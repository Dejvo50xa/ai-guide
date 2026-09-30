import { useContext, useEffect, useRef, useState } from 'react';
import { Mark, SectionHead } from './Explore.jsx';
import { copyText } from './clipboard.js';
import { StudioContext } from './Studio.jsx';
import { useContent } from './i18n.jsx';
import { checkPrompt, MIN_LENGTH } from './practice.mjs';
import { normalize } from './text.mjs';

export function Paths() {
  const { paths } = useContent();
  const { choose } = useContext(StudioContext);
  const [active, setActive] = useState(paths.items[0].id);
  const path = paths.items.find(p => p.id === active);
  return (
    <section id="profese" className="section wrap" aria-labelledby="profese-title">
      <SectionHead id="profese-title" kicker={paths.kicker} title={paths.title} text={paths.text} />
      <div className="chips" role="group" aria-label={paths.tabsLabel}>
        {paths.items.map(p => <button type="button" key={p.id} className="chip" aria-pressed={p.id === active} onClick={() => setActive(p.id)}>{p.name}</button>)}
      </div>
      <p className="path-intro" aria-live="polite">{path.intro}</p>
      <div className="grid cols-3">
        {path.tasks.map(task => (
          <article className="card path-task" key={task.title}>
            <h3>{task.title}</h3>
            <p className="situation"><span className="sr-only">{paths.situation}: </span>{task.situation}</p>
            <div>
              <h4>{paths.checksTitle}</h4>
              <ul className="check-list" style={{ marginTop: 8 }}>{task.checks.map(c => <li key={c}><Mark kind="check" /><span>{c}</span></li>)}</ul>
            </div>
            <button type="button" className="btn btn-secondary" onClick={() => choose({ id: path.id + ':' + task.title, tool: paths.tool, steps: task.situation, fields: task.fields })}>{paths.open} <Mark kind="arrow" /></button>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Roadmap() {
  const { roadmap } = useContent();
  return (
    <section id="cesta" className="section band" aria-labelledby="cesta-title">
      <div className="wrap">
        <SectionHead id="cesta-title" kicker={roadmap.kicker} title={roadmap.title} text={roadmap.text} />
        <ol className="grid cols-4" style={{ listStyle: 'none', padding: 0 }}>
          {roadmap.items.map((r, i) => (
            <li className="card level" key={r.name}>
              <div className="level-top"><span className="level-num">{i + 1}</span><span>{r.weeks}</span></div>
              <small>{r.lvl}</small>
              <h3>{r.name}</h3>
              <ul>{r.items.map(it => <li key={it}>{it}</li>)}</ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function CopyButton({ text, labels, className = 'btn btn-small btn-secondary' }) {
  const [state, setState] = useState('idle');
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    setState((await copyText(text)) ? 'done' : 'error');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 2200);
  }
  return <button type="button" className={className} onClick={copy}><span aria-live="polite">{state === 'done' ? '✓ ' + labels.copied : state === 'error' ? labels.copyFailed : labels.copy}</span></button>;
}

function TechniqueDialog({ t, labels, onClose }) {
  const ref = useRef(null);
  // Close natively first so the page stops being inert and focus can return to the opener,
  // then tell React. The native 'close' event is only a fallback; it isn't dispatched reliably.
  const dismiss = () => { if (ref.current?.open) ref.current.close(); onClose(); };
  // No close() in cleanup: it would fire onClose during StrictMode's effect re-run. Removing the
  // element from the page already ends the modal state.
  useEffect(() => {
    const el = ref.current;
    if (!el.open) el.showModal();
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = ''; };
  }, []);
  return (
    <dialog ref={ref} className="sheet" aria-labelledby="technique-title" onClose={onClose} onCancel={e => { e.preventDefault(); dismiss(); }} onClick={e => { if (e.target === e.currentTarget) dismiss(); }}>
      <div className="sheet-body">
        <div className="sheet-head">
          <div><span className="kicker">{labels.dialogKicker}</span><h2 id="technique-title">{t.name}</h2></div>
          <button type="button" className="close" aria-label={labels.close} onClick={dismiss}>×</button>
        </div>
        <p>{t.co}</p>
        <div><div className="label label-weak">✗ {labels.weak}</div><div className="prompt-box prompt-weak">{t.spatne}</div></div>
        <div>
          <div className="label label-strong">✓ {labels.strong} <CopyButton text={t.dobre} labels={{ copy: labels.copy, copied: labels.copied, copyFailed: labels.copyFailed }} /></div>
          <div className="prompt-box">{t.dobre}</div>
        </div>
        <div className="callout" style={{ marginTop: 0 }}><span className="icon"><Mark /></span><p><strong>{labels.tip}:</strong> {t.tip}</p></div>
      </div>
    </dialog>
  );
}

export function Techniques() {
  const { techniques, templates, mistakes } = useContent();
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(null);
  const opener = useRef(null);
  const shown = techniques.items.filter(t => filter === 'all' || String(t.lvl) === filter);
  function close() { setOpen(null); opener.current?.focus(); }
  return (
    <>
      <section id="techniky" className="section wrap" aria-labelledby="techniky-title">
        <SectionHead id="techniky-title" kicker={techniques.kicker} title={techniques.title} text={techniques.text} />
        <div className="chips" role="group" aria-label={techniques.filterLabel} style={{ marginBottom: 20 }}>
          {techniques.filters.map(([id, label]) => <button type="button" key={id} className="chip" aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>)}
        </div>
        <div className="grid cols-3">
          {shown.map(t => (
            <button type="button" key={t.id} className="card technique clickable" data-level={t.lvl} aria-haspopup="dialog" onClick={e => { opener.current = e.currentTarget; setOpen(t); }}>
              <span className="technique-top"><span className="icon"><Mark kind="book" /></span><span className="tag">{t.tag}</span></span>
              <h3>{t.name}</h3>
              <p>{t.kdy}</p>
              <span className="more">{techniques.show} →</span>
            </button>
          ))}
        </div>
        {open && <TechniqueDialog t={open} labels={{ ...techniques, copy: templates.copy, copied: templates.copied, copyFailed: templates.copyFailed }} onClose={close} />}

        <div className="subhead">
          <span className="kicker">{mistakes.kicker}</span>
          <h3>{mistakes.title}</h3>
          <p>{mistakes.text}</p>
        </div>
        <ul className="grid cols-2" style={{ listStyle: 'none', padding: 0 }}>
          {mistakes.items.map(m => <li className="mistake" key={m.p}><strong>{m.p}</strong><span>{m.fix}</span></li>)}
        </ul>
      </section>
    </>
  );
}

export function Practice() {
  const { practice, lang } = useContent();
  const [active, setActive] = useState(practice.exercises[0].id);
  const [drafts, setDrafts] = useState({});
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showModel, setShowModel] = useState(false);
  const exercise = practice.exercises.find(e => e.id === active);
  const text = drafts[active] || '';

  function select(id) { setActive(id); setResults(null); setError(''); setShowModel(false); }
  function check() {
    if (!text.trim()) { setError(practice.empty); setResults(null); return; }
    setError(text.trim().length < MIN_LENGTH ? practice.tooShort : '');
    setResults(checkPrompt(text, lang));
  }
  function reset() { setDrafts({ ...drafts, [active]: '' }); setResults(null); setError(''); setShowModel(false); }
  const found = results ? results.filter(r => r.found).length : 0;

  return (
    <section id="trenink" className="section band" aria-labelledby="trenink-title">
      <div className="wrap">
        <SectionHead id="trenink-title" kicker={practice.kicker} title={practice.title} text={practice.text} />
        <div className="chips" role="group" aria-label={practice.tabsLabel} style={{ marginBottom: 20 }}>
          {practice.exercises.map((e, i) => <button type="button" key={e.id} className="chip" aria-pressed={e.id === active} onClick={() => select(e.id)}>{i + 1}. {e.title}</button>)}
        </div>
        <div className="practice">
          <div className="card practice-main">
            <div><div className="label label-weak">{practice.weakLabel}</div><div className="prompt-box prompt-weak">{exercise.weak}</div></div>
            <div><div className="label">{practice.situationLabel}</div><p style={{ color: 'var(--ink)' }}>{exercise.situation}</p></div>
            <label className="field">{practice.inputLabel}
              <textarea rows={7} placeholder={practice.placeholder} value={text} aria-invalid={error === practice.empty || undefined} aria-describedby="practice-error"
                onChange={e => { setDrafts({ ...drafts, [active]: e.target.value }); if (error) setError(''); }} />
            </label>
            <p id="practice-error" className="status" role="status" style={{ color: 'var(--warn)' }}>{error}</p>
            <div className="practice-buttons">
              <button type="button" className="btn" onClick={check}>{practice.check}</button>
              <button type="button" className="btn btn-secondary" aria-expanded={showModel} aria-controls="practice-model" onClick={() => setShowModel(!showModel)}>{showModel ? practice.hide : practice.reveal}</button>
              {text && <button type="button" className="btn btn-secondary" onClick={reset}>{practice.reset}</button>}
            </div>
          </div>
          <div className="card results" aria-live="polite">
            {results ? (
              <>
                <h3>{practice.resultTitle(found, results.length)}</h3>
                <ul className="result-list">
                  {results.map(r => {
                    const meta = practice.checks.find(c => c.id === r.id);
                    return <li key={r.id} className={r.found ? 'found' : 'missing'}><span className="mark" aria-hidden="true">{r.found ? '✓' : '!'}</span><div><strong>{meta.label}</strong>{!r.found && <span>{meta.hint}</span>}</div></li>;
                  })}
                </ul>
                {found === results.length && <p>{practice.allDone}</p>}
              </>
            ) : (
              <ul className="result-list">
                {practice.checks.map(c => <li key={c.id}><span className="mark" aria-hidden="true" style={{ border: '1px solid var(--line-strong)' }}>·</span><div><strong>{c.label}</strong><span>{c.hint}</span></div></li>)}
              </ul>
            )}
            <p className="note">{practice.note}</p>
          </div>
        </div>
        <div id="practice-model" className="card model-answer" hidden={!showModel} style={{ marginTop: 20 }}>
          <div className="label label-strong">{practice.modelLabel}</div>
          <pre className="prompt-box">{exercise.model}</pre>
          <p><strong>{practice.whyLabel}:</strong> {exercise.why}</p>
        </div>
      </div>
    </section>
  );
}

function LoopSimulator() {
  const { loop } = useContent();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setStep(p => (p + 1) % loop.steps.length), 1700);
    return () => clearTimeout(t);
  }, [playing, step, loop.steps.length]);
  const cur = loop.steps[step];
  const R = 118, c = 150;
  const go = i => { setPlaying(false); setStep(i); };
  return (
    <div className="loop">
      <svg viewBox="0 0 300 300" role="group" aria-label={loop.stepsLabel}>
        <circle cx={c} cy={c} r={R} fill="none" stroke="var(--line-strong)" strokeDasharray="4 6" />
        {loop.steps.map((st, i) => {
          const a = (i / loop.steps.length) * Math.PI * 2 - Math.PI / 2;
          const x = c + Math.cos(a) * R, y = c + Math.sin(a) * R;
          return (
            <g key={st.k} className={'loop-node' + (i === step ? ' on' : '')} role="button" tabIndex={0} aria-label={`${i + 1}. ${st.name}`} aria-pressed={i === step}
              onClick={() => go(i)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(i); } }}>
              <circle cx={x} cy={y} r={i === step ? 24 : 19} />
              <text x={x} y={y + 5} textAnchor="middle">{i + 1}</text>
            </g>
          );
        })}
        <circle className="loop-center" cx={c} cy={c} r="48" />
        <text x={c} y={c - 2} textAnchor="middle" fill="var(--accent)" style={{ font: '800 13px var(--head)', letterSpacing: 1 }}>{cur.k}</text>
        <text x={c} y={c + 16} textAnchor="middle" fill="var(--muted)" style={{ font: '500 12px var(--body)' }}>{cur.name}</text>
      </svg>
      <div className="loop-panel">
        <div className="studio-actions">
          <button type="button" className="btn" onClick={() => setPlaying(!playing)}>{playing ? '❚❚ ' + loop.pause : '▶ ' + loop.play}</button>
          <button type="button" className="btn btn-secondary" onClick={() => go((step + 1) % loop.steps.length)}>{loop.next} →</button>
        </div>
        <div className="card" aria-live="polite" style={{ display: 'grid', gap: 12 }}>
          <span className="loop-step">{step + 1}. {cur.k} · {cur.name}</span>
          <div className="prompt-box loop-code">{cur.txt}</div>
          <p>{cur.detail}</p>
        </div>
        <div className="loop-progress" aria-hidden="true">{loop.steps.map((s, i) => <span key={s.k} className={i === step ? 'on' : ''} />)}</div>
      </div>
    </div>
  );
}

export function Agents() {
  const { agents, loop } = useContent();
  return (
    <>
      <section id="agenti" className="section wrap" aria-labelledby="agenti-title">
        <SectionHead id="agenti-title" kicker={agents.kicker} title={agents.title} text={agents.text} />
        <div className="grid cols-3">
          {agents.parts.map(p => <article className="card part" key={p.name}><span className="icon"><Mark kind="flow" /></span><h3>{p.name}</h3><p>{p.desc}</p></article>)}
        </div>
        <div className="subhead"><h3>{agents.archTitle}</h3><p>{agents.archText}</p></div>
        <div className="grid">
          {agents.architectures.map(a => (
            <article className="card arch" key={a.name}>
              <span className="arch-level">{a.lvl}</span>
              <div>
                <h4>{a.name}</h4>
                <p>{a.how}</p>
                <dl><div><dt>{agents.when}:</dt><dd>{a.when}</dd></div><div><dt>{agents.uses}:</dt><dd>{a.uses}</dd></div></dl>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section id="smycka" className="section band" aria-labelledby="smycka-title">
        <div className="wrap">
          <SectionHead id="smycka-title" kicker={loop.kicker} title={loop.title} text={loop.text} />
          <LoopSimulator />
          <div className="subhead"><h3>{loop.principlesTitle}</h3><p>{loop.principlesText}</p></div>
          <div className="grid cols-3">
            {loop.principles.map(p => <article className="card part" key={p.name}><span className="icon"><Mark kind="check" /></span><h3>{p.name}</h3><p>{p.desc}</p></article>)}
          </div>
        </div>
      </section>
    </>
  );
}

export function Templates() {
  const { templates } = useContent();
  return (
    <section id="sablony" className="section wrap" aria-labelledby="sablony-title">
      <SectionHead id="sablony-title" kicker={templates.kicker} title={templates.title} text={templates.text} />
      <div className="grid cols-2">
        {templates.items.map(s => (
          <article className="card template" key={s.name}>
            <div className="template-top"><h3>{s.name}</h3><span className="tag">{s.tag}</span></div>
            <pre className="prompt-box">{s.text}</pre>
            <CopyButton text={s.text} labels={templates} />
          </article>
        ))}
      </div>
    </section>
  );
}

export function Glossary() {
  const { glossary, locale } = useContent();
  const [q, setQ] = useState('');
  const query = normalize(q.trim());
  const items = glossary.items.filter(g => normalize(g.t + ' ' + g.d).includes(query)).sort((a, b) => a.t.localeCompare(b.t, locale));
  return (
    <section id="slovnik" className="section band" aria-labelledby="slovnik-title">
      <div className="wrap">
        <SectionHead id="slovnik-title" kicker={glossary.kicker} title={glossary.title} text={glossary.text} />
        <label className="field search glossary-search"><span className="sr-only">{glossary.searchLabel}</span><Mark kind="search" /><input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder={glossary.placeholder(glossary.items.length)} /></label>
        <dl className="grid cols-3">
          {items.map(g => <div className="card term" key={g.t}><dt>{g.t}</dt><dd>{g.d}</dd></div>)}
        </dl>
        <p className="status" role="status">{items.length ? '' : glossary.empty(q)}</p>
      </div>
    </section>
  );
}

export function Faq() {
  const { faq } = useContent();
  return (
    <section id="faq" className="section wrap" aria-labelledby="faq-title">
      <SectionHead id="faq-title" kicker={faq.kicker} title={faq.title} />
      <div className="faq">
        {faq.items.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
      </div>
    </section>
  );
}
