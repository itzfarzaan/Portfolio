// The figure's SVG: static art behind and in front of the hand's slot, plus the data pulses on the cables.
import * as k from './kit/iso-kit.mjs';
import { staticArt, WIDTH, HEIGHT } from './scene.mjs';
import { PULSES } from './live.mjs';

export const LABEL = 'A sensor glove on a bench stand, wired to an Arduino Uno that streams its readings over USB to a laptop. Flex sensors on each finger and an MPU6050 on the back of the hand read the handshape; the laptop recognises the letter, shows it and speaks it.';

export function figureSvg() {
  const { back, front } = staticArt();
  const pulses = PULSES.map(p => `<path class="gl-pulse" data-pulse="${p.id}" d="${p.d}" style="stroke-dasharray:24 ${Math.ceil(p.length + 48)};opacity:0"/>`).join('');
  return k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL, body: `${back}<g data-part="hand"></g>${front}${pulses}` });
}
