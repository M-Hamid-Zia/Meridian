import { Avatar } from '@bible-strong/avatar-react';
import type { AvatarDefinition } from '@bible-strong/avatar-core';
import avatarJson from '../avatar.json';

const definition = avatarJson as unknown as AvatarDefinition;

export default function MeridianAvatar({ size = 64 }: { size?: number }) {
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <Avatar
      definition={definition}
      size={size}
      ariaLabel="Meridian route desk avatar"
      className="route-desk-avatar"
      {...(reduce ? { defaultExpression: 'neutral' } : { defaultAnimation: 'idle' })}
    />
  );
}
