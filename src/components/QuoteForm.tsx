import { useRef, useState, type FormEvent, type InvalidEvent } from 'react';
import { cargoTypes } from '../data/routes';
import { ArrowRight } from './Icons';
import { emitGuide } from '../lib/guide';

type Props = {
  /** Surface tone — 'light' sits on the paper contact panel; 'dark' is kept available. */
  tone?: 'dark' | 'light';
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

export default function QuoteForm({ tone = 'light' }: Props) {
  const light = tone === 'light';
  const fieldBase = light ? 'field field--light' : 'field field--dark';
  const fieldFull = `${fieldBase} field--full`;
  const selectWrap = light ? 'select-wrap select-wrap--light' : 'select-wrap select-wrap--dark';
  const [form, setForm] = useState<FormState>(empty);
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const hinted = useRef(false);

  const hintFocus = () => {
    if (hinted.current) return;
    hinted.current = true;
    emitGuide({ text: 'Six fields. I will keep it painless.', effect: 'think' });
  };

  const update = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setStatus('');
    setDone(false);
  };

  // Name the mistake, not just the mood. Each rejected control is mapped to
  // its visible label and a one-line reason from the validity flags.
  const describeField = (field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
    const label =
      field.closest('label')?.querySelector('.field__label')?.textContent?.trim() ||
      field.getAttribute('aria-label') ||
      field.name ||
      'That field';
    const validity = field.validity;
    let why = 'needs another look';
    if (validity.valueMissing) why = 'is empty';
    else if (validity.typeMismatch) why = field.type === 'email' ? "isn't a valid email" : 'is the wrong type';
    else if (validity.patternMismatch) why = 'needs a letter or a digit';
    else if (validity.tooShort) why = 'is too short';
    return { label, why };
  };

  const listJoin = (items: string[]) =>
    items.length <= 2 ? items.join(' and ') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

  const announceInvalid = (fields: Array<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const problems = fields.map(describeField);
    const missing = problems.filter((problem) => problem.why === 'is empty').map((problem) => problem.label);
    let text: string;
    if (problems.length === 0) {
      text = 'That one needs fixing before it ships.';
    } else if (missing.length === problems.length && problems.length > 1) {
      text = `${listJoin(missing)} are missing.`;
    } else {
      text = problems.map((problem) => `${problem.label} ${problem.why}.`).join(' ');
    }
    emitGuide({ text, effect: 'angry' });
  };

  // IMPORTANT: a blocked (invalid) form never reaches onSubmit — the browser
  // stops the submission during interactive validation first. The 'invalid'
  // event on each failing control is the only hook that fires, so the angry
  // reaction lives there, attached in the capture phase (invalid does not
  // bubble). The native warning popup still shows; we do not preventDefault.
  const invalidBuffer = useRef<Array<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>>([]);
  const invalidQueued = useRef(false);

  const noteInvalid = (event: InvalidEvent<HTMLFormElement>) => {
    // Capture phase: `target` is the failing control, despite the handler living on the form.
    invalidBuffer.current.push(event.target as unknown as HTMLInputElement);
    if (invalidQueued.current) return;
    invalidQueued.current = true;
    queueMicrotask(() => {
      invalidQueued.current = false;
      const fields = invalidBuffer.current;
      invalidBuffer.current = [];
      announceInvalid(fields);
    });
  };

  // The desk swallows the inquiry whole: one fetch to the FormSubmit AJAX
  // endpoint, no mail app, no redirect. hello@meridian.example is a reserved,
  // unrouteable demo address chosen deliberately by the site owner, so FormSubmit
  // can never activate for it and nothing is ever delivered; swapping the single
  // endpoint constant for an activated address or a real API makes it live.
  const ENDPOINT = 'https://formsubmit.co/ajax/hello@meridian.example';
  const SUBMISSION_TEXT = 'Your quote has been submitted. The desk answers within one business day.';

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current?.checkValidity()) {
      // Belt and braces: normal clicks never reach this branch (native
      // interactive validation stops invalid submissions first). Keep any
      // scripted submission on the page.
      const fields = Array.from(
        formRef.current?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(':invalid') ?? [],
      );
      announceInvalid(fields);
      return;
    }
    setSubmitting(true);
    setStatus('');
    const subject = `Quote request: ${form.origin || 'origin'} to ${form.destination || 'destination'}`;
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, _subject: subject, _captcha: 'false' }),
      });
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
      setDone(true);
      setStatus(SUBMISSION_TEXT);
      emitGuide({ text: SUBMISSION_TEXT, effect: 'celebrate' });
    } catch {
      setStatus('That did not go through. Check your connection and try again.');
      emitGuide({ text: 'That one did not go through. Try again in a moment.', effect: 'nervous' });
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setForm(empty);
    setDone(false);
    setStatus('');
  };

  return (
    <form className={light ? 'quote-form quote-form--light' : 'quote-form'} ref={formRef} onSubmit={submit} onInvalidCapture={noteInvalid} onFocusCapture={hintFocus} data-reveal="fade" data-reveal-delay={0.12}>
      <div className="quote-form__bar">
        <span className="label label--gold">Quote request</span>
      </div>

      <div className="quote-form__grid">
        <label className={fieldBase}>
          <span className="field__label">Name</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            required
            minLength={2}
            pattern="^(?=.*[\p{L}\p{N}])[\s\S]*$"
            title="At least two characters, with a letter or a digit."
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
          />
        </label>
        <label className={fieldBase}>
          <span className="field__label">Company</span>
          <input
            type="text"
            name="company"
            autoComplete="organization"
            required
            minLength={2}
            pattern="^(?=.*[\p{L}\p{N}])[\s\S]*$"
            title="At least two characters, with a letter or a digit."
            value={form.company}
            onChange={(event) => update('company', event.target.value)}
          />
        </label>
        <label className={fieldFull}>
          <span className="field__label">Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            title="A working email, for example name@company.com."
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
          />
        </label>
        <label className={fieldBase}>
          <span className="field__label">Origin</span>
          <input
            type="text"
            name="origin"
            placeholder="City or port"
            required
            minLength={2}
            pattern="^(?=.*[\p{L}\p{N}])[\s\S]*$"
            title="At least two characters, with a letter or a digit."
            value={form.origin}
            onChange={(event) => update('origin', event.target.value)}
          />
        </label>
        <label className={fieldBase}>
          <span className="field__label">Destination</span>
          <input
            type="text"
            name="destination"
            placeholder="City or port"
            required
            minLength={2}
            pattern="^(?=.*[\p{L}\p{N}])[\s\S]*$"
            title="At least two characters, with a letter or a digit."
            value={form.destination}
            onChange={(event) => update('destination', event.target.value)}
          />
        </label>
        <label className={fieldFull}>
          <span className="field__label">Cargo type</span>
          <span className={selectWrap}>
            <select name="cargo" value={form.cargo} onChange={(event) => update('cargo', event.target.value)}>
              {cargoTypes.map((type) => (
                <option key={type.id} value={type.label}>{type.label}</option>
              ))}
            </select>
          </span>
        </label>
      </div>

      <button className="btn btn--primary btn--block quote-form__submit" type="submit" disabled={submitting || done}>
        <span>{done ? 'Quote submitted' : submitting ? 'Sending…' : 'Submit a quote'}</span>
        {!done && <ArrowRight className="btn__arrow" />}
      </button>
      <p className="quote-form__status" role="status">{status}</p>
      {done && (
        <button type="button" className="text-link quote-form__again" onClick={reset}>
          Send another inquiry
        </button>
      )}

      <div className="contact__next">
        <div><span>01</span><p>We read the lane and the document pack.</p></div>
        <div><span>02</span><p>A specialist confirms capacity and the customs route.</p></div>
        <div><span>03</span><p>You get a written quote with the accessorials.</p></div>
      </div>
    </form>
  );
}
