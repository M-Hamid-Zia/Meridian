import { useEffect, useRef, useState } from 'react';
import type { QuotePrefill } from '../App';
import { cargoTypes } from '../data/routes';
import { ArrowRight } from './Icons';
import MeridianAvatar from './MeridianAvatar';
import { gsap, prefersReducedMotion } from '../lib/motion';

type Props = {
  prefill: QuotePrefill | null;
};

type FormState = {
  name: string;
  company: string;
  email: string;
  origin: string;
  destination: string;
  cargo: string;
};

const empty: FormState = {
  name: '',
  company: '',
  email: '',
  origin: '',
  destination: '',
  cargo: 'General cargo',
};

export default function Contact({ prefill }: Props) {
  const [form, setForm] = useState<FormState>(empty);
  const [status, setStatus] = useState('');
  const noteRef = useRef('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!prefill) return;
    setForm((current) => ({
      ...current,
      origin: prefill.origin ?? current.origin,
      destination: prefill.destination ?? current.destination,
      cargo: prefill.cargo ?? current.cargo,
    }));
    noteRef.current = prefill.note ?? '';
    if (!formRef.current || prefersReducedMotion()) return;
    gsap.fromTo(
      formRef.current.querySelectorAll('.field--dark, .quote-form__submit'),
      { boxShadow: '0 0 0 1px rgba(200,162,74,0)' },
      { boxShadow: '0 0 0 1px rgba(200,162,74,0.9)', duration: 0.5, stagger: 0.05, yoyo: true, repeat: 1 },
    );
  }, [prefill]);

  const update = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setStatus('');
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current?.checkValidity()) {
      formRef.current?.reportValidity();
      return;
    }
    const subject = `Quote request — ${form.origin || 'origin'} to ${form.destination || 'destination'}`;
    const body = [
      `Name: ${form.name}`,
      `Company: ${form.company}`,
      `Email: ${form.email}`,
      `Origin: ${form.origin}`,
      `Destination: ${form.destination}`,
      `Cargo: ${form.cargo}`,
      noteRef.current ? `Lane note: ${noteRef.current}` : '',
      '',
      'Please confirm the transit options and the next sailing.',
    ]
      .filter(Boolean)
      .join('\n');
    setStatus('Opening your email app with the request.');
    window.location.href = `mailto:hello@meridian.example?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="contact" id="contact">
      <div className="wrap contact__inner">
        <div className="contact__top">
          <span className="eyebrow eyebrow--light" data-reveal>
            <span className="eyebrow__num">07</span> Request a quote
          </span>
          <h2 data-reveal data-reveal-delay={0.05}>
            Tell us the route.
            <br />
            <em>We&rsquo;ll tell you the plan.</em>
          </h2>
          <p className="contact__lead" data-reveal data-reveal-delay={0.1}>
            Six fields. One business day. A named specialist who knows the lane, the equipment and the
            customs route.
          </p>
        </div>

        <div className="contact__grid">
          <div className="contact__copy">
            <div className="route-desk" data-reveal>
              <MeridianAvatar size={104} className="avatar--lg" />
              <div className="route-desk__copy">
                <span className="label label--gold">Route desk · Rotterdam</span>
                <p>
                  &ldquo;Send the lane and the document pack. I&rsquo;ll come back with capacity, the
                  customs route and the accessorials — in writing.&rdquo;
                </p>
                <span className="route-desk__sign">— Named specialist, 4h response</span>
              </div>
            </div>

            <div className="contact__details" data-reveal data-reveal-delay={0.08}>
              <div>
                <span className="label">Office</span>
                <p>Waalhaven, Rotterdam</p>
              </div>
              <div>
                <span className="label">Credentials</span>
                <p>FIATA · IATA · Customs broker (EU)</p>
              </div>
              <div>
                <span className="label">Response</span>
                <p>Within one business day</p>
              </div>
              <div>
                <span className="label">Direct</span>
                <p>hello@meridian.example</p>
              </div>
            </div>
          </div>

          <form className="quote-form" ref={formRef} onSubmit={submit} data-reveal="fade" data-reveal-delay={0.12}>
            <div className="quote-form__bar">
              <span className="label label--gold">Quote request</span>
              <span className="quote-form__step">01 / 01</span>
            </div>

            <div className="quote-form__grid">
              <label className="field field--dark">
                <span className="field__label">Name</span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={(event) => update('name', event.target.value)}
                />
              </label>
              <label className="field field--dark">
                <span className="field__label">Company</span>
                <input
                  type="text"
                  name="company"
                  autoComplete="organization"
                  required
                  value={form.company}
                  onChange={(event) => update('company', event.target.value)}
                />
              </label>
              <label className="field field--dark field--full">
                <span className="field__label">Email</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(event) => update('email', event.target.value)}
                />
              </label>
              <label className="field field--dark">
                <span className="field__label">Origin</span>
                <input
                  type="text"
                  name="origin"
                  placeholder="City or port"
                  required
                  value={form.origin}
                  onChange={(event) => update('origin', event.target.value)}
                />
              </label>
              <label className="field field--dark">
                <span className="field__label">Destination</span>
                <input
                  type="text"
                  name="destination"
                  placeholder="City or port"
                  required
                  value={form.destination}
                  onChange={(event) => update('destination', event.target.value)}
                />
              </label>
              <label className="field field--dark field--full">
                <span className="field__label">Cargo type</span>
                <span className="select-wrap select-wrap--dark">
                  <select name="cargo" value={form.cargo} onChange={(event) => update('cargo', event.target.value)}>
                    {cargoTypes.map((type) => (
                      <option key={type.id} value={type.label}>{type.label}</option>
                    ))}
                  </select>
                </span>
              </label>
            </div>

            <button className="btn btn--primary btn--block quote-form__submit" type="submit">
              Request a quote
              <ArrowRight className="btn__arrow" />
            </button>
            <p className="quote-form__note">A specialist responds within one business day.</p>
            <p className="quote-form__status" role="status">{status}</p>

            <div className="contact__next">
              <div><span>01</span><p>We read the lane and the document pack.</p></div>
              <div><span>02</span><p>A specialist confirms capacity and the customs route.</p></div>
              <div><span>03</span><p>You get a written quote with the accessorials.</p></div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
