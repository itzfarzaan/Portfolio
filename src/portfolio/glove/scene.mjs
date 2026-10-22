// Geometry for "See it live": a sensor glove on a bench stand, wired to an Arduino Uno, which streams
// over USB to a laptop running the Python app. Static parts are built once; the hand is rebuilt per frame
// from its joint angles. World units are about 1 mm, x and y on the bench, z up.
import * as k from './kit/iso-kit.mjs';
import * as G from './kit/lathe.mjs';
import { tubePieces, tubeSvg } from './kit/tube.mjs';
import { SHORT } from './model.mjs';

export const WIDTH = 610;
export const HEIGHT = 470;

const PLATE = { x: -200, y: -84, w: 456, d: 196, r: 10 };
const PLATE_H = 10;
const FOOT_H = 5;

// Glove stand: a round base, a post, and a forearm form the glove's cuff is pulled over.
const STAND = { x: -128, y: -6 };
const FOREARM = { x: STAND.x - 27, y: STAND.y - 15, w: 54, d: 30, r: 13 };
const FOREARM_Z = [48, 104];
export const PIVOT = [STAND.x, STAND.y, 112];
// The hand is turned 13° about the vertical so its back is seen at an angle: the fingers then curl in a
// plane that faces the camera instead of folding straight away from it.
const YAW = 13 * Math.PI / 180;
const YAW_X = [Math.cos(YAW), Math.sin(YAW), 0];
const YAW_Y = [-Math.sin(YAW), Math.cos(YAW), 0];
const yawRing = (u0, v0, u1, v1, r, steps = 8) => k.roundedPlan({ x: u0, y: v0, w: u1 - u0, d: v1 - v0, r }, steps).map(([u, v]) => [STAND.x + YAW_X[0] * u + YAW_Y[0] * v, STAND.y + YAW_X[1] * u + YAW_Y[1] * v]);

// Hand, in its own frame: u across the palm (+u is the thumb side), v out of the back, s toward the fingers.
const PALM = { u: 36, v: 12, s0: 8, s1: 86 };
const FINGER = [
  { u: -25.5, r: 7.2, len: [26, 17, 15] },   // index ... pinky are listed from the index side
  { u: -8.5, r: 7.6, len: [29, 19, 16] },
  { u: 8.5, r: 7.3, len: [27, 18, 15] },
  { u: 25, r: 6.5, len: [21, 14, 13] }
];
// The glove is a left glove seen from the back, so the thumb is on screen right (+x) and the index
// finger is on the far side of the palm from it.
FINGER.forEach(finger => { finger.u = -finger.u; });
const THUMB = { r: 8, len: [17, 22, 18], root: [PALM.u - 1, -1, 24] };

const BOARD = { u0: -24, u1: 22, s0: 24, s1: 72, v: PALM.v, t: 1.6 };
const MPU = { u0: -12, u1: 10, s0: 40, s1: 60, t: 1.2 };
const PIN_U = [18, 10, 2, -6, -14];   // header pins: thumb, index, middle, ring, pinky

// Arduino Uno, flat on the bench. Its USB jack faces the laptop (+x).
const UNO = { x: -56, y: 20, w: 69, d: 54, r: 2.5 };
const UNO_Z = 5;
const UNO_TOP = UNO_Z + 1.6;

// Laptop at the back right, lid open at 90°.
const LAP = { x: 78, y: -66, w: 172, d: 118, r: 6 };
const LAP_H = 8;
const LID = { x: LAP.x, y: LAP.y, w: LAP.w, d: 5, r: 2 };
const LID_TOP = 124;
export const SCREEN = { x0: LAP.x + 11, x1: LAP.x + LAP.w - 11, z0: LAP_H + 14, z1: LID_TOP - 8 };
const SCREEN_Y = LAP.y + LID.d;

export const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [STAND.x, STAND.y, 272], [STAND.x + 70, STAND.y, 220], ...k.boxCorners(LID, 0, LID_TOP)],
  WIDTH, HEIGHT, { pad: 14, azimuth: 58 }
);
export const V = G.viewOf(P);
const at = point => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const depth = point => G.dot3(point, V);
const byDepth = points => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const planeOf = y => k.sideMatrix([0, y], 0, P, 'left');
const flatRect = (x0, z0, x1, z1, r, steps = 6) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);
const rounded = (u0, v0, u1, v1, r, steps = 4) => k.roundedPlan({ x: u0, y: v0, w: u1 - u0, d: v1 - v0, r }, steps);
const tubes = (points, r, options = {}, style = {}) => tubePieces(points, r, P, { maxLength: 16, ...options }).map(piece => ({ key: depth(piece.mid) + (style.bias || 0), svg: tubeSvg(piece, { tone: style.tone || 'hi' }) }));

