import { MeridianMark, ArrowRight } from './Icons';
import { transitionToId } from '../lib/motion';

const columns = [
  {
    title: 'Navigate',
    links: [
      { href: 'routes', label: 'Route desk' },
      { href: 'services', label: 'Services' },
      { href: 'network', label: 'Network' },
      { href: 'faq', label: 'Questions' },
    ],
  },
  {
    title: 'Capability',
    links: [
      { href: 'services', label: 'Ocean freight' },
      { href: 'services', label: 'Air & expedited' },
      { href: 'services', label: 'Trade compliance' },
      { href: 'contact', label: 'Become a partner' },
    ],
  },
];

export default function Footer() {
  const go = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    if (id === 'top') window.__meridianScrollTop?.();
    else transitionToId(id);
  };

  return (
    <footer className="footer">
      <section className="footer__cta" aria-labelledby="footer-cta-title">
        <img
          className="footer__cta-media"
          src="/images/air-freight.jpg"
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
        <div className="footer__cta-scrim" aria-hidden="true" />
        <div className="footer__cta-inner">
          <span className="eyebrow eyebrow--light footer__cta-eyebrow" data-reveal>
            <span className="eyebrow__num">08</span> Next step
          </span>
          <h2 id="footer-cta-title" data-reveal data-reveal-delay={0.05}>
            One lane. One contract.
            <br />
            <em>Zero surprises.</em>
          </h2>
          <p className="footer__cta-copy" data-reveal data-reveal-delay={0.1}>
            Tell us your lane and you'll have a written quote within one business day.
          </p>
          <a className="btn btn--primary footer__cta-btn" href="#contact" onClick={go('contact')} data-reveal data-reveal-delay={0.15}>
            <span>Request a quote</span>
            <ArrowRight className="btn__arrow" />
          </a>
        </div>
      </section>

      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <a className="brand" href="#top" onClick={go('top')} aria-label="Meridian home">
              <MeridianMark className="brand__mark" />
              <span className="brand__text">
                <span className="brand__name">Meridian</span>
                <span className="brand__sub">Freight &amp; trade</span>
              </span>
            </a>
            <p>Freight forwarding and trade management worldwide.</p>
          </div>

          {columns.map((column) => (
            <nav className="footer__links" aria-label={column.title} key={column.title}>
              <span className="label">{column.title}</span>
              {column.links.map((link) => (
                <a key={`${column.title}-${link.label}`} href={`#${link.href}`} onClick={go(link.href)}>
                  {link.label}
                </a>
              ))}
            </nav>
          ))}

          <div className="footer__contact">
            <span className="label">Office</span>
            <p>Waalhaven<br />Rotterdam, NL</p>
            <span className="label">Credentials</span>
            <p>FIATA · IATA<br />Customs broker (EU)</p>
          </div>
        </div>

        <div className="footer__wordmark" aria-hidden="true">
          <svg className="footer__wordmark-svg" viewBox="0 0 1440 312" role="presentation" focusable="false">
            <text x="0" y="304" textLength="1440" lengthAdjust="spacing">Meridian</text>
          </svg>
        </div>
      </div>
    </footer>
  );
}
