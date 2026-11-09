#!/usr/bin/env bash
# Compress videos for the /tours video carousel.
#
#   scripts/compress-tour-videos.sh path/to/video1.mov path/to/video2.mp4 ...
#
# For each input it writes, into public/tours/:
#   <name>.mp4  H.264 + AAC, max 720 px wide (1280 tall for portrait), CRF 28,
#               "faststart" so it begins playing before it has fully downloaded
#   <name>.jpg  a poster still taken 1 second in
# <name> is the input filename in lower-case with spaces turned into dashes.
# Then add each one to VIDEOS in src/components/india-tour-2026/itMedia.js.
set -euo pipefail
out_dir="$(cd "$(dirname "$0")/.." && pwd)/public/tours"
mkdir -p "$out_dir"
for in in "$@"; do
  base="$(basename "${in%.*}" | tr '[:upper:]' '[:lower:]' | tr ' _' '--' | tr -cd 'a-z0-9-')"
  mp4="$out_dir/$base.mp4"
  jpg="$out_dir/$base.jpg"
  ffmpeg -y -loglevel error -i "$in" \
    -vf "scale='min(720,iw)':-2:force_original_aspect_ratio=decrease,fps=30" \
    -c:v libx264 -preset slow -crf 28 -profile:v high -pix_fmt yuv420p \
    -c:a aac -b:a 96k -ac 2 -movflags +faststart "$mp4"
  ffmpeg -y -loglevel error -ss 1 -i "$mp4" -frames:v 1 -q:v 4 "$jpg"
  printf '%s  %s -> %s (%s)\n' "ok" "$(basename "$in")" "public/tours/$base.mp4" "$(du -h "$mp4" | cut -f1)"
done
