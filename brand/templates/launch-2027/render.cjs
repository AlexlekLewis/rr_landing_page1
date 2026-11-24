// node render.cjs <outdir> [prefix]  -> every piece in FEED-4x5, VERT-9x16, SQ-1x1 (ads)
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
const dir=__dirname,P=JSON.parse(fs.readFileSync(path.join(dir,process.argv[4]||'pieces.json'))),out=process.argv[2],pre=process.argv[3]||'DRAFT_PROGRAM_ALL-ACADEMY';
fs.mkdirSync(out,{recursive:true});
(async()=>{const b=await chromium.launch();
for(const p of P)for(const [F,h,tag] of [['feed',1350,'FEED-4x5'],['vert',1920,'VERT-9x16'],['sq',1080,'SQ-1x1']]){
 const pg=await b.newPage({viewport:{width:1080,height:h}});await pg.addInitScript(([p,F])=>{window.PIECE=p;window.FMT=F},[p,F]);
 await pg.goto('file://'+path.join(dir,'piece.html'));await pg.waitForSelector('body[data-ready="1"]');await pg.waitForTimeout(300);
 console.log(p.file,tag,await pg.evaluate(()=>document.body.dataset.fit));
 await pg.screenshot({path:path.join(out,`${pre}_${p.file}_${tag}.png`)});await pg.close()}
await b.close()})();
