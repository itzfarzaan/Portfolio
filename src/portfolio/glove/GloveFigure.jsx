import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../theme';
import { figureSvg } from './art.mjs';
import { mountGlove } from './live.mjs';
import { STEPS } from './model.mjs';
import './kit/iso.css';
import './glove.css';

// One line icon per step, drawn on a 24 px grid.
const ICONS = {
  hand: <path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11m0-6.5a1.5 1.5 0 0 1 3 0V11m0-5a1.5 1.5 0 0 1 3 0v7.5a6 6 0 0 1-6 6h-.6a5 5 0 0 1-3.9-1.9L4 14.6a1.5 1.5 0 0 1 2.3-1.9L8 14.5" />,
  flex: <><path d="M5 19c3-1 5-4 6-8s3-6.5 8-6.5" /><path d="M6.6 16.2l1.6 1.2M8.6 13.4l1.7.9M10.1 10.2l1.8.6M12 7.4l1.6 1M14.7 5.4l.9 1.6" /></>,
  tilt: <><rect x="6" y="9" width="12" height="7" rx="1.5" transform="rotate(-14 12 12.5)" /><path d="M4 7.5a9 9 0 0 1 5-3.6M20 16.5a9 9 0 0 1-5 3.6" /></>,
  chip: <><rect x="7" y="7" width="10" height="10" rx="1.5" /><path d="M10 4v3M14 4v3M10 17v3M14 17v3M4 10h3M4 14h3M17 10h3M17 14h3" /></>,
  cable: <><path d="M4 16h4c3 0 3-8 6-8h2" /><rect x="16" y="5.5" width="4" height="5" rx="1" /><circle cx="4" cy="16" r="1.2" /></>,
  knn: <><circle cx="12" cy="12" r="2" /><circle cx="6" cy="7" r="1.3" /><circle cx="18" cy="8" r="1.3" /><circle cx="16" cy="18" r="1.3" /><path d="M7 8l3.5 2.8M16.9 8.8l-3.3 2.2M15.3 16.9l-2.2-3.1" /></>,
  speak: <><path d="M5 10v4h3l4 3.5v-11L8 10z" /><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /></>
};
const Icon = ({ name }) => <svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[name]}</svg>;
const Chevron = ({ back }) => <svg viewBox="0 0 24 24" aria-hidden="true"><path d={back ? 'M14.5 6l-6 6 6 6' : 'M9.5 6l6 6-6 6'} /></svg>;

// "See it live" on the Gesture Glove page: the glove's pipeline, one step at a time. The SVG is built
// once and moved by live.mjs; this component renders the step text and the controls around it.
export default function GloveFigure() {
  const theme = useTheme();
  const root = useRef(null);
  const controller = useRef(null);
  const [{ step, playing }, setView] = useState({ step: 0, playing: true });

  // The SVG is written here rather than through React, so re-renders never replace the nodes live.mjs moves.
  useEffect(() => {
    root.current.querySelector('.gl-stage').innerHTML = figureSvg();
    controller.current = mountGlove(root.current, { onStep: (index, play) => setView({ step: index, playing: play }) });
    return () => controller.current?.destroy();
  }, []);

  const current = STEPS[step];
  const number = n => String(n).padStart(2, '0');
  return <figure className="iso gl" data-theme={theme} ref={root}>
    <div className="iso-plate">
      <div className="iso-plate-corners" aria-hidden="true">
        <span className="iso-plate-corner" data-corner="fig">Fig 1</span>
        <span className="iso-plate-corner" data-corner="title">Sign to speech, Gesture Glove</span>
      </div>
      <div className="gl-stage" />

      <div className="gl-step">
        <button type="button" className="gl-arrow" onClick={() => controller.current?.prev()} aria-label="Previous step"><Chevron back /></button>
        <div className="gl-step-text" aria-live="polite">
          <h3><span className="gl-count"><b>{number(step + 1)}</b> / {number(STEPS.length)}</span>{current.title}</h3>
          <p>{current.text}</p>
        </div>
        <button type="button" className="gl-arrow is-dark" onClick={() => controller.current?.next()} aria-label="Next step"><Chevron /></button>
      </div>

      <ol className="gl-track">
        {STEPS.map((item, i) => <li key={item.id} data-state={i === step ? 'on' : i < step ? 'done' : undefined}>
          <button type="button" onClick={() => controller.current?.go(i)} aria-label={`Step ${i + 1}: ${item.title}`} aria-current={i === step ? 'step' : undefined}>
            <span className="gl-dot"><Icon name={item.icon} /></span>
            <span className="gl-label">{item.label}</span>
          </button>
        </li>)}
      </ol>

      <button type="button" className="gl-play" onClick={() => controller.current?.toggle()}>
        {playing
          ? <><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6v12M15 6v12" /></svg>Pause</>
          : <><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10-6.5z" /></svg>Play</>}
      </button>
    </div>
  </figure>;
}