// ---------- the bench ----------
function bench() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 24))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: 'lo' }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: 'mid' }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: 'mid', inner: L(k.sideSeam(PLATE, -PLATE_H / 2, P, 8), { tone: 'faint' }) }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: 'lo' }));
  const screws = k.corners(PLATE, 11);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(''), { tone: 'lo' }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // Ruler strip along the front edge, and the label plate.
  const strip = { x: PLATE.x + 60, y: PLATE.y + PLATE.d - 16, w: 150, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: 'lo', crease: 'none' }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 5, 5, strip.y + 0.6, 0.6, [2.2, 4], P);
  out.push(L(ticks.minor, { tone: 'lo' }) + L(ticks.major, { tone: 'mid' }));
  const label = { x: PLATE.x + 222, y: PLATE.y + PLATE.d - 20, w: 46, d: 11, r: 1.2 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 3), { tone: 'lo', crease: 'none' }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.4), 0.8, P, 3), { tone: 'faint' }));
  out.push(L([30, 22, 26].map((w, i) => k.lineOnTop([label.x + 4, label.y + 3 + i * 2.6], [label.x + 4 + w, label.y + 3 + i * 2.6], 0.8, P)).join(''), { tone: 'lo', free: true }));
  out.push(D([at([label.x + label.w - 3.5, label.y + 3, 0.8]), at([label.x + label.w - 3.5, label.y + label.d - 3, 0.8])], { size: 0.45 }));
  return out.join('');
}

// ---------- the stand and the forearm form ----------
function standBase() {
  const { x, y } = STAND;
  const out = [`<path class="iso-halo" d="${k.haloOf({ x: x - 34, y: y - 34, w: 68, d: 68, r: 34 }, 0, 6, P)}"/>`];
  out.push(S(k.cylinder(x, y, 34, 0, 3, P, 72, 0.8), { tone: 'lo' }));
  out.push(S(k.cylinder(x, y, 30, 3, 4, P, 72, 0.6), { tone: 'mid', inner: L(k.sideArc(x, y, 30, 5, P, 48), { tone: 'faint' }) }));
  const ticks = k.radialTicks(x, y, 28.5, 48, 6, 7, [1.2, 2.4], P);
  out.push(L(ticks.minor, { tone: 'lo' }) + L(ticks.major, { tone: 'mid' }));
  out.push(L(k.ring(x, y, 24, 7, P, 64), { tone: 'faint' }));
  const bolts = [0, 1, 2, 3].map(i => [x + 19 * Math.cos(i * Math.PI / 2 + 0.4), y + 19 * Math.sin(i * Math.PI / 2 + 0.4)]);
  out.push(L(bolts.map(([bx, by]) => k.ring(bx, by, 1.8, 7, P, 14)).join(''), { tone: 'lo' }));
  out.push(D(bolts.map(([bx, by]) => at([bx, by, 7])), { size: 0.45 }));
  out.push(S(k.cylinder(x, y, 10, 7, 5, P, 40, 0.5), { tone: 'mid' }));
  out.push(L(k.knurl(x, y, 10, 7.6, 11.4, 40, P), { tone: 'lo' }));
  out.push(S(k.cylinder(x, y, 5.2, 12, 22, P, 32), { tone: 'mid', crease: 'none', inner: L([24].map(z => k.sideArc(x, y, 5.2, z, P, 16)).join(''), { tone: 'faint' }) }));
  // Clamp collar with a thumb screw, holding the forearm form at its height.
  out.push(S(k.cylinder(x, y, 8, 34, 10, P, 36, 0.5), { tone: 'mid', inner: L(k.sideArc(x, y, 8, 39, P, 24), { tone: 'faint' }) }));
  out.push(S(k.slabOf({ x: x + 7, y: y - 2, w: 4, d: 4, r: 1 }, 37.5, 3, P, 3), { tone: 'mid' }));
  out.push(S(k.cylinder(x + 13.5, y, 3, 36, 7, P, 20), { tone: 'mid' }));
  out.push(L(k.knurl(x + 13.5, y, 3, 36.5, 42.5, 16, P, 0.3), { tone: 'lo' }));
  out.push(S(k.cylinder(x, y, 6, 44, FOREARM_Z[0] - 44, P, 32), { tone: 'mid' }));
  return out.join('');
}

function forearm() {
  const [z0, z1] = FOREARM_Z;
  const cuffAt = z1 - 26;
  const out = [];
  const form = yawRing(-27, -15, 27, 15, 13);
  out.push(S(k.extrude(form, z0, cuffAt - z0, P, { bevel: 0.6 }), { tone: 'mid', inner: L(k.ringSeam(form, z0 + 9, P), { tone: 'faint' }) }));
  // The glove's ribbed cuff over the top of the form.
  const cuff = yawRing(-28.2, -16.2, 28.2, 16.2, 14);
  out.push(S(k.extrude(cuff, cuffAt, z1 - cuffAt, P, { bevel: 0.8 }), { tone: 'hi', crease: 'lo', inner: L([4, 8, 12, 16, 20].map(h => k.ringSeam(cuff, cuffAt + h, P)).join(''), { tone: 'faint' }) }));
  return out.join('');
}

// ---------- the hand ----------
// Frame for a tilt (roll about the y axis, degrees). Positive roll tips the fingers toward -x.
export function handFrame(roll) {
  const a = roll * Math.PI / 180;
  const [X0, Y0, Z0] = [YAW_X, YAW_Y, [0, 0, 1]];
  const X = G.add3(G.mul3(X0, Math.cos(a)), G.mul3(Z0, Math.sin(a)));
  const Y = Y0;
  const Z = G.add3(G.mul3(X0, -Math.sin(a)), G.mul3(Z0, Math.cos(a)));
  const dir = ([u, v, s]) => G.add3(G.add3(G.mul3(X, u), G.mul3(Y, v)), G.mul3(Z, s));
  const local = point => G.add3(PIVOT, dir(point));
  return { X, Y, Z, local, dir };
}

