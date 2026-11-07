import { useRef, useState } from 'react';
import { ArrowRight } from './Icons';

type Props = {
  onSelectService: () => void;
};

const services: {
  number: string;
  mode: string;
  title: string;
  body: string;
  proof: string;
  metric: string;
  metricLabel: string;
  image: string;
}[] = [
  {
    number: '01',
    mode: 'Ocean',
    title: 'Ocean Freight',
    body: 'FCL and LCL with 40+ carrier contracts. We book the sailing, pre-clear the documents and keep the container moving.',
    proof: 'Average 2.3-day customs clearance across EU ports.',
    metric: '2.3',
    metricLabel: 'days clearance',
    image: '/images/services-ocean.jpg',
  },
  {
    number: '02',
    mode: 'Air',
    title: 'Air & Expedited',
    body: 'Time-critical cargo and charter capability. We book the uplift, screen the shipment and hand it to a named specialist at the other end.',
    proof: 'Wheel-to-wheel in under 48 hours on 12 major corridors.',
    metric: '48',
    metricLabel: 'hours door-to-door',
    image: '/images/services-air.jpg',
  },
  {
    number: '03',
    mode: 'Customs',
    title: 'Trade Compliance',
    body: 'Brokerage, documentation and tariff advisory. We classify the goods, check the preference and keep the file audit-ready.',
    proof: 'Zero penalty events across 2.1M filings.',
    metric: '0',
    metricLabel: 'penalty events',
    image: '/images/services-customs.jpg',
  },
];

export default function Services({ onSelectService }: Props) {
  const [active, setActive] = useState(0);

  return (
    <section className="section services" id="services">
      <div className="wrap">
        <div className="section-head">
          <div className="section-head__title">
            <span className="eyebrow" data-reveal>
              <span className="eyebrow__num">02</span> Services
            </span>
            <h2 data-reveal data-reveal-delay={0.05}>
              <span className="accent">Three ways</span> we move freight<span className="accent">.</span>
            </h2>
          </div>
          <div className="section-head__intro" data-reveal data-reveal-delay={0.12}>
            <p>
              Ocean, air and customs under one contract. No handoffs between providers who never speak.
            </p>
          </div>
        </div>

        <div className="deck">
          <div className="deck__list">
            {services.map((service, index) => (
              <article
                className={`deck__row${active === index ? ' is-active' : ''}`}
                key={service.title}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                data-reveal
                data-reveal-delay={index * 0.05}
              >
                <button
                  className="deck__trigger"
                  type="button"
                  onClick={onSelectService}
                  aria-label={`${service.title}: request a quote`}
                >
                  <span className="deck__num">{service.number}</span>
                  <span className="deck__title">{service.title}</span>
                  <span className="deck__mode">{service.mode}</span>
                  <span className="deck__metric">
                    <strong>{service.metric}</strong>
                    <em>{service.metricLabel}</em>
                  </span>
                  <span className="deck__arrow">
                    <ArrowRight className="icon-20" />
                  </span>
                </button>
                <div className="deck__detail">
                  <p>{service.body}</p>
                  <span className="deck__proof">{service.proof}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="deck__frame" aria-hidden="true">
            <div className="deck__echo" aria-hidden="true" />
            <div className="deck__arch">
              {services.map((service, index) => (
                <figure className={`deck__image${active === index ? ' is-active' : ''}`} key={service.title}>
                  <img src={service.image} alt="" loading="lazy" decoding="async" />
                </figure>
              ))}
            </div>
            <div className="deck__caption">
              <span className="label label--gold">Capability</span>
              <span className="deck__caption-loc">{services[active].title}</span>
              <span className="deck__caption-est">{services[active].number} / 03</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
