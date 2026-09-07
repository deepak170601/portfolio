import { profile, socialLinks } from '../content/profile';
import { useCopy } from '../lib/useCopy';
import { LinkOut } from './LinkOut';

const COPY_LABEL: Record<'idle' | 'copied' | 'failed', string> = {
  idle: 'Copy',
  copied: 'Copied',
  failed: 'Copy failed',
};

export function Contact() {
  const { state, copy } = useCopy(profile.email);

  return (
    <div className="contact-panel">
      <h3 className="contact-panel__title">
        Let&rsquo;s build something <span className="is-italic">measurable</span>.
      </h3>

      <p className="contact-panel__lead">
        Open to backend engineering roles in distributed systems. Get in touch below.
      </p>

      <div className="contact">
        <a className="contact__email" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <button type="button" className="copy-button" onClick={copy} aria-label="Copy email address">
          {COPY_LABEL[state]}
        </button>
        {/* Announced politely so the confirmation is not only a visual change. */}
        <span className="visually-hidden" role="status">
          {state === 'copied' ? 'Email address copied to clipboard' : ''}
          {state === 'failed' ? 'Could not copy. Please select the address manually.' : ''}
        </span>
      </div>

      <div className="contact__links">
        {socialLinks.map((link) => (
          <LinkOut
            href={link.href}
            key={link.href}
            {...(link.download ? { download: link.download } : {})}
          >
            {link.label}
          </LinkOut>
        ))}
      </div>
    </div>
  );
}
