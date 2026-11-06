import { useEffect, useRef, useState } from 'react';
import { Avatar, type AvatarController } from '@bible-strong/avatar-react';
import type { AvatarDefinition } from '@bible-strong/avatar-core';
import avatarJson from '../avatar.json';

const definition = avatarJson as unknown as AvatarDefinition;
const HIDE_SELECTOR = 'input, textarea, select, .quote-form, .nav, .mobile-menu, .actionbar, .footer';

export default function CursorAvatar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<AvatarController>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const visibleRef = useRef(false);
  const activeRef = useRef(false);
  const hiddenRef = useRef(false);
  const frameRef = useRef<number | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onScroll = () => {
      const next = window.scrollY > window.innerHeight * 0.55;
      activeRef.current = next;
      setActive((value) => (value === next ? value : next));
      if (!next) {
        visibleRef.current = false;
        setVisible(false);
      }
    };

    const onMove = (event: MouseEvent) => {
      target.current = { x: event.clientX, y: event.clientY };
      const element = event.target as HTMLElement | null;
      const hide = Boolean(element?.closest(HIDE_SELECTOR));
      if (hide !== hiddenRef.current) {
        hiddenRef.current = hide;
        setHidden(hide);
      }
      const isActive = window.scrollY > window.innerHeight * 0.55;
      if (isActive !== activeRef.current) {
        activeRef.current = isActive;
        setActive(isActive);
      }
      if (!isActive) return;
      if (!visibleRef.current) {
        visibleRef.current = true;
        current.current = { x: event.clientX, y: event.clientY };
        setVisible(true);
      }
    };

    const onLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };

    const onDown = () => {
      avatarRef.current?.play('greet');
    };

    const onOver = (event: MouseEvent) => {
      const element = event.target as HTMLElement | null;
      if (element?.closest('a, button, [role="button"]')) {
        avatarRef.current?.play('greet');
      }
    };

    const onOut = (event: MouseEvent) => {
      const element = event.target as HTMLElement | null;
      if (element?.closest('a, button, [role="button"]')) {
        avatarRef.current?.play('idle');
      }
    };

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.16;
      current.current.y += (target.current.y - current.current.y) * 0.16;
      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${current.current.x + 18}px, ${current.current.y + 18}px, 0)`;
      }
      frameRef.current = requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseout', onOut, { passive: true });
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={containerRef}
      className={`cursor-avatar${active ? ' is-active' : ''}${visible ? ' is-visible' : ''}`}
      style={{ opacity: active && visible && !hidden ? 0.94 : 0 }}
      aria-hidden="true"
      data-cursor-avatar
    >
      <Avatar
        ref={avatarRef}
        definition={definition}
        defaultAnimation="idle"
        size={36}
        ariaLabel="Meridian route desk avatar"
      />
    </div>
  );
}
