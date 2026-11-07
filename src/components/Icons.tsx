type IconProps = { className?: string };

export function MeridianMark({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="13.25" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="16" cy="16" rx="6.1" ry="13.25" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.75 16h26.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.2 9.2h21.6M5.2 22.8h21.6" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="16" cy="16" r="2.1" fill="currentColor" />
    </svg>
  );
}

export function ArrowRight({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 10h13M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowUp({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 17V4M5 9l5-5 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ShipIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3.5 13.5h17l-2.2 5.2a2 2 0 0 1-1.8 1.2H7.5a2 2 0 0 1-1.8-1.2l-2.2-5.2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M6 13.5V8.2h12v5.3M9.5 8.2V5.5h5v2.7M12 3v2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 20.5c1.2 0 1.2-1 2.4-1s1.2 1 2.4 1 1.2-1 2.4-1 1.2 1 2.4 1 1.2-1 2.4-1 1.2 1 2.4 1 1.2-1 2.4-1 1.2 1 2.4 1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export function PlaneIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10.2 13.8 3 11.4l1.2-1.2 6.1.7 3.5-3.5-6.2-3.2 1.5-1.5 8.3 2.2 2.2 8.3-1.5 1.5-3.2-6.2-3.5 3.5.7 6.1-1.2 1.2-2.4-7.2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export function TrainIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="3.5" width="14" height="13" rx="3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 10h14M8.5 20l2-3.5M15.5 20l-2-3.5M8 13.5h.01M16 13.5h.01" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function TruckIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2.5 6.5h11v10h-11zM13.5 10h4l3 3v3.5h-7" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="6.5" cy="18" r="1.8" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="17" cy="18" r="1.8" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function PlusIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function MinusIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 10h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function MenuIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 5 14 14M19 5 5 19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function ModeIcon({ mode, className = '' }: { mode: string; className?: string }) {
  if (mode === 'Air') return <PlaneIcon className={className} />;
  if (mode === 'Rail') return <TrainIcon className={className} />;
  if (mode === 'Road') return <TruckIcon className={className} />;
  return <ShipIcon className={className} />;
}
