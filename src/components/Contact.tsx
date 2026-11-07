import QuoteForm from './QuoteForm';
import MeridianAvatar from './MeridianAvatar';

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="wrap contact__inner">
        <div className="contact__top">
          <div className="contact__top-main">
            <span className="eyebrow" data-reveal>
              <span className="eyebrow__num">07</span> Request a quote
            </span>
            <h2 data-reveal data-reveal-delay={0.05}>
              Tell us the route.
              <br />
              <em>We&rsquo;ll tell you the plan.</em>
            </h2>
          </div>
          <p className="contact__lead" data-reveal data-reveal-delay={0.1}>
            Six fields. One business day. A named specialist who knows the lane.
          </p>
        </div>

        <div className="contact__panel" data-reveal data-reveal-delay={0.12}>
          <aside className="contact__aside">
            <div className="contact__aside-head">
              <span className="label label--gold">Route desk · Rotterdam</span>
            </div>

            <div className="contact__specialist">
              <span className="contact__avatar">
                <MeridianAvatar size={68} />
              </span>
              <div className="contact__specialist-copy">
                <p className="contact__name">Your named specialist</p>
                <p className="contact__role">Quote to delivery, one owner.</p>
              </div>
            </div>

            <figure className="contact__quote-wrap">
              <blockquote className="contact__quote">
                Send the lane and the document pack. I&rsquo;ll come back with capacity, the
                customs route and the accessorials, <em>in writing.</em>
              </blockquote>
            </figure>

            <dl className="contact__meta">
              <div>
                <dt>Office</dt>
                <dd>Waalhaven, Rotterdam</dd>
              </div>
              <div>
                <dt>Direct</dt>
                <dd>hello@meridian.example</dd>
              </div>
              <div>
                <dt>Credentials</dt>
                <dd>FIATA · IATA · Customs broker (EU)</dd>
              </div>
            </dl>
          </aside>

          <QuoteForm tone="light" />
        </div>
      </div>
    </section>
  );
}
