import { MeridianMark } from './Icons';
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
      <div className="wrap">
        <div className="footer__cta">
          <span className="eyebrow eyebrow--light" data-reveal>
            <span className="eyebrow__num">08</span> Next step
          </span>
          <h2>
            Every route,
            <br />
            <em>accounted for.</em>
          </h2>
          <button className="btn btn--primary" type="button" onClick={go('contact')} data-reveal data-reveal-delay={0.1}>
            Start a quote
          </button>
        </div>

        <div className="footer__top">
          <div className="footer__brand">
            <a className="brand" href="#top" onClick={go('top')} aria-label="Meridian home">
              <MeridianMark className="brand__mark" />
              <span className="brand__text">
                <span className="brand__name">Meridian</span>
                <span className="brand__sub">Freight &amp; trade</span>
              </span>
            </a>
            <p>Freight forwarding and trade management across 140+ countries.</p>
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
            <span className="label">Registration</span>
            <p>Numbers available on request.</p>
          </div>
        </div>

        <div className="footer__wordmark" aria-hidden="true">
          <span>Meridian</span>
        </div>

        <div className="footer__legal">
          <span>© {new Date().getFullYear()} Meridian Freight B.V.</span>
          <span>FIATA · IATA · Customs broker (EU)</span>
          <a href="#top" onClick={go('top')}>Back to top ↑</a>
        </div>
        <p className="footer__credits">Photographs via Pexels. Map data: Natural Earth.</p>
      </div>
    </footer>
  );
}
