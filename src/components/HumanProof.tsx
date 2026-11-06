import MeridianAvatar from './MeridianAvatar';

const voices = [
  {
    quote:
      'They found the space when the carrier rolled the booking, and they told us before we had to ask.',
    role: 'Head of Logistics',
    company: 'European pharma distributor',
  },
  {
    quote:
      'One number, one owner, one status page. Our line-side team stopped calling three different forwarders.',
    role: 'Import Manager',
    company: 'Tier-1 automotive supplier',
  },
];

export default function HumanProof() {
  return (
    <section className="section human" id="team">
      <div className="wrap">
        <div className="section-head">
          <div className="section-head__title">
            <span className="eyebrow" data-reveal>
              <span className="eyebrow__num">05</span> The people
            </span>
            <h2 data-reveal data-reveal-delay={0.05}>
              The route desk<span className="accent">.</span>
            </h2>
          </div>
          <div className="section-head__intro" data-reveal data-reveal-delay={0.12}>
            <p>
              A route is only as good as the person who owns it when the vessel rolls, the customs
              query lands or the truck misses the cut-off.
            </p>
          </div>
        </div>

        <div className="human__grid">
          <div className="human__photo" data-reveal="mask">
            <img
              src="/images/route-desk.webp"
              srcSet="/images/route-desk-700.webp 700w, /images/route-desk.webp 1200w"
              sizes="(max-width: 640px) 100vw, 628px"
              alt="A Meridian route specialist working at a desk with monitors and shipping documents"
              width="1200"
              height="800"
              loading="lazy"
              decoding="async"
              data-parallax="8"
            />
            <div className="human__photo-tag">
              <span className="label label--gold">Route desk</span>
              <span>Rotterdam</span>
            </div>
          </div>

          <div className="human__copy">
            <div className="human__promise" data-reveal>
              <div className="human__promise-avatar">
                <MeridianAvatar size={92} />
              </div>
              <div>
                <span className="label label--gold">4 hour promise</span>
                <p>
                  Every inquiry reaches a named specialist within four hours — not a ticket queue.
                </p>
              </div>
            </div>

            <p className="human__lead" data-reveal data-reveal-delay={0.06}>
              The desk is staffed by people who have booked the sailing, filed the entry and chased
              the truck. They know the difference between a documentation query and a real delay.
            </p>

            <div className="voices">
              {voices.map((voice, index) => (
                <blockquote key={voice.role} data-reveal data-reveal-delay={0.1 + index * 0.06}>
                  <p>{voice.quote}</p>
                  <footer>
                    {voice.role}, {voice.company}
                    <span>Client name withheld under NDA.</span>
                  </footer>
                </blockquote>
              ))}
            </div>

            <div className="human__stats" data-reveal>
              <div>
                <strong data-count="4h">4h</strong>
                <span>Median first response</span>
              </div>
              <div>
                <strong data-count="24/7">24/7</strong>
                <span>Desk coverage</span>
              </div>
              <div>
                <strong data-count="12">12</strong>
                <span>Named owners</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
