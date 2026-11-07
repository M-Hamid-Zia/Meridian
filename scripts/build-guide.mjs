/**
 * Generates + validates src/guide.json — the route-desk guide mascot.
 *
 * Same engine and envelope contract as the route-desk specialist (see
 * build-avatar.mjs): user space -150 … 150, sphere-family body, exactly two
 * eye shapes, no mouth or brows. This character is deliberately the cute one:
 * a gold plush orb, the classic house gold-2 #d8b65e, grown a proper coat of fluff — a
 * forehead fringe that sits between the eyes and the ears, cheek-spill puffs beside the old bumps, a soft
 * chest ruff, two paws tucked at the bottom of the silhouette, and the same
 * Mickey-style ears, antenna and mitten hands as before. The eyes stay big
 * and low; the joy bloom on the ecstatic expressions steps all the way up
 * to #e6c87a. Everything stays inside the house
 * palette: body #d8b65e (house gold-2), ink #0b0b0c eyes, bloom #e6c87a,
 * and the single brick-red exception #b8422f for the angry state. Nodes carry no color of
 * their own — the engine shades every node from the body tone, which is what
 * makes the puffs read as plush relief rather than painted-on spots.
 */

import * as core from '@bible-strong/avatar-core';
import fs from 'fs';

/** Keep perspective at or below ~2 or the eyes skew round the sphere. */
const PERSPECTIVE = 1.85;

/** Arc length between the eyes. Slightly tighter than the specialist so the pair fills the face. */
const SPACING = 118;

const eye = (width, height, x, y, angle) => ({ width, height, x, y, angle });

const EYES = {
  neutral: [eye(58, 70, -1, -16, 0), eye(58, 70, 1, -16, 0)],
  focused: [eye(58, 31, -1, -13, 0), eye(58, 31, 1, -13, 0)],
  satisfied: [eye(54, 20, -1, -12, 0), eye(54, 20, 1, -12, 0)],
  look: [eye(54, 64, -1, -16, -7), eye(54, 64, 1, -16, -7)],
  // One eye wide, one scrunched into a happy arc — the wink.
  wink: [eye(58, 70, -1, -16, 0), eye(58, 13, 1, -13, 0)],
  // Sparkle eyes, the face of pure delight (and of a won deal).
  delighted: [eye(60, 77, -1, -17, 0), eye(60, 77, 1, -17, 0)],
  // Puppy eyes, gentle bow. Reserved for the softest asks.
  pleading: [eye(62, 80, -1, -15, 0), eye(62, 80, 1, -15, 0)],
  // Asymmetric pair — inquisitive head tilt territory.
  curious: [eye(60, 72, -1, -16, 0), eye(52, 62, 1, -16, 0)],
  // Half-lidded doze for the idle loop.
  sleepy: [eye(56, 30, -1, -12, 0), eye(56, 30, 1, -12, 0)],
  // Mismatched happy arcs, a sideways giggle.
  giggle: [eye(55, 22, -1, -13, 0), eye(55, 24, 1, -12, 0)],
  // The gasp — as wide as the engine will pleasantly go.
  astonished: [eye(62, 84, -1, -16, 0), eye(62, 84, 1, -16, 0)],
  // Cat-squint — the two eyes rotated in opposite directions.
  mischief: [eye(54, 34, -1, -12, -14), eye(54, 34, 1, -12, 14)],
  // Tiny wide eyes on the jitter circuit.
  nervous: [eye(44, 54, -1, -17, 0), eye(44, 54, 1, -17, 0)],
  // Dropped gaze, the shy one.
  bashful: [eye(54, 34, -1, -9, 0), eye(54, 34, 1, -9, 0)],
  // Chin-up open gaze.
  brave: [eye(58, 74, -1, -17, 0), eye(58, 74, 1, -17, 0)],
  // The scowl — narrowed lids, inner corners drawn down (\/).
  angry: [eye(54, 26, -1, -14, -14), eye(54, 26, 1, -14, 14)],
  // Shut eyes, the deep end of the dozing ladder.
  sleeping: [eye(52, 11, -1, -12, 0), eye(52, 11, 1, -12, 0)],
  // Attentive side-hold with the tracking flicker.
  watching: [eye(57, 50, -1, -15, 0), eye(57, 50, 1, -15, 0)],
  // High wide scan, looking up and ahead.
  searching: [eye(55, 66, -1, -20, 0), eye(55, 66, 1, -20, 0)],
  // Dead-flat lids and not one ounce of interest.
  bored: [eye(52, 16, -1, -12, 0), eye(52, 16, 1, -12, 0)],
  // The gentle squint between content and joy.
  happy: [eye(52, 38, -1, -15, 0), eye(52, 38, 1, -15, 0)],
  // Shimmering wide eyes, head popped up.
  excited: [eye(54, 72, -1, -17, 0), eye(54, 72, 1, -17, 0)],
};

