import { useEffect, useMemo, useRef, useState } from 'react';
import SiteNav, { Footer } from './SiteNav.jsx';
import { Mark } from './Explore.jsx';
import { copyText } from './clipboard.js';
import snapshot from './data/repositories.json';
import { selectRepositories, validCachedStats } from './catalog-utils.mjs';
import { useContent } from './i18n.jsx';

const cacheKey = 'promptujai-repository-stars-v1';
const ids = snapshot.map(r => r.id);
const PAGE = 12;

function loadCache() { try { return validCachedStats(JSON.parse(localStorage.getItem(cacheKey)), ids); } catch { return {}; } }

function RepoCard({ repo }) {
  const { catalog: c, locale } = useContent();
  const [state, setState] = useState('idle');
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  const number = new Intl.NumberFormat(locale);
  const date = value => new Date(value).toLocaleDateString(locale);
  const prompt = `${c.promptIntro(repo.url)}\n${c.promptTask} ${repo.prompt}\n${c.promptOutro}`;
  async function copy() {
    setState((await copyText(prompt)) ? 'done' : 'error');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 2500);
  }
  return (
    <article className="repo-card">
      <div className="repo-card-top">
        <span className="tag">{c.types[repo.type]}</span>
        <a className="repo-stars" href={repo.url + '/stargazers'} target="_blank" rel="noopener noreferrer" title={c.starsTitle(date(repo.checkedAt))} aria-label={c.starsLabel(number.format(repo.stars))}><Mark kind="star" />{number.format(repo.stars)}</a>
      </div>
      <div>
        <h2><a href={repo.url} target="_blank" rel="noopener noreferrer">{repo.name} <span aria-hidden="true">↗</span></a></h2>
        <span className="repo-id">{repo.id}</span>
      </div>
      <p>{repo.description}</p>
      <div className="repo-tags">{repo.categories.map(id => <span key={id}>{c.categories.find(x => x[0] === id)?.[1]}</span>)}</div>
      {(repo.archived || repo.maintenance) && <p className="repo-warning">{repo.archived ? c.archived : c.maintenance}</p>}
      <details className="repo-setup">
        <summary>{c.setup}</summary>
        <div>
          <p>{repo.setup}</p>
          <a className="link" href={repo.readme} target="_blank" rel="noopener noreferrer">{c.readme} ↗</a>
          <label className="field" htmlFor={'prompt-' + repo.id}>{c.promptLabel}</label>
          <textarea className="input" id={'prompt-' + repo.id} readOnly value={prompt} rows={6} />
          <div><button type="button" className="btn btn-small btn-secondary" onClick={copy}>{state === 'done' ? '✓ ' + c.copied : c.copy}</button></div>
          <span className="status" role="status">{state === 'error' ? c.copyFailed : state === 'done' ? c.copiedStatus : ''}</span>
        </div>
      </details>
      <div className="repo-card-bottom">
        <a className="link" href={repo.url} target="_blank" rel="noopener noreferrer">{c.repoLink} ↗</a>
        <small>{c.dates(date(repo.checkedAt), date(repo.pushedAt))}</small>
      </div>
    </article>
  );
}