const deg = Math.PI / 180;
const unit = G.unit3;

// The bent centreline of one finger in hand coordinates: knuckle, PIP, DIP, tip.
function fingerPoints(finger, joints, splay) {
  const base = [finger.u, 0, PALM.s1];
  const sp = -splay * deg;
  let angle = 0;
  const points = [base];
  let p = base;
  finger.len.forEach((length, j) => {
    angle += joints[j] * deg;
    const d = [Math.sin(sp) * Math.cos(angle), -Math.sin(angle), Math.cos(sp) * Math.cos(angle)];
    p = G.add3(p, G.mul3(d, length - (j === 2 ? finger.r * 0.6 : 0)));
    points.push(p);
  });
  return points;
}

export function thumbPoints(pose) {
  const outAngle = (18 + 46 * pose.out) * deg;
  const open = unit([Math.sin(outAngle), 0.05, Math.cos(outAngle)]);
  // Folded across the palm: the metacarpal comes forward of the palm, the rest lies along its front.
  const folded = [unit([-0.2, -0.8, 0.55]), unit([-0.85, -0.35, 0.35]), unit([-1, 0, 0.05])];
  const blend = (a, b, t) => unit(G.lerp3(a, b, t));
  const toward = unit([-0.6, -0.8, 0]);
  const curl = (d, angle) => {
    const axis = G.cross3(d, toward);
    const size = G.len3(axis);
    if (size < 1e-3) return d;
    const n = G.mul3(axis, 1 / size);
    const c = Math.cos(angle), s = Math.sin(angle);
    return unit(G.add3(G.add3(G.mul3(d, c), G.mul3(G.cross3(n, d), s)), G.mul3(n, G.dot3(n, d) * (1 - c))));
  };
  const t = pose.across;
  const d1 = blend(open, folded[0], t);
  const d2 = curl(blend(open, folded[1], t), pose.thumb[0] * deg * (1 - 0.6 * t));
  const d3 = curl(blend(open, folded[2], t), (pose.thumb[0] + pose.thumb[1]) * deg * (1 - 0.6 * t));
  const root = THUMB.root;
  const p1 = G.add3(root, G.mul3(d1, THUMB.len[0]));
  const p2 = G.add3(p1, G.mul3(d2, THUMB.len[1]));
  const p3 = G.add3(p2, G.mul3(d3, THUMB.len[2] - THUMB.r * 0.6));
  return [root, p1, p2, p3];
}

const STRIP_TURN = 40 * deg;

// A flex sensor strip on the back of a finger: a ribbon on the surface with its printed ladder.
function strip(frame, centre, radius, from, to, lit, thumb = false) {
  const dense = G.resample(centre, 1.2);
  const total = G.pathLength(dense);
  const left = [], right = [], rungs = [];
  const sideAxis = [1, 0, 0];
  for (let at = from; at <= total - to + 1e-6; at += 0.8) {
    const p = G.pointAlong(dense, at);
    const t = G.tangentAlong(dense, at);
    // The strip sits on the back, turned a little toward the camera so it is not seen on the limb.
    // A finger curls about the palm's width, so its back is t × u. The thumb points along u, so its back
    // is the back of the hand (+v) taken square to the thumb.
    const back = thumb ? unit(G.sub3([0, 1, 0], G.mul3(t, t[1]))) : unit(G.cross3(t, sideAxis));
    const turn = thumb ? 0 : STRIP_TURN;
    const n = unit(G.add3(G.mul3(back, Math.cos(turn)), G.mul3(unit(G.cross3(back, t)), Math.sin(turn))));
    const across = unit(G.cross3(n, t));
    const surface = G.add3(p, G.mul3(n, radius + 0.5));
    left.push(frame.local(G.add3(surface, G.mul3(across, 2.8))));
    right.push(frame.local(G.add3(surface, G.mul3(across, -2.8))));
  }
  const l = left.map(at), r = right.map(at);
  for (let i = 3; i < l.length - 3; i += 3) rungs.push(k.pathOf([l[i], r[i]]));
  const outline = k.pathOf([...l, ...r.reverse()], true);
  return `<g class="gl-strip"${lit ? ' data-lit' : ''}><path class="iso-fill gl-strip-fill" d="${outline}"/>${L(rungs.join(''), { tone: 'faint', className: 'gl-rung' })}${L(outline, { tone: 'hi', className: 'gl-strip-edge' })}</g>`;
}

