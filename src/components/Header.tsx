import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CloseIcon, MenuIcon, MeridianMark } from './Icons';
import { scrollToId } from '../lib/motion';

const links = [
  { href: 'routes', label: 'Route desk', num: '01' },
  { href: 'services', label: 'Services', num: '02' },
  { href: 'network', label: 'Network', num: '03' },
  { href: 'contact', label: 'Contact', num: '04' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    if (open) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('menu-open');
    } else {
      document.body.style.overflow = previous;
      document.body.classList.remove('menu-open');
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (!open) return;
      document.body.style.overflow = previous;
      document.body.classList.remove('menu-open');
    };
  }, [open]);

  const go = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    setOpen(false);
    window.setTimeout(() => scrollToId(id), open ? 260 : 0);
  };

  return (
    <>
      <header className={`nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
        <div className="nav__inner">
          <a className="brand" href="#top" aria-label="Meridian home" onClick={go('top')}>
            <MeridianMark className="brand__mark" />
            <span className="brand__text">
              <span className="brand__name">Meridian</span>
              <span className="brand__sub">Freight &amp; trade</span>
            </span>
          </a>

          <nav className="nav__links" aria-label="Primary">
            {links.map((link) => (
              <a key={link.href} href={`#${link.href}`} className="nav__link" onClick={go(link.href)}>
                <span className="nav__link-inner">
                  <span>{link.label}</span>
                  <span aria-hidden="true">{link.label}</span>
                </span>
              </a>
            ))}
          </nav>

          <div className="nav__actions">
            <a className="nav__tel" href="tel:+3110000000">+31 10 000 000</a>
            <button className="btn btn--primary nav__cta" type="button" onClick={go('contact')}>
              Request a quote
              <ArrowRight className="btn__arrow" />
            </button>
            <button
              className="nav__menu-btn"
              type="button"
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((value) => !value)}
            >
              <MenuIcon className="icon-24" />
            </button>
          </div>
        </div>
        <span className="nav__progress" aria-hidden="true" ref={progressRef} />
      </header>

      <div
        className={`menu${open ? ' is-open' : ''}`}
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
      >
        <div className="menu__inner" ref={panelRef}>
          <div className="menu__head">
            <span className="label">Navigate</span>
            <button type="button" className="menu__close" onClick={() => setOpen(false)} aria-label="Close menu">
              <CloseIcon className="icon-24" />
            </button>
          </div>

          <nav className="menu__links" aria-label="Site">
            {links.map((link) => (
              <a key={link.href} href={`#${link.href}`} onClick={go(link.href)} tabIndex={open ? 0 : -1}>
                <span className="menu__num">{link.num}</span>
                <span className="menu__label">{link.label}</span>
                <ArrowRight className="menu__arrow" />
              </a>
            ))}
          </nav>

          <div className="menu__foot">
            <div>
              <span className="label">Route desk</span>
              <p>Waalhaven, Rotterdam<br />Answering within 4 hours</p>
            </div>
            <button className="btn btn--primary" type="button" onClick={go('contact')} tabIndex={open ? 0 : -1}>
              Request a quote
              <ArrowRight className="btn__arrow" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
