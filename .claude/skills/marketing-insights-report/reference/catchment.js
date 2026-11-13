dash.loader('locations', {description: 'Reads the rows out of the database tool\'s text answer.', fn: ({answer}) => {
  if (Array.isArray(answer)) return answer;
  const text = typeof answer === 'string' ? answer : (answer && typeof answer.result === 'string' ? answer.result : null);
  if (text == null) throw new Error('The database returned an unexpected answer.');
  const end = text.lastIndexOf('</untrusted-data-');
  const body = end < 0 ? text : text.slice(0, end);
  const start = body.lastIndexOf('>\n');
  const json = (start < 0 ? body : body.slice(start + 2)).trim();
  if (!json.startsWith('[')) throw new Error(text.slice(0, 300));
  return JSON.parse(json);
}});

dash.calc('catchment', {
  inputs: ['locations', 'coords'],
  title: 'Estimated drive time to each centre, by suburb',
  description: 'Joins each suburb to its estimated location and works out drive minutes to Bundoora, Ravenhall and Hallam.',
  fn: (locations, coords) => {
    // Straight-line distance between two points, in km.
    const km = (lat1, lon1, lat2, lon2) => {
      const t = Math.PI / 180;
      const h = Math.sin((lat2 - lat1) * t / 2) ** 2 + Math.cos(lat1 * t) * Math.cos(lat2 * t) * Math.sin((lon2 - lon1) * t / 2) ** 2;
      return 2 * 6371 * Math.asin(Math.sqrt(h));
    };
    // Estimated drive: road distance is about 1.3 x straight line. 6 minutes to get going, 1.2 minutes per km for the first 25 road km (suburban, about 50 km/h), then 0.75 minutes per km (freeway, about 80 km/h).
    const driveMinutes = (straightKm) => { const road = 1.3 * straightKm; return Math.round(6 + 1.2 * Math.min(road, 25) + 0.75 * Math.max(0, road - 25)); };
    const num = (v) => (v === null || v === undefined || String(v).trim() === '' ? null : Number(v));
    const centres = coords.filter((c) => c.kind === 'centre').map((c) => ({name: String(c.suburb).split(' (')[0], lat: num(c.lat), lon: num(c.lon)}));
    const places = new Map(coords.filter((c) => c.kind === 'suburb').map((c) => [c.place, c]));
    const days = locations.map((r) => r.day).filter(Boolean).sort();
    const launchEnd = days.length ? new Date(Date.parse(days[0] + 'T00:00:00Z') + 3 * 864e5).toISOString().slice(0, 10) : '';
    const groups = new Map();
    locations.forEach((r) => {
      const g = groups.get(r.place) || {players: 0, launch: 0};
      g.players += Number(r.players);
      if (r.day && r.day < launchEnd) g.launch += Number(r.players);
      groups.set(r.place, g);
    });
    return [...groups].map(([place, g]) => {
      const c = places.get(place);
      const row = {place, suburb: c ? c.suburb : place, region: c ? c.region : 'Unknown', players: g.players, launch: g.launch,
        lat: c ? num(c.lat) : null, lon: c ? num(c.lon) : null, bundoora_min: null, ravenhall_min: null, hallam_min: null, nearest: 'Unknown', saving_min: null, centre: 'Unknown'};
      if (row.lat === null || row.lon === null) return row;
      centres.forEach((ct) => { row[ct.name.toLowerCase() + '_min'] = driveMinutes(km(row.lat, row.lon, ct.lat, ct.lon)); });
      const best = centres.reduce((a, ct) => (row[ct.name.toLowerCase() + '_min'] < row[a.name.toLowerCase() + '_min'] ? ct : a), centres[0]);
      row.nearest = best.name;
      row.saving_min = row.bundoora_min - row[best.name.toLowerCase() + '_min'];
      row.centre = best.name !== 'Bundoora' && row.saving_min >= 10 ? best.name : 'Bundoora';
      return row;
    }).sort((a, b) => b.players - a.players || String(a.suburb).localeCompare(String(b.suburb)));
  },
});

