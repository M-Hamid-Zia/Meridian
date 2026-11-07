/**
 * A tiny address bus from any interactive section to the route-desk guide.
 *
 * Components emit a `meridian:guide` CustomEvent with a message (and an
 * optional CTA + avatar expression). GuideAvatar listens, shows its bubble,
 * and plays the matching motion cue. Anything not carrying a guide banner is
 * ignored, so the bus never crashes when the guide is dismissed.
 */

export const GUIDE_EVENT = 'meridian:guide';

export type GuideEffect = 'greet' | 'think' | 'celebrate' | 'giggle' | 'pleading' | 'nervous' | 'angry';

export interface GuideEvent {
  /** One or two short lines. No em dashes. Desk voice, not chirpy. */
  text: string;
  /** Optional gold text-link CTA inside the bubble. Targets an in-page section id. */
  cta?: { label: string; targetId: string };
  /** Avatar cue to play alongside the bubble. */
  effect?: GuideEffect;
}

declare global {
  interface WindowEventMap {
    [GUIDE_EVENT]: CustomEvent<GuideEvent>;
  }
}

export function emitGuide(detail: GuideEvent) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<GuideEvent>(GUIDE_EVENT, { detail }));
}
