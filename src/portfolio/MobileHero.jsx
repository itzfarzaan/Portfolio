import { useEffect, useRef } from 'react';
import { profile } from './content';

const SRC = '/media/farzaan-portrait-card.webp';
const COARSE = 14, FINE = 6, SWEEP_MS = 1900, FIRST_MS = 1400, EVERY_MS = 10000, BAND = .22;

// The portrait is always sharp. Every 10 seconds a diagonal band sweeps from the top-left corner to the
// bottom-right, pixelating the photo as it passes (coarse at its centre, finer at its edges, with a blue
// leading edge) and leaving it clear behind. Nothing runs between sweeps or while it is off screen.
function PortraitLoad() {
  const frameRef = useRef(null), canvasRef = useRef(null);
  useEffect(() => {
    const frame = frameRef.current, canvas = canvasRef.current, ctx = canvas.getContext('2d');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const hex = getComputedStyle(frame).getPropertyValue('--color-signal').trim().replace('#', '');
    const SIGNAL = /^[0-9a-f]{6}$/i.test(hex) ? [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16)).join(',') : '47,84,235';
    let coarse = null, fine = null, width = 0, height = 0, dpr = 1, raf = 0, timer = 0, start = 0, visible = false, disposed = false;
    const image = new Image();
    image.src = SRC;

    // Two pixelated copies of the portrait, drawn small and scaled up without smoothing.
    const mosaic = block => {
      const small = document.createElement('canvas'), out = document.createElement('canvas');
      small.width = Math.ceil(width / block);
      small.height = Math.ceil(height / block);
      small.getContext('2d').drawImage(image, 0, 0, small.width, small.height);
      out.width = canvas.width;
      out.height = canvas.height;
      const o = out.getContext('2d');
      o.imageSmoothingEnabled = false;
      o.drawImage(small, 0, 0, small.width * block * dpr, small.height * block * dpr);
      return out;
    };
    const measure = () => {
      const box = frame.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width;
      height = box.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      coarse = mosaic(COARSE);
      fine = mosaic(FINE);
    };
    // p is the band's centre along the diagonal (0 at the top-left corner, 1 at the bottom-right).
    const draw = p => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cols = Math.ceil(width / COARSE), rows = Math.ceil(height / COARSE), s = COARSE * dpr;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const ahead = ((c + .5) / cols + (r + .5) / rows) / 2 - p;
        if (Math.abs(ahead) > BAND / 2) continue;
        ctx.drawImage(Math.abs(ahead) < BAND / 4 ? coarse : fine, c * s, r * s, s, s, c * s, r * s, s, s);
        if (ahead > BAND * .3) {
          ctx.fillStyle = `rgba(${SIGNAL},.4)`;
          ctx.fillRect(c * s, r * s, s, s);
        }
      }
    };
    const tick = now => {
      const t = Math.min(1, (now - start) / SWEEP_MS), eased = t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      draw(eased * (1 + BAND) - BAND / 2);
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        timer = setTimeout(sweep, EVERY_MS - SWEEP_MS);
      }
    };
    const sweep = () => {
      if (disposed || !visible || !coarse) return;
      start = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      stop();
      if (visible) timer = setTimeout(sweep, FIRST_MS);
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
    <img src={SRC} alt="Mohammed Farzaan Ali" width="600" height="800" fetchPriority="high" />
    <canvas ref={canvasRef} aria-hidden="true" />
  </div>;
}

export default function MobileHero() {
  return <section className="m-hero" aria-labelledby="intro-title">
    <p className="m-hud" aria-hidden="true"><i />Retrieval · live <span>Top result</span></p>
    <div className="m-intro">
      <div>
        <p className="m-eyebrow">AI & Software Engineer</p>
        <h1 id="intro-title">Farzaan<br />Ali</h1>
        <p className="m-tagline">I build software that <em>understands.</em></p>
      </div>
      <PortraitLoad />
    </div>
    <div className="m-actions">
      <a className="embed-primary" href={profile.resume} download><span aria-hidden="true">↓</span> Resume</a>
      <a className="embed-chip" href={profile.linkedin}>LinkedIn <span aria-hidden="true">↗</span></a>
      <a className="embed-chip" href={profile.github}>GitHub <span aria-hidden="true">↗</span></a>
      <a className="embed-chip" href={`mailto:${profile.email}`}>Email</a>
    </div>
    <p className="m-bio">Artificial Intelligence Engineer at <strong>Linkiat</strong>, leading software projects at <strong>Creative Analytica</strong>. I build software where people and AI work together, automating the busywork so people can focus on what matters.</p>
  </section>;
}
