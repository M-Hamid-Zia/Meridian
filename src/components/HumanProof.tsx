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
    company: 'Automotive OEM',
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
              The route <span className="accent">desk</span><span className="accent">.</span>
            </h2>
          </div>
        </div>

        <div className="human__layout">
          <figure className="human__figure" data-reveal="mask">
            <div className="human__echo" aria-hidden="true" />
            <div className="human__arch">
              <img
                src="/images/route-desk-portrait.jpg"
                alt="A Meridian route specialist on a headset reviewing shipping documents at her Rotterdam desk"
                width="1122"
                height="1402"
                loading="lazy"
                decoding="async"
                data-parallax="6"
              />
            </div>
          </figure>

          <div className="human__copy">
            <div className="voices">
              {voices.map((voice, index) => (
                <blockquote key={voice.role} data-reveal data-reveal-delay={0.1 + index * 0.06}>
                  <span className="voices__num">0{index + 1}</span>
                  <div className="voices__body">
                    <p>{voice.quote}</p>
                    <footer>
                      <span className="voices__role">
                        {voice.role}, {voice.company}
                      </span>
                    </footer>
                  </div>
                </blockquote>
              ))}
            </div>

            <div className="human__stats" data-reveal>
              <div>
                <strong data-count="24/7">24/7</strong>
                <span>Desk coverage</span>
              </div>
              <div>
                <strong data-count="12">12</strong>
                <span>Named owners</span>
              </div>
            </div>

            <p className="human__lead" data-reveal data-reveal-delay={0.18}>
              A route is only as good as its owner. Ours have booked the sailing, filed the entry
              and chased the truck.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
