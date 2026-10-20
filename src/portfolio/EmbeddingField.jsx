import { useEffect, useRef } from 'react';

// An ASCII-rendered embedding space: clustered vectors rotate in 3D, are rasterised
// into a character grid, and the pointer acts as a query that retrieves its nearest neighbours.
const CLUSTERS = [
  { label: 'retrieval.rag', tone: [58, 68, 92] },
  { label: 'voice.agents', tone: [92, 104, 128] },
  { label: 'fullstack.web', tone: [44, 44, 54] },
  { label: 'ml.models', tone: [112, 100, 140] },
  { label: 'docs.context', tone: [128, 118, 102] },
  { label: 'product.systems', tone: [70, 112, 120] }
];
const PER_CLUSTER = 230;
const AMBIENT = 2048 - CLUSTERS.length * PER_CLUSTER;
const RAMP = ".:-=+*tsSX%#8@";
const SIGNAL = [47, 84, 235];
const TOP_K = 7;
const CAMERA = 3.6;
const NAME_LABEL = 'farzaan.ali';
const SCRAMBLE = '!<>-_/[]{}=+*^?#%&$01';
const INK = [22, 23, 29];

function seeded(seed) {
  return () => {
    seed = seed + 0x6d2b79f5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function unit(rand) {
  const z = rand() * 2 - 1, a = rand() * Math.PI * 2, r = Math.sqrt(1 - z * z);
  return [r * Math.cos(a), r * Math.sin(a), z];
}
function buildSpace() {
  const rand = seeded(20260);
  const gauss = () => Math.sqrt(-2 * Math.log(rand() || 1e-9)) * Math.cos(2 * Math.PI * rand());
  const count = CLUSTERS.length * PER_CLUSTER + AMBIENT;
  const pos = new Float32Array(count * 3), owner = new Int8Array(count), weight = new Float32Array(count);
  const centroids = [];
  let n = 0;
  CLUSTERS.forEach((_, c) => {
    // Fibonacci sphere spacing keeps clusters apart; each one is a bent filament, not a ball.
    const y = 1 - (c + .5) / CLUSTERS.length * 2, r = Math.sqrt(1 - y * y), phi = c * 2.39996;
    const centre = [Math.cos(phi) * r * 1.05, y * .85, Math.sin(phi) * r * 1.05];
    const axis = unit(rand), bend = unit(rand);
    centroids.push(centre);
    for (let i = 0; i < PER_CLUSTER; i++, n++) {
      const s = gauss() * .36, curve = s * s * .9;
      for (let d = 0; d < 3; d++) pos[n * 3 + d] = centre[d] + axis[d] * s + bend[d] * curve + gauss() * .075;
      owner[n] = c;
      weight[n] = 1;
    }
  });
  for (let i = 0; i < AMBIENT; i++, n++) {
    const dir = unit(rand), radius = 0.4 + Math.cbrt(rand()) * 1.6;
    for (let d = 0; d < 3; d++) pos[n * 3 + d] = dir[d] * radius;
    owner[n] = -1;
    weight[n] = .35;
  }
  return { count, pos, owner, weight, centroids };
}

export default function EmbeddingField({ hudRef, cardRef, nameRef }) {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current, host = canvas.parentElement, ctx = canvas.getContext('2d');
    // The overlay sits above the text wash: it carries the ASCII name and the query graphics.
    const overlay = overlayRef.current, fx = overlay.getContext('2d');
    const space = buildSpace();
    const screenX = new Float32Array(space.count), screenY = new Float32Array(space.count), depth = new Float32Array(space.count);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fonts = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    const styles = new Map();
    const rgba = (rgb, a) => {
      const key = rgb.join() + (Math.round(a * 20) / 20);
      if (!styles.has(key)) styles.set(key, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${Math.round(a * 20) / 20})`);
      return styles.get(key);
    };
    let width = 0, height = 0, cell = 13, cols = 0, rows = 0;
    let density, cellOwner, cellNear, highlight, backdrop, dashes = [];
    let frame = 0, running = false, visible = true, last = performance.now(), clock = 0, hudTick = 0;
    let letters = [], nameCell = 7, nameReady = false, nameClock = 0, disposed = false;
    const pointer = { x: 0, y: 0, inside: false };
    const query = { x: 0, y: 0, ready: false };
    const tilt = { x: 0, y: 0 };

    const layout = () => {
      const narrow = width < 760;
      return narrow ? { cx: width * .55, cy: 150, scale: Math.min(width * .3, 125) } : { cx: width * .56, cy: height * .5, scale: Math.min(width * .3, height * .4) };
    };
    const drawBackdrop = () => {
      backdrop = document.createElement('canvas');
      const dpr = canvas.width / width;
      backdrop.width = canvas.width;
      backdrop.height = canvas.height;
      const b = backdrop.getContext('2d');
      b.scale(dpr, dpr);
      b.strokeStyle = 'rgba(30,32,44,0.045)';
      b.lineWidth = 1;
      b.beginPath();
      for (let x = 0; x <= width; x += cell) { b.moveTo(Math.round(x) + .5, 0); b.lineTo(Math.round(x) + .5, height); }
      for (let y = 0; y <= height; y += cell) { b.moveTo(0, Math.round(y) + .5); b.lineTo(width, Math.round(y) + .5); }
      b.stroke();
    };
    // Rasterise the real h1 (same font, size and tracking) into half-size cells; each cell becomes a vector.
    const buildName = () => {
      const h1 = nameRef?.current;
      if (!h1 || !nameReady) return [];
      const box = host.getBoundingClientRect(), style = getComputedStyle(h1), area = h1.getBoundingClientRect();
      const off = document.createElement('canvas');
      off.width = Math.ceil(width);
      off.height = Math.ceil(height);
      const o = off.getContext('2d', { willReadFrequently: true });
      o.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      if ('letterSpacing' in o) o.letterSpacing = style.letterSpacing;
      const metrics = o.measureText('Hg'), ascent = metrics.fontBoundingBoxAscent, descent = metrics.fontBoundingBoxDescent;
      // Neighbouring letters are drawn into different colour channels so each cell knows which letter it belongs to.
      o.globalCompositeOperation = 'lighter';
      h1.querySelectorAll('span').forEach((span, line) => {
        const r = span.getBoundingClientRect(), text = span.textContent;
        const baseline = r.top - box.top + (r.height - (ascent + descent)) / 2 + ascent;
        [...text].forEach((letter, index) => {
          o.fillStyle = (index + line) % 2 ? '#00f' : '#f00';
          o.fillText(letter, r.left - box.left + o.measureText(text.slice(0, index)).width, baseline);
        });
      });
      const data = o.getImageData(0, 0, off.width, off.height).data, rand = seeded(42), found = [];
      const c0 = Math.max(0, Math.floor((area.left - box.left - 20) / nameCell)), c1 = Math.min(Math.ceil(width / nameCell), Math.ceil((area.right - box.left + 60) / nameCell));
      const r0 = Math.max(0, Math.floor((area.top - box.top - 10) / nameCell)), r1 = Math.min(Math.ceil(height / nameCell), Math.ceil((area.bottom - box.top + 20) / nameCell));
      const gridCols = c1 - c0, cells = new Map();
      for (let row = r0; row < r1; row++) for (let col = c0; col < c1; col++) {
        let red = 0, blue = 0;
        for (let sy = 0; sy < 4; sy++) for (let sx = 0; sx < 4; sx++) {
          const x = Math.min(off.width - 1, col * nameCell + (sx + .5) * nameCell / 4 | 0), y = Math.min(off.height - 1, row * nameCell + (sy + .5) * nameCell / 4 | 0);
          const at = (y * off.width + x) * 4, alpha = data[at + 3] / 255;
          if (data[at] * alpha > 110) red++;
          if (data[at + 2] * alpha > 110) blue++;
        }
        const coverage = Math.max(red, blue) / 16;
        if (coverage < .12) continue;
        cells.set((row - r0) * gridCols + col - c0, { tx: col * nameCell + nameCell / 2, ty: row * nameCell + nameCell / 2, coverage, col, letter: red >= blue ? 0 : 1 });
      }
      // Where two letters touch, the weaker cell is dropped so there is always a clear gap between them.
      const dropped = new Set();
      cells.forEach((cell, key) => {
        const col = key % gridCols;
        [-1, 1].forEach(dc => [-gridCols, 0, gridCols].forEach(dr => {
          if (col + dc < 0 || col + dc >= gridCols) return;
          const other = cells.get(key + dc + dr);
          if (other && other.letter !== cell.letter) dropped.add(cell.coverage < other.coverage || (cell.coverage === other.coverage && dc > 0) ? key : key + dc + dr);
        }));
      });
      cells.forEach((cell, key) => { if (!dropped.has(key)) found.push(cell); });
      const span = Math.max(1, c1 - c0);
      return found.map(p => ({
        ...p, glyph: RAMP[Math.max(0, RAMP.length - 1 - Math.round((1 - p.coverage) * 6) - (rand() > .6 ? 1 : 0))],
        delay: (p.col - c0) / span * .9 + rand() * .15, ox: 0, oy: 0, vx: 0, vy: 0, heat: 0, lit: false
      }));
    };
    const resize = () => {
      const box = host.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width;
      height = box.height;
      cell = width < 760 ? 11 : 14;
      nameCell = width < 760 ? cell / 3 : cell / 2;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      overlay.width = canvas.width;
      overlay.height = canvas.height;
      overlay.style.width = `${width}px`;
      overlay.style.height = `${height}px`;
      fx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / cell);
      rows = Math.ceil(height / cell);
      density = new Float32Array(cols * rows);
      cellOwner = new Int8Array(cols * rows);
      cellNear = new Float32Array(cols * rows);
      highlight = new Uint8Array(cols * rows);
      const rand = seeded(7);
      dashes = Array.from({ length: Math.round(cols * rows / 70) }, () => ({ x: rand() * width, y: rand() * height, speed: 4 + rand() * 10, glyph: rand() > .7 ? '·' : '-', alpha: .12 + rand() * .2 }));
      drawBackdrop();
      letters = buildName();
      if (!query.ready) {
        const { cx, cy } = layout();
        Object.assign(query, { x: cx, y: cy, ready: true });
      }
      if (!running) render(0);
    };

    const render = dt => {
      const started = performance.now();
      if (!reduceMotion) clock += dt;
      const { cx, cy, scale } = layout();
      // The query follows the pointer, or wanders through the space when nobody is steering.
      const target = pointer.inside ? pointer : { x: cx + Math.cos(clock * .23) * scale * 1.05, y: cy + Math.sin(clock * .37) * scale * .62 };
      const ease = reduceMotion ? 1 : 1 - Math.pow(.0015, dt);
      query.x += (target.x - query.x) * ease;
      query.y += (target.y - query.y) * ease;
      const tiltTarget = pointer.inside ? { x: (pointer.x / width - .5), y: (pointer.y / height - .5) } : { x: 0, y: 0 };
      tilt.x += (tiltTarget.x - tilt.x) * Math.min(1, dt * 2.5 || 1);
      tilt.y += (tiltTarget.y - tilt.y) * Math.min(1, dt * 2.5 || 1);
      const yaw = clock * .07 + tilt.x * .7, pitch = .34 + tilt.y * .32;
      const cosY = Math.cos(yaw), sinY = Math.sin(yaw), cosP = Math.cos(pitch), sinP = Math.sin(pitch);

      density.fill(0);
      cellNear.fill(-1);
      highlight.fill(0);
      const nearest = [];
      const radius2 = (Math.max(scale * .9, 150)) ** 2;
      for (let i = 0; i < space.count; i++) {
        const x = space.pos[i * 3], y = space.pos[i * 3 + 1], z = space.pos[i * 3 + 2];
        const x1 = x * cosY - z * sinY, z1 = x * sinY + z * cosY;
        const y1 = y * cosP - z1 * sinP, z2 = y * sinP + z1 * cosP;
        const p = CAMERA / (CAMERA - z2);
        const sx = cx + x1 * scale * p, sy = cy + y1 * scale * p;
        const near = Math.min(1, Math.max(0, (z2 + 2) / 4));
        screenX[i] = sx;
        screenY[i] = sy;
        depth[i] = near;
        const col = sx / cell | 0, row = sy / cell | 0;
        if (col < 0 || row < 0 || col >= cols || row >= rows) continue;
        const idx = row * cols + col;
        density[idx] += space.weight[i] * (.45 + near * .95);
        if (near > cellNear[idx]) { cellNear[idx] = near; cellOwner[idx] = space.owner[i]; }
        if (space.owner[i] < 0) continue;
        const dx = sx - query.x, dy = sy - query.y, d2 = dx * dx + dy * dy;
        if (d2 > radius2) continue;
        if (nearest.length < TOP_K || d2 < nearest[nearest.length - 1].d2) {
          let at = nearest.length;
          while (at > 0 && nearest[at - 1].d2 > d2) at--;
          nearest.splice(at, 0, { d2, idx, x: col * cell + cell / 2, y: row * cell + cell / 2, label: CLUSTERS[space.owner[i]].label });
          if (nearest.length > TOP_K) nearest.pop();
        }
      }
      // Letters of the name are vectors too: they join the search and are pushed aside by the query.
      if (!reduceMotion) nameClock += dt;
      const push = width < 760 ? 55 : 90;
      for (const p of letters) {
        p.lit = false;
        if (nameClock < p.delay) continue;
        if (!reduceMotion) {
          let ax = -p.ox * 70 - p.vx * 10, ay = -p.oy * 70 - p.vy * 10;
          if (pointer.inside) {
            const dx = p.tx + p.ox - query.x, dy = p.ty + p.oy - query.y, d = Math.hypot(dx, dy);
            if (d < push && d > .01) {
              const force = (1 - d / push) ** 2;
              ax += dx / d * force * 2400;
              ay += dy / d * force * 2400;
              p.heat = Math.max(p.heat, force * 1.7);
            }
          }
          p.vx += ax * dt;
          p.vy += ay * dt;
          p.ox += p.vx * dt;
          p.oy += p.vy * dt;
          p.heat = Math.max(0, p.heat - dt * 1.3);
        }
        if (!pointer.inside) continue;
        const x = p.tx + p.ox, y = p.ty + p.oy, dx = x - query.x, dy = y - query.y, d2 = dx * dx + dy * dy;
        if (d2 > radius2 || (nearest.length >= TOP_K && d2 >= nearest[nearest.length - 1].d2)) continue;
        let at = nearest.length;
        while (at > 0 && nearest[at - 1].d2 > d2) at--;
        nearest.splice(at, 0, { d2, letter: p, x, y, label: NAME_LABEL });
        if (nearest.length > TOP_K) nearest.pop();
      }
      nearest.forEach(n => { if (n.letter) n.letter.lit = true; else highlight[n.idx] = 1; });

      ctx.clearRect(0, 0, width, height);
      if (backdrop) ctx.drawImage(backdrop, 0, 0, width, height);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${Math.round(cell * .78)}px ${fonts}`;

      for (const dash of dashes) {
        if (!reduceMotion) dash.x = (dash.x + dash.speed * dt) % width;
        ctx.fillStyle = rgba([40, 44, 60], dash.alpha);
        ctx.fillText(dash.glyph, (dash.x / cell | 0) * cell + cell / 2, (dash.y / cell | 0) * cell + cell / 2);
      }

      const flicker = clock * 3 | 0;
      for (let idx = 0; idx < density.length; idx++) {
        const d = density[idx];
        if (d <= 0) continue;
        const col = idx % cols, row = idx / cols | 0, x = col * cell, y = row * cell;
        const level = Math.min(1, d / (cell < 12 ? 6.5 : 4.6));
        const owner = cellOwner[idx], tone = owner >= 0 ? CLUSTERS[owner].tone : [70, 74, 90];
        // A small per-cell hash keeps glyphs shimmering without looking random.
        const jitter = ((idx * 2654435761 + flicker * 40503) >>> 28) & 1;
        const glyph = RAMP[Math.min(RAMP.length - 1, Math.round(level * (RAMP.length - 1)) + jitter)];
        if (highlight[idx]) {
          ctx.fillStyle = rgba(SIGNAL, .92);
          ctx.fillRect(x + .5, y + .5, cell - 1, cell - 1);
          ctx.fillStyle = '#fff';
        } else if (level < .14) {
          ctx.fillStyle = rgba(tone, .22 + level * 2);
        } else {
          ctx.fillStyle = rgba(tone, .06 + level * .62);
          ctx.fillRect(x + .5, y + .5, cell - 1, cell - 1);
          ctx.fillStyle = level > .55 ? 'rgba(250,250,248,0.92)' : rgba(tone.map(v => v * .55), .9);
        }
        ctx.fillText(glyph, x + cell / 2, y + cell / 2 + .5);
      }

      fx.clearRect(0, 0, width, height);
      fx.textAlign = 'center';
      fx.textBaseline = 'middle';
      fx.font = `${Math.round(nameCell * .86)}px ${fonts}`;
      for (const p of letters) {
        const age = reduceMotion ? 1 : Math.min(1, (nameClock - p.delay) / .35);
        if (age <= 0) continue;
        const x = p.tx + p.ox, y = p.ty + p.oy, heat = p.lit ? 1 : Math.min(1, p.heat);
        const tone = INK.map((v, i) => Math.round((v + (SIGNAL[i] - v) * heat) / 8) * 8);
        // Solid cells carry a glyph; edge cells are tinted by coverage so the letterforms stay smooth.
        const solid = p.coverage > .7;
        fx.fillStyle = rgba(tone, (solid ? .94 : Math.max(.18, p.coverage * .75 + heat * .3)) * age);
        fx.fillRect(x - nameCell / 2 + .3, y - nameCell / 2 + .3, nameCell - .6, nameCell - .6);
        if (solid || heat > .35) {
          fx.fillStyle = solid ? rgba([250, 250, 248], .82 * age) : rgba(SIGNAL, .9);
          fx.fillText(heat > .35 && !p.lit ? SCRAMBLE[Math.random() * SCRAMBLE.length | 0] : p.glyph, x, y + .4);
        }
      }

      // Retrieval links from the query to its neighbours.
      fx.lineWidth = 1;
      nearest.forEach((n, rank) => {
        fx.strokeStyle = rgba(SIGNAL, .62 - rank * .06);
        fx.beginPath();
        fx.moveTo(query.x, query.y);
        fx.lineTo(n.x, n.y);
        fx.stroke();
      });
      fx.font = `${cell * 2.4}px ${fonts}`;
      fx.fillStyle = rgba([24, 26, 36], .85);
      const qc = Math.floor(query.x / cell) * cell + cell / 2, qr = Math.floor(query.y / cell) * cell + cell / 2;
      fx.strokeStyle = rgba([24, 26, 36], .8);
      fx.beginPath();
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => {
        const ox = qc + sx * cell * 1.5, oy = qr + sy * cell * 1.5;
        fx.moveTo(ox, oy - sy * cell * .7);
        fx.lineTo(ox, oy);
        fx.lineTo(ox - sx * cell * .7, oy);
      });
      fx.stroke();
      fx.fillRect(qc - 1.5, qr - 1.5, 3, 3);

      fx.font = `10.5px ${fonts}`;
      fx.textAlign = 'left';
      if (width >= 760) {
        // Cluster labels belong to the field layer, so the text wash and the name sit above them.
        ctx.font = `10.5px ${fonts}`;
        ctx.textAlign = 'left';
        const placed = [];
        space.centroids.forEach((c, index) => {
          const x1 = c[0] * cosY - c[2] * sinY, z1 = c[0] * sinY + c[2] * cosY;
          const y1 = c[1] * cosP - z1 * sinP, z2 = c[1] * sinP + z1 * cosP, p = CAMERA / (CAMERA - z2);
          const sx = cx + x1 * scale * p, sy = cy + y1 * scale * p, near = (z2 + 2) / 4;
          // Labels sit outside their cluster, away from the centre; overlapping ones are skipped.
          const side = sx >= cx ? 1 : -1, text = `${CLUSTERS[index].label} · ${PER_CLUSTER}`, tw = ctx.measureText(text).width;
          const lx = sx + side * scale * .36 - (side < 0 ? tw : 0), ly = sy - scale * .24;
          if (placed.some(b => lx < b.x + b.w + 12 && lx + tw + 12 > b.x && Math.abs(ly - b.y) < 16)) return;
          placed.push({ x: lx, y: ly, w: tw });
          ctx.strokeStyle = rgba([40, 44, 60], .15 + near * .3);
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(side > 0 ? lx - 4 : lx + tw + 4, ly);
          ctx.stroke();
          ctx.fillStyle = rgba([40, 44, 60], .3 + near * .55);
          ctx.fillText(text, lx, ly);
        });
      }
      const top = nearest[0];
      if (top) {
        const score = (.995 - Math.sqrt(top.d2) / Math.sqrt(radius2) * .32).toFixed(3);
        const text = `${top.label}  ${score}`;
        const tx = top.x + cell * 1.1, ty = top.y - cell * 1.9;
        const w = fx.measureText(text).width + 14;
        const chipX = Math.max(4, Math.min(tx, width - w - 4));
        fx.fillStyle = rgba(SIGNAL, .95);
        fx.fillRect(chipX, ty - 9, w, 19);
        fx.fillStyle = '#fff';
        fx.fillText(text, chipX + 7, ty + 1);
      }

      // Thin trace to the profile card: it is always the top document for this query.
      const card = cardRef?.current;
      if (card && width >= 760) {
        const hostBox = host.getBoundingClientRect(), box = card.getBoundingClientRect();
        const ex = box.left - hostBox.left, ey = box.top - hostBox.top + 18;
        fx.setLineDash([3, 4]);
        fx.strokeStyle = rgba(SIGNAL, .4);
        fx.beginPath();
        fx.moveTo(query.x, query.y);
        fx.bezierCurveTo(query.x + (ex - query.x) * .5, query.y, ex - 60, ey, ex, ey);
        fx.stroke();
        fx.setLineDash([]);
      }

      if (hudRef?.current && (hudTick++ % 12 === 0 || reduceMotion)) {
        const set = (key, value) => { const el = hudRef.current.querySelector(`[data-stat="${key}"]`); if (el) el.textContent = value; };
        set('k', String(nearest.length).padStart(2, '0'));
        set('cluster', top ? top.label : '—');
        set('latency', `${(performance.now() - started).toFixed(1)} ms`);
        set('yaw', `${(((yaw * 180 / Math.PI) % 360 + 360) % 360).toFixed(0).padStart(3, '0')}°`);
      }
    };

    const loop = now => {
      const dt = Math.min(.05, (now - last) / 1000);
      last = now;
      render(dt);
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduceMotion || !visible) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    };
    const stop = () => { running = false; cancelAnimationFrame(frame); };

    const onMove = event => {
      const box = host.getBoundingClientRect();
      Object.assign(pointer, { x: event.clientX - box.left, y: event.clientY - box.top, inside: true });
      if (reduceMotion) render(0);
    };
    const onLeave = () => { pointer.inside = false; if (reduceMotion) render(0); };
    const observer = new ResizeObserver(resize);
    const seen = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visible ? start() : stop(); });
    observer.observe(host);
    seen.observe(host);
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    resize();
    start();
    // The name must be sampled in the display font, so it switches to ASCII once that font is ready.
    const fontFamily = nameRef?.current ? getComputedStyle(nameRef.current).fontFamily : '';
    (document.fonts?.load ? document.fonts.load(`700 100px ${fontFamily}`) : Promise.resolve()).catch(() => {}).then(() => {
      if (disposed || !nameRef?.current) return;
      nameReady = true;
      host.dataset.ascii = 'on';
      nameClock = 0;
      letters = buildName();
      if (!running) render(0);
    });
    return () => {
      disposed = true;
      delete host.dataset.ascii;
      stop();
      observer.disconnect();
      seen.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
    };
  }, [hudRef, cardRef, nameRef]);
  return <>
    <canvas ref={canvasRef} className="embedding-field" aria-hidden="true" />
    <canvas ref={overlayRef} className="embedding-field embedding-overlay" aria-hidden="true" />
  </>;
}
