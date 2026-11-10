#!/usr/bin/env python3
"""Check new photos against the /tours September 2026 carousel for repeats.

    python3 scripts/check-photo-duplicates.py new1.jpg new2.jpg ...

Compares by what the picture looks like (a 16x16 difference hash), not by
filename or file size, so a resized, re-saved or re-sent copy still matches.
Prints NEW or DUPLICATE for each file. Distance 0-10 = same photo.
Two shots taken a moment apart usually differ by well over 10.
Also flags repeats among the new files themselves.
"""
import glob
import os
import sys

from PIL import Image, ImageOps

GALLERY = os.path.join(os.path.dirname(__file__), '..', 'src', 'assets', 'india-tour-2026', 'september-2026')
THRESHOLD = 10


def dhash(path, size=16):
    im = ImageOps.exif_transpose(Image.open(path)).convert('L').resize((size + 1, size), Image.LANCZOS)
    px = list(im.tobytes())
    bits = 0
    for row in range(size):
        for col in range(size):
            left = px[row * (size + 1) + col]
            right = px[row * (size + 1) + col + 1]
            bits = (bits << 1) | (left > right)
    return bits


def distance(a, b):
    return bin(a ^ b).count('1')


existing = {os.path.basename(p): dhash(p) for p in sorted(glob.glob(os.path.join(GALLERY, '*.webp')))}
seen = {}
for path in sys.argv[1:]:
    h = dhash(path)
    pool = {**existing, **seen}
    best = min(pool.items(), key=lambda kv: distance(h, kv[1]), default=(None, None))
    d = distance(h, best[1]) if best[0] else 999
    if d <= THRESHOLD:
        print(f'DUPLICATE  {os.path.basename(path)}  matches {best[0]} (distance {d})')
    else:
        print(f'NEW        {os.path.basename(path)}  (closest {best[0]}, distance {d})')
        seen[os.path.basename(path)] = h
