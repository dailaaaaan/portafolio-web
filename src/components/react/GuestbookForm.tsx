import { useState, type SubmitEvent } from 'react';

interface Labels {
  nameLabel: string;
  relationshipLabel: string;
  messageLabel: string;
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
  rateLimitMessage: string;
}

interface Props {
  locale: string;
  labels: Labels;
}

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'rate_limited';

const inputClass =
  'w-full rounded border border-accent-dim bg-bg px-2 py-1.5 text-fg outline-none focus:border-accent';

export default function GuestbookForm({ locale, labels }: Props) {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, relationship, message, locale, website })
      });

      if (response.status === 429) {
        setStatus('rate_limited');
        return;
      }

      if (!response.ok) {
        setStatus('error');
        return;
      }

      setStatus('success');
      setName('');
      setRelationship('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <p className="text-accent text-sm" role="status">
        {labels.successMessage}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label htmlFor="guestbook-name" className="text-muted mb-1 block text-xs">
          {labels.nameLabel}
        </label>
        <input
          id="guestbook-name"
          type="text"
          required
          maxLength={80}
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="guestbook-relationship" className="text-muted mb-1 block text-xs">
          {labels.relationshipLabel}
        </label>
        <input
          id="guestbook-relationship"
          type="text"
          required
          maxLength={120}
          value={relationship}
          onChange={(event) => setRelationship(event.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="guestbook-message" className="text-muted mb-1 block text-xs">
          {labels.messageLabel}
        </label>
        <textarea
          id="guestbook-message"
          required
          maxLength={500}
          rows={3}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className={inputClass}
        />
      </div>

      {/* Honeypot: invisible para personas, un bot que rellena todos los
          campos del formulario caera en este tambien. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="guestbook-website">Website</label>
        <input
          id="guestbook-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="border-accent-dim text-accent hover:bg-bg mt-1 inline-block rounded border px-3 py-1.5 disabled:opacity-50"
      >
        {labels.submitLabel}
      </button>

      {status === 'error' && (
        <p className="text-danger text-xs" role="alert">
          {labels.errorMessage}
        </p>
      )}
      {status === 'rate_limited' && (
        <p className="text-danger text-xs" role="alert">
          {labels.rateLimitMessage}
        </p>
      )}
    </form>
  );
}
