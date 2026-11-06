import { useEffect, useState } from 'react';
import { ArrowRight, CloseIcon, MenuIcon, MeridianMark } from './Icons';

const links = [
  { href: '#services', label: 'Services' },
  { href: '#network', label: 'Network' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className="nav">
      <div className="wrap nav__wrap">
        <a className="brand" href="#top" aria-label="Meridian home">
          <MeridianMark className="brand__mark" />
          <span className="brand__name">Meridian</span>
          <span className="brand__sub">Freight &amp; trade</span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="nav__link">{link.label}</a>
          ))}
        </nav>

        <div className="nav__actions">
          <a className="btn btn--primary nav__cta" href="#contact">
            Request a Quote
            <ArrowRight className="btn__arrow" />
          </a>
          <button
            className="nav__menu-btn"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon className="icon-24" /> : <MenuIcon className="icon-24" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="mobile-menu__head">
            <span className="label">Menu</span>
            <button type="button" className="mobile-menu__close" onClick={() => setOpen(false)} aria-label="Close menu">
              <CloseIcon className="icon-24" />
            </button>
          </div>
          <nav className="mobile-menu__links" aria-label="Mobile">
            {links.map((link, index) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                <span className="mobile-menu__num">0{index + 1}</span>
                <span>{link.label}</span>
              </a>
            ))}
          </nav>
          <div className="mobile-menu__foot">
            <p>140+ countries. Sea, air and land under one contract.</p>
            <a className="btn btn--primary btn--block" href="#contact" onClick={() => setOpen(false)}>
              Request a Quote
              <ArrowRight className="btn__arrow" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
