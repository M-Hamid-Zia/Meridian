import * as core from '@bible-strong/avatar-core';
import fs from 'fs';

const eye = (w, h, x, y, a) => ({ width: w, height: h, x, y, angle: a });
const expr = (headY, headX, l, r, spacing, eyes, body) => ({
  head: { x: headX, y: headY, z: 0 },
  eyes: { left: l, right: r, spacing },
  perspective: 3.2,
  motion: { eyes, body },
});
const blink = (delay) => ({ enabled: true, initialDelayMs: delay, minIntervalMs: 2800, maxIntervalMs: 5600, durationMs: 150 });

const def = {
  schema: 'bible-strong/avatar-definition',
  schemaVersion: 1,
  name: 'Meridian Route Desk',
  body: {
    primary: { type: 'sphere', width: 249, height: 249, depth: 249, roundness: 1 },
    nodes: [],
  },
  colors: { body: '#c8a24a', eyes: '#0b0b0c' },
  expressions: {
    neutral: expr(0, 0, eye(34, 32, -3, -14, 0), eye(34, 32, 3, -14, 0), 46, 'microSaccades', 'slowDrift'),
    focused: expr(6, 0, eye(36, 18, -3, -12, -7), eye(36, 18, 3, -12, 7), 46, 'none', 'none'),
    satisfied: expr(-5, 0, eye(34, 15, -3, -12, 12), eye(34, 15, 3, -12, -12), 46, 'none', 'slowDrift'),
    look: expr(0, 10, eye(32, 30, -3, -14, -8), eye(32, 30, 3, -14, -8), 46, 'none', 'none'),
  },
  expressionOrder: ['neutral', 'focused', 'satisfied', 'look'],
  animations: {
    idle: {
      playbackMode: 'loop',
      steps: [
        { expression: 'neutral', holdMs: 2400, transitionMs: 600, transition: 'smooth' },
        { expression: 'look', holdMs: 1100, transitionMs: 520, transition: 'smooth' },
        { expression: 'neutral', holdMs: 1700, transitionMs: 520, transition: 'smooth' },
        { expression: 'focused', holdMs: 900, transitionMs: 420, transition: 'smooth' },
        { expression: 'satisfied', holdMs: 800, transitionMs: 460, transition: 'smooth' },
      ],
      blink: blink(1400),
    },
    greet: {
      playbackMode: 'once',
      steps: [
        { expression: 'satisfied', holdMs: 500, transitionMs: 200, transition: 'snappy' },
        { expression: 'neutral', holdMs: 420, transitionMs: 280, transition: 'smooth' },
      ],
      blink: blink(900),
    },
    think: {
      playbackMode: 'once',
      steps: [
        { expression: 'focused', holdMs: 700, transitionMs: 200, transition: 'snappy' },
        { expression: 'look', holdMs: 640, transitionMs: 220, transition: 'smooth' },
        { expression: 'neutral', holdMs: 320, transitionMs: 260, transition: 'smooth' },
      ],
      blink: blink(900),
    },
  },
  animationOrder: ['idle', 'greet', 'think'],
};

const v = core.validateAvatarDefinition(def);
if (!v.ok) {
  console.error(JSON.stringify(v.errors, null, 1));
  process.exit(1);
}
fs.writeFileSync('src/avatar.json', JSON.stringify(def, null, 2) + '\n');
console.log('avatar.json written & valid');
