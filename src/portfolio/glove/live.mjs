// The live figure: eases the hand between handshapes, streams simulated sensor frames at 100 Hz through a
// moving average, classifies them with the k-NN, and walks the lit accent through the five steps.
// Framework-free so the React wrapper and the standalone preview share it.
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

export function mountGlove(root, { onState } = {}) {
  const $ = selector => root.querySelector(selector);
  const hand = $('[data-part="hand"]');
  const readout = $('[data-readout]');
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
  const live = $('.gl-live');
  // Reduced motion: no tour, and every move jumps to its pose; the figure still answers input.
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');

  const rest = flatten(model.anglesOf(model.SHAPES.rest));
  const state = {
    values: [...rest], rates: rest.map(() => 0), target: [...rest],
    clock: 0, letter: null, letterAt: 0, queue: [], typed: '', result: null,
    touring: !still.matches, tourWord: 0, tourIndex: 0, idleUntil: 0, speakingWord: 0,
    samples: [], sampleClock: 0, frames: 0, smoothed: model.FINGERS.map(() => model.ADC_FLAT),
    drawn: '', stageId: ''
  };

  const sign = letter => {
    state.letter = letter;
    state.letterAt = state.clock;
    state.result = null;
    state.target = flatten(model.anglesOf(model.SHAPES[letter] || model.SHAPES.rest));
  };

  // The tour spells the words, speaks each one, then clears the line and goes on to the next.
  function tourStep() {
    const word = model.TOUR[state.tourWord % model.TOUR.length];
    if (state.tourIndex < word.length) {
      sign(word[state.tourIndex]);
      state.tourIndex += 1;
    } else {
      speakWord();
      state.tourIndex = 0;
      state.tourWord += 1;
    }
  }
  function speakWord() {
    if (!state.typed) return;
    state.letter = null;
    state.speakingWord = state.clock;
    state.target = [...rest];
  }

  const say = text => { if (readout && readout.textContent !== text) readout.textContent = text; };
  const announce = text => { if (live) live.textContent = text; };

  function sample(dt) {
    // Raw counts come from the pose the hand is really in, with a little sensor noise; 100 times a second.
    state.sampleClock += dt;
    const pose = unflatten(state.values);
    const bends = model.bendOf(pose);
    while (state.sampleClock >= 1 / model.RATE) {
      state.sampleClock -= 1 / model.RATE;
      state.frames += 1;
      state.samples.push(bends.map(b => model.adcOf(b) + Math.round((Math.random() - 0.5) * 6)));
      if (state.samples.length > model.WINDOW) state.samples.shift();
    }
    if (state.samples.length) state.smoothed = model.FINGERS.map((_, i) => state.samples.reduce((sum, s) => sum + s[i], 0) / state.samples.length);
  }

  function drawScreen(stageId, t) {
    bars.forEach((bar, i) => {
      const level = Math.max(0, Math.min(1, (state.smoothed[i] - model.ADC_BENT) / (model.ADC_FLAT - model.ADC_BENT)));
      const b = UI.bar(i);
      const full = b.z1 - b.z0 - 1.6;
      const h = full * level;
      bar.setAttribute('y', (-(b.z0 + 0.8 + h)).toFixed(2));
      bar.setAttribute('height', h.toFixed(2));
    });
    const roll = state.values[20];
    const g = UI.roll, a = -roll * Math.PI / 180, r = g.r - 2;
    rollLine.setAttribute('d', `M${(g.cx - r * Math.cos(a)).toFixed(2)} ${(-g.cz + r * Math.sin(a)).toFixed(2)}L${(g.cx + r * Math.cos(a)).toFixed(2)} ${(-g.cz - r * Math.sin(a)).toFixed(2)}`);
    rollText.textContent = `roll ${roll >= 0 ? '+' : ''}${roll.toFixed(0)}°`;
    const shown = state.result && ['classify', 'speak'].includes(stageId);
    letterText.textContent = shown ? state.result.letter : '';
    votesText.textContent = shown ? `${state.result.votes} of ${model.K} votes` : '';
    knnText.textContent = shown ? `k-NN · ${state.result.near.join(' ')}` : 'k-NN · k = 3';
    typedText.textContent = state.typed + '▌';
    // The voice: an envelope over a few sines, only while speaking.
    let amp = 0;
    if (stageId === 'speak') amp = Math.sin(Math.min(1, t) * Math.PI);
    const w = UI.wave, points = [];
    for (let x = w.x0; x <= w.x1; x += 1) {
      const p = (x - w.x0) / (w.x1 - w.x0);
      const y = amp * w.amp * Math.sin(p * Math.PI) * (Math.sin(x * 0.9 + state.clock * 22) * 0.6 + Math.sin(x * 0.37 - state.clock * 13) * 0.4);
      points.push(`${x.toFixed(1)} ${(-w.z + y).toFixed(2)}`);
    }
    wave.setAttribute('d', `M${points.join('L')}`);
    grille.toggleAttribute('data-on', amp > 0.05);
  }

  function setLit(stageId, t) {
    root.dataset.stage = stageId;
    chip?.toggleAttribute('data-lit', stageId === 'collect');
    const blink = stageId === 'transmit' && Math.floor(t * 12) % 2 === 0;
    leds.tx?.toggleAttribute('data-lit', blink);
    leds.rx?.toggleAttribute('data-lit', stageId === 'collect' && Math.floor(t * 9) % 2 === 0);
    leds.on?.toggleAttribute('data-lit', true);
    const run = (id, active, progress) => {
      const el = pulses[id];
      if (!el) return;
      const { length } = PULSES.find(p => p.id === id);
      el.style.opacity = active ? String(Math.sin(Math.min(1, progress) * Math.PI)) : '0';
      el.style.strokeDashoffset = String(24 - Math.min(1, progress) * (length + 24));
    };
    const collect = model.STAGES[1], transmit = model.STAGES[2];
    run('harness', stageId === 'collect', (t) / collect.hold);
    run('usb', stageId === 'transmit', (t) / transmit.hold);
  }

  function readoutOf(stageId) {
    const counts = state.smoothed.map(Math.round).join(' ');
    if (state.speakingWord && !state.letter) return `05 speak · “${state.typed.toLowerCase()}”`;
    if (!state.letter) return 'ready · type a letter';
    if (!model.SHAPES[state.letter]) return `no trained gesture for “${state.letter}”`;
    switch (stageId) {
      case 'sense': return `01 sense · flex ${counts}`;
      case 'collect': return `02 collect · ${model.RATE} Hz · ${model.WINDOW}-sample average`;
      case 'transmit': return `03 transmit · frame ${state.frames.toLocaleString('en-US')} over serial`;
      case 'classify': return `04 classify · k-NN → ${state.result?.letter} · ${state.result?.votes} of ${model.K}`;
      default: return `05 speak · “${state.typed}”`;
    }
  }

  let frame = 0, last = 0, visible = false;
  function tick(now) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    const calm = still.matches;
    state.clock += dt;

    // Ease every joint with a critically damped spring.
    const w = 1 / 0.16;
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

    let stageId = 'idle', t = 0;
    if (state.letter && model.SHAPES[state.letter]) {
      const age = state.clock - state.letterAt;
      const current = model.stageAt(age);
      stageId = current.id;
      t = age - current.at;
      if (stageId === 'classify' && !state.result) state.result = model.classify(model.featuresOf(state.smoothed, state.values[20]));
      if (stageId === 'speak' && state.result && !state.result.typed) {
        state.result.typed = true;
        state.typed = (state.typed + state.result.letter).slice(-14);
        announce(`Recognised ${state.result.letter}`);
      }
      if (age >= model.LETTER_TIME) {
        state.letter = null;
        if (state.queue.length) sign(state.queue.shift());
        else if (state.touring) tourStep();
      }
    } else if (state.speakingWord) {
      const age = state.clock - state.speakingWord;
      stageId = 'speak';
      t = age / 1.2;
      if (age > 1.2 && age < 1.25) announce(`Spoke “${state.typed.toLowerCase()}”`);
      if (age >= 2.2) {
        state.speakingWord = 0;
        if (state.touring) { state.typed = ''; tourStep(); }
      }
    } else if (state.letter) {
      if (state.clock - state.letterAt > 1.6) state.letter = null;
    } else if (state.queue.length) sign(state.queue.shift());
    else if (state.touring && state.clock > 1.2) tourStep();
    if (!state.touring && state.idleUntil && state.clock > state.idleUntil && !state.letter && !state.speakingWord && !state.queue.length) {
      state.touring = !still.matches;
      state.typed = '';
      state.tourIndex = 0;
    }

    const lit = stageId === 'sense' ? 'sense' : '';
    const key = state.values.map(v => v.toFixed(2)).join(',') + lit;
    if (key !== state.drawn) {
      hand.innerHTML = handSvg(unflatten(state.values), { lit });
      state.drawn = key;
    }
    setLit(stageId, t);
    drawScreen(stageId, t);
    say(readoutOf(stageId));
    if (stageId !== state.stageId) { state.stageId = stageId; onState?.(stageId); }

    const busy = moving || state.touring || state.letter || state.speakingWord || state.queue.length || state.idleUntil > state.clock;
    frame = visible && busy ? requestAnimationFrame(tick) : 0;
  }
  const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };

  const observer = new IntersectionObserver(entries => {
    visible = entries[entries.length - 1].isIntersecting;
    if (visible) run();
  }, { rootMargin: '120px 0px' });
  observer.observe(stage);

  // Input: a letter signs it, Space speaks the word, Backspace deletes, Escape hands back to the tour.
  function takeOver() {
    if (state.touring) {
      state.touring = false;
      state.queue = [];
      state.typed = '';
      state.letter = null;
      state.speakingWord = 0;
    }
    state.idleUntil = state.clock + 12;
  }
  function press(key) {
    if (key === 'Escape') { state.idleUntil = state.clock; run(); return; }
    takeOver();
    if (key === ' ' || key === 'Enter') speakWord();
    else if (key === 'Backspace') state.typed = state.typed.slice(0, -1);
    else if (/^[a-z]$/i.test(key)) {
      const letter = key.toUpperCase();
      if (state.letter || state.speakingWord) state.queue.push(letter);
      else sign(letter);
    }
    run();
  }
  const onKey = event => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (/^[a-z]$/i.test(event.key) || [' ', 'Enter', 'Backspace', 'Escape'].includes(event.key)) {
      event.preventDefault();
      press(event.key);
    }
  };
  stage.addEventListener('keydown', onKey);
  hand.innerHTML = handSvg(unflatten(state.values), {});
  run();

  return {
    press,
    destroy() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      stage.removeEventListener('keydown', onKey);
    }
  };
}
