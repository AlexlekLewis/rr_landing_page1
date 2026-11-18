// node render.cjs [pieces.json] [outdir]  -> <file>_FEED-4x5.png and <file>_VERT-9x16.png per piece
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
const dir=__dirname, pieces=JSON.parse(fs.readFileSync(process.argv[2]||path.join(dir,'pieces.json'))), out=process.argv[3]||path.join(dir,'out');
fs.mkdirSync(out,{recursive:true});
(async()=>{const b=await chromium.launch();let bad=[];
for(const P of pieces)for(const [F,h,tag] of [['feed',1350,'FEED-4x5'],['vert',1920,'VERT-9x16']]){
  const p=await b.newPage({viewport:{width:1080,height:h}});
  await p.addInitScript(([P,F])=>{window.PIECE=P;window.FORMAT=F},[P,F]);
  await p.goto('file://'+path.join(dir,'frame.html'));await p.waitForSelector('body[data-ready="1"]');await p.waitForTimeout(150);
  const issues=await p.evaluate(()=>{const o=[];document.querySelectorAll('.gc,.gc *').forEach(e=>{if(e.scrollWidth>e.clientWidth+1&&getComputedStyle(e).display!=='inline')o.push('overflow:'+e.className+':'+e.textContent.slice(0,30))});
    const cards=[...document.querySelectorAll('.gc')].map(c=>c.getBoundingClientRect());const foot=document.querySelector('.footer').getBoundingClientRect();
    if(cards.some(c=>c.bottom>foot.top-10))o.push('cards hit footer');const st=document.getElementById('st'),g=document.getElementById('g'),h=document.getElementById('h');
    if(st&&st.getBoundingClientRect().bottom>g.getBoundingClientRect().top-12)o.push('statement hits cards');
    if(st&&h.getBoundingClientRect().bottom-0.12*parseFloat(h.style.fontSize||245)>st.getBoundingClientRect().top)o.push('headline hits statement');return o});
  if(issues.length)bad.push(P.file+' '+F+': '+issues.join('; '));
  await p.screenshot({path:path.join(out,`${P.file}_${tag}.png`)});await p.close()}
await b.close();console.log(bad.length?bad.join('\n'):'all frames clean');})();