// Every drawn item of the hand for one pose, depth sorted. Returns an SVG string.
export function handSvg(pose, { lit = '' } = {}) {
  const frame = handFrame(pose.roll);
  const items = [];
  const put = (key, svg) => items.push({ key, svg });
  const sensing = lit === 'sense';

  // Wrist: the glove between the cuff and the palm.
  const wristF = { o: frame.local([0, 0, 0]), a: frame.Z, u: frame.X, v: frame.Y };
  put(depth(frame.local([0, 0, -6])), S(G.prismOf(wristF, rounded(-27, -13, 27, 13, 12), -10, PALM.s0 + 1, P), { tone: 'mid' }));
  // Palm.
  const palmPoly = rounded(-PALM.u, -PALM.v, PALM.u, PALM.v, 10);
  const palmKey = depth(frame.local([0, 0, (PALM.s0 + PALM.s1) / 2]));
  put(palmKey, S(G.prismOf(wristF, palmPoly, PALM.s0, PALM.s1, P), { tone: 'mid' }));

  // Fingers: each a tube with a domed tip, sorted chunk by chunk against the palm.
  const centres = [];
  FINGER.forEach((finger, i) => {
    const points = G.fillet(fingerPoints(finger, pose.fingers[i], pose.splay[i]), finger.r * 1.1, 7);
    centres.push({ points, r: finger.r });
    const world = points.map(frame.local);
    const r = t => finger.r * (1 - 0.12 * t);
    tubes(world, r, { caps: [false, true] }, { tone: 'mid' }).forEach(item => {
      put(item.key, item.svg);
    });
    const tip = world[world.length - 1];
    put(depth(tip) + 0.3, S(G.sphereOf(tip, finger.r * 0.88, P, { steps: 28 }), { tone: 'mid' }));
  });
  {
    const points = G.fillet(thumbPoints(pose), THUMB.r * 1.1, 7);
    centres.push({ points, r: THUMB.r, thumb: true });
    const world = points.map(frame.local);
    tubes(world, t => THUMB.r * (1 - 0.14 * t), { caps: [false, true] }, { tone: 'mid' }).forEach(item => put(item.key, item.svg));
    const tip = world[world.length - 1];
    put(depth(tip) + 0.3, S(G.sphereOf(tip, THUMB.r * 0.86, P, { steps: 28 }), { tone: 'mid' }));
  }

  // Flex strips: drawn just over the finger they ride on.
  centres.forEach(({ points, r, thumb }, index) => {
    const middle = G.pointAlong(points, G.pathLength(points) * 0.5);
    put(depth(frame.local(middle)) + r + 2, strip(frame, points, r * 0.94, thumb ? 4 : 2, 6, sensing, thumb));
  });

  // Perfboard on the back of the hand, the MPU6050 breakout on it, five divider resistors and a header.
  const back = PALM.v;
  const boardKey = palmKey + 40;
  const boardF = { o: frame.local([0, back, 0]), a: frame.Y, u: frame.X, v: frame.Z };
  const boardItems = [];
  boardItems.push(S(G.prismOf(boardF, rounded(BOARD.u0, BOARD.s0, BOARD.u1, BOARD.s1, 1.5, 2), 0, BOARD.t, P), { tone: 'lo' }));
  const holes = [];
  for (let u = BOARD.u0 + 2.5; u < BOARD.u1 - 1; u += 2.54) for (let s = BOARD.s0 + 2.5; s < BOARD.s1 - 1; s += 2.54) {
    if (u > MPU.u0 - 1.5 && u < MPU.u1 + 1.5 && s > MPU.s0 - 1.5 && s < MPU.s1 + 1.5) continue;
    holes.push(at(frame.local([u, back + BOARD.t, s])));
  }
  boardItems.push(D(holes, { size: 0.32, tone: 'faint' }));
  const mpuF = { o: frame.local([0, back + BOARD.t, 0]), a: frame.Y, u: frame.X, v: frame.Z };
  boardItems.push(S(G.prismOf(mpuF, rounded(MPU.u0, MPU.s0, MPU.u1, MPU.s1, 1, 2), 0, MPU.t, P), { tone: 'hi', lit: lit === 'tilt' }));
  const chipF = { o: frame.local([0, back + BOARD.t + MPU.t, 0]), a: frame.Y, u: frame.X, v: frame.Z };
  boardItems.push(S(G.prismOf(chipF, rounded(-3, 49, 3, 55, 0.5, 2), 0, 0.9, P), { tone: 'mid' }));
  boardItems.push(D([MPU.s0 + 2].flatMap(s => Array.from({ length: 8 }, (_, i) => at(frame.local([MPU.u0 + 2.5 + i * 2.4, back + BOARD.t + MPU.t, s])))), { size: 0.4, tone: 'mid' }));
  boardItems.push(D([[MPU.u0 + 2, MPU.s1 - 2], [MPU.u1 - 2, MPU.s1 - 2]].map(([u, s]) => at(frame.local([u, back + BOARD.t + MPU.t, s]))), { size: 0.55, tone: 'lo' }));
  // Resistors: five small bodies lying across the board below the MPU.
  for (let i = 0; i < 5; i++) {
    const u = BOARD.u0 + 6 + i * 8;
    const F = G.frameAlong(frame.local([u, back + BOARD.t + 1.1, 31]), frame.Z);
    boardItems.push(S(G.solidOf([[-3.4, 0.6], [-3.4, 1.1], [-2.6, 1.2, 1], [2.6, 1.2, 1], [3.4, 1.1], [3.4, 0.6]], F, P, { steps: 16 }), { tone: 'hi' }));
    boardItems.push(L(G.arcOf(F, -1.2, 1.25, P) + G.arcOf(F, 0.2, 1.25, P), { tone: 'mid' }));
  }
  // Header: a row of five pins near the top of the board, where the sensor leads land.
  const headerF = { o: frame.local([0, back + BOARD.t, 0]), a: frame.Y, u: frame.X, v: frame.Z };
  boardItems.push(S(G.prismOf(headerF, rounded(BOARD.u0 + 3, 64, BOARD.u1 - 3, 68, 0.5, 2), 0, 2.4, P), { tone: 'mid' }));
  const pinTop = back + BOARD.t + 2.4;
  boardItems.push(D(PIN_U.map(u => at(frame.local([u, pinTop, 66]))), { size: 0.7, tone: 'hi' }));
  // A second header at the bottom of the board, where the harness leaves.
  boardItems.push(S(G.prismOf(headerF, rounded(-12, 25.5, 12, 29, 0.5, 2), 0, 2.4, P), { tone: 'mid' }));
  boardItems.push(D(Array.from({ length: 7 }, (_, i) => at(frame.local([-9 + i * 3, pinTop, 27.2]))), { size: 0.45, tone: 'mid' }));
  put(boardKey, boardItems.join(''));

  // Sensor leads: from each strip's root on the knuckle straight down the back of the hand to its pin.
  centres.forEach(({ points, r, thumb }, index) => {
    const start = G.pointAlong(points, thumb ? 6 : 3);
    const turn = thumb ? 0 : STRIP_TURN;
    const root = G.add3(start, [Math.sin(turn) * (r + 1.2), Math.cos(turn) * (r + 1.2), 0]);
    const pin = PIN_U[thumb ? 0 : index + 1];
    const end = [pin, pinTop, 66];
    const route = G.fillet(thumb
      ? [root, [root[0] - 4, back + 7, root[2] + 2], [pin, back + 7, 74], end]
      : [root, [root[0], back + 6, PALM.s1 - 6], [pin, back + 6, 72], end], 2.5, 6, { P, tube: 0.6 }).map(frame.local);
    tubes(route, 0.6, {}, { tone: 'mid', bias: 60 }).forEach(item => put(item.key, item.svg));
    put(depth(frame.local(root)) + 61, D([at(frame.local(root))], { size: 0.9, tone: 'hi' }));
  });

  // Harness from the lower header down the back of the wrist to the clip on the cuff.
  const clip = CLIP_LOCAL;
  const route = G.fillet([[0, back + BOARD.t + 2.4, 27.2], [0, back + 9, 22], [0, back + 9, 2], clip], 4, 6).map(frame.local);
  const worldRoute = [...route.slice(0, -1), CLIP];
  tubes(worldRoute, 1.6, { rings: { pitch: 1.6, tone: 'lo' } }, { tone: 'hi', bias: 55 }).forEach(item => put(item.key, item.svg));

  items.sort((a, b) => a.key - b.key);
  return items.map(item => item.svg).join('');
}

