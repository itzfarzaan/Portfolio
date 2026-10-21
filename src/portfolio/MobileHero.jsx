import { useEffect, useRef } from 'react';
import { profile } from './content';

const RAMP = '@%#8XSs*+=-:. ';
const SWEEP_MS = 2200, REST_MS = 2600, BAND = 90, CELL = 7;

// A blue scan line sweeps down the portrait on its own; the rows it passes briefly turn into ASCII.
// Between sweeps nothing animates, and the loop stops whenever the portrait is off screen.
function PortraitScan() {
  const frameRef = useRef(null), canvasRef = useRef(null), lineRef = useRef(null);
  useEffect(() => {
    const frame = frameRef.current, canvas = canvasRef.current, line = lineRef.current, ctx = canvas.getContext('2d');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let lum = null, cols = 0, rows = 0, width = 0, height = 0, raf = 0, timer = 0, start = 0, visible = true, disposed = false;
    const image = new Image();
    image.src = '/media/farzaan-portrait.webp';

    // Sample the portrait once into a small luminance grid that matches object-fit: cover.
    const measure = () => {
      const box = frame.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width;
      height = box.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CELL);
      rows = Math.ceil(height / CELL);
      const off = document.createElement('canvas');
      off.width = cols;
      off.height = rows;
      const o = off.getContext('2d', { willReadFrequently: true });
      const scale = Math.max(cols / image.width, rows / image.height), dw = image.width * scale, dh = image.height * scale;
      o.drawImage(image, (cols - dw) / 2, (rows - dh) * .12, dw, dh);
      const data = o.getImageData(0, 0, cols, rows).data;
      lum = new Float32Array(cols * rows);
      for (let i = 0; i < lum.length; i++) lum[i] = (data[i * 4] * .3 + data[i * 4 + 1] * .59 + data[i * 4 + 2] * .11) / 255;
    };
    const draw = y => {
      ctx.clearRect(0, 0, width, height);
      ctx.font = `${CELL + 1}px ui-monospace, Menlo, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const r0 = Math.max(0, Math.floor((y - BAND) / CELL)), r1 = Math.min(rows, Math.ceil(y / CELL));
      for (let r = r0; r < r1; r++) {
        // Strongest right behind the line, fading out towards the top of the band.
        const strength = 1 - (y - r * CELL) / BAND;
        for (let c = 0; c < cols; c++) {
          const v = lum[r * cols + c];
          ctx.fillStyle = `rgba(250,250,248,${(.92 * strength).toFixed(2)})`;
          ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
          ctx.fillStyle = strength > .82 ? `rgba(47,84,235,${strength.toFixed(2)})` : `rgba(22,23,29,${(strength * (1.05 - v * .7)).toFixed(2)})`;
          ctx.fillText(RAMP[Math.min(RAMP.length - 1, Math.floor(v * RAMP.length))], c * CELL + CELL / 2, r * CELL + CELL / 2 + .5);
        }
      }
      line.style.transform = `translateY(${y}px)`;
    };
    const tick = now => {
      const t = Math.min(1, (now - start) / SWEEP_MS), eased = t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      draw(eased * (height + BAND));
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        ctx.clearRect(0, 0, width, height);
        frame.classList.remove('is-scanning');
        timer = setTimeout(sweep, REST_MS);
      }
    };
    const sweep = () => {
      if (disposed || !visible || !lum) return;
      frame.classList.add('is-scanning');
      start = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      ctx.clearRect(0, 0, width, height);
      frame.classList.remove('is-scanning');
    };
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      stop();
      if (visible) timer = setTimeout(sweep, 600);
    });
    image.onload = () => {
      if (disposed) return;
      measure();
      seen.observe(frame);
    };
    return () => {
      disposed = true;
      stop();
      seen.disconnect();
    };
  }, []);
  return <div className="m-portrait" ref={frameRef}>
    <img src="/media/farzaan-portrait.webp" alt="Mohammed Farzaan Ali" width="1321" height="1600" fetchPriority="high" />
    <canvas ref={canvasRef} aria-hidden="true" />
    <span className="m-scanline" ref={lineRef} aria-hidden="true" />
    <span className="m-chip" aria-hidden="true">farzaan.ali <b>0.991</b></span>
  </div>;
}

export default function MobileHero() {
  return <section className="m-hero" aria-labelledby="intro-title">
    <p className="m-hud" aria-hidden="true"><i />Retrieval · live <span>Top result</span></p>
    <PortraitScan />
    <p className="m-eyebrow">AI & Software Engineer</p>
    <h1 id="intro-title">Farzaan Ali</h1>
    <p className="m-tagline">I build software that <em>understands.</em></p>
    <div className="m-actions">
      <a className="embed-primary" href={profile.resume} download><span aria-hidden="true">↓</span> Resume</a>
      <a className="embed-chip" href={profile.linkedin}>LinkedIn <span aria-hidden="true">↗</span></a>
      <a className="embed-chip" href={profile.github}>GitHub <span aria-hidden="true">↗</span></a>
      <a className="embed-chip" href={`mailto:${profile.email}`}>Email</a>
    </div>
    <p className="m-bio">AI Engineer at <strong>Linkiat</strong> and Software Engineer at <strong>Creative Analytica</strong>, where I lead AqaarPro. I also built the voice AI receptionist behind <strong>YoraHealth</strong>.</p>
  </section>;
}
