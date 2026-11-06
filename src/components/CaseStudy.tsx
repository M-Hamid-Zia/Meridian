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
        <div className="case-study__grid">
          <div className="case-study__text">
            <span className="eyebrow eyebrow--light">03 / Case study</span>
            <h2>How a Tier-1 parts supplier cut Rotterdam–Chicago transit by 9 days.</h2>

            <div className="case-study__body">
              <p>
                The lane was 34 days door-to-door, with customs holds adding 3–5 days at random. The supplier's line-side buffer was carrying the cost.
              </p>
              <p>
                Meridian moved the lane to a weekly FCL sailing, pre-cleared the entry before arrival and added a rail leg from New York to Chicago. One specialist owned the file from booking to delivery.
              </p>
              <p>
                Transit fell to 25 days. Customs clearance averaged 2.3 days. The supplier cut its buffer by 9 days and took the same volume without adding a second forwarder.
              </p>
            </div>

            <div className={`case-study__more${expanded ? ' is-open' : ''}`} id="case-study-more">
              <div className="case-study__more-inner">
                <p>
                  The first change was the sailing: a fixed weekly FCL allocation instead of spot bookings. The second was the entry: documents were filed four days before vessel arrival, so the container moved from discharge to rail without a customs queue. The third was the handoff: a named specialist in Rotterdam and a named specialist in Chicago shared one file, one status page and one escalation number.
                </p>
                <p>
                  The supplier kept its existing Incoterms and its existing customs broker of record. Meridian ran the booking, the pre-clearance and the inland leg. The result was a 9-day reduction in door-to-door transit and a 2.3-day average customs clearance across the first 120 containers.
                </p>
              </div>
            </div>

            <div className="case-study__numbers">
              <div><strong>9</strong><span>days saved door-to-door</span></div>
              <div><strong>2.3</strong><span>days average customs clearance</span></div>
              <div><strong>99.2%</strong><span>on-time delivery</span></div>
            </div>

            <blockquote className="case-study__quote">
              <p>“We stopped treating the lane as a black box. Meridian gave us one plan, one owner and a number we could hold them to.”</p>
              <footer>Head of Supply Chain, Tier-1 automotive supplier <span>Name withheld under NDA.</span></footer>
            </blockquote>

            <div className="case-study__actions">
              <button
                className="btn btn--primary"
                type="button"
                onClick={() => onRequestQuote({
                  origin: 'Europe',
                  destination: 'North America',
                  cargo: 'Automotive parts',
                  note: 'Rotterdam → Chicago · automotive parts · request a similar assessment',
                })}
              >
                Request a similar assessment
                <ArrowRight className="btn__arrow" />
              </button>
              <button
                className="link link--button"
                type="button"
                aria-expanded={expanded}
                aria-controls="case-study-more"
                onClick={() => setExpanded((value) => !value)}
              >
                {expanded ? 'Close the case study' : 'Read the full case study'}
                <ArrowRight className={`link__arrow${expanded ? ' is-up' : ''}`} />
              </button>
            </div>
          </div>

          <div className="case-study__photo">
            <img
              src="/images/case-port.webp"
              alt="Container cranes and a cargo ship at a deep-water port"
              width="500"
              height="625"
              loading="lazy"
              decoding="async"
            />
            <div className="case-study__photo-tag">Rotterdam → Chicago</div>
          </div>
        </div>
      </div>
    </section>
  );
}
