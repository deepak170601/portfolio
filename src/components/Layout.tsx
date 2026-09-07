import type { ReactNode } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import { NodeField } from './NodeField';
import { ScrollProgress } from './ScrollProgress';
import { SkipLink } from './SkipLink';
import { useTheme } from '../lib/useTheme';

export function Layout({ children }: { children: ReactNode }) {
  const { theme, toggle } = useTheme();

  return (
    <div className="layout">
      <SkipLink />
      <NodeField />
      <ScrollProgress />
      <Header theme={theme} onToggleTheme={toggle} />
      <main className="layout__main" id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
