const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
const dir=__dirname,slides=JSON.parse(fs.readFileSync(path.join(dir,'slides.json'))),out=process.argv[2]||path.join(dir,'out'),pre=process.argv[3]||'DRAFT_CAREERS_ALL-ACADEMY';
fs.mkdirSync(out,{recursive:true});
(async()=>{const b=await chromium.launch();const bad=[];
for(const S of slides)for(const [F,h,tag] of [['feed',1350,'FEED-4x5'],['vert',1920,'VERT-9x16']]){
 const p=await b.newPage({viewport:{width:1080,height:h}});await p.addInitScript(([S,F])=>{window.SLIDE=S;window.FORMAT=F},[S,F]);
 await p.goto('file://'+path.join(dir,'slide.html'));await p.waitForSelector('body[data-ready="1"]');await p.waitForTimeout(150);
 const o=await p.evaluate(()=>{const r=[];const foot=document.querySelector('.footer').getBoundingClientRect();document.querySelectorAll('.gc').forEach(c=>{if(c.scrollHeight>c.clientHeight+1||c.scrollWidth>c.clientWidth+1)r.push('card overflow: '+c.textContent.slice(0,30));if(c.getBoundingClientRect().bottom>foot.top-8)r.push('card hits footer')});
  const st=document.getElementById('st'),g=document.getElementById('g');if(st&&st.getBoundingClientRect().bottom>g.getBoundingClientRect().top-10)r.push('statement hits cards');return r});
 if(o.length)bad.push(`${S.file} ${F}: ${o.join('; ')}`);
 await p.screenshot({path:path.join(out,`${pre}_${S.file}_${tag}.png`)});await p.close()}
await b.close();console.log(bad.length?bad.join('\n'):'all clean')})();
