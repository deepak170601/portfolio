import { Route, Routes, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useScrollToTop } from './lib/scrollToTop';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { MultimodalRagPage } from './pages/case-studies/MultimodalRag';
import { OnCallCopilotPage } from './pages/case-studies/OnCallCopilot';
import { TippingOnTapPage } from './pages/case-studies/TippingOnTap';

export function App() {
  const location = useLocation();
  useScrollToTop();

  return (
    <Layout>
      {/* Keyed on the path so React remounts on navigation and the CSS
          fade-in replays. A CSS animation with fill-mode both cannot leave
          the page stuck invisible the way an interrupted JS tween can. */}
      <div className="route-fade" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/oncall-copilot" element={<OnCallCopilotPage />} />
          <Route path="/multimodal-rag" element={<MultimodalRagPage />} />
          <Route path="/tippingontap" element={<TippingOnTapPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Layout>
  );
}
