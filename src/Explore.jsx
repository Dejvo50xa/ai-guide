import { useState } from 'react';
import { useContent } from './i18n.jsx';
import { copyText } from './clipboard.js';
import { normalize } from './text.mjs';

const paths = { spark: 'M12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9Z', code: 'm8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18', book: 'M3 4h6l3 2 3-2h6v16h-6l-3 2-3-2H3ZM12 6v16', search: 'M20 20l-5-5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0', flow: 'M4 4h6v6H4Zm10 10h6v6h-6ZM10 7h7v7M7 10v7h7', arrow: 'M4 12h16m-6-6 6 6-6 6', check: 'm5 12 4 4L19 6', star: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L2 9.6l6.2-.9Z' };
export function Mark({ kind = 'spark' }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[kind] || paths.spark} /></svg>;
}

export function SectionHead({ kicker, title, text, children, id }) {
  return (
    <div className="section-head">
      <div>
        <span className="kicker">{kicker}</span>
        <h2 id={id} tabIndex={-1}>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {children}
    </div>
  );
}

export function Hero() {
  const { hero } = useContent();
  return (
    <>
      <section className="hero wrap" id="uvod" aria-labelledby="hero-title">
        <div>
          <span className="kicker">{hero.kicker}</span>
          <h1 id="hero-title">{hero.title[0]}<br />{hero.title[1]}<em>{hero.title[2]}</em></h1>
          <p className="hero-text">{hero.text}</p>
          <div className="hero-actions">
            <a className="btn" href="#ukoly">{hero.primary} <Mark kind="arrow" /></a>
            <a className="btn btn-secondary" href="#cesta">{hero.secondary}</a>
          </div>
        </div>
        <figure className="hero-card" aria-label={hero.cardLabel}>
          <span className="kicker" style={{ margin: 0 }}>{hero.cardLabel}</span>
          <div>
            <div className="label label-weak">{hero.weakLabel}</div>
            <div className="prompt-box prompt-weak">{hero.weak}</div>
          </div>
          <div>
            <div className="label label-strong">{hero.strongLabel}</div>
            <div className="prompt-box">{hero.strong}</div>
          </div>
          <p>{hero.cardNote}</p>
        </figure>
      </section>
      <div className="wrap">
        <div className="proof">
          {hero.proof.map(([n, label]) => <span key={label}><strong>{n}</strong>{label}</span>)}
          <span className="verified">{hero.verified}</span>
        </div>
      </div>
    </>
  );
}

const sources = { OpenAI: 'https://developers.openai.com/api/docs/models', Anthropic: 'https://platform.claude.com/docs/en/models/overview', Google: 'https://ai.google.dev/gemini-api/docs/models' };
const typeIcon = { text: 'spark', image: 'book', video: 'flow', audio: 'flow' };

export function ModelExplorer() {
  const { models } = useContent();
  const [task, setTask] = useState('all');
  const [q, setQ] = useState('');
  const query = normalize(q.trim());
  const visible = models.items.filter(m => (task === 'all' || m.tasks.includes(task)) && normalize([m.name, m.brand, m.tag, m.desc].join(' ')).includes(query));
  return (
    <section id="modely" className="section wrap" aria-labelledby="modely-title">
      <SectionHead id="modely-title" kicker={models.kicker} title={models.title} text={models.text}><span className="tag">{models.verified}</span></SectionHead>
      <div className="model-tools">
        <div className="chips" role="group" aria-label={models.filterLabel}>
          {models.tasks.map(([id, label]) => <button type="button" key={id} className="chip" aria-pressed={task === id} onClick={() => setTask(id)}>{label}</button>)}
        </div>
        <label className="search field"><span className="sr-only">{models.searchLabel}</span><Mark kind="search" /><input type="search" placeholder={models.searchPlaceholder} value={q} onChange={e => setQ(e.target.value)} /></label>
      </div>
      <p className="note" style={{ marginBottom: 20 }}>{models.sourceNote}</p>
      <div className="grid cols-3">
        {visible.map(m => (
          <article className="card model-card" key={m.name}>
            <div className="model-meta"><span>{m.brand}</span><span className="tag">{m.tag}</span></div>
            <span className="icon"><Mark kind={typeIcon[m.type]} /></span>
            <h3>{m.name}</h3>
            <p>{m.desc}</p>
            <div className="tip">{m.tip}</div>
            <a className="link" href={sources[m.brand]} target="_blank" rel="noopener noreferrer">{models.official} ↗</a>
          </article>
        ))}
      </div>
      <p className="status" role="status" style={{ marginTop: 14 }}>{visible.length ? models.results(visible.length) : models.empty}</p>
      <div className="callout"><span className="icon"><Mark kind="search" /></span><p><strong>{models.tipTitle}</strong> {models.tipText}</p></div>
    </section>
  );
}

export function Workflows() {
  const { workflows } = useContent();
  const [active, setActive] = useState(workflows.items[0].id);
  const [status, setStatus] = useState('');
  const current = workflows.items.find(w => w.id === active);
  async function copy() { setStatus((await copyText(current.prompt)) ? workflows.copied : workflows.copyFailed); }
  // On narrow screens the detail sits below the list, so bring it into view after a choice.
  function select(id) {
    setActive(id); setStatus('');
    if (matchMedia('(max-width: 860px)').matches) requestAnimationFrame(() => document.getElementById('workflow-detail')?.scrollIntoView({ block: 'start' }));
  }
  return (
    <section id="workflow" className="section band" aria-labelledby="workflow-title">
      <div className="wrap">
        <SectionHead id="workflow-title" kicker={workflows.kicker} title={workflows.title} text={workflows.text} />
        <div className="workflow">
          <div className="workflow-list" role="group" aria-label={workflows.listLabel}>
            {workflows.items.map((w, i) => (
              <button type="button" key={w.id} aria-pressed={w.id === active} onClick={() => select(w.id)}>
                <span>0{i + 1}</span><strong>{w.title}</strong><small>{w.time}</small>
              </button>
            ))}
          </div>
          <article className="card workflow-detail" id="workflow-detail" aria-live="polite">
            <span className="kicker" style={{ margin: 0 }}>{current.time}</span>
            <h3>{current.title}</h3>
            <p>{current.desc}</p>
            <ol>{current.steps.map(s => <li key={s}>{s}</li>)}</ol>
            <div>
              <div className="label">{workflows.promptLabel} <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 500 }}>{workflows.promptHint}</span></div>
              <pre className="prompt-box">{current.prompt}</pre>
            </div>
            <div><button type="button" className="btn" onClick={copy}>{workflows.copy}</button></div>
            <p className="status" role="status">{status}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
