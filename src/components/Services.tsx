import type { CargoId } from '../data/routes';
import { ArrowRight } from './Icons';

type Props = {
  onSelectService: (cargo: CargoId) => void;
};

const services: {
  number: string;
  mode: string;
  title: string;
  body: string;
  proof: string;
  cargo: CargoId;
}[] = [
  {
    number: '01',
    mode: 'Ocean',
    title: 'Ocean Freight',
    body: 'FCL and LCL freight with 40+ carrier contracts. We book the sailing, pre-clear the documents and keep the container moving.',
    proof: 'Average 2.3-day customs clearance across EU ports.',
    cargo: 'general',
  },
  {
    number: '02',
    mode: 'Air',
    title: 'Air Freight & Expedited',
    body: 'Time-critical cargo and charter capability. We book the uplift, screen the shipment and hand it to a named specialist at the other end.',
    proof: 'Wheel-to-wheel in under 48 hours on 12 major corridors.',
    cargo: 'high-value',
  },
  {
    number: '03',
    mode: 'Customs',
    title: 'Trade Compliance & Customs',
    body: 'Brokerage, documentation and tariff advisory. We classify the goods, check the preference and keep the file audit-ready.',
    proof: 'Zero penalty events across 2.1M filings.',
    cargo: 'general',
  },
];

export default function Services({ onSelectService }: Props) {
  return (
    <section className="section services" id="services">
      <div className="wrap">
        <div className="section-head">
          <div className="section-head__title">
            <span className="eyebrow">02 / Services</span>
            <h2>Three ways we move freight.</h2>
          </div>
          <div className="section-head__intro">
            <p>Ocean, air and customs are one contract, one team and one set of documents. No handoffs between providers who never speak.</p>
          </div>
        </div>

        <div className="services-photo">
          <img
            src="/images/services-warehouse.webp"
            srcSet="/images/services-warehouse-700.webp 700w, /images/services-warehouse.webp 1200w"
            sizes="(max-width: 640px) 100vw, 1280px"
            alt="Pallets and organised racking inside a Meridian warehouse"
            width="1200"
            height="675"
            loading="lazy"
            decoding="async"
          />
          <div className="services-photo__index">01 — 03</div>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <article className="service card" key={service.title}>
              <div className="service__top">
                <span className="service__num">{service.number}</span>
                <span className="service__mode">{service.mode}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
              <div className="service__proof">
                <span className="service__proof-label">Proof point</span>
                <span>{service.proof}</span>
              </div>
              <button className="link link--button" type="button" onClick={() => onSelectService(service.cargo)}>
                Check this lane
                <ArrowRight className="link__arrow" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
