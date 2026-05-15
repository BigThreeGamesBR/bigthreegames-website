$ErrorActionPreference = 'Stop'

$blockedPattern = '@tanstack/'
$filesToScan = @(
  './package.json',
  './package-lock.json',
  './pnpm-lock.yaml'
)

$found = @()

foreach ($path in $filesToScan) {
  if (Test-Path $path) {
    $content = Get-Content -Raw -Path $path
    if ($content -match [regex]::Escape($blockedPattern)) {
      $found += $path
    }
  }
}

if ($found.Count -gt 0) {
  Write-Error "Blocked package pattern '$blockedPattern' found in: $($found -join ', ')"
  exit 1
}

Write-Host "Blocklist check passed. No '$blockedPattern' entries found."