// The harness clip sits on the front of the cuff. Its point in hand coordinates at rest is where the
// moving lead ends, so the lead always lands on it.
const CLIP_V = 16.2 + 1.6;
const CLIP_LOCAL = [0, CLIP_V + 1.6, FOREARM_Z[1] - 12 - PIVOT[2]];
const CLIP = G.add3(PIVOT, G.add3(G.mul3(YAW_Y, CLIP_LOCAL[1]), [0, 0, CLIP_LOCAL[2]]));

// ---------- the harness from the cuff to the Arduino ----------
const PLUG = { x: UNO.x + 14, y: UNO.y + UNO.d - 6, w: 17, d: 4.6, z: UNO_TOP + 8.4 };
export const HARNESS = G.fillet([
  CLIP,
  [CLIP[0], CLIP[1], 66],
  G.add3([CLIP[0], CLIP[1], 12], G.mul3(YAW_Y, 2)),
  [CLIP[0] + 8, CLIP[1] + 20, 9],
  [CLIP[0] + 34, CLIP[1] + 48, 2],
  [PLUG.x - 22, PLUG.y + 16, 2],
  [PLUG.x + PLUG.w / 2 - 8, PLUG.y + PLUG.d / 2, PLUG.z + 6],
  [PLUG.x + PLUG.w / 2, PLUG.y + PLUG.d / 2, PLUG.z]
], 9, 8);

function harness() {
  const pieces = tubes(HARNESS, 1.6, { rings: { pitch: 1.6, tone: 'lo' } }, { tone: 'hi' });
  return pieces;
}

