import { createContext, createElement, StrictMode, useContext } from 'react';
import { createRoot } from 'react-dom/client';

const ContentContext = createContext(null);
export const useContent = () => useContext(ContentContext);

// Each HTML page declares its language on <html lang>; only that language's content is downloaded.
export function mount(Page) {
  const load = document.documentElement.lang === 'en' ? import('./content/en.js') : import('./content/cs.js');
  load.then(({ default: content }) => {
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <ContentContext.Provider value={content}>{createElement(Page)}</ContentContext.Provider>
      </StrictMode>,
    );
  });
}
