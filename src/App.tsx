import { useCallback, useEffect, useState } from 'react';

import Header from './components/Header';
import CurveSwipe from './components/CurveSwipe';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import ProofBar from './components/ProofBar';
import RouteDesk from './components/RouteDesk';
import Services from './components/Services';
import CaseStudy from './components/CaseStudy';
import Network from './components/Network';
import HumanProof from './components/HumanProof';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import GuideAvatar from './components/GuideAvatar';
import Intro from './components/Intro';
import { ArrowRight } from './components/Icons';
import { useReveal } from './hooks/useReveal';
import { useMagnetic } from './hooks/useMagnetic';
import { gsap, prefersReducedMotion, startSmoothScroll, transitionToId } from './lib/motion';

const trustedBy = [
  'Automotive OEM',
  'Pharma distribution',
  'Industrial parts',
  'Retail import',
  'Cold chain',
  'Aerospace',
];

export default function App() {
  const [introDone, setIntroDone] = useState(() => prefersReducedMotion());
  const [pastHero, setPastHero] = useState(false);

  useReveal();
  useMagnetic();

  const requestQuote = useCallback(() => {
    transitionToId('contact');
  }, []);

  useEffect(() => {
    const stop = startSmoothScroll();
    return stop;
  }, []);

  // Hide the floating controls once the footer is on screen so they never
  // cover the wordmark.
  useEffect(() => {
    const footer = document.querySelector('.footer');
    if (!footer || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => document.body.classList.toggle('at-foot', entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(footer);
    return () => {
      io.disconnect();
      document.body.classList.remove('at-foot');
    };
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

  // Sticky mobile CTA appears only once the visitor has scrolled past the hero.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const hero = document.querySelector<HTMLElement>('.hero');
        const limit = hero ? hero.offsetHeight - Math.min(140, hero.offsetHeight * 0.18) : window.innerHeight * 0.75;
        setPastHero(window.scrollY > limit);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      {!introDone && <Intro onDone={() => setIntroDone(true)} />}
      <CurveSwipe />
      <Header />
      <main id="main">
        <Hero />
        <ProofBar />
        <div className="marquee-band" aria-hidden="true">
          <Marquee items={trustedBy} duration={30} />
        </div>
        <RouteDesk />
        <Services onSelectService={requestQuote} />
        <CaseStudy />
        <Network />
        <HumanProof />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <GuideAvatar />
      <nav className={`actionbar${pastHero ? ' is-visible' : ''}`} aria-label="Quick actions">
        <a className="btn btn--primary btn--block" href="#contact" onClick={(event) => { event.preventDefault(); transitionToId('contact'); }}>
          <span>Request a quote</span>
          <ArrowRight className="btn__arrow" />
        </a>
      </nav>
    </>
  );
}
