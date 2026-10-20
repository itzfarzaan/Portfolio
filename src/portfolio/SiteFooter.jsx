import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { rasterizeText } from './asciiText';
import { profile } from './content';

const RAMP = '.:-=+*tsSX%#8@';
const SCRAMBLE = '!<>-_/[]{}=+*^?#%&$01';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

// The footer wordmark, drawn in the hero's ASCII cells on the dark band; the cursor pushes letters aside.
function AsciiWordmark({ text }) {
  const hostRef = useRef(null), textRef = useRef(null), canvasRef = useRef(null);
  useEffect(() => {
    const host = hostRef.current, element = textRef.current, canvas = canvasRef.current, ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const signal = getComputedStyle(host).getPropertyValue('--color-signal').trim() || '#2f54eb';
    let cells = [], cell = 8, width = 0, height = 0, frame = 0, running = false, last = 0, disposed = false, ready = false;
    const pointer = { x: 0, y: 0, inside: false };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${Math.round(cell * .86)}px ${MONO}`;
      for (const p of cells) {
        const x = p.tx + p.ox, y = p.ty + p.oy, solid = p.coverage > .7, hot = p.heat > .35;
        ctx.globalAlpha = solid ? 1 : Math.max(.22, p.coverage * .8);
        ctx.fillStyle = p.heat > .05 ? signal : '#f4f4f1';
        ctx.fillRect(x - cell / 2 + .3, y - cell / 2 + .3, cell - .6, cell - .6);
        if ((solid || hot) && cell >= 6) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = hot ? '#fff' : '#16171d';
          ctx.fillText(hot ? SCRAMBLE[Math.random() * SCRAMBLE.length | 0] : p.glyph, x, y + .4);
        }
      }
      ctx.globalAlpha = 1;
    };
    // Springs only run while something is moving, so an idle footer costs nothing.
    const step = now => {
      const dt = Math.min(.04, (now - last) / 1000);
      last = now;
      let moving = false;
      const radius = width < 760 ? 50 : 80;
      for (const p of cells) {
        let ax = -p.ox * 70 - p.vx * 10, ay = -p.oy * 70 - p.vy * 10;
        if (pointer.inside) {
          const dx = p.tx + p.ox - pointer.x, dy = p.ty + p.oy - pointer.y, d = Math.hypot(dx, dy);
          if (d < radius && d > .01) {
            const force = (1 - d / radius) ** 2;
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
        if (Math.abs(p.ox) + Math.abs(p.oy) + Math.abs(p.vx) + Math.abs(p.vy) > .05 || p.heat > 0) moving = true;
      }
      draw();
      if (moving || pointer.inside) frame = requestAnimationFrame(step);
      else running = false;
    };
    const wake = () => {
      if (running || reduceMotion) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(step);
    };
    const build = () => {
      const box = host.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width;
      height = box.height;
      cell = width < 760 ? 4 : 8;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      let seed = 7;
      const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      cells = rasterizeText(host, element, cell).cells.map(p => ({ ...p, glyph: RAMP[Math.max(0, RAMP.length - 1 - Math.round((1 - p.coverage) * 6) - (rand() > .6 ? 1 : 0))], ox: 0, oy: 0, vx: 0, vy: 0, heat: 0 }));
      draw();
    };
    const onMove = event => {
      const box = host.getBoundingClientRect();
      Object.assign(pointer, { x: event.clientX - box.left, y: event.clientY - box.top, inside: true });
      wake();
    };
    const onLeave = () => { pointer.inside = false; };
    const sizes = new ResizeObserver(() => { if (ready) build(); });
    const fontFamily = getComputedStyle(element).fontFamily;
    (document.fonts?.load ? document.fonts.load(`700 100px ${fontFamily}`) : Promise.resolve()).catch(() => {}).then(() => {
      if (disposed) return;
      ready = true;
      host.dataset.ascii = 'on';
      build();
      sizes.observe(host);
    });
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      sizes.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
    };
  }, []);
  return <div className="footer-wordmark" ref={hostRef} aria-hidden="true" style={{ '--fit': Math.min(1, 11 / text.length) }}>
    <p ref={textRef}><span>{text}</span></p>
    <canvas ref={canvasRef} />
  </div>;
}

function LocalTime() {
  const format = () => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const timer = setInterval(() => setTime(format()), 30000);
    return () => clearInterval(timer);
  }, []);
  return <time>{time} IST</time>;
}

export default function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-inner">
      <div className="footer-top">
        <nav className="footer-col" aria-label="Footer">
          <h2>Site</h2>
          <Link to="/projects">Projects</Link>
          <Link to="/#experience">Experience</Link>
          <a href={profile.blog}>Blog ↗</a>
          <a href={profile.resume} target="_blank" rel="noreferrer">Resume ↗</a>
        </nav>
        <div className="footer-col">
          <h2>Elsewhere</h2>
          <a href={profile.github}>GitHub ↗</a>
          <a href={profile.linkedin}>LinkedIn ↗</a>
          <a href={`mailto:${profile.email}`}>Email</a>
        </div>
        <a className="footer-up" href="#main">Back to top <span aria-hidden="true">↑</span></a>
      </div>
      <AsciiWordmark text="Farzaan Ali" />
      <div className="footer-hud">
        <span><i className="footer-dot" aria-hidden="true" />Hyderabad, IN · <LocalTime /></span>
        <span>© {new Date().getFullYear()} Mohammed Farzaan Ali</span>
      </div>
    </div>
  </footer>;
}
