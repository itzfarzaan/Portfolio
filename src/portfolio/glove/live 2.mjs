// The live figure as a walkthrough: one step of the pipeline at a time, each with its own motion.
// The hand eases between handshapes, the sensors stream simulated frames at 100 Hz through a moving
// average, and the k-NN names the letter. Steps advance on their own and can be paused or stepped.
// Framework-free; the React wrapper renders the controls around it.
import * as model from './model.mjs';
import { handSvg, USB, HARNESS, UI, routeScreen } from './scene.mjs';

const pathD = points => points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('');
const lengthOf = points => points.reduce((sum, p, i) => (i ? sum + Math.hypot(p[0] - points[i - 1][0], p[1] - points[i - 1][1]) : 0), 0);

// A pose as a flat list of numbers, so one easing loop can move every joint.
const flatten = pose => [...pose.fingers.flat(), ...pose.splay, ...pose.thumb, pose.out, pose.across, pose.roll];
const unflatten = values => ({
  fingers: [0, 1, 2, 3].map(i => values.slice(i * 3, i * 3 + 3)),
  splay: values.slice(12, 16),
  thumb: values.slice(16, 18),
  out: values[18],
  across: values[19],
  roll: values[20]
});

const USB_SCREEN = routeScreen(USB);
const HARNESS_SCREEN = routeScreen(HARNESS);
export const PULSES = [
  { id: 'harness', d: pathD(HARNESS_SCREEN), length: lengthOf(HARNESS_SCREEN) },
  { id: 'usb', d: pathD(USB_SCREEN), length: lengthOf(USB_SCREEN) }
];
const index = id => model.STEPS.findIndex(step => step.id === id);

