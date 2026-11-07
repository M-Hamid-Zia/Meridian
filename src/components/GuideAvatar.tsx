import { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, type AvatarController } from '@bible-strong/avatar-react';
import type { AvatarDefinition } from '@bible-strong/avatar-core';
import guideJson from '../guide.json';
import { prefersReducedMotion, transitionToId } from '../lib/motion';
import { GUIDE_EVENT, type GuideEvent } from '../lib/guide';
import { ArrowRight, CloseIcon } from './Icons';

const definition = guideJson as unknown as AvatarDefinition;

const COOLDOWN_MS = 6000;
const IDLE_AFTER_MS = 26000;
const IDLE_EVERY_MS = 26000;
// Gaze tracking: the guide watches the cursor, and locks its eyes onto the
// field the visitor is focused on (typing, choosing) before drifting back.
const MAX_GAZE = 12; // svg user units (viewBox is 300 across)
const FULL_GAZE_PX = 140; // distance at which the pupils reach their travel limit
const PIN_LINGER_MS = 1400; // hold the field after blur before returning to the cursor
const PIN_TYPING_MS = 1800; // keep the field locked while input/select events land

const INTRO: GuideEvent = {
  text: "Hi. I'm the route desk's little guide. I'll show you around.",
  cta: { label: 'Request a quote', targetId: 'contact' },
  effect: 'greet',
};

/** Section-aware tips. Each fires at most once per session and yields to action messages. */
const SECTION_TIPS: Record<string, GuideEvent> = {
  routes: { text: 'Pick a lane below. The estimate is live.' },
  services: {
    text: 'Ocean, air or customs. One named owner each.',
    cta: { label: 'Get a quote', targetId: 'contact' },
  },
  'case-study': { text: 'Nine days back. The first 120 containers.' },
  network: { text: 'Twelve owned offices. One accountable contract.' },
  team: { text: 'Client voices, held under NDA.' },
  faq: {
    text: 'Six questions we hear first. If yours is not here, ask the desk.',
    cta: { label: 'Ask the desk', targetId: 'contact' },
  },
  contact: { text: 'Six fields. One business day. One named specialist.' },
};

const IDLE_TIPS: GuideEvent[] = [
  { text: 'Every lane gets one owner. Yours will too.' },
  { text: 'Rotterdam is our home port. Every file starts there.' },
  {
    text: 'Need the desk? Four hours, in writing.',
    cta: { label: 'Ask the desk', targetId: 'contact' },
    effect: 'pleading',
  },
];

/**
 * The route-desk guide: a cute gold orb that floats bottom-left and reacts to
 * what the user does. It is wired to the page through the `meridian:guide`
 * window event (see src/lib/guide.ts), suggests section-by-section next steps,
 * celebrates real actions, and can be dismissed for the session.
 *
 * The character itself is authored in `src/guide.json` and rendered by the
 * same runtime as the named-specialist avatar: the classic gold-2 plush orb. Its pupils watch the cursor, and lock onto the field the visitor is
 * focused on (focus, click, typing, selection) before gliding back. On
 * desktop it travels the page with the scroll, drifting freely on both axes
 * to a per-section spot instead of pinning a corner, so it keeps pace with
 * the chapter it is helpful in (≤640px it stays docked above the sticky CTA). Under
 * prefers-reduced-motion the orb stays a calm static face, the bubble
 * changes are instant, and the gaze and travel loops are both disabled.
 * The guide never gates its listeners on session state, so wired reactions
 * always fire while the widget is on the page.
 */