const expression = (key, headY = 0, headX = 0, headZ = 0, colors) => {
  const [left, right] = EYES[key];
  const jitter = key === 'neutral' || key === 'nervous' || key === 'watching' || key === 'searching' || key === 'excited';
  return {
    head: { x: headX, y: headY, z: headZ },
    eyes: { left, right, spacing: SPACING },
    perspective: PERSPECTIVE,
    motion: {
      eyes: jitter ? 'microSaccades' : 'none',
      body: key === 'neutral' ? 'slowDrift' : key === 'angry' ? 'shake' : 'none',
    },
    ...(colors ? { colors } : {}),
  };
};

// A warmer gold the body blooms into for the biggest feelings. Same hue
// family, one step lighter — the joy shows without leaving the palette.
const BLOOM = { body: '#e6c87a' };

// The rage flush — brick red, desaturated to sit with the gold and ink.
const ANGER = { body: '#b8422f' };

const blink = (initialDelayMs) => ({
  enabled: true,
  initialDelayMs,
  minIntervalMs: 2400,
  maxIntervalMs: 4800,
  durationMs: 130,
});

// Node geometry, same gold as the body (the engine shades single-tone nodes on
// its own). Envelope limit is -150 … 150 in every axis; protrusion depth is
// tuned per node against the body sphere so every puff breaks the surface by
// only a few units: fringe across the upper face, ruff low on the chest,
// paws past the bottom arc, cowlick past the crown.
const sphere = (diameter) => ({ type: 'sphere', width: diameter, height: diameter, depth: diameter, roundness: 1 });

const NODES = [
  // Mickey-style ears, slightly behind the face plane for depth.
  { surface: sphere(84), position: [-82, -72, -8], rotation: [0, 0, 0] },
  { surface: sphere(84), position: [82, -72, -8], rotation: [0, 0, 0] },
  // Antenna: a leaning capsule stem with a ball tip.
  { surface: { type: 'capsule', width: 16, height: 44, depth: 16, roundness: 1 }, position: [3, -122, 0], rotation: [0, 0, -14] },
  { surface: sphere(26), position: [7, -133, 0], rotation: [0, 0, 0] },
  // Soft forehead fringe — a row of plush bumps between the eyes and the ears.
  { surface: sphere(38), position: [-36, -78, 66], rotation: [0, 0, 0] },
  { surface: sphere(44), position: [0, -84, 64], rotation: [0, 0, 0] },
  { surface: sphere(38), position: [36, -78, 66], rotation: [0, 0, 0] },
  // Chubby cheek bumps — just under the surface enough to catch the light differently.
  { surface: sphere(34), position: [-56, 22, 92], rotation: [0, 0, 0] },
  { surface: sphere(34), position: [56, 22, 92], rotation: [0, 0, 0] },
  // Cheek-spill puffs, one step outward — the fluff running down the jawline.
  { surface: sphere(20), position: [-84, 33, 62], rotation: [0, 0, 0] },
  { surface: sphere(20), position: [84, 33, 62], rotation: [0, 0, 0] },
  // Little mitten hands, half-sunk into the lower silhouette like paws.
  { surface: sphere(38), position: [-106, 52, 12], rotation: [0, 0, 0] },
  { surface: sphere(38), position: [106, 52, 12], rotation: [0, 0, 0] },
  // A soft chest ruff — three puffs low on the front.
  { surface: sphere(28), position: [0, 80, 74], rotation: [0, 0, 0] },
  // Two paws tucked under the belly — the bottom edge silhouette breaks instead of a clean arc.
  { surface: sphere(30), position: [-44, 104, 10], rotation: [0, 0, 0] },
  { surface: sphere(30), position: [44, 104, 10], rotation: [0, 0, 0] },
];