export function mountGlove(root, { onStep } = {}) {
  const $ = selector => root.querySelector(selector);
  const hand = $('[data-part="hand"]');
  const stage = $('.gl-stage');
  const bars = [...root.querySelectorAll('[data-bar]')];
  const letterText = $('[data-part="letter"]');
  const votesText = $('[data-part="votes"]');
  const knnText = $('[data-part="knn"]');
  const typedText = $('[data-part="typed"]');
  const rollLine = $('[data-part="roll"]');
  const rollText = $('[data-part="roll-text"]');
  const wave = $('[data-part="wave"]');
  const chip = $('.gl-chip .iso-solid');
  const leds = Object.fromEntries([...root.querySelectorAll('[data-led]')].map(el => [el.dataset.led, el.querySelector('.iso-solid')]));
  const grille = $('.gl-grille');
  const pulses = Object.fromEntries(PULSES.map(p => [p.id, root.querySelector(`[data-pulse="${p.id}"]`)]));
  // Reduced motion: the steps don't advance on their own, and every move jumps to its pose.
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');

  const rest = flatten(model.anglesOf(model.SHAPES.rest));
  const state = {
    values: [...rest], rates: rest.map(() => 0), target: [...rest],
    clock: 0, step: 0, stepAt: 0, playing: !still.matches, pass: 0, result: null,
    samples: [], sampleClock: 0, smoothed: model.FINGERS.map(() => model.ADC_FLAT), drawn: ''
  };
  const letter = () => model.WORD[state.pass % model.WORD.length];

  function go(step, { wrap = false } = {}) {
    const count = model.STEPS.length;
    if (wrap && step >= count) state.pass += 1;
    state.step = ((step % count) + count) % count;
    state.stepAt = state.clock;
    // Each pass starts from a relaxed hand, so the sign is seen forming; later steps hold it.
    if (state.step === 0) {
      state.values = [...rest];
      state.rates = rest.map(() => 0);
    }
    const shape = model.SHAPES[letter()];
    state.target = flatten(model.anglesOf(shape));
    state.result = state.step >= index('classify') ? model.classify(model.featuresOf(model.bendOf(model.anglesOf(shape)).map(model.adcOf), shape.roll)) : null;
    onStep?.(state.step, state.playing);
    run();
  }

  function sample(dt) {
    // Raw counts come from the pose the hand is really in, with a little sensor noise, 100 times a second.
    state.sampleClock += dt;
    const bends = model.bendOf(unflatten(state.values));
    while (state.sampleClock >= 1 / model.RATE) {
      state.sampleClock -= 1 / model.RATE;
      state.samples.push(bends.map(b => model.adcOf(b) + Math.round((Math.random() - 0.5) * 6)));
      if (state.samples.length > model.WINDOW) state.samples.shift();
    }
    if (state.samples.length) state.smoothed = model.FINGERS.map((_, i) => state.samples.reduce((sum, s) => sum + s[i], 0) / state.samples.length);
  }

  function drawScreen(id, t) {
    // The app only sees what has reached it: the meters come alive once frames arrive over serial.
    const arrived = state.step >= index('transmit');
    bars.forEach((bar, i) => {
      const level = arrived ? Math.max(0, Math.min(1, (state.smoothed[i] - model.ADC_BENT) / (model.ADC_FLAT - model.ADC_BENT))) : 0;
      const b = UI.bar(i);
      const h = (b.z1 - b.z0 - 1.6) * level;
      bar.setAttribute('y', (-(b.z0 + 0.8 + h)).toFixed(2));
      bar.setAttribute('height', h.toFixed(2));
    });
    const roll = arrived ? state.values[20] : 0;
    const g = UI.roll, a = -roll * Math.PI / 180, r = g.r - 2;
    rollLine.setAttribute('d', `M${(g.cx - r * Math.cos(a)).toFixed(2)} ${(-g.cz + r * Math.sin(a)).toFixed(2)}L${(g.cx + r * Math.cos(a)).toFixed(2)} ${(-g.cz - r * Math.sin(a)).toFixed(2)}`);
    rollText.textContent = `roll ${roll >= 0 ? '+' : ''}${roll.toFixed(0)}°`;
    letterText.textContent = state.result ? state.result.letter : '';
    votesText.textContent = state.result ? `${state.result.votes} of ${model.K} votes` : '';
    knnText.textContent = state.result ? `k-NN · ${state.result.near.join(' ')}` : 'k-NN · k = 3';
    // The text line spells the word one pass at a time; this pass's letter joins it when it is spoken.
    const done = model.WORD.slice(0, state.pass % model.WORD.length);
    typedText.textContent = done + (id === 'speak' ? letter() : '') + '▌';
    // The voice: an envelope over a few sines while speaking.
    const amp = id === 'speak' ? Math.sin(Math.min(1, t / 1.6) * Math.PI) : 0;
    const w = UI.wave, points = [];
    for (let x = w.x0; x <= w.x1; x += 1) {
      const p = (x - w.x0) / (w.x1 - w.x0);
      const y = amp * w.amp * Math.sin(p * Math.PI) * (Math.sin(x * 0.9 + state.clock * 22) * 0.6 + Math.sin(x * 0.37 - state.clock * 13) * 0.4);
      points.push(`${x.toFixed(1)} ${(-w.z + y).toFixed(2)}`);
    }
    wave.setAttribute('d', `M${points.join('L')}`);
    grille.toggleAttribute('data-on', amp > 0.05);
  }

  function setLit(id, t) {
    root.dataset.stage = id;
    chip?.toggleAttribute('data-lit', id === 'collect');
    leds.tx?.toggleAttribute('data-lit', id === 'transmit' && Math.floor(t * 10) % 2 === 0);
    leds.on?.toggleAttribute('data-lit', true);
    // Frames run along the cable again and again while its step is showing.
    const pulse = (key, active, period) => {
      const el = pulses[key];
      if (!el) return;
      const { length } = PULSES.find(p => p.id === key);
      const progress = (t % period) / period;
      el.style.opacity = active ? String(Math.sin(progress * Math.PI)) : '0';
      el.style.strokeDashoffset = String(24 - progress * (length + 24));
    };
    pulse('harness', id === 'collect', 1.1);
    pulse('usb', id === 'transmit', 0.9);
  }

  let frame = 0, last = 0, visible = false;
  function tick(now) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    const calm = still.matches;
    state.clock += dt;
    const id = model.STEPS[state.step].id;
    const t = state.clock - state.stepAt;

    // While the tilt step shows, the hand rocks gently so the MPU6050 has something to read.
    const shape = model.SHAPES[letter()];
    state.target[20] = id === 'tilt' && !calm ? shape.roll + 9 * Math.sin(t * 1.6) : shape.roll;

    // Ease every joint with a critically damped spring; the sign itself forms slowly enough to watch.
    const w = id === 'sign' ? 1 / 0.32 : 1 / 0.16;
    let moving = false;
    state.values = state.values.map((x, i) => {
      if (calm) { state.rates[i] = 0; return state.target[i]; }
      let v = state.rates[i];
      const target = state.target[i];
      for (let s = 0; s < 4; s++) {
        v += (w * w * (target - x) - 2 * w * v) * (dt / 4);
        x += v * (dt / 4);
      }
      if (Math.abs(target - x) < 1e-3 && Math.abs(v) < 1e-3) { x = target; v = 0; } else moving = true;
      state.rates[i] = v;
      return x;
    });
    sample(dt);

    const lit = ['sense', 'tilt'].includes(id) ? id : '';
    const key = state.values.map(v => v.toFixed(2)).join(',') + lit;
    if (key !== state.drawn) {
      hand.innerHTML = handSvg(unflatten(state.values), { lit });
      state.drawn = key;
    }
    setLit(id, t);
    drawScreen(id, t);

    if (state.playing && t >= model.STEP_TIME) go(state.step + 1, { wrap: true });
    const busy = moving || state.playing || ['tilt', 'collect', 'transmit', 'speak'].includes(id);
    frame = visible && busy ? requestAnimationFrame(tick) : 0;
  }
  function run() { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } }

  const observer = new IntersectionObserver(entries => {
    visible = entries[entries.length - 1].isIntersecting;
    if (visible) run();
  }, { rootMargin: '120px 0px' });
  observer.observe(stage);

  hand.innerHTML = handSvg(unflatten(state.values), {});
  go(0);

  return {
    go: step => go(step),
    next: () => go(state.step + 1, { wrap: true }),
    prev: () => go(state.step - 1),
    toggle() {
      state.playing = !state.playing;
      state.stepAt = state.clock;
      onStep?.(state.step, state.playing);
      run();
    },
    destroy() {
      cancelAnimationFrame(frame);
      observer.disconnect();
    }
  };
}
