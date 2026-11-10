#!/usr/bin/env node
// Every image the change adds or replaces, where it is used, and a copy staged for Drive.
//
//   node images.mjs --out <dir> [--base origin/main] [--originals <dir of source photos>]
//
// Writes <out>/images.json and copies each image to <out>/drive/01 Images (web-ready)/<repo path>
// so the developers can put it at exactly that path. Originals (the photos as supplied),
// if given, are copied to <out>/drive/02 Images (originals)/.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, all) => {
    if (v.startsWith('--')) a.push([v.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true]);
    return a;
}, []));
const out = path.resolve(args.out || 'handoff-images');
const base = args.base || 'origin/main';
const repo = execSync('git rev-parse --show-toplevel').toString().trim();
const IMG = /\.(png|jpe?g|webp|gif|svg|avif)$/i;
const WEB_DIR = '01 Images (web-ready)';
const ORIG_DIR = '02 Images (originals)';

const changed = execSync(`git diff --name-status ${base}...HEAD -- public`, { cwd: repo }).toString()
    .split('\n').filter(Boolean).map((l) => l.split('\t'))
    .filter(([s, f]) => IMG.test(f) && s !== 'D')
    .map(([s, f]) => ({ status: s.startsWith('A') ? 'new' : 'replaced', repoPath: f }));

// Where the site refers to it: the public URL (/assets/...) or, for code that builds the
// name (e.g. `${name}.webp`), the file name without size suffix or extension.
const refs = (urlPath) => {
    const stem = path.basename(urlPath).replace(IMG, '').replace(/-sm$/, '');
    for (const needle of [urlPath, `'${stem}'`]) {
        try {
            const hits = execSync(`git grep -n -F "${needle}" -- src`, { cwd: repo }).toString().trim().split('\n');
            if (hits[0]) return hits.map((h) => h.split(':').slice(0, 2).join(':'));
        } catch { /* no match */ }
    }
    return [];
};
const dims = (file) => {
    try {
        const o = execSync(`python3 -c "from PIL import Image;i=Image.open('${file}');print(i.size[0],i.size[1])"`).toString().trim().split(' ');
        return { width: +o[0], height: +o[1] };
    } catch { return {}; }
};

fs.mkdirSync(path.join(out, 'drive', WEB_DIR), { recursive: true });
const images = changed.map((img) => {
    const abs = path.join(repo, img.repoPath);
    const url = img.repoPath.replace(/^public/, '');
    const dest = path.join(out, 'drive', WEB_DIR, img.repoPath);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(abs, dest);
    return { ...img, url, bytes: fs.statSync(abs).size, ...dims(abs), usedIn: refs(url), drivePath: `${WEB_DIR}/${img.repoPath}` };
});

let originals = [];
if (typeof args.originals === 'string') {
    fs.mkdirSync(path.join(out, 'drive', ORIG_DIR), { recursive: true });
    originals = fs.readdirSync(args.originals).filter((f) => IMG.test(f)).map((f) => {
        fs.copyFileSync(path.join(args.originals, f), path.join(out, 'drive', ORIG_DIR, f));
        return { file: f, drivePath: `${ORIG_DIR}/${f}`, bytes: fs.statSync(path.join(args.originals, f)).size };
    });
}

fs.writeFileSync(path.join(out, 'images.json'), JSON.stringify({ base, images, originals }, null, 2));
const mb = (n) => (n / 1048576).toFixed(1);
console.log(`${images.length} web-ready images (${mb(images.reduce((s, i) => s + i.bytes, 0))} MB), ${originals.length} originals, staged in ${path.join(out, 'drive')}`);
