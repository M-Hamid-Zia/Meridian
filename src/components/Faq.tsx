import { useState } from 'react';
import { MinusIcon, PlusIcon } from './Icons';
import MeridianAvatar from './MeridianAvatar';

const faqs = [
  {
    question: "What's your minimum shipment size?",
    answer: 'One pallet for LCL, one container for FCL. Air starts at 45 kg. We quote the whole door-to-door move, not just the port leg.',
  },
  {
    question: 'How do you handle customs disputes?',
    answer: 'The filing specialist owns the query from first notice to release. We hold the classification, valuation and preference file, and we respond to the authority within one business day. If a penalty is issued, we review the file with you before any payment.',
  },
  {
    question: 'Which trade lanes are your strongest?',
    answer: 'Europe–North America, Asia–Europe, Middle East–Africa and intra-Asia. We have weekly allocations on 12 major corridors and 40+ carrier contracts.',
  },
  {
    question: 'What does onboarding look like?',
    answer: 'One 45-minute call, a lane list, a document pack and a named specialist. Most accounts are live in 5–7 business days. No system integration required.',
  },
  {
    question: 'How is pricing structured?',
    answer: 'A per-shipment quote with the ocean or air rate, origin charges, destination charges and customs. We show the accessorials before you book. No monthly platform fee.',
  },
  {
    question: 'Do you handle temperature-controlled cargo?',
    answer: 'Yes. Reefer FCL at 2–8°C or frozen, with temperature monitoring and a pre-trip inspection. Air reefer and active containers on 12 corridors.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section faq" id="faq">
      <div className="wrap faq__grid">
        <div className="faq__intro">
          <span className="eyebrow">06 / Questions</span>
          <h2>Route desk questions.</h2>
          <p>Six questions we hear from import and export teams before the first quote. If yours is not here, the route desk will answer it directly.</p>
          <a className="link link--button" href="#contact">
            Ask the route desk
            <span className="link__arrow">→</span>
          </a>
        </div>

        <div className="faq__list">
          {faqs.map((faq, index) => {
            const isOpen = open === index;
            return (
              <div className={`faq__item${isOpen ? ' is-open' : ''}`} key={faq.question}>
                <button
                  type="button"
                  className="faq__question"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                  id={`faq-button-${index}`}
                  onClick={() => setOpen(isOpen ? null : index)}
                >
                  <span>{faq.question}</span>
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

        <div className="faq__cta card">
          <MeridianAvatar size={48} />
          <div>
            <p>Still have a question?</p>
            <p className="faq__cta-copy">The route desk answers directly. No ticket queue, no chatbot.</p>
            <a className="link link--button" href="#contact">
              Ask the route desk
              <span className="link__arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
