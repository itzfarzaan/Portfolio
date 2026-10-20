// Shared by the hero name and the footer wordmark: traces real DOM text into grid cells.
// Each <span> inside `element` is one line; the text is drawn with the element's own font,
// size and tracking, so the cells line up with the (transparent) text underneath.
export function rasterizeText(host, element, cell) {
  const box = host.getBoundingClientRect(), style = getComputedStyle(element), area = element.getBoundingClientRect();
  const width = box.width, height = box.height;
  const off = document.createElement('canvas');
  off.width = Math.ceil(width);
  off.height = Math.ceil(height);
  const o = off.getContext('2d', { willReadFrequently: true });
  o.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  if ('letterSpacing' in o) o.letterSpacing = style.letterSpacing;
  const metrics = o.measureText('Hg'), ascent = metrics.fontBoundingBoxAscent, descent = metrics.fontBoundingBoxDescent;
  // Neighbouring letters are drawn into different colour channels so each cell knows which letter it belongs to.
  o.globalCompositeOperation = 'lighter';
  element.querySelectorAll('span').forEach((span, line) => {
    const r = span.getBoundingClientRect(), text = span.textContent;
    const baseline = r.top - box.top + (r.height - (ascent + descent)) / 2 + ascent;
    [...text].forEach((letter, index) => {
      o.fillStyle = (index + line) % 2 ? '#00f' : '#f00';
      o.fillText(letter, r.left - box.left + o.measureText(text.slice(0, index)).width, baseline);
    });
  });
  const data = o.getImageData(0, 0, off.width, off.height).data;
  const c0 = Math.max(0, Math.floor((area.left - box.left - 20) / cell)), c1 = Math.min(Math.ceil(width / cell), Math.ceil((area.right - box.left + 60) / cell));
  const r0 = Math.max(0, Math.floor((area.top - box.top - 10) / cell)), r1 = Math.min(Math.ceil(height / cell), Math.ceil((area.bottom - box.top + 20) / cell));
  const gridCols = Math.max(1, c1 - c0), cells = new Map();
  for (let row = r0; row < r1; row++) for (let col = c0; col < c1; col++) {
    let red = 0, blue = 0;
    for (let sy = 0; sy < 4; sy++) for (let sx = 0; sx < 4; sx++) {
      const x = Math.min(off.width - 1, col * cell + (sx + .5) * cell / 4 | 0), y = Math.min(off.height - 1, row * cell + (sy + .5) * cell / 4 | 0);
      const at = (y * off.width + x) * 4, alpha = data[at + 3] / 255;
      if (data[at] * alpha > 110) red++;
      if (data[at + 2] * alpha > 110) blue++;
    }
    const coverage = Math.max(red, blue) / 16;
    if (coverage < .12) continue;
    cells.set((row - r0) * gridCols + col - c0, { tx: col * cell + cell / 2, ty: row * cell + cell / 2, coverage, col, letter: red >= blue ? 0 : 1 });
  }
  // Where two letters touch, the weaker cell is dropped so there is always a clear gap between them.
  const dropped = new Set();
  cells.forEach((item, key) => {
    const col = key % gridCols;
    [-1, 1].forEach(dc => [-gridCols, 0, gridCols].forEach(dr => {
      if (col + dc < 0 || col + dc >= gridCols) return;
      const other = cells.get(key + dc + dr);
      if (other && other.letter !== item.letter) dropped.add(item.coverage < other.coverage || (item.coverage === other.coverage && dc > 0) ? key : key + dc + dr);
    }));
  });
  const found = [];
  cells.forEach((item, key) => { if (!dropped.has(key)) found.push(item); });
  return { cells: found, firstCol: c0, span: gridCols };
}
