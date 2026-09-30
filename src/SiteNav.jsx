import { useState } from 'react';
import { Mark } from './Explore.jsx';
import { useContent } from './i18n.jsx';

export default function SiteNav({ catalog = false }) {
  const { nav } = useContent();
  const [open, setOpen] = useState(false);
  // On the catalog page, section links point back to the home page of the same language.
  const home = catalog ? nav.home : '';
  const links = [...nav.links.map(([label, hash]) => [label, home + hash]), nav.catalog];
  const mobileLinks = [...links, ...nav.extra.map(([label, hash]) => [label, home + hash]), [nav.cta, home + '#builder']];
  const switchHref = catalog ? nav.switchCatalog : nav.switchHome;
  return (
    <header className="site-header">
      <nav className="wrap" aria-label={nav.label}>
        <a className="brand" href={home || '#uvod'}><Mark /><b>promptuj<span>ai</span></b></a>
        <div className="nav-links">
          {links.map(([label, url]) => <a key={url} href={url} aria-current={catalog && url === nav.catalog[1] ? 'page' : undefined}>{label}</a>)}
        </div>
        <div className="nav-actions">
          <a className="lang-switch" href={switchHref} hrefLang={nav.switchShort.toLowerCase()} lang={nav.switchShort.toLowerCase()} aria-label={nav.switchLabel} title={nav.switchLabel}>{nav.switchShort}</a>
          <a className="btn btn-small nav-cta" href={home + '#builder'}>{nav.cta}</a>
          <button type="button" className="menu-toggle" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>{open ? nav.close : nav.menu}</button>
        </div>
      </nav>
      {open && (
        <div className="mobile-nav" id="mobile-nav">
          {mobileLinks.map(([label, url]) => <a key={url + label} href={url} onClick={() => setOpen(false)}>{label}</a>)}
          <a href={switchHref} hrefLang={nav.switchShort.toLowerCase()} lang={nav.switchShort.toLowerCase()}>{nav.switchLabel}</a>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const { footer, nav } = useContent();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <a className="brand" href={nav.home}><b>promptuj<span>ai</span></b></a>
            <p>{footer.about}</p>
          </div>
          {footer.columns.map(([title, links]) => (
            <nav key={title} aria-label={title}>
              <h2>{title}</h2>
              <ul>{links.map(([label, url]) => <li key={url + label}><a href={url.startsWith('#') ? nav.home + url : url}>{label}</a></li>)}</ul>
            </nav>
          ))}
        </div>
        <div className="footer-bottom">
          <span>{footer.note}</span>
          <span><a className="link" href="https://github.com/Dejvo50xa/ai-guide" target="_blank" rel="noopener noreferrer">{footer.source} ↗</a> · © {new Date().getFullYear()} promptuj.ai</span>
        </div>
      </div>
    </footer>
  );
}