export default function GuideAvatar() {
  const reduce = typeof window !== 'undefined' ? prefersReducedMotion() : false;

  // Dismissal is deliberately per page view: a hidden guide reloads with the
  // page, so the corner can never go permanently mute within a session.
  const [dismissed, setDismissed] = useState(false);
  const [painted, setPainted] = useState(false);
  const [face, setFace] = useState('neutral');
  const [message, setMessage] = useState<GuideEvent | null>(null);
  const [bubbleVisible, setBubbleVisible] = useState(false);

  const rootRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLSpanElement>(null);
  const controller = useRef<AvatarController | null>(null);
  const seenSectionsRef = useRef(new Set<string>());
  const actionUntilRef = useRef(0);
  const idleIndexRef = useRef(0);
  const hideTimerRef = useRef<number | null>(null);

  const playEffect = useCallback(
    (effect?: GuideEvent['effect']) => {
      if (reduce || !effect) return;
      controller.current?.play(effect);
    },
    [reduce],
  );

  const show = useCallback(
    (event: GuideEvent, ttl = 7000) => {
      setMessage(event);
      setBubbleVisible(true);
      playEffect(event.effect);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = window.setTimeout(() => setBubbleVisible(false), ttl);
    },
    [playEffect],
  );

  // The engine only knows two eyes, so the face below them is ours: one
  // poll of the live expression drives both the catch-light visibility on
  // shut/squinting lids and the mouth variant.
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      const state = controller.current?.getState?.();
      const expression = state?.activeExpression;
      if (typeof expression === 'string') setFace(expression);
    }, 250);
    return () => window.clearInterval(id);
  }, [reduce]);

  const SHUT = new Set(['sleeping', 'bored', 'satisfied', 'giggle', 'happy', 'angry', 'wink', 'mischief', 'bashful', 'sleepy']);
  const eyesShut = SHUT.has(face);

  const MOUTH: Record<string, string> = {
    neutral: 'soft',
    focused: 'flat',
    satisfied: 'soft',
    look: 'flat',
    wink: 'smile',
    delighted: 'smile',
    pleading: 'worried',
    curious: 'flat',
    sleepy: 'flat',
    giggle: 'smile',
    astonished: 'o',
    mischief: 'soft',
    nervous: 'worried',
    bashful: 'worried',
    brave: 'soft',
    angry: 'frown',
    sleeping: 'o',
    watching: 'flat',
    searching: 'flat',
    bored: 'flat',
    happy: 'smile',
    excited: 'smile',
  };
  const mouth = MOUTH[face] ?? 'soft';

  // Reveal only once the eye paths exist (same first-frame paint guard as the specialist avatar).
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let frame = 0;
    let tries = 0;
    const check = () => {
      const eyes = host.querySelectorAll('g[clip-path] path');
      const drawn = Array.from(eyes).some((path) => (path.getAttribute('d') ?? '').length > 8);
      if (drawn) {
        setPainted(true);
        return;
      }
      if (tries++ < 40) frame = requestAnimationFrame(check);
      else setPainted(true); // never leave a hole in the corner
    };
    frame = requestAnimationFrame(check);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Greet shortly after arrival.
  useEffect(() => {
    if (dismissed) return;
    const timer = window.setTimeout(() => {
      actionUntilRef.current = Date.now() + COOLDOWN_MS;
      show(INTRO, 9000);
    }, reduce ? 400 : 900);
    return () => window.clearTimeout(timer);
  }, [dismissed, reduce, show]);

  // React to what the user does anywhere on the page.
  useEffect(() => {
    if (dismissed) return;
    const onGuide = (event: WindowEventMap[typeof GUIDE_EVENT]) => {
      const detail = event.detail;
      if (!detail?.text) return;
      actionUntilRef.current = Date.now() + COOLDOWN_MS;
      show(detail, 8000);
    };
    window.addEventListener(GUIDE_EVENT, onGuide);
    return () => window.removeEventListener(GUIDE_EVENT, onGuide);
  }, [dismissed, show]);

  // Travel with the scroll: the guide rests at a per-section anchor instead of
  // a pinned corner, drifting freely on BOTH axes — it glides to that
  // chapter's own (x, y) home as the visitor scrolls, never out of the
  // viewport (clamped by its measured width). Viewport-fraction targets,
  // lerped in rAF with a slow docking curve and a faint two-axis bob. Only
  // ≥641px (the sticky-CTA dock owns small phones) and never for reduced
  // motion; inline top/left cleared otherwise.
  useEffect(() => {
    if (reduce || dismissed) return;
    const el = rootRef.current;
    if (!el) return;

    const dock = window.matchMedia('(min-width: 641px)');
    // Each chapter has its own home on the screen: [section id, y (fraction
    // of innerHeight), x (fraction of innerWidth)]. Alternating sides keeps
    // the drift feeling alive instead of a vertical rail.
    const ANCHORS: Array<[string, number, number]> = [
      ['top', 0.6, 0.03],
      ['routes', 0.34, 0.6],
      ['services', 0.52, 0.05],
      ['case-study', 0.26, 0.58],
      ['network', 0.5, 0.07],
      ['team', 0.3, 0.62],
      ['faq', 0.54, 0.09],
      ['contact', 0.24, 0.56],
    ];
    const clampTarget = (x: number, y: number) => ({
      x: Math.min(0.86, Math.max(0.02, x)),
      y: Math.min(0.72, Math.max(0.1, y)),
    });
    let target = clampTarget(0.03, 0.6);
    let current = { ...target };
    let maxLeft = Number.POSITIVE_INFINITY;

    const measure = () => {
      const line = window.innerHeight * 0.35;
      let passedTop = -Infinity;
      let picked = { x: 0.03, y: 0.6 };
      for (const [id, y, x] of ANCHORS) {
        if (id === 'top') continue;
        const node = document.getElementById(id);
        if (!node) continue;
        const top = node.getBoundingClientRect().top;
        if (top <= line && top > passedTop) {
          passedTop = top;
          picked = { x, y };
        }
      }
      target = clampTarget(picked.x, picked.y);
      maxLeft = Math.max(8, window.innerWidth - el.offsetWidth - 8);
    };

    let lastMeasure = 0;
    let raf = 0;
    const loop = (t: number) => {
      if (dock.matches) {
        if (t - lastMeasure > 200) {
          measure();
          lastMeasure = t;
        }
        current.x += (target.x - current.x) * 0.075;
        current.y += (target.y - current.y) * 0.075;
        const bobY = Math.sin(t / 1600) * 0.012;
        const bobX = Math.cos(t / 2300) * 0.006;
        const top = Math.round((current.y + bobY) * window.innerHeight);
        const left = Math.min(Math.round((current.x + bobX) * window.innerWidth), maxLeft);
        el.style.top = `${top}px`;
        el.style.left = `${Math.max(8, left)}px`;
      } else {
        el.style.top = '';
        el.style.left = '';
      }
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(raf);
      el.style.top = '';
      el.style.left = '';
    };
  }, [reduce, dismissed]);

  // Watch the cursor; on focus/typing/click/select, lock onto that control.
  // The pupils glide in pure SVG user units via CSS variables on the host,
  // so no runtime internals are touched and replacements re-apply cleanly.
  useEffect(() => {
    if (reduce || dismissed) return;
    const host = hostRef.current;
    if (!host) return;

    const state = { x: 0, y: 0, tx: 0, ty: 0, pinUntil: 0, raf: 0 };

    const aimAtPoint = (clientX: number, clientY: number) => {
      const rect = host.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      const len = Math.hypot(dx, dy);
      if (len < 4) {
        state.tx = 0;
        state.ty = 0;
        return;
      }
      const magnitude = Math.min(MAX_GAZE, (len / FULL_GAZE_PX) * MAX_GAZE);
      state.tx = (dx / len) * magnitude;
      state.ty = (dy / len) * magnitude;
    };

    const aimAtElement = (el: Element) => {
      const rect = el.getBoundingClientRect();
      aimAtPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    };

    const isFormControl = (el: EventTarget | null): el is HTMLElement =>
      el instanceof HTMLElement && /^(input|select|textarea)$/i.test(el.tagName);

    const onPointerMove = (event: PointerEvent) => {
      if (Date.now() < state.pinUntil) return;
      aimAtPoint(event.clientX, event.clientY);
    };
    const onPointerDown = (event: PointerEvent) => {
      aimAtPoint(event.clientX, event.clientY);
      state.pinUntil = Date.now() + 1200;
    };
    const onFocusIn = (event: FocusEvent) => {
      if (!isFormControl(event.target)) return;
      aimAtElement(event.target);
      state.pinUntil = Date.now() + 10_000; // holds the field for as long as it has focus
    };
    const onFocusOut = () => {
      state.pinUntil = Date.now() + PIN_LINGER_MS;
    };
    const onFieldEvent = (event: Event) => {
      if (!isFormControl(event.target)) return;
      aimAtElement(event.target);
      state.pinUntil = Date.now() + PIN_TYPING_MS;
    };

    const loop = () => {
      state.x += (state.tx - state.x) * 0.16;
      state.y += (state.ty - state.y) * 0.16;
      host.style.setProperty('--gaze-x', `${state.x.toFixed(2)}px`);
      host.style.setProperty('--gaze-y', `${state.y.toFixed(2)}px`);
      state.raf = window.requestAnimationFrame(loop);
    };
    state.raf = window.requestAnimationFrame(loop);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('focusin', onFocusIn);
    window.addEventListener('focusout', onFocusOut);
    window.addEventListener('input', onFieldEvent, true);
    window.addEventListener('change', onFieldEvent, true);

    return () => {
      window.cancelAnimationFrame(state.raf);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('focusin', onFocusIn);
      window.removeEventListener('focusout', onFocusOut);
      window.removeEventListener('input', onFieldEvent, true);
      window.removeEventListener('change', onFieldEvent, true);
      host.style.removeProperty('--gaze-x');
      host.style.removeProperty('--gaze-y');
    };
  }, [reduce, dismissed]);

  // Section-aware guidance, once per section per session. Action messages win the cooldown.
  useEffect(() => {
    if (dismissed) return;
    const targets = Object.keys(SECTION_TIPS)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          if (seenSectionsRef.current.has(id)) continue;
          if (Date.now() < actionUntilRef.current) continue;
          seenSectionsRef.current.add(id);
          show(SECTION_TIPS[id], 6500);
        }
      },
      { rootMargin: '-35% 0px -35% 0px', threshold: 0 },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [dismissed, show]);

  // A quiet idle rotation keeps the corner alive without pestering.
  useEffect(() => {
    if (dismissed) return;
    let interval: number | null = null;
    const tick = () => {
      if (document.hidden) return;
      if (Date.now() < actionUntilRef.current) return;
      const tip = IDLE_TIPS[idleIndexRef.current % IDLE_TIPS.length];
      idleIndexRef.current += 1;
      show(tip, 6500);
    };
    const start = window.setTimeout(() => {
      tick();
      interval = window.setInterval(tick, IDLE_EVERY_MS);
    }, IDLE_AFTER_MS);
    return () => {
      window.clearTimeout(start);
      if (interval) window.clearInterval(interval);
    };
  }, [dismissed, show]);

  // Clean up any pending auto-hide.
  useEffect(
    () => () => {
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    },
    [],
  );

  const dismiss = () => {
    setDismissed(true);
    setBubbleVisible(false);
  };

  if (dismissed) return null;

  return (
    <aside ref={rootRef} className={`guide ${painted ? 'is-painted' : ''}`} aria-label="Route desk guide">
      <span
        ref={hostRef}
        className={`guide__avatar guide__watch${eyesShut ? ' is-eyes-shut' : ''}`}
        aria-hidden="true"
        onPointerEnter={() => {
          if (!reduce) controller.current?.play('greet');
        }}
      >
        <span className="guide__halo" />
        <span className="guide__spark guide__spark--one" />
        <span className="guide__spark guide__spark--two" />
        <Avatar
          ref={controller}
          definition={definition}
          size={88}
          ariaLabel="Route desk guide"
          {...(reduce
            ? { expression: 'neutral' as const, autoplay: false }
            : { defaultAnimation: 'idle' as const, autoplay: true })}
        />
        {/* Catch-light glints: HTML overlays on the ink pupils, gliding with
            the same gaze vector as the eyes so they stay centred. */}
        <span aria-hidden="true" className="guide__glint guide__glint--l" />
        <span aria-hidden="true" className="guide__glint guide__glint--l2" />
        <span aria-hidden="true" className="guide__glint guide__glint--r" />
        <span aria-hidden="true" className="guide__glint guide__glint--r2" />
        <svg className="guide__mouth" data-variant={mouth} viewBox="0 0 48 16" aria-hidden="true">
          <path className="m m-soft" d="M8 6 Q24 14 40 6" />
          <path className="m m-flat" d="M9 8 H39" />
          <path className="m m-smile" d="M5 4 Q24 17 43 4" />
          <path className="m m-frown" d="M5 12 Q24 0 43 12" />
          <path className="m m-worried" d="M5 9 q5 -6 9.5 0 t9.5 0 t9.5 0 t9.5 0" />
          <circle className="m m-o" cx="24" cy="8" r="4" />
        </svg>
      </span>

      <div className={`guide__bubble ${bubbleVisible ? 'is-visible' : ''}`} role="status" aria-live="polite">
        <button type="button" className="guide__close" onClick={dismiss} aria-label="Dismiss the guide">
          <CloseIcon className="guide__close-icon" />
        </button>
        {message && <p className="guide__text">{message.text}</p>}
        {message?.cta && (
          <a
            className="text-link guide__cta"
            href={`#${message.cta.targetId}`}
            onClick={(event) => {
              event.preventDefault();
              transitionToId(message.cta!.targetId);
            }}
          >
            {message.cta.label}
            <ArrowRight className="text-link__icon" />
          </a>
        )}
      </div>
    </aside>
  );
}
