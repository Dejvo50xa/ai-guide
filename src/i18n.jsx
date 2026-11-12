import { createContext, createElement, StrictMode, useContext } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';

const ContentContext = createContext(null);
export const useContent = () => useContext(ContentContext);

// Each HTML page declares its language on <html lang>; only that language's content is downloaded.
export function mount(Page) {
  const root = document.getElementById('root');
  const en = document.documentElement.lang === 'en';
  (en ? import('./content/en.js') : import('./content/cs.js'))
    .then(({ default: content }) => {
      // Render synchronously: content arrives after the browser's own jump to #fragment, so we
      // scroll to it ourselves once the sections exist.
      flushSync(() => createRoot(root).render(
        <StrictMode>
          <ContentContext.Provider value={content}>{createElement(Page)}</ContentContext.Provider>
        </StrictMode>,
      ));
      const id = decodeURIComponent(location.hash.slice(1));
      if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'instant' });
    })
    .catch(() => {
      // Usually a stale cached page after a deploy or a dropped connection; a reload fixes both.
      root.innerHTML = en
        ? '<p class="load-error">The page couldn’t load. Check your connection and <a href="">reload</a>.</p>'
        : '<p class="load-error">Stránku se nepodařilo načíst. Zkontroluj připojení a <a href="">načti ji znovu</a>.</p>';
    });
}
