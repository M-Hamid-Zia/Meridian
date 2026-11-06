import { useState } from 'react';
import { MinusIcon, PlusIcon } from './Icons';
import MeridianAvatar from './MeridianAvatar';

const faqs = [
  {
    question: "What's your minimum shipment size?",
    answer:
      'One pallet for LCL, one container for FCL. Air starts at 45 kg. We quote the whole door-to-door move, not just the port leg.',
  },
  {
    question: 'How do you handle customs disputes?',
    answer:
      'The filing specialist owns the query from first notice to release. We hold the classification, valuation and preference file, and we respond to the authority within one business day. If a penalty is issued, we review the file with you before any payment.',
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

  return (
    <section className="section faq" id="faq">
      <div className="wrap faq__grid">
        <div className="faq__intro">
          <span className="eyebrow" data-reveal>
            <span className="eyebrow__num">06</span> Questions
          </span>
          <h2 data-reveal data-reveal-delay={0.05}>
            Answered before you ask<span className="accent">.</span>
          </h2>
          <p data-reveal data-reveal-delay={0.1}>
            Six questions we hear from import and export teams before the first quote. If yours is not
            here, the route desk will answer it directly.
          </p>

          <div className="faq__desk" data-reveal data-reveal-delay={0.14}>
            <MeridianAvatar size={64} />
            <div>
              <span className="label label--gold">Still deciding?</span>
              <p>The desk replies within four hours. No ticket queue, no chatbot.</p>
            </div>
          </div>
        </div>

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
                  onClick={() => setOpen(isOpen ? null : index)}
                >
                  <span className="faq__index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="faq__text">{faq.question}</span>
                  <span className="faq__icon">{isOpen ? <MinusIcon className="icon-20" /> : <PlusIcon className="icon-20" />}</span>
                </button>
                <div
                  className="faq__panel"
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-button-${index}`}
                >
                  <div className="faq__panel-inner">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
