import RouteFinder from './RouteFinder';

export default function RouteDesk() {
  return (
    <section className="section routes" id="routes">
      <div className="wrap">
        <div className="routes__figure" data-reveal="mask">
          <div className="routes__media">
            <img
              src="/images/routes-harbor.jpg"
              alt="Container cranes at a deep-water port at dusk"
              width="2172"
              height="724"
              loading="lazy"
              decoding="async"
            />
            <div className="routes__scrim" aria-hidden="true" />
            <div className="routes__overlay">
              <span className="eyebrow eyebrow--light">
                <span className="eyebrow__num">01</span> Route desk
              </span>
              <h2>
                Find your <span className="accent">trade lane</span><span className="accent">.</span>
              </h2>
              <p>
                Rotterdam is our home port. Every lane has one owner who confirms the sailing, the
                equipment and the customs route before the box is on the quay.
              </p>
              <RouteFinder />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
