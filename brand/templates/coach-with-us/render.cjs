// node render.cjs <outdir> -> COACH-WITH-US story (9:16) + feed (4:5)
const {chromium}=require('playwright'),path=require('path'),fs=require('fs');const out=process.argv[2];fs.mkdirSync(out,{recursive:true});
(async()=>{const b=await chromium.launch();for(const [f,h,tag] of [['vert',1920,'VERT-9x16'],['feed',1350,'FEED-4x5']]){
 const p=await b.newPage({viewport:{width:1080,height:h}});await p.goto('file://'+path.join(__dirname,'story.html')+'?f='+f);
 await p.waitForSelector('body[data-ready="1"]');console.log(tag,await p.evaluate(()=>document.body.dataset.fit));
 await p.screenshot({path:path.join(out,`DRAFT_CAREERS_ALL-ACADEMY_coach-with-us_${tag}.png`)});await p.close()}await b.close()})();