const definition = {
  schema: 'bible-strong/avatar-definition',
  schemaVersion: 1,
  name: 'Meridian Route Desk Guide',
  body: {
    primary: { type: 'sphere', width: 232, height: 232, depth: 232, roundness: 1 },
    nodes: NODES,
  },
  colors: {
    body: '#d8b65e',
    eyes: '#0b0b0c',
  },
  expressions: {
    neutral: expression('neutral'),
    focused: expression('focused', 8),
    satisfied: expression('satisfied', -6),
    look: expression('look', 0, 8),
    wink: expression('wink', 2, 4),
    delighted: expression('delighted', -8, 0, 0, BLOOM),
    pleading: expression('pleading', 5, 3, 0, BLOOM),
    curious: expression('curious', 6, -4),
    sleepy: expression('sleepy', 1, 0, 5),
    giggle: expression('giggle', 0, 2, 6),
    astonished: expression('astonished', -6, 0, 0),
    mischief: expression('mischief', 3, 3, 0),
    nervous: expression('nervous', 4, 0, 0),
    bashful: expression('bashful', 5, 0, 0),
    brave: expression('brave', -10, 0, 0),
    // Brick-red flush while the scowl holds — the one deliberate exception to
    // the gold body, requested for the mistake/alert state. Eyes stay ink.
    angry: expression('angry', -4, 0, 0, ANGER),
    sleeping: expression('sleeping', 1, 0, 9),
    watching: expression('watching', 0, 10, 2),
    searching: expression('searching', -5, 6, 0),
    bored: expression('bored', 3, 0, 0),
    happy: expression('happy', -5, 0, 0),
    excited: expression('excited', -10, 0, 0),
  },
  expressionOrder: ['neutral', 'focused', 'satisfied', 'look', 'wink', 'delighted', 'pleading', 'curious', 'sleepy', 'giggle', 'astonished', 'mischief', 'nervous', 'bashful', 'brave', 'angry', 'sleeping', 'watching', 'searching', 'bored', 'happy', 'excited'],
  animations: {
    idle: {
      playbackMode: 'loop',
      steps: [
        { expression: 'neutral', holdMs: 1900, transitionMs: 560, transition: 'smooth' },
        { expression: 'watching', holdMs: 1000, transitionMs: 480, transition: 'smooth' },
        { expression: 'neutral', holdMs: 640, transitionMs: 400, transition: 'smooth' },
        { expression: 'bored', holdMs: 680, transitionMs: 560, transition: 'smooth' },
        { expression: 'neutral', holdMs: 560, transitionMs: 400, transition: 'smooth' },
        { expression: 'sleeping', holdMs: 780, transitionMs: 620, transition: 'smooth' },
        { expression: 'neutral', holdMs: 600, transitionMs: 280, transition: 'snappy' },
        { expression: 'satisfied', holdMs: 680, transitionMs: 420, transition: 'spring' },
      ],
      blink: blink(1200),
    },
    greet: {
      playbackMode: 'once',
      steps: [
        { expression: 'happy', holdMs: 420, transitionMs: 200, transition: 'spring' },
        { expression: 'brave', holdMs: 420, transitionMs: 220, transition: 'spring' },
        { expression: 'wink', holdMs: 560, transitionMs: 210, transition: 'spring' },
        { expression: 'delighted', holdMs: 480, transitionMs: 240, transition: 'spring' },
        { expression: 'satisfied', holdMs: 380, transitionMs: 240, transition: 'spring' },
        { expression: 'neutral', holdMs: 360, transitionMs: 300, transition: 'smooth' },
      ],
      blink: blink(700),
    },
    think: {
      playbackMode: 'once',
      steps: [
        { expression: 'focused', holdMs: 600, transitionMs: 180, transition: 'spring' },
        { expression: 'searching', holdMs: 650, transitionMs: 220, transition: 'smooth' },
        { expression: 'curious', holdMs: 520, transitionMs: 220, transition: 'smooth' },
        { expression: 'look', holdMs: 520, transitionMs: 240, transition: 'smooth' },
        { expression: 'neutral', holdMs: 320, transitionMs: 260, transition: 'smooth' },
      ],
      blink: blink(700),
    },
    celebrate: {
      playbackMode: 'once',
      steps: [
        { expression: 'delighted', holdMs: 420, transitionMs: 170, transition: 'spring' },
        { expression: 'astonished', holdMs: 380, transitionMs: 190, transition: 'spring' },
        { expression: 'excited', holdMs: 420, transitionMs: 200, transition: 'spring' },
        { expression: 'giggle', holdMs: 520, transitionMs: 200, transition: 'spring' },
        { expression: 'delighted', holdMs: 380, transitionMs: 220, transition: 'spring' },
        { expression: 'satisfied', holdMs: 400, transitionMs: 240, transition: 'spring' },
        { expression: 'neutral', holdMs: 340, transitionMs: 300, transition: 'smooth' },
      ],
      blink: blink(700),
    },
    giggle: {
      playbackMode: 'once',
      steps: [
        { expression: 'giggle', holdMs: 620, transitionMs: 170, transition: 'spring' },
        { expression: 'satisfied', holdMs: 380, transitionMs: 240, transition: 'spring' },
        { expression: 'neutral', holdMs: 320, transitionMs: 300, transition: 'smooth' },
      ],
      blink: blink(700),
    },
    pleading: {
      playbackMode: 'once',
      steps: [
        { expression: 'bashful', holdMs: 520, transitionMs: 220, transition: 'smooth' },
        { expression: 'pleading', holdMs: 720, transitionMs: 240, transition: 'spring' },
        { expression: 'satisfied', holdMs: 380, transitionMs: 280, transition: 'smooth' },
        { expression: 'neutral', holdMs: 300, transitionMs: 300, transition: 'smooth' },
      ],
      blink: blink(700),
    },
    nervous: {
      playbackMode: 'once',
      steps: [
        { expression: 'nervous', holdMs: 720, transitionMs: 180, transition: 'snappy' },
        { expression: 'neutral', holdMs: 320, transitionMs: 300, transition: 'smooth' },
      ],
      blink: blink(700),
    },
    angry: {
      playbackMode: 'once',
      steps: [
        { expression: 'angry', holdMs: 680, transitionMs: 150, transition: 'snappy' },
        { expression: 'nervous', holdMs: 420, transitionMs: 280, transition: 'smooth' },
        { expression: 'neutral', holdMs: 240, transitionMs: 260, transition: 'smooth' },
      ],
      blink: blink(700),
    },
  },
  animationOrder: ['idle', 'greet', 'think', 'celebrate', 'giggle', 'pleading', 'nervous', 'angry'],
};

const result = core.validateAvatarDefinition(definition);

if (!result.ok) {
  console.error('Invalid guide definition:');
  console.error(JSON.stringify(result.errors, null, 1));
  process.exit(1);
}

fs.writeFileSync(new URL('../src/guide.json', import.meta.url), JSON.stringify(definition, null, 2) + '\n');
console.log('guide.json written.');
