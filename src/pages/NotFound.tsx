import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../lib/useDocumentMeta';

export function NotFound() {
  useDocumentMeta(
    'Page not found',
    'That page does not exist on this site.',
    '/404',
  );

  return (
    <div className="container notfound">
      {/* A heading, not a decorative number: every route needs one h1. */}
      <h1 className="notfound__code">404</h1>
      <p className="notfound__body">
        No page at this address. It may have been renamed, or the link may be wrong.
      </p>
      <div className="notfound__actions">
        <Link className="button" to="/">
          Back to the homepage
        </Link>
      </div>
    </div>
  );
}
