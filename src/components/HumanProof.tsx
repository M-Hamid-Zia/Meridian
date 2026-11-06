export default function HumanProof() {
  return (
    <section className="section human" id="team">
      <div className="wrap">
        <div className="section-head">
          <div className="section-head__title">
            <span className="eyebrow">05 / Human proof</span>
            <h2>The route desk team.</h2>
          </div>
          <div className="section-head__intro">
            <p>A route is only as good as the person who owns it when the vessel rolls, the customs query lands or the truck misses the cut-off.</p>
          </div>
        </div>

        <div className="human__grid">
          <div className="human__photo">
            <img
              src="/images/route-desk.webp"
              srcSet="/images/route-desk-700.webp 700w, /images/route-desk.webp 1200w"
              sizes="(max-width: 640px) 100vw, 628px"
              alt="Two Meridian route specialists working at a desk with monitors and shipping documents"
              width="1200"
              height="800"
              loading="lazy"
              decoding="async"
            />
            <div className="human__photo-tag">Route desk · Rotterdam</div>
          </div>

          <div className="human__copy">
            <div className="human__promise card">
              <span className="human__promise-num">4h</span>
              <p>Every inquiry reaches a named specialist within 4 hours — not a ticket queue.</p>
            </div>
            <p className="human__lead">
              The desk is staffed by people who have booked the sailing, filed the entry and chased the truck. They know the difference between a documentation query and a real delay.
            </p>

            <div className="quotes">
              <blockquote>
                <p>“They found the space when the carrier rolled the booking, and they told us before we had to ask.”</p>
                <footer>Head of Logistics, European pharma distributor <span>Client name withheld under NDA.</span></footer>
              </blockquote>
              <blockquote>
                <p>“One number, one owner, one status page. Our line-side team stopped calling three different forwarders.”</p>
                <footer>Import Manager, Tier-1 automotive supplier <span>Client name withheld under NDA.</span></footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
