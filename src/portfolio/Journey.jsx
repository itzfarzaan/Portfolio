import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { experience, journey } from './content';
import AsciiTitle from './AsciiTitle';

// Photos fly in from the prints that were clicked and settle into a collage; one photo fills the frame,
// two sit side by side. Escape, the close button, or the backdrop close it.
function Collage({ photos, title, from, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    if (!dialog.current.open) dialog.current.showModal();
  }, []);
  return <dialog ref={dialog} className="tj-collage" aria-label={`Photos: ${title}`} onClose={onClose} onClick={event => { if (event.target === dialog.current) onClose(); }}
    style={{ '--from-x': `${from.x}px`, '--from-y': `${from.y}px` }}>
    <div className="tj-collage-head"><span>{photos.length} {photos.length === 1 ? 'photo' : 'photos'}</span><strong>{title}</strong><button type="button" onClick={onClose} aria-label="Close photos">×</button></div>
    <div className={`tj-collage-grid count-${Math.min(photos.length, 3)}`}>
      {photos.map((photo, i) => <figure key={photo.src} style={{ '--i': i }}><img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} /></figure>)}
    </div>
  </dialog>;
}

// Group stops into eras, keeping each stop's position in the story.
const eras = journey.reduce((list, stop, index) => {
  const last = list.at(-1);
  if (last?.label === stop.era) last.stops.push({ stop, index });
  else list.push({ label: stop.era, stops: [{ stop, index }] });
  return list;
}, []);

