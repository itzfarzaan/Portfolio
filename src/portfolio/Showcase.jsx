import { useRef } from 'react';
import EmbeddingField from './EmbeddingField';
import MobileHero from './MobileHero';
import { useIsPhone } from './usePhone';
import { useTheme } from './theme';
import { profile } from './content';
export function Spark({
  className = ''
}) {
  return <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d="M50 0 58 31 85 15 69 42 100 50 69 58 85 85 58 69 50 100 42 69 15 85 31 58 0 50 31 42 15 15 42 31Z" fill="currentColor" /></svg>;
}
function DesktopHero() {
  const hud = useRef(null);
  const card = useRef(null);
  const name = useRef(null);
  // The top-result card tilts toward a mouse pointer; touch and reduced-motion users get a still card.
  const tilt = event => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = event.currentTarget.getBoundingClientRect(), x = (event.clientX - box.left) / box.width, y = (event.clientY - box.top) / box.height;
    card.current.style.transform = `rotateY(${(x - .5) * 14}deg) rotateX(${(.5 - y) * 10}deg) translateZ(10px)`;
    card.current.style.setProperty('--gx', `${x * 100}%`);
    card.current.style.setProperty('--gy', `${y * 100}%`);
  };
  const untilt = () => { card.current.style.transform = ''; };
  return <section className="embed-hero" aria-labelledby="intro-title">
    <EmbeddingField hudRef={hud} cardRef={card} nameRef={name} />
    <div className="embed-hero-inner">
      <div className="embed-hud" ref={hud} aria-hidden="true">
        <span><i className="hud-dot" />Retrieval · live<b className="hud-sep">/</b>2,048 vectors · cosine</span>
        <span>Top-k <b data-stat="k">07</b> Nearest <b data-stat="cluster">retrieval.rag</b> Yaw <b data-stat="yaw">000°</b> Query <b data-stat="latency">0.0 ms</b></span>
      </div>
      <div className="embed-hero-grid">
        <div className="embed-hero-copy">
          <p className="embed-eyebrow">AI & Software Engineer</p>
          <h1 id="intro-title" ref={name}><span>Farzaan</span> <span>Ali</span></h1>
          <p className="embed-tagline">I build software that <em>understands.</em></p>
          <p className="embed-bio">Artificial Intelligence Engineer at <strong>Linkiat</strong>, leading software projects at <strong>Creative Analytica</strong>. I build software where people and AI work together, automating the busywork so people can focus on what matters.</p>
          <div className="embed-actions">
            <a className="embed-primary" href={profile.resume} download><span aria-hidden="true">↓</span> Download resume</a>
            <a className="embed-chip" href={profile.linkedin}>LinkedIn <span aria-hidden="true">↗</span></a>
            <a className="embed-chip" href={profile.github}>GitHub <span aria-hidden="true">↗</span></a>
            <a className="embed-chip" href={`mailto:${profile.email}`}>Email</a>
          </div>
        </div>
        <div className="rank-stack" onPointerMove={tilt} onPointerLeave={untilt}>
          <div className="rank-card rank-ghost rank-ghost-3" aria-hidden="true"><span>#03 · <b>retrieval.rag</b></span><span>cos 0.861</span></div>
          <div className="rank-card rank-ghost rank-ghost-2" aria-hidden="true"><span>#02 · <b>voice.agents</b></span><span>cos 0.874</span></div>
          <figure className="rank-card rank-main" ref={card}>
            <img src="/media/farzaan-portrait-casual.webp" alt="Mohammed Farzaan Ali" width="1200" height="1363" fetchPriority="high" />
            <span className="rank-label" aria-hidden="true">#01 · Top result</span>
            <span className="rank-score" aria-hidden="true">0.991</span>
            <figcaption className="rank-info"><strong>farzaan.ali</strong></figcaption>
            <span className="rank-glare" aria-hidden="true" />
          </figure>
        </div>
      </div>
    </div>
  </section>;
}
// Phones get their own self-running hero; tablets and desktops keep the interactive one.
// Both heroes draw with canvas colours read at mount, so they remount when the theme changes.
export function Hero() {
  const theme = useTheme();
  return useIsPhone() ? <MobileHero key={theme} /> : <DesktopHero key={theme} />;
}
