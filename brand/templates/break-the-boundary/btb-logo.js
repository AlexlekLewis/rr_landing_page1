// BREAK THE BOUNDARY FESTIVAL event logo, v2 (Andy, 27 Nov 2026: sporting not community, more T20, sexier,
// Royals Academy logo much bigger and without "Melbourne", no ball).
// Idea: italic T20-style wordmark; BOUNDARY is physically broken by a diagonal cut. btbLogo(W,{mode,crest}) -> HTML.
function btbLogo(W,o={}){const mode=o.mode||'dark',ink=mode==='light'?'#001D48':'#fff',crest=o.crest!==false;
  const fs=W*.185, cut='44%', cut2='70%';
  const word=`<span style="font:italic 900 ${fs}px M;letter-spacing:-.035em;line-height:.9;white-space:nowrap;padding:0 ${fs*.08}px">BOUNDARY</span>`;
  return `<div style="width:${W}px;text-align:center;text-transform:uppercase;display:flex;flex-direction:column;align-items:center">
  ${crest?`<img src="../../logos/rra-academy-${mode==='light'?'blue':'white'}.png" style="height:${W*.42}px;display:block">
  <div style="width:${W*.5}px;height:${W*.006}px;background:#E11F8F;margin:${W*.04}px 0 ${W*.04}px;transform:skewX(-20deg)"></div>`:''}
  <div style="font:italic 900 ${W*.105}px M;letter-spacing:.09em;color:${ink};line-height:1;margin-right:${W*.1}px">Break the</div>
  <div style="position:relative;color:#E11F8F;margin-top:${W*.012}px;height:${fs*.92}px">
    <div style="clip-path:polygon(0 0,100% 0,100% ${cut},0 ${cut2});transform:translate(${-W*.02}px,${-W*.012}px)">${word}</div>
    <div style="position:absolute;inset:0;clip-path:polygon(0 ${cut2},100% ${cut},100% 100%,0 100%);transform:translate(${W*.022}px,${W*.012}px)">${word}</div>
  </div>
  <div style="display:flex;align-items:center;gap:${W*.03}px;margin-top:${W*.04}px;margin-left:${W*.1}px">
    <i style="width:${W*.12}px;height:${W*.008}px;background:${ink};transform:skewX(-20deg)"></i>
    <div style="background:${ink};color:${mode==='light'?'#fff':'#001D48'};font:italic 900 ${W*.066}px M;letter-spacing:.3em;padding:${W*.016}px ${W*.03}px ${W*.014}px ${W*.05}px;transform:skewX(-12deg)"><span style="display:inline-block;transform:skewX(12deg)">Festival</span></div>
    <i style="width:${W*.12}px;height:${W*.008}px;background:#E11F8F;transform:skewX(-20deg)"></i>
  </div>
  ${o.torquay?`<div style="display:flex;align-items:center;gap:${W*.03}px;margin-top:${W*.045}px">
    <svg viewBox="0 0 120 24" style="width:${W*.09}px;height:${W*.018}px"><path d="M2 14 Q 17 0 32 14 T 62 14 T 92 14 T 118 14" fill="none" stroke="#E11F8F" stroke-width="5" stroke-linecap="round"/></svg>
    <span style="font:italic 900 ${W*.05}px M;letter-spacing:.2em;margin-right:-.2em;color:${ink};white-space:nowrap">Torquay, Geelong</span>
    <svg viewBox="0 0 120 24" style="width:${W*.09}px;height:${W*.018}px"><path d="M2 14 Q 17 0 32 14 T 62 14 T 92 14 T 118 14" fill="none" stroke="#E11F8F" stroke-width="5" stroke-linecap="round"/></svg></div>`:''}
  </div>`}
