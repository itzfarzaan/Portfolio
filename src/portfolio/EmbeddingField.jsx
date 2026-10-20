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

export default function EmbeddingField({ hudRef, cardRef }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current, host = canvas.parentElement, ctx = canvas.getContext('2d');
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
    const resize = () => {
      const box = host.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width;
      height = box.height;
      cell = width < 760 ? 11 : 13;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / cell);
      rows = Math.ceil(height / cell);
      density = new Float32Array(cols * rows);
      cellOwner = new Int8Array(cols * rows);
      cellNear = new Float32Array(cols * rows);
      highlight = new Uint8Array(cols * rows);
      const rand = seeded(7);
      dashes = Array.from({ length: Math.round(cols * rows / 70) }, () => ({ x: rand() * width, y: rand() * height, speed: 4 + rand() * 10, glyph: rand() > .7 ? '·' : '-', alpha: .12 + rand() * .2 }));
      drawBackdrop();
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
          nearest.splice(at, 0, { i, d2, idx });
          if (nearest.length > TOP_K) nearest.pop();
        }
      }
      nearest.forEach(n => { highlight[n.idx] = 1; });

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

      // Retrieval links from the query to its neighbours.
      ctx.lineWidth = 1;
      nearest.forEach((n, rank) => {
        ctx.strokeStyle = rgba(SIGNAL, .62 - rank * .06);
        ctx.beginPath();
        ctx.moveTo(query.x, query.y);
        ctx.lineTo((n.idx % cols) * cell + cell / 2, (n.idx / cols | 0) * cell + cell / 2);
        ctx.stroke();
      });
      ctx.font = `${cell * 2.4}px ${fonts}`;
      ctx.fillStyle = rgba([24, 26, 36], .85);
      const qc = Math.floor(query.x / cell) * cell + cell / 2, qr = Math.floor(query.y / cell) * cell + cell / 2;
      ctx.strokeStyle = rgba([24, 26, 36], .8);
      ctx.beginPath();
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => {
        const ox = qc + sx * cell * 1.5, oy = qr + sy * cell * 1.5;
        ctx.moveTo(ox, oy - sy * cell * .7);
        ctx.lineTo(ox, oy);
        ctx.lineTo(ox - sx * cell * .7, oy);
      });
      ctx.stroke();
      ctx.fillRect(qc - 1.5, qr - 1.5, 3, 3);

      ctx.font = `10.5px ${fonts}`;
      ctx.textAlign = 'left';
      if (width >= 760) {
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
        const text = `${CLUSTERS[space.owner[top.i]].label}  ${score}`;
        const tx = (top.idx % cols) * cell + cell * 1.6, ty = (top.idx / cols | 0) * cell - cell * 1.9;
        const w = ctx.measureText(text).width + 14;
        const chipX = Math.max(4, Math.min(tx, width - w - 4));
        ctx.fillStyle = rgba(SIGNAL, .95);
        ctx.fillRect(chipX, ty - 9, w, 19);
        ctx.fillStyle = '#fff';
        ctx.fillText(text, chipX + 7, ty + 1);
      }

      // Thin trace to the profile card: it is always the top document for this query.
      const card = cardRef?.current;
      if (card && width >= 760) {
        const hostBox = host.getBoundingClientRect(), box = card.getBoundingClientRect();
        const ex = box.left - hostBox.left, ey = box.top - hostBox.top + 18;
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = rgba(SIGNAL, .4);
        ctx.beginPath();
        ctx.moveTo(query.x, query.y);
        ctx.bezierCurveTo(query.x + (ex - query.x) * .5, query.y, ex - 60, ey, ex, ey);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      if (hudRef?.current && (hudTick++ % 12 === 0 || reduceMotion)) {
        const set = (key, value) => { const el = hudRef.current.querySelector(`[data-stat="${key}"]`); if (el) el.textContent = value; };
        set('k', String(nearest.length).padStart(2, '0'));
        set('cluster', top ? CLUSTERS[space.owner[top.i]].label : '—');
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
    return () => {
      stop();
      observer.disconnect();
      seen.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
    };
  }, [hudRef, cardRef]);
  return <canvas ref={canvasRef} className="embedding-field" aria-hidden="true" />;
}
