# Cloudflare-safe video delivery (HLS)

Use this workflow when source trailers are larger than Cloudflare's 25 MB per-file limit.

## Why this works

- A single 114 MB MP4 fails Cloudflare's file-size limit.
- HLS splits video into many small `.m4s` chunks plus `.m3u8` playlists.
- Each chunk is well below 25 MB, so Cloudflare can serve them reliably.

## Output strategy

- Home hero: short loop clip (`hero-loop.mp4`) under 25 MB.
- Game trailer: adaptive HLS master playlist (`hls/master.m3u8`) with segmented renditions.

## Build command

From project root:

```powershell
powershell -ExecutionPolicy Bypass -File ./scripts/build-heritage-video-hls.ps1 -SourceVideo "C:\path\to\heritage-trailer.mp4"
```

Optional parameters:

```powershell
-HeroClipStart "00:00:10" -HeroClipDuration "00:00:16"
```

## Content values to use after build

- `home.hero.videoMp4`: `/assets/heritage/trailer/hero-loop.mp4`
- `heritage.media.trailerMp4`: `/assets/heritage/trailer/hls/master.m3u8`

## Notes

- The frontend now supports:
  - YouTube embed URLs
  - MP4 file URLs
  - HLS `.m3u8` URLs (native where supported, `hls.js` fallback elsewhere)
- If you tune bitrate settings in the script, keep segment files under 25 MB.
