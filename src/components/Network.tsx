import { ports } from '../data/mapData';
import WorldMap from './WorldMap';

const offices = ports.filter((port) => port.type === 'office');

export default function Network() {
  return (
    <section className="section network" id="network">
      <div className="wrap">
        <div className="section-head">
          <div className="section-head__title">
            <span className="eyebrow">04 / Network</span>
            <h2>The Meridian network.</h2>
          </div>
          <div className="section-head__intro">
            <p>Owned offices in the ports that matter, partner agents in the ports that do not. One contract covers both.</p>
          </div>
        </div>

        <div className="network__statement">
          <p>12 owned offices. 60+ partner agents. <em>One accountable contract.</em></p>
        </div>

        <div className="network__grid">
          <div className="network__copy">
            <p className="network__lead">
              We do not hand a shipment to a stranger at the other end. The office that quotes the lane owns the file, and the partner agent works to our document and our escalation path.
            </p>
            <div className="office-list">
              {offices.map((office) => (
                <div className="office-list__item" key={office.id}>
                  <div>
                    <strong>{office.name}</strong>
                    <span>{office.country}</span>
                  </div>
                  <span className="office-list__type">Owned</span>
                </div>
              ))}
            </div>
            <p className="micro-note">Hover a pin on the map for the hub name. Partner ports are shown as small dots.</p>
            <a className="btn btn--primary network__cta" href="#contact">
              Request a Quote
              <span className="link__arrow">→</span>
            </a>
          </div>

          <div className="network__map">
            <WorldMap variant="network" />
          </div>
        </div>
      </div>
    </section>
  );
}
