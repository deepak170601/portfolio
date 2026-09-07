import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_SECTIONS, NAV_SECTION_IDS } from '../content/nav';
import { profile } from '../content/profile';
import { useActiveSection } from '../lib/useActiveSection';
import { LinkOut } from './LinkOut';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import type { Theme } from '../lib/useTheme';

type Props = {
  theme: Theme;
  onToggleTheme: () => void;
};

export function Header({ theme, onToggleTheme }: Props) {
  const { pathname, hash } = useLocation();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const active = useActiveSection(NAV_SECTION_IDS, isHome);

  // The header only grows its border once the page has moved, so it sits
  // flush against the hero at rest.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Any navigation closes the menu, including a jump to a section on the page
  // we are already on.
  useEffect(() => setMenuOpen(false), [pathname, hash]);

  // Escape closes it and returns focus to the control that opened it.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      menuButton.current?.focus();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  // Do not retain an open mobile panel after switching to desktop navigation.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 861px)');
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    closeOnDesktop();
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);
  const sectionLinks = NAV_SECTIONS.map((section) => (
    <Link
      className="nav__link"
      key={section.id}
      to={`/#${section.id}`}
      onClick={() => setMenuOpen(false)}
      {...(isHome && active === section.id ? { 'aria-current': 'location' } : {})}
    >
      {section.label}
    </Link>
  ));

  return (
    <header className="site-header" data-scrolled={scrolled}>
      <div className="container site-header__inner">
        <Link className="site-header__name" to="/">
          <Logo />
          {profile.name}
        </Link>

        <div className="site-header__right">
          <nav className="nav" aria-label="Sections">
            {sectionLinks}
            <span className="nav__divider" aria-hidden="true" />
            <LinkOut className="nav__link nav__link--cta" href="/resume.pdf" download="Chekurthi-Deepak-CV.pdf">
              Résumé
            </LinkOut>
          </nav>

          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          <button
            type="button"
            className="menu-button"
            ref={menuButton}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="visually-hidden">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            <span className={menuOpen ? 'menu-button__bars is-open' : 'menu-button__bars'}>
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {/* Kept mounted so the panel can transition, and hidden from both the
          accessibility tree and the tab order while closed. */}
      <div className="mobile-nav" id="mobile-nav" data-open={menuOpen} hidden={!menuOpen}>
        <nav className="container mobile-nav__inner" aria-label="Sections">
          {sectionLinks}
          <LinkOut className="nav__link nav__link--cta" href="/resume.pdf" download="Chekurthi-Deepak-CV.pdf">
            Résumé
          </LinkOut>
        </nav>
      </div>
    </header>
  );
}
