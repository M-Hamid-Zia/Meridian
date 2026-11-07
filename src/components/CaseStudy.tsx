import { useState } from 'react';
import { ArrowRight } from './Icons';
import { transitionToId } from '../lib/motion';

export default function CaseStudy() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="section case-study" id="case-study">
      <div className="wrap">
        <div className="case-study__head">
          <span className="eyebrow eyebrow--light" data-reveal>
            <span className="eyebrow__num">03</span> Case study
          </span>
          <h2 data-reveal data-reveal-delay={0.05}>
            Nine days back in the <span className="accent">supply chain</span><span className="accent">.</span>
          </h2>
          <p className="case-study__sub" data-reveal data-reveal-delay={0.12}>
            Rotterdam → Chicago. The three changes that fixed a drifting lane.
          </p>
        </div>

        <div className="case-study__layout">
          <div className="case-study__copy">
            <div className="case-study__body" data-reveal>
              <p className="case-study__lede">
                The lane ran 34 days door-to-door; customs holds added three to five days at random.
                The supplier&rsquo;s line-side buffer carried the cost.
              </p>
              <p>
                Meridian moved the lane to a weekly FCL sailing, pre-cleared the entry before arrival
                and added a New York–Chicago rail leg. One specialist owned the file end to end.
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
            </div>

            <div className={`case-study__more${expanded ? ' is-open' : ''}`} id="case-study-more">
              <div className="case-study__more-inner">
                <p>
                  First, the sailing: a fixed weekly FCL allocation instead of spot bookings.
                  Second, the entry: documents filed four days before arrival, so the container moved
                  discharge-to-rail with no customs queue. Third, the handoff: a named specialist in
                  Rotterdam and one in Chicago, sharing one file, one status page and one escalation
                  number.
                </p>
                <p>
                  The supplier kept its existing Incoterms and broker. Meridian ran the booking,
                  pre-clearance and the inland leg. Result: 9 days off door-to-door transit across
                  the first 120 containers.
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
                className="text-link text-link--light"
                type="button"
                aria-expanded={expanded}
                aria-controls="case-study-more"
                onClick={() => setExpanded((value) => !value)}
              >
                {expanded ? 'Close the full case study' : 'Read full case study'}
                <ArrowRight className={`text-link__icon${expanded ? ' is-up' : ''}`} />
              </button>
              <a className="btn btn--ghost btn--ghost-light" href="#contact" onClick={(event) => { event.preventDefault(); transitionToId('contact'); }}>
                <span>Request similar assessment</span>
                <ArrowRight className="btn__arrow" />
              </a>
            </div>
          </div>

          <figure className="case-study__figure" data-reveal="mask">
            <div className="case-study__echo" aria-hidden="true" />
            <div className="case-study__arch">
              <img
                src="/images/case-study-port.jpg"
                alt="A container vessel alongside gantry cranes at a deep-water port at dusk"
                width="1122"
                height="1402"
                loading="lazy"
                decoding="async"
                data-parallax="6"
              />
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