// The line is drawn through the actual node positions: straight down within an era, and one long
// S-curve in the open space between eras when it crosses to the other side.
function tracePath(points) {
  let d = `M${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i];
    if (Math.abs(a.x - b.x) < 1) d += `L${b.x} ${b.y}`;
    else {
      const bend = (b.y - a.y) * .55;
      d += `C${a.x} ${a.y + bend} ${b.x} ${b.y - bend} ${b.x} ${b.y}`;
    }
  }
  return d;
}

// A vertical journey through the page. One line runs down the section and draws as you scroll,
// led by a glowing point; each era's year stays pinned opposite the line while you read it,
// and every stop rises in once the line reaches it. Scrolling only sets a dash offset and classes.
export default function Journey() {
  const wrap = useRef(null), base = useRef(null), fill = useRef(null), head = useRef(null);
  const [path, setPath] = useState(null);
  const [open, setOpen] = useState(null);

  // Measure node positions and trace the line through them; re-trace whenever the layout changes.
  useLayoutEffect(() => {
    const trace = () => {
      if (!wrap.current) return;
      const box = wrap.current.getBoundingClientRect();
      const at = el => {
        const r = el.getBoundingClientRect();
        return { x: Math.round(r.left + r.width / 2 - box.left), y: Math.round(r.top + r.height / 2 - box.top) };
      };
      // Each era (and the end) contributes its nodes; the line clears the era before it bends.
      const groups = [...wrap.current.querySelectorAll('.jv-era, .jv-end')].map(group => ({
        top: group.getBoundingClientRect().top - box.top, bottom: group.getBoundingClientRect().bottom - box.top,
        nodes: [...group.querySelectorAll('[data-node]')].map(at)
      }));
      if (!groups.length) return;
      const points = [{ x: groups[0].nodes[0].x, y: 0 }];
      groups.forEach((group, i) => {
        const x = group.nodes[0].x, prev = points.at(-1);
        if (i && Math.abs(prev.x - x) >= 1) {
          const gap = group.top - groups[i - 1].bottom;
          const clear = Math.min(24, gap * .1);
          points.push({ x: prev.x, y: Math.round(groups[i - 1].bottom + clear) }, { x, y: Math.round(group.top - clear) });
        }
        points.push(...group.nodes);
      });
      setPath({ d: tracePath(points), width: Math.round(box.width), height: Math.round(box.height) });
    };
    trace();
    // Anything that shifts the cards (late fonts, photos, reflow) re-traces, so the line never runs over text.
    const sizes = new ResizeObserver(trace);
    sizes.observe(wrap.current);
    wrap.current.querySelectorAll('.jv-era, .jv-card, .jv-end').forEach(el => sizes.observe(el));
    document.fonts?.ready.then(trace);
    window.addEventListener('load', trace);
    return () => {
      sizes.disconnect();
      window.removeEventListener('load', trace);
    };
  }, []);

  useLayoutEffect(() => {
    if (!path) return;
    const total = base.current.getTotalLength();
    // Sample the line once so a scroll position maps to a length with a quick search.
    const samples = [];
    for (let l = 0; l <= total; l += 6) samples.push([l, base.current.getPointAtLength(l)]);
    samples.push([total, base.current.getPointAtLength(total)]);
    const stops = [...wrap.current.querySelectorAll('.jv-stop, .jv-end')], years = [...wrap.current.querySelectorAll('.jv-era')];
    fill.current.style.strokeDasharray = `${total} ${total}`;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;

    const update = () => {
      frame = 0;
      const box = wrap.current.getBoundingClientRect();
      const y = still ? Infinity : window.innerHeight * .62 - box.top;
      let lo = 0, hi = samples.length - 1;
      if (y >= samples[hi][1].y) lo = hi;
      else if (y <= samples[0][1].y) lo = 0;
      else {
        while (hi - lo > 1) {
          const mid = (lo + hi) >> 1;
          if (samples[mid][1].y <= y) lo = mid;
          else hi = mid;
        }
      }
      const [length, point] = samples[lo];
      fill.current.style.strokeDashoffset = `${total - length}`;
      head.current.style.transform = `translate(${point.x}px, ${point.y}px)`;
      head.current.classList.toggle('is-hidden', length <= 0 || length >= total);
      stops.forEach(el => {
        const node = el.querySelector('[data-node]'), r = node.getBoundingClientRect();
        el.classList.toggle('is-on', r.top + r.height / 2 - box.top <= y + 2);
      });
      years.forEach(el => {
        const r = el.getBoundingClientRect();
        el.classList.toggle('is-on', r.top - box.top <= y && r.bottom - box.top > y);
      });
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [path]);

  const openPhotos = (stop, button) => {
    const box = button.getBoundingClientRect();
    setOpen({ stop, from: { x: box.left + box.width / 2 - window.innerWidth / 2, y: box.top + box.height / 2 - window.innerHeight / 2 } });
  };
  const current = experience.filter(item => item.current).map(item => item.company);

  return <section className="home-section jv-section" id="journey" aria-labelledby="journey-title">
    <header className="section-head">
      <AsciiTitle id="journey-title">Journey</AsciiTitle>
      <span className="section-leader" aria-hidden="true" />
      <span className="section-meta">From school to today</span>
    </header>
    <div className="jv" ref={wrap}>
      {path && <svg className="jv-line" width={path.width} height={path.height} viewBox={`0 0 ${path.width} ${path.height}`} aria-hidden="true">
        <path className="jv-line-base" d={path.d} ref={base} />
        <path className="jv-line-fill" d={path.d} ref={fill} />
      </svg>}
      <span className="jv-head is-hidden" ref={head} aria-hidden="true" />
      {eras.map((era, e) => <div key={era.label} className={`jv-era ${e % 2 ? 'is-right' : 'is-left'}`}>
        <div className="jv-year" aria-hidden="true"><span>{era.label}</span></div>
        <ol className="jv-stops">
          {era.stops.map(({ stop, index }) => <li key={stop.id} className="jv-stop">
            <span className="jv-node" data-node aria-hidden="true"><i /></span>
            <div className="jv-card">
              <span className="jv-when"><b>{String(index + 1).padStart(2, '0')}</b>{stop.when}</span>
              {stop.metric && <span className="jv-metric">{stop.metric}<small>{stop.metricLabel}</small></span>}
              <h3>{stop.title}</h3>
              <p>{stop.text}</p>
              {stop.photos?.length > 0 && <button type="button" className="jv-prints" onClick={event => openPhotos(stop, event.currentTarget)} aria-label={`Open ${stop.photos.length} photos: ${stop.title}`}>
                {stop.photos.map((photo, i) => <img key={photo.src} src={photo.src} alt="" width={photo.width} height={photo.height} loading="lazy" style={{ '--i': i }} />)}
                <span>{stop.photos.length > 1 ? `View ${stop.photos.length} photos` : 'View photo'}</span>
              </button>}
            </div>
          </li>)}
        </ol>
      </div>)}
      <div className="jv-end">
        <span className="jv-node" data-node aria-hidden="true"><i /></span>
        <a href="#experience">
          <span className="jv-end-label">Next · {String(journey.length + 1).padStart(2, '0')}</span>
          <strong>Continue the experience</strong>
          <span className="jv-end-text">Where the journey leads today: {current.join(' and ')}.</span>
          <span className="jv-end-logos" aria-hidden="true">{experience.map((item, i) => <span key={item.company} style={{ '--i': i }}>{item.logo ? <img src={item.logo} alt="" /> : item.monogram}</span>)}</span>
          <span className="jv-end-arrow" aria-hidden="true">↑</span>
        </a>
      </div>
    </div>
    {open && <Collage photos={open.stop.photos} title={open.stop.title} from={open.from} onClose={() => setOpen(null)} />}
  </section>;
}
