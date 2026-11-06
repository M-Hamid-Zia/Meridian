import { Avatar } from '@bible-strong/avatar-react';
import type { AvatarDefinition } from '@bible-strong/avatar-core';
import avatarJson from '../avatar.json';
import { prefersReducedMotion } from '../lib/motion';

const definition = avatarJson as unknown as AvatarDefinition;

type Props = {
  size?: number;
  className?: string;
  /** Fires when the avatar has been mounted and its first frame is painted. */
  onReady?: () => void;
};

/**
 * The route-desk companion. The avatar runtime paints in a -150..150 user space,
 * so the shipped definition is drawn at that scale (regenerate with `node scripts/build-avatar.mjs`).
 */
export default function MeridianAvatar({ size = 64, className = '', onReady }: Props) {
  const reduce = typeof window !== 'undefined' ? prefersReducedMotion() : false;

  return (
    <span className={`avatar ${className}`.trim()} style={{ width: size, height: size }} onAnimationEnd={onReady}>
      <span className="avatar__glow" aria-hidden="true" />
      <Avatar
        definition={definition}
        size={size}
        autoplay={!reduce}
        ariaLabel="Meridian route desk avatar"
        {...(reduce ? { defaultExpression: 'neutral' as const } : { defaultAnimation: 'idle' as const })}
      />
    </span>
  );
}