dash.calc('catchment_summary', {
  inputs: ['catchment'],
  title: 'Players by the centre they would likely choose',
  description: 'Players whose suburb has another centre at least 10 minutes closer than Bundoora are counted against that centre.',
  fn: (catchment) => ['Bundoora', 'Ravenhall', 'Hallam', 'Unknown'].map((centre) => {
    const rows = catchment.filter((r) => r.centre === centre);
    const players = rows.reduce((a, r) => a + r.players, 0);
    const key = centre.toLowerCase() + '_min';
    const minutes = centre === 'Unknown' || !players ? null : Math.round(rows.reduce((a, r) => a + r[key] * r.players, 0) / players);
    const fromBundoora = centre === 'Unknown' || !players ? null : Math.round(rows.reduce((a, r) => a + r.bundoora_min * r.players, 0) / players);
    return {centre, players, avg_min: minutes, avg_bundoora_min: fromBundoora, launch: rows.reduce((a, r) => a + r.launch, 0)};
  }),
});

dash.calc('switch_overall', {
  inputs: ['catchment'],
  title: 'Players who would have a closer centre',
  description: 'Of players with a known suburb, how many have Ravenhall or Hallam at least 10 minutes closer than Bundoora.',
  fn: (catchment) => {
    const located = catchment.filter((r) => r.centre !== 'Unknown').reduce((a, r) => a + r.players, 0);
    const moved = catchment.filter((r) => r.centre === 'Ravenhall' || r.centre === 'Hallam').reduce((a, r) => a + r.players, 0);
    const over45 = catchment.filter((r) => r.bundoora_min !== null && r.bundoora_min > 45).reduce((a, r) => a + r.players, 0);
    return [{located, moved, share: located ? Math.round(100 * moved / located) + '%' : '—', over45}];
  },
});

dash.calc('catchment_daily', {
  inputs: ['locations', 'catchment'],
  title: 'Running total of purchases by likely centre',
  description: 'Cumulative first purchases per day, grouped by the centre each family would likely choose.',
  fn: (locations, catchment) => {
    const centreOf = new Map(catchment.map((r) => [r.place, r.centre]));
    const days = [...new Set(locations.map((r) => r.day).filter(Boolean))].sort();
    const run = {Bundoora: 0, Ravenhall: 0, Hallam: 0, Unknown: 0};
    return days.map((day) => {
      locations.filter((r) => r.day === day).forEach((r) => { run[centreOf.get(r.place) || 'Unknown'] += Number(r.players); });
      return {day, bundoora: run.Bundoora, ravenhall: run.Ravenhall, hallam: run.Hallam};
    });
  },
});

window.epCentreIndex = {Bundoora: 0, Ravenhall: 1, Hallam: 2};

dash.draw('cstat', (el) => {
  const d = dash.data(el.dataset.source);
  if (d.status !== 'ok' || !Array.isArray(d.data)) { el.textContent = '—'; return; }
  let row = d.data[Number(el.dataset.row || 0)];
  if (el.dataset.where) {
    const [k, v] = el.dataset.where.split('=').map(decodeURIComponent);
    row = d.data.find((r) => String(r[k]) === v);
  }
  const v = row ? row[el.dataset.field] : null;
  el.textContent = v === null || v === undefined ? '—' : (el.dataset.suffix ? v + el.dataset.suffix : String(v));
});

dash.draw('offmap', (el) => {
  const d = dash.data('catchment');
  if (d.status !== 'ok' || !Array.isArray(d.data)) { el.textContent = '—'; return; }
  const out = d.data.filter((r) => r.lat !== null && (r.lat > -37.38 || r.lat < -38.2 || r.lon < 144.45 || r.lon > 145.6));
  el.textContent = out.length ? out.map((r) => `${r.suburb} (${r.players}, about ${r.bundoora_min} min to Bundoora)`).join(', ') : 'none';
});