export default function RepositoryCatalog() {
  const { catalog: c, nav, lang } = useContent();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [type, setType] = useState('all');
  const [sort, setSort] = useState('stars');
  const [limit, setLimit] = useState(PAGE);
  const [stats, setStats] = useState(loadCache);
  const [refreshing, setRefreshing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [notice, setNotice] = useState('');
  const controller = useRef(null);
  useEffect(() => () => controller.current?.abort(), []);
  // English pages use the translated description, setup and prompt stored under `en`.
  const repos = useMemo(() => snapshot.map(r => ({ ...r, ...(lang === 'en' ? r.en : null), ...stats[r.id] })), [stats, lang]);
  const results = useMemo(() => selectRepositories(repos, { query, category, type, sort }), [repos, query, category, type, sort]);
  const filtered = query || category !== 'all' || type !== 'all' || sort !== 'stars';
  const update = setter => value => { setter(value); setLimit(PAGE); };
  const reset = () => { setQuery(''); setCategory('all'); setType('all'); setSort('stars'); setLimit(PAGE); };

  async function refresh() {
    if (controller.current) return;
    const abort = new AbortController();
    controller.current = abort;
    setRefreshing(true); setProgress(0); setNotice('');
    const next = { ...stats };
    let success = 0, done = 0, rateLimited = false;
    try {
      for (let i = 0; i < snapshot.length && !rateLimited; i += 4) {
        await Promise.all(snapshot.slice(i, i + 4).map(async repo => {
          const timeout = setTimeout(() => abort.abort(), 20000);
          try {
            const response = await fetch('https://api.github.com/repos/' + repo.id, { signal: abort.signal, headers: { Accept: 'application/vnd.github+json' } });
            if (response.status === 403 || response.status === 429) { rateLimited = true; return; }
            if (!response.ok) throw new Error('GitHub request failed');
            const data = await response.json();
            if (!Number.isSafeInteger(data.stargazers_count) || data.stargazers_count < 0) throw new Error('Invalid star count');
            next[repo.id] = { stars: data.stargazers_count, checkedAt: new Date().toISOString() };
            success++;
          } catch { /* Keep the dated snapshot when GitHub is unavailable. */ }
          finally { clearTimeout(timeout); done++; if (!abort.signal.aborted) setProgress(done); }
        }));
        if (abort.signal.aborted) break;
      }
      setStats(next);
      try { localStorage.setItem(cacheKey, JSON.stringify(next)); } catch { /* Cache is optional. */ }
      setNotice(success === snapshot.length ? c.refreshedAll : c.refreshedSome(success, snapshot.length, rateLimited));
    } finally { controller.current = null; setRefreshing(false); }
  }

  const [foundA, foundN, foundB] = c.found(results.length, snapshot.length);
  return (
    <>
      <a className="skip-link" href="#catalog-results">{c.skip}</a>
      <SiteNav catalog />
      <main className="wrap">
        <a className="repo-back" href={nav.home}>{c.back}</a>
        <section className="repo-hero" aria-labelledby="catalog-hero">
          <div>
            <span className="kicker">{c.kicker}</span>
            <h1 id="catalog-hero">{c.title[0]}<br />{c.title[1]}<em>{c.title[2]}</em></h1>
            <p>{c.text}</p>
            <a href="#catalog-results" className="btn">{c.browse} <span aria-hidden="true">↓</span></a>
          </div>
          <aside className="repo-stat">
            <span className="kicker">{c.asideKicker}</span>
            <strong>{snapshot.length}</strong>
            <p>{c.asideText}</p>
            <div><b>{c.categories.length - 1}</b> {c.areas} · <b>{Object.keys(c.types).length}</b> {c.toolTypes}</div>
            <small>{c.asideNote}</small>
          </aside>
        </section>
        <section className="repo-explainer" aria-label={c.explainerLabel}>
          {c.explainer.map(([title, text]) => <div key={title}><b>{title}</b><p>{text}</p></div>)}
        </section>
        <section id="catalog-results" className="repo-browser" aria-labelledby="catalog-title">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <div><span className="kicker">{c.listKicker}</span><h2 id="catalog-title">{c.listTitle}</h2></div>
            <button type="button" className="btn btn-secondary" onClick={refresh} disabled={refreshing}>{refreshing ? c.refreshing(progress, snapshot.length) : c.refresh + ' ↻'}</button>
          </div>
          <p className="note" style={{ marginTop: 14 }}>{c.sourceNote}</p>
          <p role="status" className="repo-notice status">{notice}</p>
          <div className="repo-filters">
            <label className="field">{c.search}<input type="search" placeholder={c.searchPlaceholder} value={query} onChange={e => update(setQuery)(e.target.value)} /></label>
            <label className="field">{c.type}<select value={type} onChange={e => update(setType)(e.target.value)}><option value="all">{c.allTypes}</option>{Object.entries(c.types).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
            <label className="field">{c.sort}<select value={sort} onChange={e => update(setSort)(e.target.value)}>{c.sorts.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
          </div>
          <div className="chips" role="group" aria-label={c.areaLabel}>
            {c.categories.map(([id, label]) => <button type="button" key={id} className="chip" aria-pressed={id === category} onClick={() => update(setCategory)(id)}>{label}<small>{id === 'all' ? repos.length : repos.filter(r => r.categories.includes(id)).length}</small></button>)}
          </div>
          <div className="repo-results-line">
            <p aria-live="polite">{foundA}<strong>{foundN}</strong>{foundB}</p>
            <button type="button" className="btn btn-small btn-secondary" onClick={reset} disabled={!filtered}>{c.reset}</button>
          </div>
          {results.length ? <div className="repo-grid">{results.slice(0, limit).map(repo => <RepoCard key={repo.id} repo={repo} />)}</div> : (
            <div className="repo-empty card"><h3>{c.emptyTitle}</h3><p className="note">{c.emptyText}</p><button type="button" className="btn" onClick={reset}>{c.showAll}</button></div>
          )}
          {limit < results.length && <div className="repo-load"><button type="button" className="btn" onClick={() => setLimit(n => n + PAGE)}>{c.more(results.length - limit)}</button></div>}
        </section>
        <section className="repo-next" aria-labelledby="catalog-next">
          <div><span className="kicker">{c.nextKicker}</span><h2 id="catalog-next">{c.nextTitle}</h2><p>{c.nextText}</p></div>
          <a className="btn" href={nav.home + '#builder'}>{c.nextCta} ↗</a>
        </section>
      </main>
      <Footer />
    </>
  );
}
