param(
  [Parameter(Mandatory = $true)]
  [string]$SourceVideo,
  [string]$OutputRoot = "public/assets/heritage/trailer",
  [string]$HeroClipStart = "00:00:10",
  [string]$HeroClipDuration = "00:00:16"
)

$ErrorActionPreference = 'Stop'

if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
  throw "ffmpeg was not found on PATH. Install ffmpeg first."
}

$sourcePath = (Resolve-Path -LiteralPath $SourceVideo).Path

if (-not (Test-Path -LiteralPath $OutputRoot)) {
  New-Item -ItemType Directory -Path $OutputRoot -Force | Out-Null
}

$outputRootPath = (Resolve-Path -LiteralPath $OutputRoot).Path
$hlsRootPath = Join-Path $outputRootPath 'hls'
$workingDirPath = (Get-Location).Path

if (Test-Path -LiteralPath $hlsRootPath) {
  Remove-Item -LiteralPath $hlsRootPath -Recurse -Force
}

# Clean stale init fragments from previous runs.
Get-ChildItem -Path $workingDirPath -Filter 'init_*.mp4' -File -ErrorAction SilentlyContinue |
  Remove-Item -Force -ErrorAction SilentlyContinue

@('v0', 'v1', 'v2') | ForEach-Object {
  New-Item -ItemType Directory -Path (Join-Path $hlsRootPath $_) -Force | Out-Null
}

$heroLoopPath = Join-Path $outputRootPath 'hero-loop.mp4'
$segmentPattern = Join-Path $hlsRootPath 'v%v/segment_%03d.m4s'
$variantPlaylistPattern = Join-Path $hlsRootPath 'v%v/prog_index.m3u8'

Write-Host "Building hero loop MP4..."
& ffmpeg -y -ss $HeroClipStart -i $sourcePath -t $HeroClipDuration -vf "scale=1280:-2,fps=30" -an -c:v libx264 -preset slow -crf 23 -movflags +faststart $heroLoopPath

if ($LASTEXITCODE -ne 0) {
  throw "Hero loop generation failed."
}

Write-Host "Building adaptive HLS renditions..."
& ffmpeg -y -i $sourcePath `
  -filter_complex "[0:v]split=3[v1080][v720][v480];[v1080]scale=1920:-2[v1080out];[v720]scale=1280:-2[v720out];[v480]scale=854:-2[v480out]" `
  -map "[v1080out]" -map 0:a:0? -c:v:0 libx264 -preset slow -profile:v:0 high -b:v:0 5000k -maxrate:v:0 5350k -bufsize:v:0 10000k -c:a:0 aac -b:a:0 128k `
  -map "[v720out]" -map 0:a:0? -c:v:1 libx264 -preset slow -profile:v:1 main -b:v:1 2800k -maxrate:v:1 3000k -bufsize:v:1 5600k -c:a:1 aac -b:a:1 128k `
  -map "[v480out]" -map 0:a:0? -c:v:2 libx264 -preset slow -profile:v:2 main -b:v:2 1400k -maxrate:v:2 1500k -bufsize:v:2 2800k -c:a:2 aac -b:a:2 96k `
  -g 60 -keyint_min 60 -sc_threshold 0 `
  -f hls -hls_time 6 -hls_playlist_type vod -hls_flags independent_segments `
  -hls_segment_type fmp4 -hls_fmp4_init_filename "init.mp4" `
  -hls_segment_filename $segmentPattern `
  -master_pl_name "master.m3u8" `
  -var_stream_map "v:0,a:0 v:1,a:1 v:2,a:2" `
  $variantPlaylistPattern

if ($LASTEXITCODE -ne 0) {
  throw "HLS build failed."
}

# ffmpeg emits init_0.mp4/init_1.mp4/init_2.mp4 in the working directory.
# Move them to each variant folder and normalize EXT-X-MAP to init.mp4.
0..2 | ForEach-Object {
  $variant = "v$_"
  $sourceInit = Join-Path $workingDirPath ("init_{0}.mp4" -f $_)
  $variantDir = Join-Path $hlsRootPath $variant
  $targetInit = Join-Path $variantDir 'init.mp4'
  $variantPlaylist = Join-Path $variantDir 'prog_index.m3u8'

  if (Test-Path -LiteralPath $sourceInit) {
    Move-Item -LiteralPath $sourceInit -Destination $targetInit -Force
  }

  if (Test-Path -LiteralPath $variantPlaylist) {
    $playlistContent = Get-Content -LiteralPath $variantPlaylist
    $playlistContent = $playlistContent -replace 'URI="init_[0-9]+\.mp4"', 'URI="init.mp4"'
    Set-Content -LiteralPath $variantPlaylist -Value $playlistContent -Encoding ascii
  }
}

$masterPlaylist = Join-Path $hlsRootPath 'master.m3u8'
if (Test-Path -LiteralPath $masterPlaylist) {
  $masterContent = Get-Content -LiteralPath $masterPlaylist
  $masterContent = $masterContent -replace '\\', '/'
  Set-Content -LiteralPath $masterPlaylist -Value $masterContent -Encoding ascii
}

$largestSegment = Get-ChildItem -Path $hlsRootPath -Recurse -Filter *.m4s | Sort-Object Length -Descending | Select-Object -First 1
if ($largestSegment -and $largestSegment.Length -gt 25MB) {
  $mb = [math]::Round($largestSegment.Length / 1MB, 2)
  Write-Warning "Largest segment is ${mb} MB (> 25 MB). Reduce bitrate or segment duration."
} else {
  Write-Host "Largest segment is within Cloudflare's 25 MB file limit."
}

Write-Host "Done. Generated files:"
Write-Host "- $heroLoopPath"
Write-Host "- $(Join-Path $hlsRootPath 'master.m3u8')"
Write-Host ""
Write-Host "Recommended content values:"
Write-Host "- home.hero.videoMp4 = /assets/heritage/trailer/hero-loop.mp4"
Write-Host "- heritage.media.trailerMp4 = /assets/heritage/trailer/hls/master.m3u8"
