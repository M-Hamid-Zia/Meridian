import { MeridianMark } from './Icons';

const links = [
  { href: '#services', label: 'Services' },
  { href: '#network', label: 'Network' },
  { href: '#routes', label: 'Route selector' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <a className="brand brand--footer" href="#top" aria-label="Meridian home">
              <MeridianMark className="brand__mark" />
              <span className="brand__name">Meridian</span>
            </a>
            <p>Freight forwarding and trade management across 140+ countries.</p>
          </div>

          <nav className="footer__links" aria-label="Footer">
            <span className="label">Navigate</span>
            {links.map((link) => (
              <a key={link.href} href={link.href}>{link.label}</a>
            ))}
          </nav>

          <div className="footer__contact">
            <span className="label">Office</span>
            <p>Waalhaven<br />Rotterdam</p>
            <span className="label">Credentials</span>
            <p>FIATA · IATA<br />Customs broker (EU)</p>
            <span className="label">Registration</span>
            <p>Numbers available on request.</p>
          </div>
        </div>

        <div className="footer__wordmark" aria-hidden="true">
          <span>Meridian</span>
          <i className="gold-dot" />
        </div>

        <div className="footer__legal">
          <span>© {new Date().getFullYear()} Meridian Freight B.V.</span>
          <span>FIATA · IATA · Customs broker (EU)</span>
          <span>Registration numbers available on request.</span>
          <a href="#top">Back to top ↑</a>
        </div>
        <p className="footer__credits">Photographs via Pexels. Map data: Natural Earth.</p>
      </div>
    </footer>
  );
}