// ---------- the Arduino Uno ----------
function uno(lit) {
  const out = [];
  const { x, y, w, d } = UNO;
  out.push(`<path class="iso-halo" d="${k.haloOf(UNO, 0, UNO_Z, P)}"/>`);
  for (const [cx, cy] of byDepth(k.corners(UNO, 4))) out.push(S(k.cylinder(cx, cy, 2.6, 0, UNO_Z, P, 16), { tone: 'lo' }));
  out.push(S(k.slabOf(UNO, UNO_Z, 1.6, P, 3, 0.4), { tone: 'lo' }));
  const top = UNO_TOP;
  out.push(L(k.corners(UNO, 4).map(([cx, cy]) => k.ring(cx, cy, 1.7, top, P, 14)).join(''), { tone: 'mid' }));
  // Female headers: digital along the back edge, power and analog along the front.
  const header = (hx, hy, count) => {
    const plan = { x: hx, y: hy, w: count * 2.54, d: 2.6, r: 0.4 };
    out.push(S(k.slabOf(plan, top, 8.4, P, 2), { tone: 'mid' }));
    out.push(D(Array.from({ length: count }, (_, i) => at([hx + 1.27 + i * 2.54, hy + 1.3, top + 8.4])), { size: 0.42, tone: 'lo' }));
  };
  header(x + 15, y + 1.2, 10);
  header(x + 42.5, y + 1.2, 8);
  header(x + 2, y + d - 3.8, 8);
  header(x + 24, y + d - 3.8, 6);
  // ATmega328P in its DIP socket, with its pins along both long sides.
  const chip = { x: x + 22, y: y + d - 18, w: 35, d: 9, r: 0.6 };
  out.push(S(k.slabOf(k.insetPlan(chip, -1), top, 1.2, P, 2), { tone: 'lo' }));
  out.push(`<g class="gl-chip"${lit === 'collect' ? ' data-lit' : ''}>${S(k.slabOf(chip, top + 1.2, 3.4, P, 2, 0.3), { tone: 'hi', lit: lit === 'collect' })}</g>`);
  out.push(L(k.ring(chip.x + 3, chip.y + chip.d / 2, 1.1, top + 4.6, P, 12), { tone: 'lo' }));
  const pins = [];
  for (let i = 0; i < 14; i++) {
    const px = chip.x + 1.4 + i * 2.54;
    pins.push(S(k.slabOf({ x: px - 0.4, y: chip.y + chip.d, w: 0.8, d: 0.9, r: 0 }, top + 1.2, 2.2, P, 1), { tone: 'mid', crease: 'none' }));
  }
  out.push(pins.join(''));
  out.push(L(k.lineOnTop([chip.x + 7, chip.y + 3], [chip.x + 24, chip.y + 3], top + 4.6, P) + k.lineOnTop([chip.x + 7, chip.y + 5.6], [chip.x + 18, chip.y + 5.6], top + 4.6, P), { tone: 'lo', free: true }));
  // USB-B jack and barrel jack on the +x edge, facing the laptop.
  out.push(S(k.slabOf({ x: x + w - 10, y: y + 30, w: 16, d: 12, r: 0.6 }, top, 10.5, P, 2, 0.4), { tone: 'hi' }));
  out.push(S(k.slabOf({ x: x + w - 12, y: y + 4, w: 13, d: 9, r: 1 }, top, 11, P, 3, 0.4), { tone: 'mid' }));
  out.push(S(k.cylinder(x + w + 1.2, y + 8.5, 2.6, top + 3, 5, P, 16), { tone: 'lo' }));
  // Crystal, reset button, regulator, capacitors and the four LEDs.
  out.push(S(k.slabOf({ x: x + 28, y: y + 15, w: 8, d: 3.4, r: 1.6 }, top, 3.2, P, 4, 0.3), { tone: 'hi' }));
  out.push(S(k.slabOf({ x: x + 4, y: y + 4, w: 6, d: 6, r: 0.6 }, top, 2.4, P, 2), { tone: 'mid' }));
  out.push(S(k.cylinder(x + 7, y + 7, 1.7, top + 2.4, 1.2, P, 14), { tone: 'hi' }));
  out.push(S(k.slabOf({ x: x + 46, y: y + 12, w: 6, d: 7, r: 0.4 }, top, 2.4, P, 2), { tone: 'mid' }));
  for (const [cx, cy] of byDepth([[x + 41, y + 30], [x + 44.5, y + 30]])) {
    out.push(S(k.cylinder(cx, cy, 1.6, top, 4.6, P, 16), { tone: 'mid', inner: L(k.sideArc(cx, cy, 1.6, top + 3.6, P, 10), { tone: 'faint' }) }));
  }
  // ICSP header near the chip end.
  out.push(S(k.slabOf({ x: x + 60, y: y + d - 20, w: 5, d: 7.6, r: 0.3 }, top, 2.4, P, 2), { tone: 'mid' }));
  out.push(D([0, 1].flatMap(c => [0, 1, 2].map(r => at([x + 61.3 + c * 2.54, y + d - 18.6 + r * 2.54, top + 2.4]))), { size: 0.4, tone: 'mid' }));
  const leds = [['l', x + 22, y + 9], ['tx', x + 22, y + 14], ['rx', x + 22, y + 18], ['on', x + 50, y + 25]];
  leds.forEach(([name, cx, cy]) => {
    out.push(`<g class="gl-led" data-led="${name}">${S(k.slabOf({ x: cx - 1.2, y: cy - 0.7, w: 2.4, d: 1.4, r: 0.3 }, top, 0.9, P, 1), { tone: 'hi' })}</g>`);
  });
  out.push(k.faceTextSvg(k.topMatrix([x + 33, y + 25], top, P), 'UNO', { size: 3.4, tone: 'lo' }));
  return out.join('');
}

