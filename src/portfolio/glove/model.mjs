// The Gesture Glove as numbers. Pure: no DOM. The figure's motion, readout and screen all read from here.
//
// Sensors: five flex sensors (thumb to pinky) and an MPU6050 on the back of the hand, read 100 times a second.
// Each flex sensor sits in a voltage divider on an Arduino analog input. A typical 2.2" flex sensor is about
// 25 kΩ flat and rises with bend; the divider value below is a common choice, so the counts are a model,
// not a log from the real glove.

export const FINGERS = ['thumb', 'index', 'middle', 'ring', 'pinky'];
export const SHORT = ['T', 'I', 'M', 'R', 'P'];
export const RATE = 100;            // Hz, sensor sampling
export const WINDOW = 5;            // moving-average window, in samples
export const K = 3;                 // neighbours the k-NN vote uses

const R_FLAT = 25;                  // kΩ, flex sensor lying flat
const R_PER_DEG = 0.42;             // kΩ per degree of bend along the strip
const R_FIXED = 47;                 // kΩ, the divider's fixed resistor

// Joint limits in degrees: [MCP, PIP, DIP] for fingers, [MCP, IP] for the thumb.
export const FINGER_MAX = [85, 100, 70];
export const THUMB_MAX = [55, 75];

// Handshapes. f: [mcp, pip, dip] per finger (0 straight, 1 fully bent), splay in degrees,
// thumb: flex [mcp, ip], out (abduction, 0..1), across (opposition over the palm, 0..1), roll in degrees.
const curl = [1, 1, 0.8], flat = [0, 0, 0];
export const SHAPES = {
  rest: { f: [[0.12, 0.16, 0.1], [0.14, 0.18, 0.12], [0.16, 0.2, 0.12], [0.18, 0.22, 0.14]], splay: [-3, -1, 1, 4], thumb: { flex: [0.1, 0.1], out: 0.45, across: 0.1 }, roll: 0 },
  A: { f: [curl, curl, curl, curl], splay: [0, 0, 0, 0], thumb: { flex: [0.05, 0.05], out: 0.05, across: 0 }, roll: 2 },
  B: { f: [flat, flat, flat, flat], splay: [0, 0, 0, 0], thumb: { flex: [0.7, 0.6], out: 0, across: 1 }, roll: 0 },
  C: { f: [[0.35, 0.45, 0.35], [0.35, 0.45, 0.35], [0.35, 0.45, 0.35], [0.35, 0.45, 0.35]], splay: [0, 0, 0, 0], thumb: { flex: [0.3, 0.3], out: 0.6, across: 0.2 }, roll: -6 },
  D: { f: [flat, [0.6, 0.8, 0.6], [0.6, 0.8, 0.6], [0.6, 0.8, 0.6]], splay: [0, 0, 0, 0], thumb: { flex: [0.5, 0.6], out: 0.2, across: 0.7 }, roll: 0 },
  E: { f: [[0.25, 1, 1], [0.25, 1, 1], [0.25, 1, 1], [0.25, 1, 1]], splay: [0, 0, 0, 0], thumb: { flex: [0.8, 0.8], out: 0, across: 1 }, roll: 0 },
  I: { f: [curl, curl, curl, flat], splay: [0, 0, 0, 6], thumb: { flex: [0.6, 0.6], out: 0, across: 0.8 }, roll: 0 },
  L: { f: [flat, curl, curl, curl], splay: [0, 0, 0, 0], thumb: { flex: [0, 0], out: 1, across: 0 }, roll: 0 },
  O: { f: [[0.5, 0.6, 0.5], [0.5, 0.6, 0.5], [0.5, 0.6, 0.5], [0.5, 0.6, 0.5]], splay: [0, 0, 0, 0], thumb: { flex: [0.5, 0.5], out: 0.4, across: 0.6 }, roll: -4 },
  S: { f: [curl, curl, curl, curl], splay: [0, 0, 0, 0], thumb: { flex: [0.6, 0.5], out: 0, across: 1 }, roll: 0 },
  V: { f: [flat, flat, curl, curl], splay: [-9, 9, 0, 0], thumb: { flex: [0.7, 0.6], out: 0, across: 0.9 }, roll: 0 },
  W: { f: [flat, flat, flat, curl], splay: [-10, 0, 10, 0], thumb: { flex: [0.7, 0.6], out: 0, across: 0.9 }, roll: 0 },
  Y: { f: [curl, curl, curl, flat], splay: [0, 0, 0, 12], thumb: { flex: [0, 0], out: 1, across: 0 }, roll: 4 }
};
export const LETTERS = Object.keys(SHAPES).filter(name => name !== 'rest');

