// node build.cjs <clips dir> <out.mp4>  — Elite T20 launch reel (1080x1920, 30fps, silent: add licensed music in-app)
const {chromium}=require('playwright'),{execFileSync}=require('child_process'),path=require('path'),fs=require('fs');
const [clips,out]=process.argv.slice(2), tmp=path.join(path.dirname(out),'reel-tmp'); fs.mkdirSync(tmp,{recursive:true});
const SHOTS=[ // file, start, duration, headline a/b, subline
 ['mitch-clark-power.mp4',1.6,2.4,'WHAT CAN','12 WEEKS DO?',''],
 ['may28-3429.mp4',6.0,2.2,'12','WEEKS','Elite T20 Program'],
 ['coaches-power-movement.mp4',10.5,2.6,'48','HOURS','Of coaching'],
 ['may28-3397.mp4',0.7,2.4,'8 CORE','PILLARS','Tracked for every player'],
 ['may28-3363.mp4',3.4,2.0,'ELITE','T20','Back in 2027'],
 [null,0,3.2,'ELITE','T20','The 12-week T20 Program · 2027'],
];
(async()=>{const b=await chromium.launch();const parts=[];
for(const [i,[file,ss,d,a,bb,s]] of SHOTS.entries()){
  const p=await b.newPage({viewport:{width:1080,height:1920}});const png=path.join(tmp,`o${i}.png`);
  await p.goto('file://'+path.join(__dirname,'overlay.html')+`?a=${encodeURIComponent(a)}&b=${encodeURIComponent(bb)}&s=${encodeURIComponent(s)}${file?'':'&end=1'}`);
  await p.waitForSelector('body[data-ready="1"]');await p.screenshot({path:png,omitBackground:true});await p.close();
  const seg=path.join(tmp,`s${i}.mp4`);parts.push(seg);
  const base=file?['-ss',String(ss),'-t',String(d),'-i',path.join(clips,file)]:['-f','lavfi','-t',String(d),'-i','color=c=0x001D48:s=1080x1920:r=30'];
  // footage: cover-crop, slow push-in, brand grade (desaturate + lift contrast); overlay fades/slides in
  const vf=(file?`[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,scale=iw*1.08:-2,crop=1080:1920:(iw-1080)/2:(ih-1920)*(1-t/${d})/2,eq=saturation=0.55:contrast=1.12:brightness=-0.02,fps=30[v];`:`[0:v]fps=30[v];`)
    +`[1:v]format=rgba,fade=in:st=0:d=0.3:alpha=1[o];[v][o]overlay=0:'if(lt(t,0.3),(0.3-t)*80,0)':format=auto,format=yuv420p[x]`;
  execFileSync('ffmpeg',['-v','error','-y',...base,'-loop','1','-t',String(d),'-i',png,'-filter_complex',vf,'-map','[x]','-an','-r','30','-c:v','libx264','-crf','20','-preset','medium',seg]);}
await b.close();
fs.writeFileSync(path.join(tmp,'list.txt'),parts.map(p=>`file '${p}'`).join('\n'));
execFileSync('ffmpeg',['-v','error','-y','-f','concat','-safe','0','-i',path.join(tmp,'list.txt'),'-c','copy','-movflags','+faststart',out]);console.log('done',out)})();
