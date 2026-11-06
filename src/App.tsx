import { useCallback, useEffect, useState } from 'react';
import Header from './components/Header';
import Cursor from './components/Cursor';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import ProofBar from './components/ProofBar';
import RouteSelector from './components/RouteSelector';
import Services from './components/Services';
import CaseStudy from './components/CaseStudy';
import Network from './components/Network';
import HumanProof from './components/HumanProof';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Intro from './components/Intro';
import type { CargoId, RegionId } from './data/routes';
import { useReveal } from './hooks/useReveal';
import { useMagnetic } from './hooks/useMagnetic';
import { gsap, prefersReducedMotion, startSmoothScroll } from './lib/motion';

export type QuotePrefill = {
  origin?: string;
  destination?: string;
  cargo?: string;
  note?: string;
  nonce: number;
};

export type RoutePreset = {
  origin?: RegionId;
  destination?: RegionId;
  cargo?: CargoId;
  nonce: number;
};

const trustedBy = [
  'Automotive OEM',
  'Pharma distribution',
  'Industrial parts',
  'Retail import',
  'Cold chain',
  'Aerospace',
];

export default function App() {
  const [quotePrefill, setQuotePrefill] = useState<QuotePrefill | null>(null);
  const [routePreset, setRoutePreset] = useState<RoutePreset | null>(null);
  const [introDone, setIntroDone] = useState(() => prefersReducedMotion());

  useReveal();
  useMagnetic();

  useEffect(() => {
    const stop = startSmoothScroll();
    return stop;
  }, []);

  useEffect(() => {
    if (!introDone) return;
    document.documentElement.classList.add('is-ready');
    if (prefersReducedMotion()) return;
    gsap.fromTo(
      '.nav',
      { yPercent: -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1.1, ease: 'expo.out', delay: 0.1 },
    );
  }, [introDone]);

  const requestQuote = useCallback((prefill: Omit<QuotePrefill, 'nonce'>) => {
    setQuotePrefill({ ...prefill, nonce: Date.now() });
    window.setTimeout(() => {
      const el = document.getElementById('contact');
      el?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    }, 60);
  }, []);

  const selectService = useCallback((cargo: CargoId) => {
    setRoutePreset({ cargo, nonce: Date.now() });
    document.getElementById('routes')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      {!introDone && <Intro onDone={() => setIntroDone(true)} />}
      <Cursor />
      <Header />
      <main id="main">
        <Hero />
        <ProofBar />
        <div className="marquee-band" aria-hidden="true">
          <Marquee items={trustedBy} duration={30} />
        </div>
        <RouteSelector preset={routePreset} onRequestQuote={requestQuote} />
        <Services onSelectService={selectService} />
        <CaseStudy onRequestQuote={requestQuote} />
        <Network />
        <HumanProof />
        <Faq />
        <Contact prefill={quotePrefill} />
      </main>
      <Footer />
      <nav className="actionbar" aria-label="Quick actions">
        <a className="btn btn--primary btn--block" href="#contact">Request a quote</a>
      </nav>
    </>
  );
}