// Joint angles in degrees for a shape: { fingers: [[mcp, pip, dip] x4], splay: [x4], thumb: [mcp, ip], out, across, roll }.
export function anglesOf(shape) {
  return {
    fingers: shape.f.map(joints => joints.map((value, j) => value * FINGER_MAX[j])),
    splay: [...shape.splay],
    thumb: shape.thumb.flex.map((value, j) => value * THUMB_MAX[j]),
    out: shape.thumb.out,
    across: shape.thumb.across,
    roll: shape.roll
  };
}

// The bend a strip sees is the sum of the joint angles under it.
export const bendOf = pose => [pose.thumb[0] + pose.thumb[1] + pose.across * 25, ...pose.fingers.map(([a, b, c]) => a + b + c)];

// Flex sensor in a divider into a 10-bit ADC.
export function adcOf(degrees) {
  const r = R_FLAT + R_PER_DEG * Math.max(0, degrees);
  return Math.round(1023 * R_FIXED / (R_FIXED + r));
}
export const ADC_FLAT = adcOf(0);
export const ADC_BENT = adcOf(260);

// Feature vector: five bends scaled 0..1 from the counts, plus roll from the MPU6050 scaled by 45°.
export const featuresOf = (counts, roll) => [...counts.map(count => (ADC_FLAT - count) / (ADC_FLAT - ADC_BENT)), roll / 45];

// Training set: each letter is stored as a few samples around its shape, the way a gesture is recorded
// several times. Samples are deterministic so the build and the page agree.
function jitter(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s / 2147483647) * 2 - 1;
  };
}
export const TRAINING = LETTERS.flatMap((letter, index) => {
  const pose = anglesOf(SHAPES[letter]);
  const rand = jitter(index * 97 + 13);
  return [0, 1, 2].map(() => ({
    letter,
    x: featuresOf(bendOf(pose).map(degrees => adcOf(degrees + rand() * 8)), pose.roll + rand() * 3)
  }));
});

// k-NN: the K nearest samples vote; returns the winner, its votes and the nearest distance.
export function classify(x) {
  const ranked = TRAINING.map(sample => ({ letter: sample.letter, d: Math.hypot(...sample.x.map((value, i) => value - x[i])) })).sort((a, b) => a.d - b.d);
  const near = ranked.slice(0, K);
  const tally = {};
  near.forEach(({ letter }) => { tally[letter] = (tally[letter] || 0) + 1; });
  const [letter, votes] = Object.entries(tally).sort((a, b) => b[1] - a[1] || near.findIndex(n => n.letter === a[0]) - near.findIndex(n => n.letter === b[0]))[0];
  return { letter, votes, d: near[0].d, near: near.map(n => n.letter) };
}

// The walkthrough: one step of the glove's pipeline at a time. `lit` names the part that carries the accent.
// The real glove runs the whole path in under 200 ms; the figure holds each step so it can be read.
export const STEPS = [
  { id: 'sign', icon: 'hand', label: 'Sign', title: 'Make the sign', lit: '', text: 'The wearer forms a letter. The glove reads the hand itself, so nothing has to face a camera.' },
  { id: 'sense', icon: 'flex', label: 'Bend', title: 'Each finger bends a flex sensor', lit: 'sense', text: 'A strip on every finger gains resistance as it bends. In a voltage divider that becomes a voltage the Arduino can read.' },
  { id: 'tilt', icon: 'tilt', label: 'Tilt', title: 'The MPU6050 reads the hand’s angle', lit: 'tilt', text: 'On the back of the hand, the 6-axis accelerometer and gyroscope report how the hand is tilted, over I2C.' },
  { id: 'collect', icon: 'chip', label: 'Collect', title: 'The Arduino samples 100 times a second', lit: 'collect', text: 'The Uno reads the five analog inputs and the MPU6050 together and packs them into one frame.' },
  { id: 'transmit', icon: 'cable', label: 'Send', title: 'Frames stream over serial', lit: 'transmit', text: 'Each frame travels down the USB cable to the Python backend, which reads it with PySerial.' },
  { id: 'classify', icon: 'knn', label: 'Match', title: 'Smooth, then find the nearest gesture', lit: 'classify', text: 'A moving average removes sensor noise. The bend angles and orientation are then matched against the 20 trained gestures with k-NN.' },
  { id: 'speak', icon: 'speak', label: 'Speak', title: 'Show it and say it', lit: 'speak', text: 'The recognised gesture appears as text and pyttsx3 speaks it aloud, under 200\u00a0ms after the hand moved.' }
];
export const STEP_TIME = 4.8;

// The letters the walkthrough signs, one per pass, building a word on the screen.
export const WORD = 'LOVE';
