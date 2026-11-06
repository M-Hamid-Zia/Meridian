import { useState } from 'react';
import type { QuotePrefill } from '../App';
import { ArrowRight } from './Icons';

type Props = {
  onRequestQuote: (prefill: Omit<QuotePrefill, 'nonce'>) => void;
};

export default function CaseStudy({ onRequestQuote }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="section case-study" id="case-study">
      <div className="wrap">
        <div className="case-study__head">
          <span className="eyebrow eyebrow--light" data-reveal>
            <span className="eyebrow__num">03</span> Case study
          </span>
          <h2 data-reveal data-reveal-delay={0.05}>
            Nine days back in the supply chain<span className="accent">.</span>
          </h2>
          <p className="case-study__sub" data-reveal data-reveal-delay={0.12}>
            Rotterdam → Chicago. A Tier-1 automotive parts supplier, a lane that had quietly drifted,
            and the three changes that fixed it.
          </p>
        </div>

        <div className="case-study__grid">
          <div className="case-study__photo" data-reveal="mask">
            <img
              src="/images/case-port.webp"
              alt="Container cranes and a cargo ship at a deep-water port"
              width="500"
              height="625"
              loading="lazy"
              decoding="async"
              data-parallax="10"
            />
            <div className="case-study__photo-tag">
              <span className="label label--gold">Lane</span>
              <span>Rotterdam → Chicago</span>
            </div>
          </div>

          <div className="case-study__text">
            <div className="case-study__body" data-reveal>
              <p className="case-study__lede">
                The lane was 34 days door-to-door, with customs holds adding three to five days at
                random. The supplier&rsquo;s line-side buffer was carrying the cost.
              </p>
              <p>
                Meridian moved the lane to a weekly FCL sailing, pre-cleared the entry before arrival
                and added a rail leg from New York to Chicago. One specialist owned the file from
                booking to delivery.
              </p>
            </div>

            <div className="case-study__numbers">
              <div data-reveal data-reveal-delay={0.02}>
                <strong data-count="9">9</strong>
                <span>Days saved door-to-door</span>
              </div>
              <div data-reveal data-reveal-delay={0.08}>
                <strong data-count="2.3">2.3</strong>
                <span>Days average customs clearance</span>
              </div>
              <div data-reveal data-reveal-delay={0.14}>
                <strong data-count="99.2%">99.2%</strong>
                <span>On-time delivery</span>
              </div>
            </div>

            <div className={`case-study__more${expanded ? ' is-open' : ''}`} id="case-study-more">
              <div className="case-study__more-inner">
                <p>
                  The first change was the sailing: a fixed weekly FCL allocation instead of spot
                  bookings. The second was the entry: documents were filed four days before vessel
                  arrival, so the container moved from discharge to rail without a customs queue. The
                  third was the handoff: a named specialist in Rotterdam and a named specialist in
                  Chicago shared one file, one status page and one escalation number.
                </p>
                <p>
                  The supplier kept its existing Incoterms and its customs broker of record. Meridian
                  ran the booking, the pre-clearance and the inland leg. The result was a 9-day
                  reduction in door-to-door transit and a 2.3-day average customs clearance across the
                  first 120 containers.
                </p>
              </div>
            </div>

            <blockquote className="case-study__quote" data-reveal>
              <p>
                We stopped treating the lane as a black box. Meridian gave us one plan, one owner and a
                number we could hold them to.
              </p>
              <footer>
                Head of Supply Chain, Tier-1 automotive supplier
                <span>Name withheld under NDA.</span>
              </footer>
            </blockquote>

            <div className="case-study__actions" data-reveal>
              <button
                className="btn btn--primary"
                type="button"
                onClick={() =>
                  onRequestQuote({
                    origin: 'Europe',
                    destination: 'North America',
                    cargo: 'Automotive parts',
                    note: 'Rotterdam → Chicago · automotive parts · request a similar assessment',
                  })
                }
              >
                Request a similar assessment
                <ArrowRight className="btn__arrow" />
              </button>
              <button
                className="btn btn--ghost btn--ghost-light"
                type="button"
                aria-expanded={expanded}
                aria-controls="case-study-more"
                onClick={() => setExpanded((value) => !value)}
              >
                {expanded ? 'Close the case study' : 'Read the full story'}
                <ArrowRight className={`btn__arrow${expanded ? ' is-up' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
