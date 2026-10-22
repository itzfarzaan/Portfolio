import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../theme';
import { figureSvg } from './art.mjs';
import { mountGlove } from './live.mjs';
import { LETTERS, STAGES, SHAPES } from './model.mjs';
import './kit/iso.css';
import './glove.css';

// "See it live" on the Gesture Glove page: the glove signs words letter by letter, and each of the five
// steps lights up in turn. The SVG is built once; live.mjs moves it.
export default function GloveFigure() {
  const theme = useTheme();
  const root = useRef(null);
  const controller = useRef(null);
  const [stage, setStage] = useState('');

  // The SVG is written here rather than through React, so re-renders never replace the nodes live.mjs moves.
  useEffect(() => {
    root.current.querySelector('.gl-stage').innerHTML = figureSvg();
    controller.current = mountGlove(root.current, { onState: setStage });
    return () => controller.current?.destroy();
  }, []);

  const press = key => {
    controller.current?.press(key);
    root.current?.querySelector('.gl-stage')?.focus({ preventScroll: true });
  };

  return <figure className="iso gl" data-theme={theme} ref={root}>
    <div className="iso-plate">
      <div className="iso-plate-corners" aria-hidden="true">
        <span className="iso-plate-corner" data-corner="fig">Fig 1</span>
        <span className="iso-plate-corner" data-corner="title">Gesture glove</span>
        <span className="iso-plate-corner" data-corner="hint">Type a letter</span>
        <span className="iso-plate-corner" data-corner="readout" data-readout>ready · type a letter</span>
      </div>
      <div
        className="gl-stage"
        tabIndex={0}
        role="group"
        aria-label="Gesture glove demo. Type a letter to sign it, Space to speak the word, Backspace to delete, Escape to return to the tour."
      />
      <p className="gl-live" aria-live="polite" />
    </div>
    <figcaption className="iso-legend gl-legend">
      <ol className="gl-steps">
        {STAGES.map((step, i) => <li key={step.id} data-on={stage === step.id || undefined}>
          <span className="gl-step-n">{String(i + 1).padStart(2, '0')}</span>{step.title}
        </li>)}
      </ol>
      <div className="gl-letters" role="group" aria-label="Sign a letter">
        {LETTERS.map(letter => <button key={letter} type="button" onClick={() => press(letter)} aria-label={`Sign ${letter}`}>{letter}</button>)}
        <button type="button" className="gl-speak" onClick={() => press(' ')}>Speak</button>
      </div>
      <span className="iso-caption">
        Each flex sensor sits in a voltage divider on an Arduino analog input, and the MPU6050 adds the hand’s tilt.
        Frames go over serial at 100 Hz, a 5-sample moving average smooths them, and a k-NN vote (k = 3) picks the
        nearest trained gesture. The letters here are example ASL handshapes ({Object.keys(SHAPES).length - 1} of them), and the sensor counts are modelled.
        The real glove does all of this in under 200 ms; the figure slows it down so each step can be followed.
      </span>
    </figcaption>
  </figure>;
}
