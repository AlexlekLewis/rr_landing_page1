// BREAK THE BOUNDARY FESTIVAL event logo (first pass, 27 Nov 2026). btbLogo(width, {mode:'dark'|'light'}) -> HTML string.
// Parts: festival bunting, BREAK THE, BOUNDARY with the white ball (black seam) as the O, FESTIVAL ribbon.
function btbBall(r,ring){return `<svg viewBox="${-r} ${-r} ${2*r} ${2*r}" style="width:${2*r}px;height:${2*r}px;flex:none;margin:0 ${r*.06}px;transform:rotate(24deg)"><circle r="${r*.95}" fill="#fff" stroke="${ring||'none'}" stroke-width="${r*.07}"/>
<path d="M ${-r*.3} ${-r*.93} Q ${-r*.04} 0 ${-r*.3} ${r*.93}" fill="none" stroke="#111" stroke-width="${r*.075}" stroke-dasharray="${r*.11} ${r*.075}"/>
<path d="M ${r*.3} ${-r*.93} Q ${r*.04} 0 ${r*.3} ${r*.93}" fill="none" stroke="#111" stroke-width="${r*.075}" stroke-dasharray="${r*.11} ${r*.075}"/>
<path d="M ${-r*.14} ${-r*.97} Q 0 0 ${-r*.14} ${r*.97} M ${r*.14} ${-r*.97} Q 0 0 ${r*.14} ${r*.97}" fill="none" stroke="#111" stroke-width="${r*.028}"/></svg>`}
function btbBunting(W,mode){const n=11,cols=['#E11F8F','#fff','#1226AA'],h=W*.105;let f='';
  if(mode==='light')cols[1]='#001D48';
  for(let i=0;i<n;i++){const t=(i+.5)/n,x=t*W,y=h*.18+Math.sin(Math.PI*t)*h*.42,w=W/n*.74;
    f+=`<path d="M ${x-w/2} ${y} L ${x+w/2} ${y} L ${x} ${y+h*.5} Z" fill="${cols[i%3]}" ${cols[i%3]==='#1226AA'&&mode!=='light'?'stroke="#fff" stroke-width="'+W*.003+'"':''}/>`}
  return `<svg viewBox="0 0 ${W} ${h}" style="display:block;width:${W}px;height:${h}px"><path d="M 0 ${h*.16} Q ${W/2} ${h*.86} ${W} ${h*.16}" fill="none" stroke="${mode==='light'?'#001D48':'#fff'}" stroke-width="${W*.006}" stroke-linecap="round"/>${f}</svg>`}
function btbLogo(W,o={}){const mode=o.mode||'dark',ink=mode==='light'?'#001D48':'#fff',fs=W*.182;
  return `<div style="width:${W}px;font-family:M;text-align:center;line-height:.86;text-transform:uppercase">
  ${btbBunting(W,mode)}
  <div style="font-weight:900;font-size:${W*.118}px;letter-spacing:.06em;color:${ink};margin-top:${W*.02}px">Break the</div>
  <div style="font-weight:900;font-size:${fs}px;letter-spacing:-.03em;color:#E11F8F;display:flex;align-items:center;justify-content:center;margin-top:${W*.012}px;white-space:nowrap">B${btbBall(fs*.365,mode==='light'?'#001D48':null)}UNDARY</div>
  <div style="display:inline-block;margin-top:${W*.03}px;transform:rotate(-3deg)"><div style="background:${mode==='light'?'#001D48':'#fff'};color:${mode==='light'?'#fff':'#001D48'};font-weight:900;font-size:${W*.07}px;letter-spacing:.34em;padding:${W*.022}px ${W*.05}px ${W*.02}px ${W*.074}px;clip-path:polygon(0 0,100% 0,96% 50%,100% 100%,0 100%,4% 50%)">Festival</div></div></div>`}
