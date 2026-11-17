import SiteNav, { Footer } from './SiteNav.jsx';
import { Hero, ModelExplorer, Workflows } from './Explore.jsx';
import { StudioProvider, TaskLauncher, PromptStudio } from './Studio.jsx';
import { Paths, Roadmap, Techniques, Practice, Agents, Templates, Glossary, Faq } from './Learn.jsx';
import { useContent } from './i18n.jsx';

export default function App() {
  const { nav, cta } = useContent();
  return (
    <StudioProvider>
      <a className="skip-link" href="#main">{nav.skip}</a>
      <SiteNav />
      <main id="main">
        <Hero />
        <TaskLauncher />
        <ModelExplorer />
        <Workflows />
        <Paths />
        <Roadmap />
        <Techniques />
        <Practice />
        <PromptStudio />
        <Agents />
        <Templates />
        <Glossary />
        <Faq />
        <section className="wrap" aria-labelledby="cta-title">
          <div className="cta">
            <div>
              <h2 id="cta-title">{cta.title[0]}<em>{cta.title[1]}</em>{cta.title[2]}</h2>
              <p>{cta.text}</p>
            </div>
            <div className="hero-actions">
              <a className="btn" href="#builder">{cta.primary}</a>
              <a className="btn btn-secondary" href="#techniky">{cta.secondary}</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </StudioProvider>
  );
}
