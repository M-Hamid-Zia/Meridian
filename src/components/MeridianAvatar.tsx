import { useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react';
import { Avatar, type AvatarController } from '@bible-strong/avatar-react';
import type { AvatarDefinition } from '@bible-strong/avatar-core';
import avatarJson from '../avatar.json';
import { prefersReducedMotion } from '../lib/motion';

const definition = avatarJson as unknown as AvatarDefinition;

type Props = {
  size?: number;
  className?: string;
  /** Animation to start with. Ignored when the user prefers reduced motion. */
  animation?: 'idle' | 'greet' | 'think';
  ref?: Ref<AvatarController>;
};

/**
 * The route-desk companion.
 *
 * Notes:
 *  - The runtime paints in a `-150 … 150` user space, so `src/avatar.json` is
 *    generated at that scale by `npm run build:avatar`.
 *  - Under `prefers-reduced-motion` the avatar is not frozen: it renders a calm
 *    static expression instead of looping, so the character still reads.
 *  - The runtime renders empty `<path>` elements for the first frame, which
 *    paints a solid gold disc with no eyes. The wrapper therefore stays hidden
 *    until the face has actually been drawn.
 */
export default function MeridianAvatar({ size = 64, className = '', animation = 'idle', ref }: Props) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const controller = useRef<AvatarController | null>(null);
  const [painted, setPainted] = useState(false);

  useImperativeHandle(ref, () => controller.current as AvatarController, []);

  const reduce = typeof window !== 'undefined' ? prefersReducedMotion() : false;

  // Reveal only once the eye paths exist.
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
      else setPainted(true); // never leave a hole in the layout
    };
    frame = requestAnimationFrame(check);
    return () => cancelAnimationFrame(frame);
  }, []);

  const greet = () => {
    if (reduce) return;
    controller.current?.play('greet');
  };

  return (
    <span
      ref={hostRef}
      className={`avatar ${painted ? 'is-painted' : ''} ${className}`.trim()}
      style={{ width: size, height: size }}
      onPointerEnter={greet}
      onFocus={greet}
    >
      <span className="avatar__glow" aria-hidden="true" />
      <Avatar
        ref={controller}
        definition={definition}
        size={size}
        ariaLabel="Meridian route desk assistant"
        {...(reduce
          ? { expression: 'neutral' as const, autoplay: false }
          : { defaultAnimation: animation, autoplay: true })}
      />
    </span>
  );
}