// The harness ends in a plug pushed into the analog header.
function plug() {
  return S(k.slabOf({ x: PLUG.x, y: PLUG.y - 0.6, w: PLUG.w, d: PLUG.d + 1.2, r: 0.6 }, UNO_TOP + 8.4 - 2, PLUG.z - UNO_TOP - 6.4, P, 2, 0.3), { tone: 'mid' });
}

// ---------- USB cable from the Uno to the laptop ----------
const JACK = [UNO.x + UNO.w + 6, UNO.y + 36, UNO_TOP + 5.2];
const PORT = [LAP.x - 6, LAP.y + 84, 4.4];
export const USB = G.fillet([
  JACK,
  [JACK[0] + 14, JACK[1], JACK[2]],
  [JACK[0] + 24, JACK[1] - 6, 2.2],
  [PORT[0] - 22, PORT[1] + 4, 2.2],
  [PORT[0] - 10, PORT[1], PORT[2]],
  PORT
], 8, 8);

function usbPlugs() {
  const out = [];
  out.push(S(k.slabOf({ x: JACK[0] - 0.5, y: JACK[1] - 5, w: 9, d: 10, r: 1.4 }, JACK[2] - 4.6, 9.2, P, 3, 0.4), { tone: 'mid' }));
  return out.join('');
}
function portPlug() {
  return S(k.slabOf({ x: PORT[0] - 0.5, y: PORT[1] - 4.5, w: 6.5, d: 9, r: 1.2 }, PORT[2] - 3.2, 6.4, P, 3, 0.4), { tone: 'mid' });
}

// ---------- the laptop ----------
function laptopBase() {
  const out = [`<path class="iso-halo" d="${k.haloOf(LAP, 0, LAP_H, P)}"/>`];
  out.push(S(k.slabOf(k.insetPlan(LAP, 2), 0, 1.4, P, 6), { tone: 'lo' }));
  out.push(S(k.slabOf(LAP, 1.4, LAP_H - 1.4, P, 6, 1), { tone: 'mid' }));
  // Keyboard well with its keys.
  const well = { x: LAP.x + 14, y: LAP.y + 14, w: LAP.w - 28, d: 52, r: 2 };
  out.push(L(k.planOutline(well, LAP_H, P, 4), { tone: 'lo' }));
  const keys = [];
  const cols = 14, rows = 5, gap = 1.2;
  const kw = (well.w - 4 - gap * (cols - 1)) / cols, kd = (well.d - 4 - gap * (rows - 1)) / rows;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (r === 4 && c > 3 && c < 10) continue;
    keys.push(k.planOutline({ x: well.x + 2 + c * (kw + gap), y: well.y + 2 + r * (kd + gap), w: kw, d: kd, r: 0.8 }, LAP_H, P, 3));
  }
  keys.push(k.planOutline({ x: well.x + 2 + 4 * (kw + gap), y: well.y + 2 + 4 * (kd + gap), w: 6 * kw + 5 * gap, d: kd, r: 0.8 }, LAP_H, P, 3));
  out.push(L(keys.join(''), { tone: 'faint' }));
  // Trackpad.
  out.push(L(k.planOutline({ x: LAP.x + LAP.w / 2 - 28, y: LAP.y + 74, w: 56, d: 34, r: 3 }, LAP_H, P, 6), { tone: 'lo' }));
  out.push(D([at([LAP.x + 16, LAP.y + LAP.d - 6, LAP_H])], { size: 0.6, tone: 'mid' }));
  // Speaker grilles either side of the keyboard: the laptop speaks the result through these.
  const grille = gx => {
    const points = [];
    for (let c = 0; c < 2; c++) for (let r = 0; r < 14; r++) points.push(at([gx + c * 2.6, well.y + 3 + r * 3.4, LAP_H]));
    return points;
  };
  out.push(`<g class="gl-grille">${D([...grille(LAP.x + 5.2), ...grille(LAP.x + LAP.w - 7.8)], { size: 0.55, tone: 'lo' })}</g>`);
  // USB port on the left side, where the cable lands (hidden face, so its plug carries it).
  return out.join('');
}

function laptopLid() {
  const out = [];
  // Hinge barrel along the back edge.
  const hinge = G.frameAlong([LAP.x + 20, LAP.y + 3, LAP_H + 2.2], [1, 0, 0]);
  out.push(S(G.disc(0, LAP.w - 40, 3, hinge, P), { tone: 'lo' }));
  out.push(S(k.slabOf(LID, LAP_H + 2, LID_TOP - LAP_H - 2, P, 4, 0.6), { tone: 'mid' }));
  // Screen: a recess in the lid's front face, with the app drawn in the face plane.
  const y = SCREEN_Y;
  const { x0, x1, z0, z1 } = SCREEN;
  const id = 'gl-screen-clip';
  const shape = flatRect(x0, z0, x1, z1, 2);
  out.push(`<g transform="${planeOf(y)}"><path class="gl-screen" d="${shape}"/><clipPath id="${id}"><path d="${shape}"/></clipPath><g clip-path="url(#${id})" data-part="screen">${screenArt()}</g><path class="iso-line" data-tone="lo" d="${shape}"/><path class="iso-line" data-tone="faint" d="${flatRect(LID.x + 4, LAP_H + 6, LID.x + LID.w - 4, LID_TOP - 3, 3)}"/></g>`);
  out.push(D([at([LAP.x + LAP.w / 2, y, LID_TOP - 4])], { size: 0.7, tone: 'mid' }));
  return out.join('');
}

