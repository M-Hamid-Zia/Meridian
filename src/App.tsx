import { useCallback, useState } from 'react';
import Header from './components/Header';
import CursorAvatar from './components/CursorAvatar';
import Hero from './components/Hero';
import ProofBar from './components/ProofBar';
import RouteSelector from './components/RouteSelector';
import Services from './components/Services';
import CaseStudy from './components/CaseStudy';
import Network from './components/Network';
import HumanProof from './components/HumanProof';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import type { CargoId, RegionId } from './data/routes';

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

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

export default function App() {
  const [quotePrefill, setQuotePrefill] = useState<QuotePrefill | null>(null);
  const [routePreset, setRoutePreset] = useState<RoutePreset | null>(null);

  const requestQuote = useCallback((prefill: Omit<QuotePrefill, 'nonce'>) => {
    setQuotePrefill({ ...prefill, nonce: Date.now() });
    window.setTimeout(() => scrollToId('contact'), 40);
  }, []);

  const selectService = useCallback((cargo: CargoId) => {
    setRoutePreset({ cargo, nonce: Date.now() });
    scrollToId('routes');
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <CursorAvatar />
      <main id="main">
        <Hero />
        <ProofBar />
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
        <a className="btn btn--primary btn--block" href="#contact">Request a Quote</a>
      </nav>
    </>
  );
}
