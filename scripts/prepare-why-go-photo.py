#!/usr/bin/env python3
"""Prepare a photo for a /tours 'Why Go' card.

    python3 scripts/prepare-why-go-photo.py <card 1-6> <input photo> <short-name> [focus-x] [focus-y]

Every card photo is cropped to exactly 4:3 and saved at 1200x900 WebP, so all
six cards look identical in size whatever shape or size the original is.
focus-x / focus-y (0-1, default 0.5) choose which part of the photo to keep
when cropping, e.g. 0.5 0.35 keeps more of the top (faces).
Output: src/assets/india-tour-2026/why-go/<card>-<short-name>.webp
(any older photo for the same card is replaced).
"""
import glob
import os
import sys

from PIL import Image, ImageOps

W, H = 1200, 900
card, src, name = int(sys.argv[1]), sys.argv[2], sys.argv[3]
fx = float(sys.argv[4]) if len(sys.argv) > 4 else 0.5
fy = float(sys.argv[5]) if len(sys.argv) > 5 else 0.5
assert 1 <= card <= 6, 'card must be 1-6'

out_dir = os.path.join(os.path.dirname(__file__), '..', 'src', 'assets', 'india-tour-2026', 'why-go')
os.makedirs(out_dir, exist_ok=True)
for old in glob.glob(os.path.join(out_dir, f'{card}-*')):
    os.remove(old)

im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
im = ImageOps.fit(im, (W, H), method=Image.LANCZOS, centering=(fx, fy))
out = os.path.join(out_dir, f'{card}-{name}.webp')
im.save(out, 'WEBP', quality=80, method=6)
print(f'card {card}: {os.path.basename(out)} {im.size} {os.path.getsize(out) // 1024} KB')
