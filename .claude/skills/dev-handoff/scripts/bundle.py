#!/usr/bin/env python3
"""Pack everything for the Drive hand-off folder into one zip, laid out like the folder.

    python3 bundle.py --pdf handoff.pdf --shots <capture dir> --images <images dir> --out bundle.zip [--patch file.patch]

Inside the zip:  <pdf>, 01 Images (web-ready)/public/..., 02 Images (originals)/...,
03 Screenshots/..., 04 Code patch (if the branch is missing a commit)/...
The person unzips it and drags the contents into the Drive folder.
"""
import argparse, os, zipfile

p = argparse.ArgumentParser()
p.add_argument('--pdf', required=True)
p.add_argument('--shots', required=True)
p.add_argument('--images', required=True)
p.add_argument('--out', required=True)
p.add_argument('--patch')
a = p.parse_args()

with zipfile.ZipFile(a.out, 'w', zipfile.ZIP_DEFLATED) as z:
    z.write(a.pdf, os.path.basename(a.pdf))
    drive = os.path.join(a.images, 'drive')
    for root, _, files in os.walk(drive):
        for f in files:
            full = os.path.join(root, f)
            z.write(full, os.path.relpath(full, drive))
    for f in sorted(os.listdir(a.shots)):
        if f.endswith('.jpg'):
            z.write(os.path.join(a.shots, f), os.path.join('03 Screenshots', f))
    if a.patch:
        z.write(a.patch, os.path.join('04 Code patch (if the branch is missing a commit)', os.path.basename(a.patch)))

print(f"{a.out} ({os.path.getsize(a.out) / 1048576:.1f} MB)")
