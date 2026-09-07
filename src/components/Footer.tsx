import { profile } from '../content/profile';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p>{profile.name}</p>
        <p>{profile.location}</p>
      </div>
    </footer>
  );
}