const {chromium}=require('playwright'),fs=require('fs'),path=require('path');const out=process.argv[2];fs.mkdirSync(out,{recursive:true});
const L=JSON.parse(fs.readFileSync(path.join(__dirname,'promos.json')));
(async()=>{const b=await chromium.launch();for(const P of L)for(const [F,h,tag] of [['feed',1350,'FEED-4x5'],['vert',1920,'VERT-9x16'],['sq',1080,'SQ-1x1']]){
 const p=await b.newPage({viewport:{width:1080,height:h}});await p.addInitScript(([P,F])=>{window.P=P;window.FMT=F},[P,F]);
 await p.goto('file://'+path.join(__dirname,'promo.html'));await p.waitForSelector('body[data-ready="1"]');await p.waitForTimeout(300);
 await p.screenshot({path:path.join(out,`DRAFT_ACADEMY_${P.file}_${tag}.png`)});await p.close()}await b.close();console.log('ok')})();
