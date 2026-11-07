import { useEffect, useState } from 'react';
import { ArrowUp } from './Icons';
import { prefersReducedMotion } from '../lib/motion';

/**
 * Floating back-to-top control pinned to the bottom-right corner.
 * Appears once the visitor has scrolled past the hero; offset above the
 * sticky action bar on small screens.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setVisible(window.scrollY > Math.min(window.innerHeight * 0.6, 560));
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const backToTop = () => {
    if (window.__meridianScrollTop) {
      window.__meridianScrollTop();
      return;
    }
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      className={`back-top${visible ? ' is-visible' : ''}`}
      onClick={backToTop}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp className="back-top__icon" />
    </button>
  );
}
