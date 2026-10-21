import { useEffect, useRef } from 'react';
import { rasterizeText } from './asciiText';

const RAMP = '@#8%XSs*+=';
const SWEEP = 1100;

const rgbOf = (el, name, fallback) => {
  const hex = getComputedStyle(el).getPropertyValue(name).trim().replace('#', '');
  return /^[0-9a-f]{6}$/i.test(hex) ? [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16)) : fallback;
};

// A section title that loads in through ASCII: a band of ASCII cells sweeps left to right and the
// solid title appears behind it. Every 5 to 6 seconds the band sweeps across again while the title
// is on screen. Between sweeps only the normal, solid text is shown and nothing runs.
export default function AsciiTitle({ id, children }) {
  const titleRef = useRef(null), textRef = useRef(null), canvasRef = useRef(null);
  useEffect(() => {
    const title = titleRef.current, text = textRef.current, canvas = canvasRef.current, ctx = canvas.getContext('2d');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let cells = [], cell = 6, width = 0, height = 0, band = 140, raf = 0, next = 0, visible = false, loaded = false, disposed = false;

    const build = () => {
      const box = title.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.round(box.width);
      height = Math.round(box.height);
      const size = parseFloat(getComputedStyle(title).fontSize);
      cell = size < 60 ? 4 : 6;
      band = Math.round(size * 1.6);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      let seed = 23;
      const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      cells = rasterizeText(title, title, cell).cells.filter(c => c.coverage >= .25).map(c => ({
        x: Math.round(c.tx - cell / 2), y: Math.round(c.ty - cell / 2), jitter: rand() * .35,
        glyph: RAMP[Math.min(RAMP.length - 1, Math.round((1 - c.coverage) * (RAMP.length - 1)) + (rand() > .7 ? 1 : 0))]
      }));
    };
    // The solid text shows behind the sweep; on the first load the text ahead of the band is hidden too.
    const mask = (front, first) => {
      const back = Math.max(0, front - band);
      const ahead = first ? 'transparent' : '#000';
      text.style.maskImage = text.style.webkitMaskImage = `linear-gradient(90deg, #000 ${back}px, transparent ${back + 1}px, transparent ${front}px, ${ahead} ${front + 1}px)`;
    };
    const clearMask = () => { text.style.maskImage = text.style.webkitMaskImage = ''; };

    const draw = front => {
      const ink = rgbOf(title, '--color-ink', [22, 23, 29]), signal = rgbOf(title, '--color-signal', [47, 84, 235]);
      const paper = rgbOf(title, '--color-paper', [250, 250, 248]);
      ctx.clearRect(0, 0, width, height);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${cell + 1}px ui-monospace, Menlo, monospace`;
      for (const c of cells) {
        // Position inside the band: 0 at the leading edge, 1 where the solid text takes over.
        const depth = (front - c.x) / band - c.jitter * .3;
        if (depth < 0 || depth > 1) continue;
        ctx.fillStyle = `rgb(${(depth < .45 ? signal : ink).join(',')})`;
        ctx.fillRect(c.x, c.y, cell, cell);
        if (cell >= 6) {
          ctx.fillStyle = `rgb(${paper.join(',')})`;
          ctx.fillText(c.glyph, c.x + cell / 2, c.y + cell / 2 + .5);
        }
      }
    };

    const sweep = () => {
      if (disposed || !cells.length) return;
      cancelAnimationFrame(raf);
      const first = !loaded, start = performance.now(), distance = width + band;
      // From here the mask decides what shows, so the text itself can become visible.
      mask(0, first);
      title.classList.remove('is-waiting');
      const frame = now => {
        const t = Math.min(1, (now - start) / SWEEP), eased = 1 - (1 - t) ** 2;
        const front = eased * distance;
        mask(front, first);
        draw(front);
        if (t < 1) raf = requestAnimationFrame(frame);
        else {
          ctx.clearRect(0, 0, width, height);
          clearMask();
          loaded = true;
          schedule();
        }
      };
      raf = requestAnimationFrame(frame);
    };
    const schedule = () => {
      clearTimeout(next);
      if (visible) next = setTimeout(sweep, 5000 + Math.random() * 1000);
    };
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      clearTimeout(next);
      if (visible) {
        if (!loaded) sweep();
        else schedule();
      } else if (loaded) {
        cancelAnimationFrame(raf);
        ctx.clearRect(0, 0, width, height);
        clearMask();
      }
    }, { threshold: .5 });
    const sizes = new ResizeObserver(() => { if (cells.length) build(); });
    // Hidden until the first sweep, so it never flashes solid and then reloads.
    title.classList.add('is-waiting');
    (document.fonts?.ready || Promise.resolve()).then(() => {
      if (disposed) return;
      build();
      if (!cells.length) return title.classList.remove('is-waiting');
      seen.observe(title);
      sizes.observe(title);
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearTimeout(next);
      seen.disconnect();
      sizes.disconnect();
      clearMask();
      title.classList.remove('is-waiting');
    };
  }, []);
  return <h2 id={id} ref={titleRef} className="ascii-title">
    <span ref={textRef}>{children}</span>
    <canvas ref={canvasRef} className="ascii-title-canvas" aria-hidden="true" />
  </h2>;
}