// The Python app: five bend meters, a roll gauge, the k-NN result, the text line and the voice.
export const UI = (() => {
  const { x0, x1, z0, z1 } = SCREEN;
  return {
    bar: i => ({ x: x0 + 10 + i * 11, w: 6, z0: z0 + 20, z1: z1 - 20 }),
    roll: { cx: x0 + 80, cz: z1 - 34, r: 11 },
    letter: { x: x0 + 118, z: z0 + 38 },
    text: { x: x0 + 8, z: z0 + 6 },
    wave: { x0: x0 + 66, x1: x1 - 6, z: z0 + 16, amp: 4 },
    title: { x: x0 + 15, z: z1 - 6 }
  };
})();

function screenArt() {
  const { x0, x1, z0, z1 } = SCREEN;
  const out = [];
  out.push(`<path class="gl-bar-title" d="${flatRect(x0, z1 - 10, x1, z1, 0, 2)}"/>`);
  out.push([0, 1, 2].map(i => `<circle class="gl-ui-dot" cx="${x0 + 4 + i * 4}" cy="${-(z1 - 5)}" r="1.2"/>`).join(''));
  out.push(`<text class="gl-ui-text" x="${UI.title.x}" y="${-(UI.title.z - 1.4)}" font-size="4.2">gesture_glove.py</text>`);
  for (let i = 0; i < 5; i++) {
    const b = UI.bar(i);
    out.push(`<path class="gl-meter" d="${flatRect(b.x, b.z0, b.x + b.w, b.z1, 0.8, 2)}"/>`);
    out.push(`<rect class="gl-meter-fill" data-bar="${i}" x="${b.x + 0.8}" y="${-b.z1 + 0.8}" width="${b.w - 1.6}" height="${b.z1 - b.z0 - 1.6}"/>`);
    out.push(`<text class="gl-ui-text" x="${b.x + b.w / 2}" y="${-(b.z0 - 6)}" font-size="4.4" text-anchor="middle">${SHORT[i]}</text>`);
  }
  out.push(`<text class="gl-ui-small" x="${x0 + 10}" y="${-(z1 - 16)}" font-size="3.6">flex · 5-sample average</text>`);
  // Roll gauge from the MPU6050.
  const g = UI.roll;
  out.push(`<circle class="gl-meter" cx="${g.cx}" cy="${-g.cz}" r="${g.r}"/>`);
  out.push(`<path class="gl-ui-line" data-part="roll" d="M${g.cx - g.r + 2} ${-g.cz}H${g.cx + g.r - 2}"/>`);
  out.push(`<text class="gl-ui-small" x="${g.cx}" y="${-(g.cz - g.r - 6)}" font-size="3.6" text-anchor="middle" data-part="roll-text">roll 0°</text>`);
  // Result.
  out.push(`<text class="gl-ui-small" x="${UI.letter.x - 18}" y="${-(z1 - 16)}" font-size="3.6" data-part="knn">k-NN · k = 3</text>`);
  out.push(`<text class="gl-letter" x="${UI.letter.x}" y="${-UI.letter.z}" font-size="34" text-anchor="middle" data-part="letter"></text>`);
  out.push(`<text class="gl-ui-small" x="${UI.letter.x}" y="${-(UI.letter.z - 7)}" font-size="3.6" text-anchor="middle" data-part="votes"></text>`);
  out.push(`<path class="gl-ui-line" data-part="wave" d="M${UI.wave.x0} ${-UI.wave.z}H${UI.wave.x1}"/>`);
  out.push(`<path class="gl-rule" d="M${x0} ${-(z0 + 12)}H${x1}"/>`);
  out.push(`<text class="gl-typed" x="${UI.text.x}" y="${-UI.text.z}" font-size="6" data-part="typed"></text>`);
  return out.join('');
}

// ---------- assembly ----------
// Everything behind the hand, the hand's slot, and everything in front, as SVG strings.
export function staticArt(lit = '') {
  const back = [bench(), laptopBase(), laptopLid(), standBase(), forearm()].join('');
  const clip = S(G.disc(-1.6, 1.6, 4, G.frameAlong(G.sub3(CLIP, G.mul3(YAW_Y, 1.6)), YAW_Y), P), { tone: 'mid' });
  const front = [];
  const sorted = [...harness()].sort((a, b) => a.key - b.key).map(item => item.svg).join('');
  front.push(`<g class="gl-harness">${sorted}</g>`);
  front.push(clip);
  front.push(uno(lit));
  front.push(plug());
  const usb = tubes(USB, 2.2, {}, { tone: 'hi' }).sort((a, b) => a.key - b.key).map(item => item.svg).join('');
  front.push(usbPlugs(), `<g class="gl-usb">${usb}</g>`, portPlug());
  return { back, front: front.join('') };
}

// Screen paths of the two cables, for the data frames that run along them.
export const routeScreen = route => G.resample(route, 2).map(at);
