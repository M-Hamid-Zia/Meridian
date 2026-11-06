import * as core from '@bible-strong/avatar-core';
import fs from 'fs';

/**
 * Generates + validates src/avatar.json.
 *
 * Geometry notes — these are the non-obvious bits of the runtime contract:
 *  - Everything is painted into a `-150 … 150` user space; the body radius is
 *    ~120 units. A definition authored at "1.5 units" renders as a dot.
 *  - `eyes.spacing` is an arc length around the head, NOT the pixel gap
 *    between the eyes. Small values (≈40) stack both eyes in the middle of the
 *    face; a wide value puts them on either side.
 *  - The runtime draws a body surface plus exactly two eye shapes. There are no
 *    brows, nose or mouth, so the face is deliberately an abstract mark: wide,
 *    soft ovals read as a calm, premium character at 64–104px. Very tall or
 *    heavy shapes read as a cartoon and should be avoided.
 */

const eye = (width, height, x, y, angle) => ({ width, height, x, y, angle });

/** Body width. The runtime turns this into a radius non-linearly — see BODY below. */
const BODY_WIDTH = 232;

/**
 * Arc length between the eyes. Larger values push the eyes further apart and
 * shrink them in perspective; ~120 lands the pair just inside the head edge.
 */
const SPACING = 120;

/**
 * Projection strength. Above ~2.5 the eyes are pushed so far round the sphere
 * that the pair looks skewed, so keep this low.
 */
const PERSPECTIVE = 1.6;

const EYES = {
  neutral: [eye(48, 54, -1, -22, 0), eye(48, 54, 1, -22, 0)],
  focused: [eye(50, 28, -1, -20, 0), eye(50, 28, 1, -20, 0)],
  satisfied: [eye(46, 26, -1, -20, 0), eye(46, 26, 1, -20, 0)],
  look: [eye(44, 50, -1, -22, -7), eye(44, 50, 1, -22, -7)],
};

const expression = (key, headY = 0, headX = 0) => {
  const [left, right] = EYES[key];
  return {
    head: { x: headX, y: headY, z: 0 },
    eyes: { left, right, spacing: SPACING },
    perspective: PERSPECTIVE,
    motion: {
      eyes: key === 'neutral' ? 'microSaccades' : 'none',
      body: key === 'neutral' ? 'slowDrift' : 'none',
    },
  };
};

const blink = (initialDelayMs) => ({
  enabled: true,
  initialDelayMs,
  minIntervalMs: 3000,
  maxIntervalMs: 6200,
  durationMs: 150,
});

const definition = {
  schema: 'bible-strong/avatar-definition',
  schemaVersion: 1,
  name: 'Meridian Route Desk',
  body: {
    primary: { type: 'sphere', width: BODY_WIDTH, height: BODY_WIDTH, depth: BODY_WIDTH, roundness: 1 },
    nodes: [],
  },
  colors: {
    body: '#c8a24a',
    eyes: '#0b0b0c',
  },
  expressions: {
    neutral: expression('neutral'),
    focused: expression('focused', 6),
    satisfied: expression('satisfied', -6),
    look: expression('look', 0, 8),
  },
  expressionOrder: ['neutral', 'focused', 'satisfied', 'look'],
  animations: {
    idle: {
      playbackMode: 'loop',
      steps: [
        { expression: 'neutral', holdMs: 2600, transitionMs: 620, transition: 'smooth' },
        { expression: 'look', holdMs: 1100, transitionMs: 520, transition: 'smooth' },
        { expression: 'neutral', holdMs: 1800, transitionMs: 520, transition: 'smooth' },
        { expression: 'satisfied', holdMs: 780, transitionMs: 460, transition: 'smooth' },
      ],
      blink: blink(1500),
    },
    greet: {
      playbackMode: 'once',
      steps: [
        { expression: 'satisfied', holdMs: 520, transitionMs: 220, transition: 'snappy' },
        { expression: 'neutral', holdMs: 420, transitionMs: 300, transition: 'smooth' },
      ],
      blink: blink(800),
    },
    think: {
      playbackMode: 'once',
      steps: [
        { expression: 'focused', holdMs: 700, transitionMs: 220, transition: 'snappy' },
        { expression: 'look', holdMs: 620, transitionMs: 240, transition: 'smooth' },
        { expression: 'neutral', holdMs: 320, transitionMs: 280, transition: 'smooth' },
      ],
      blink: blink(800),
    },
  },
  animationOrder: ['idle', 'greet', 'think'],
};

const result = core.validateAvatarDefinition(definition);

if (!result.ok) {
  console.error('Invalid avatar definition:');
  console.error(JSON.stringify(result.errors, null, 1));
  process.exit(1);
}

// Guards for the two regressions that broke this avatar before.
//
// 1. It has to be authored in the runtime's 300-unit space, not "1.5 units",
//    or it renders as an invisible dot.
// 2. `body.primary.width` does NOT map to a radius 1:1 — the runtime uses a
//    sub-linear curve (236 -> r 148.8, 200 -> r 117). A radius much above ~120
//    fills the whole viewBox, which flattens the face against the frame and
//    hides the decorative ring.
const headPath = core
  .renderAvatarDefinition(result.value, 'neutral')
  .geometry.headPath;
const radius = Number((headPath.match(/-?\d+(?:\.\d+)?/g) ?? ['0'])[0]);

if (definition.body.primary.width < 100) {
  console.error(`Body width ${definition.body.primary.width} is too small for the 300-unit viewBox.`);
  process.exit(1);
}
if (radius < 90 || radius > 130) {
  console.error(
    `Head radius resolves to ${radius.toFixed(1)} (want 90–130 in a 300-unit box). ` +
      `Adjust BODY_WIDTH; the width -> radius curve is roughly r = 0.5w(w/236)^0.55.`,
  );
  process.exit(1);
}
console.log(`head radius ${radius.toFixed(1)} · body width ${definition.body.primary.width}`);

fs.writeFileSync('src/avatar.json', `${JSON.stringify(definition, null, 2)}\n`);
console.log('avatar.json written & valid');