dash.draw('map', (el) => {
  const d = dash.data('catchment');
  if (d.status !== 'ok' || !Array.isArray(d.data) || !d.data.length) { window.epPlaceholder(el, d); return; }
  const c = dash.data('coords');
  const centres = (c.status === 'ok' ? c.data : []).filter((r) => r.kind === 'centre').map((r) => ({name: String(r.suburb).split(' (')[0], lat: Number(r.lat), lon: Number(r.lon)}));
  const box = {lonMin: 144.45, lonMax: 145.6, latMin: -38.2, latMax: -37.38};
  const W = Math.max(280, el.clientWidth);
  const kx = Math.cos(37.8 * Math.PI / 180);
  const H = Math.round(W * (box.latMax - box.latMin) / ((box.lonMax - box.lonMin) * kx));
  const x = d3.scaleLinear([box.lonMin, box.lonMax], [0, W]);
  const y = d3.scaleLinear([box.latMax, box.latMin], [0, H]);
  const pxPerKm = (x(box.lonMin + 1) - x(box.lonMin)) / (111.32 * kx);
  const rows = d.data.filter((r) => r.lat !== null && r.lat <= box.latMax && r.lat >= box.latMin && r.lon >= box.lonMin && r.lon <= box.lonMax);
  const svg = d3.create('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img')
    .attr('aria-label', 'Map of Melbourne showing the suburbs Elite players came from, sized by number of players and coloured by the centre they would likely choose, with Bundoora, Ravenhall and Hallam marked.');
  svg.append('rect').attr('x', 0).attr('y', 0).attr('width', W).attr('height', H).attr('rx', 6).style('fill', 'var(--color-panel)').style('stroke', 'var(--color-border-line)');
  // 30-minute estimated drive ring: (30 - 6) / 1.2 = 20 road km, / 1.3 = about 15.4 km straight line.
  const ringKm = (30 - 6) / 1.2 / 1.3;
  svg.append('g').selectAll('circle').data(centres).join('circle')
    .attr('cx', (ct) => x(ct.lon)).attr('cy', (ct) => y(ct.lat)).attr('r', ringKm * pxPerKm)
    .style('fill', 'none').style('stroke', (ct) => dash.colors[window.epCentreIndex[ct.name]]).style('stroke-dasharray', '4 4').style('stroke-opacity', 0.7);
  svg.append('text').attr('class', 'vlab').attr('x', x(144.86)).attr('y', y(-37.99)).attr('text-anchor', 'middle').style('font-style', 'italic').text('Port Phillip Bay');
  svg.append('text').attr('class', 'vlab').attr('x', x(144.963)).attr('y', y(-37.814) + 14).attr('text-anchor', 'middle').text('CBD');
  const r = d3.scaleSqrt([0, d3.max(rows, (q) => q.players) || 1], [0, Math.max(6, W / 55)]);
  const t = window.epTip(el);
  svg.append('g').selectAll('circle').data(rows).join('circle')
    .attr('cx', (q) => x(q.lon)).attr('cy', (q) => y(q.lat)).attr('r', (q) => Math.max(3, r(q.players)))
    .style('fill', (q) => dash.colors[window.epCentreIndex[q.centre] ?? 0]).style('fill-opacity', 0.85).style('stroke', 'var(--color-bg)').style('stroke-width', 1)
    .on('pointermove', (ev, q) => t.show(ev, [q.suburb, `${q.players} player${q.players === 1 ? '' : 's'}`, `Bundoora ~${q.bundoora_min} min`, `Ravenhall ~${q.ravenhall_min} min`, `Hallam ~${q.hallam_min} min`, q.centre === 'Bundoora' ? 'Bundoora is closest or close enough' : `${q.centre} saves ~${q.saving_min} min`]))
    .on('pointerleave', t.hide);
  const cg = svg.append('g').selectAll('g').data(centres).join('g').attr('transform', (ct) => `translate(${x(ct.lon)},${y(ct.lat)})`);
  cg.append('rect').attr('x', -6).attr('y', -6).attr('width', 12).attr('height', 12).attr('transform', 'rotate(45)')
    .style('fill', 'var(--color-fg)').style('stroke', 'var(--color-bg)').style('stroke-width', 2);
  cg.append('text').attr('x', 10).attr('y', -8).style('fill', 'var(--color-fg)').style('font-size', 'var(--cds-font-size-caption)').style('font-weight', 600)
    .style('paint-order', 'stroke').style('stroke', 'var(--color-panel)').style('stroke-width', 3)
    .text((ct) => (ct.name === 'Bundoora' ? 'Bundoora (Cutting Edge)' : ct.name));
  el.replaceChildren(svg.node(), t.tip);
});

