import { useRef, useState } from 'react';
import { ArrowRight, PlusIcon } from './Icons';
import MeridianAvatar from './MeridianAvatar';
import { transitionToId } from '../lib/motion';
import { emitGuide } from '../lib/guide';

const faqs = [
  {
    question: "What's your minimum shipment size?",
    answer:
      'One pallet for LCL, one container for FCL. Air starts at 45 kg. We quote the whole door-to-door move, not just the port leg.',
  },
  {
    question: 'How do you handle customs disputes?',
    answer:
      'The filing specialist owns the query from first notice to release. We hold the classification, valuation and preference file, and respond to the authority within one business day. If a penalty is issued, we review the file with you before any payment.',
  },
  {
    question: 'Which trade lanes are your strongest?',
    answer:
      'Europe–North America, Asia–Europe, Middle East–Africa and intra-Asia. We have weekly allocations on 12 major corridors and 40+ carrier contracts.',
  },
  {
    question: 'What does onboarding look like?',
    answer:
      'One 45-minute call, a lane list, a document pack and a named specialist. Most accounts are live in 5–7 business days. No system integration required.',
  },
  {
    question: 'How is pricing structured?',
    answer:
      'A per-shipment quote with the ocean or air rate, origin charges, destination charges and customs. We show the accessorials before you book. No monthly platform fee.',
  },
  {
    question: 'Do you handle temperature-controlled cargo?',
    answer:
      'Yes. Reefer FCL at 2–8°C or frozen, with temperature monitoring and a pre-trip inspection. Air reefer and active containers on 12 corridors.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const hinted = useRef(false);

  const toggle = (index: number, isOpen: boolean) => {
    setOpen(isOpen ? null : index);
    if (!isOpen && !hinted.current) {
      hinted.current = true;
      emitGuide({
        text: 'Short, honest answers. If you need more, ask the desk.',
        cta: { label: 'Ask the desk', targetId: 'contact' },
        effect: 'giggle',
      });
    }
  };

  return (
    <section className="section faq" id="faq">
      <div className="wrap">
        <header className="section-head">
          <div className="section-head__title">
            <span className="eyebrow" data-reveal>
              <span className="eyebrow__num">06</span> Questions
            </span>
            <h2 data-reveal data-reveal-delay={0.05}>
              <span className="accent">Answered</span> before you ask<span className="accent">.</span>
            </h2>
          </div>
          <div className="section-head__intro" data-reveal data-reveal-delay={0.12}>
            <p>
              Six questions we hear before the first quote. If yours is not here, the route desk
              answers it directly.
            </p>
          </div>
        </header>

        <div className="faq__list">
          {faqs.map((faq, index) => {
            const isOpen = open === index;
            return (
              <div className={`faq__item${isOpen ? ' is-open' : ''}`} key={faq.question} data-reveal data-reveal-delay={index * 0.04}>
                <button
                  type="button"
                  className="faq__question"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                  id={`faq-button-${index}`}
                  onClick={() => toggle(index, isOpen)}
                >
                  <span className="faq__index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="faq__text">{faq.question}</span>
                  <span className="faq__icon">
                    <PlusIcon className="icon-24" />
                  </span>
                </button>
                <div
                  className="faq__panel"
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-button-${index}`}
                >
                  <div className="faq__panel-inner">
                    <div className="faq__answer">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <a className="faq__desk" href="#contact" data-reveal onClick={(event) => { event.preventDefault(); transitionToId('contact'); }}>
          <MeridianAvatar size={48} />
          <span className="faq__desk-copy">
            <span className="faq__desk-text">Still deciding? The desk replies within four hours.</span>
          </span>
          <ArrowRight className="faq__desk-arrow icon-20" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
