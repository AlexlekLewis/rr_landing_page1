const {chromium}=require('playwright'),path=require('path'),fs=require('fs');const out=process.argv[2];fs.mkdirSync(out,{recursive:true});
const T={file:'00-bring-on-2027-hero',chip:'2027 PROGRAMS',head:['BRING ON','2027'],sub:'Join the Royals Academy<span class="pk">North · East · South-East · West Melbourne</span>',
 cta:['FIND YOUR PROGRAM','RRAMELBOURNE.COM'],bg:'bg/lights.jpg',players:['players/parag-8940.png','players/jadeja-2536.png','players/soorya-6626.png']};
(async()=>{const b=await chromium.launch();for(const V of [{...T,bg:null,file:'00a-bring-on-2027-hero-BRAND'},{...T,file:'00b-bring-on-2027-hero-LIGHTS'},{...T,bg:'bg/smoke.jpg',file:'00c-bring-on-2027-hero-SMOKE'}])for(const [F,h,tag] of [['feed',1350,'FEED-4x5'],['vert',1920,'VERT-9x16'],['sq',1080,'SQ-1x1']]){
 const p=await b.newPage({viewport:{width:1080,height:h}});await p.addInitScript(([T,F])=>{window.T=T;window.FMT=F},[V,F]);
 await p.goto('file://'+path.join(__dirname,'trio.html'));await p.waitForSelector('body[data-ready="1"]');await p.waitForTimeout(300);
 await p.screenshot({path:path.join(out,`DRAFT_PROGRAM_ALL-ACADEMY_${V.file}_${tag}.png`)});await p.close()}await b.close();console.log('ok')})();