dash.draw('catchtable', (tb) => {
  const d = dash.data('catchment');
  tb.replaceChildren();
  if (d.status !== 'ok' || !Array.isArray(d.data)) return;
  d.data.forEach((r) => {
    const tr = document.createElement('tr');
    tr.dataset.key = encodeURIComponent(r.place);
    const cells = [r.suburb, r.region, r.players, r.bundoora_min ?? '—', r.ravenhall_min ?? '—', r.hallam_min ?? '—', r.centre === 'Unknown' ? '—' : r.centre, r.launch];
    cells.forEach((v, i) => {
      const td = document.createElement('td');
      if (i === 6 && r.centre !== 'Unknown') {
        const sw = document.createElement('i');
        sw.className = 'sw';
        sw.style.background = dash.colors[window.epCentreIndex[r.centre]];
        sw.style.marginRight = '6px';
        td.append(sw);
      }
      td.append(document.createTextNode(String(v)));
      tr.append(td);
    });
    tb.append(tr);
  });
});

dash.draw('catchtime', (el) => {
  const d = dash.data('catchment_daily');
  if (d.status !== 'ok' || !Array.isArray(d.data) || !d.data.length) { window.epPlaceholder(el, d); return; }
  const rows = d.data.map((q) => ({date: window.epParse(q.day), bundoora: q.bundoora, ravenhall: q.ravenhall, hallam: q.hallam}));
  const keys = [['bundoora', 'Bundoora', 0], ['ravenhall', 'Ravenhall', 1], ['hallam', 'Hallam', 2]];
  const W = Math.max(280, el.clientWidth), H = 220, m = {t: 12, r: 78, b: 26, l: 28};
  const x = d3.scaleUtc(d3.extent(rows, (q) => q.date), [m.l, W - m.r]);
  const y = d3.scaleLinear([0, d3.max(rows, (q) => Math.max(q.bundoora, q.ravenhall, q.hallam))], [H - m.b, m.t]).nice();
  const svg = d3.create('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img')
    .attr('aria-label', 'Line chart of the running total of Elite first purchases over time, one line per likely centre.');
  svg.append('g').attr('class', 'grid').selectAll('line').data(y.ticks(4)).join('line').attr('x1', m.l).attr('x2', W - m.r).attr('y1', y).attr('y2', y);
  svg.append('g').attr('class', 'axis').attr('transform', `translate(${m.l},0)`).call(d3.axisLeft(y).ticks(4).tickSize(0).tickPadding(6)).call((g) => g.select('.domain').remove());
  svg.append('g').attr('class', 'axis').attr('transform', `translate(0,${H - m.b})`).call(d3.axisBottom(x).ticks(W < 520 ? 4 : 7).tickSize(3).tickFormat(d3.utcFormat('%-d %b')));
  const last = rows[rows.length - 1];
  const labelYs = [];
  keys.forEach(([k, name, i]) => {
    svg.append('path').datum(rows).attr('d', d3.line().x((q) => x(q.date)).y((q) => y(q[k])).curve(d3.curveStepAfter))
      .style('fill', 'none').style('stroke', dash.colors[i]).style('stroke-width', 2.5);
    let ly = y(last[k]) + 4;
    labelYs.forEach((o) => { if (Math.abs(o - ly) < 13) ly = o + (ly >= o ? 13 : -13); });
    labelYs.push(ly);
    svg.append('text').attr('class', 'vlab').attr('x', W - m.r + 6).attr('y', ly).style('fill', dash.colors[i]).text(`${name} ${last[k]}`);
  });
  el.replaceChildren(svg.node());
});
