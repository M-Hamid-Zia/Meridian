import { useEffect, useRef, useCallback } from 'react';
import { gsap, isFinePointer, prefersReducedMotion } from '../lib/motion';

export type CursorMode = 'default' | 'link' | 'drag' | 'view';

const LABELS: Record<Exclude<CursorMode, 'default'>, string> = {
  link: 'Go',
  drag: 'Drag',
  view: 'View',
};

/**
 * A custom cursor: a small gold ring with a soft lag, a central dot that tracks
 * the pointer exactly, and a label bubble that appears over deck rows, the
 * horizontal gallery and other interactive surfaces.
 */
export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const state = useRef({ x: 0, y: 0, rx: 0, ry: 0, mode: 'default' as CursorMode, shown: false });

  const setMode = useCallback((mode: CursorMode) => {
    if (state.current.mode === mode) return;
    state.current.mode = mode;
    const root = ringRef.current?.parentElement;
    if (!root) return;
    root.dataset.cursor = mode;
    const label = labelRef.current;
    if (label) {
      label.textContent = mode === 'default' ? '' : LABELS[mode];
    }
  }, []);

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    const root = ringRef.current?.parentElement;
    if (!root) return;
    root.dataset.cursorEnabled = 'true';

    const onMove = (event: PointerEvent) => {
      state.current.x = event.clientX;
      state.current.y = event.clientY;
      if (!state.current.shown) {
        state.current.shown = true;
        state.current.rx = event.clientX;
        state.current.ry = event.clientY;
        root.classList.add('is-visible');
      }
      const target = event.target as HTMLElement | null;
      const zone = target?.closest<HTMLElement>('[data-cursor]');
      const mode = (zone?.dataset.cursor as CursorMode | undefined) ?? 'default';
      const isLink = !zone && target?.closest('a, button, [role="button"], label');
      setMode(isLink ? 'link' : mode);
    };

    const onLeave = () => {
      state.current.shown = false;
      root.classList.remove('is-visible');
    };
    const onDown = () => root.classList.add('is-down');
    const onUp = () => root.classList.remove('is-down');

    const tick = () => {
      const s = state.current;
      s.rx += (s.x - s.rx) * 0.16;
      s.ry += (s.y - s.ry) * 0.16;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${s.rx}px, ${s.ry}px, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };
    let frame = requestAnimationFrame(tick);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      root.dataset.cursorEnabled = 'false';
      gsap.killTweensOf(root);
    };
  }, [setMode]);

  return (
    <div className="cursor" data-cursor="default" aria-hidden="true">
      <div className="cursor__ring" ref={ringRef}>
        <div className="cursor__label" ref={labelRef} />
      </div>
      <div className="cursor__dot" ref={dotRef} />
    </div>
  );
}
