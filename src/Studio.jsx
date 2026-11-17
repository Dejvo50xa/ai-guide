import { createContext, useContext, useState } from 'react';
import { Mark, SectionHead } from './Explore.jsx';
import { copyText } from './clipboard.js';
import { useContent } from './i18n.jsx';

const StudioContext = createContext(null);
const KEY = 'promptujai.library.v1';
const fieldKeys = ['title', 'role', 'context', 'task', 'sources', 'criteria', 'format'];

function loadLibrary() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(data) ? data.filter(x => x && typeof x.id === 'string' && typeof x.title === 'string' && typeof x.prompt === 'string' && x.fields && fieldKeys.every(k => typeof x.fields[k] === 'string')) : [];
  } catch { return []; }
}

// Scroll to the builder and move keyboard focus there too, so the next Tab continues inside it.
function scrollToBuilder() {
  document.getElementById('builder')?.scrollIntoView({ behavior: 'instant' });
  document.getElementById('builder-title')?.focus({ preventScroll: true });
}

// Shared builder state, so the task launcher, career paths and library can all load prompts into the builder.
export function StudioProvider({ children }) {
  const { builder } = useContent();
  const empty = { title: '', role: '', context: '', task: '', sources: '', criteria: '', format: builder.formats[0] };
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(empty);
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState('');
  const [library, setLibrary] = useState(loadLibrary);
  // What the draft looked like after the last load or save; only edits beyond it count as unsaved.
  const [baseline, setBaseline] = useState(empty);
  const dirty = fieldKeys.some(k => draft[k] !== baseline[k]);
  function persist(next) {
    try { localStorage.setItem(KEY, JSON.stringify(next)); setLibrary(next); return true; }
    catch { setNotice(builder.notices.storageFailed); return false; }
  }
  function load(fields, message, confirmText) {
    if (dirty && !window.confirm(confirmText || builder.confirmReplace)) return false;
    const next = { ...empty, ...fields };
    setDraft(next);
    setBaseline(next);
    setNotice(message);
    scrollToBuilder();
    return true;
  }
  function choose(preset) {
    if (load(preset.fields, builder.notices.loaded)) { setEditing(null); setSelected(preset); }
  }
  const value = { editing, setEditing, draft, setDraft, setBaseline, selected, setSelected, notice, setNotice, library, persist, choose, load };
  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function TaskLauncher() {
  const { tasks, presets } = useContent();
  const { choose } = useContext(StudioContext);
  return (
    <section className="section wrap" id="ukoly" aria-labelledby="ukoly-title" style={{ paddingTop: 56 }}>
      <SectionHead id="ukoly-title" kicker={tasks.kicker} title={tasks.title} text={tasks.text} />
      <div className="task-grid">
        {presets.map((p, i) => (
          <button type="button" className="task clickable" key={p.id} onClick={() => choose(p)}>
            <small>0{i + 1}</small><strong>{p.name}</strong><span>{p.tool}</span><b aria-hidden="true">↗</b>
          </button>
        ))}
      </div>
    </section>
  );
}

function download(data, name, type) {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function PromptStudio() {
  const { builder, library: lib, presets } = useContent();
  const { editing, setEditing, draft, setDraft, setBaseline, selected, setSelected, notice, setNotice, library, persist, choose, load } = useContext(StudioContext);
  // The format alone (always preset) doesn't make a prompt; show the empty state until real content exists.
  const hasContent = ['role', 'context', 'task', 'sources', 'criteria'].some(k => draft[k].trim());
  const prompt = !hasContent ? '' : ['role', 'context', 'task', 'sources', 'criteria', 'format']
    .filter(k => draft[k].trim())
    .map(k => `${builder.parts[k]}: ${draft[k].trim()}`)
    .join('\n\n');
  // A prompt saved on the other language version may use a format label this language doesn't list.
  const formats = builder.formats.includes(draft.format) ? builder.formats : [draft.format, ...builder.formats];
  const set = key => e => setDraft({ ...draft, [key]: e.target.value });

  function save() {
    if (!draft.title.trim() || !draft.task.trim()) { setNotice(builder.notices.needTitle); return; }
    const item = { id: editing || crypto.randomUUID(), title: draft.title.trim(), prompt, fields: { ...draft }, updated: new Date().toISOString() };
    const next = editing ? library.map(x => x.id === editing ? item : x) : [item, ...library];
    if (persist(next)) { setEditing(item.id); setBaseline({ ...draft }); setNotice(builder.notices.saved); }
  }
  async function copy(text) { setNotice((await copyText(text)) ? builder.notices.copied : builder.notices.copyFailed); }
  function edit(item) {
    if (load(item.fields, builder.notices.editing, lib.confirmLoad)) { setSelected(null); setEditing(item.id); }
  }
  function remove(item) {
    if (window.confirm(lib.confirmDelete(item.title)) && persist(library.filter(x => x.id !== item.id))) {
      if (editing === item.id) setEditing(null);
      setNotice(builder.notices.deleted);
    }
  }

  return (
    <section id="builder" className="section band" aria-labelledby="builder-title">
      <div className="wrap">
        <SectionHead id="builder-title" kicker={builder.kicker} title={builder.title} text={builder.text} />
        <div className="chips" role="group" aria-label={builder.presetsLabel}>
          {presets.map(p => <button type="button" className="chip" key={p.id} onClick={() => choose(p)}>{p.fields.title}</button>)}
          <a className="chip" href="#knihovna" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>{builder.libraryLink(library.length)} ↓</a>
        </div>
        {selected && <div className="callout"><span className="icon"><Mark kind="check" /></span><p><strong>{selected.tool}</strong><br />{selected.steps}</p></div>}
        <div className="studio">
          <div className="studio-fields">
            {builder.fields.map(([key, label]) => (
              <label className="field" key={key}>{label}
                {key === 'title' ? <input maxLength={120} value={draft[key]} onChange={set(key)} /> : <textarea rows={key === 'role' ? 2 : 3} value={draft[key]} onChange={set(key)} />}
              </label>
            ))}
            <label className="field">{builder.formatLabel}
              <select value={draft.format} onChange={set('format')}>{formats.map(x => <option key={x}>{x}</option>)}</select>
            </label>
          </div>
          <div className="studio-output">
            <div className="label label-strong">{builder.output}</div>
            <pre className={'prompt-box' + (prompt ? '' : ' empty')}>{prompt || builder.emptyOutput}</pre>
            <div className="studio-actions">
              <button type="button" className="btn" onClick={() => copy(prompt)} disabled={!prompt}>{builder.copy}</button>
              <button type="button" className="btn btn-secondary" onClick={save}>{editing ? builder.update : builder.save}</button>
              <button type="button" className="btn btn-secondary" onClick={() => download(prompt, builder.fileName, 'text/plain;charset=utf-8')} disabled={!prompt}>{builder.export}</button>
            </div>
            <p className="status" role="status">{notice}</p>
            <p className="note">{builder.privacy}</p>
            <p className="note">{builder.source} <a className="link" href="https://developers.openai.com/api/docs/guides/reasoning-best-practices" target="_blank" rel="noopener noreferrer">{builder.sourceLink} ↗</a>. {builder.sourceNote}</p>
          </div>
        </div>

        <section id="knihovna" className="library" aria-labelledby="knihovna-title">
          <SectionHead id="knihovna-title" kicker={lib.kicker} title={lib.title} text={lib.text}>
            <button type="button" className="btn btn-secondary" disabled={!library.length} onClick={() => download(JSON.stringify({ version: 1, prompts: library }, null, 2), lib.fileName, 'application/json')}>{lib.export}</button>
          </SectionHead>
          {!library.length ? <p className="note">{lib.empty}</p> : (
            <div className="grid cols-3">
              {library.map(item => (
                <article className="card library-item" key={item.id}>
                  <h3>{item.title}</h3>
                  <p>{item.fields.task}</p>
                  <div className="studio-actions">
                    <button type="button" className="btn btn-small btn-secondary" onClick={() => edit(item)}>{lib.edit}</button>
                    <button type="button" className="btn btn-small btn-secondary" onClick={() => copy(item.prompt)}>{lib.copy}</button>
                    <button type="button" className="btn btn-small btn-secondary" onClick={() => remove(item)}>{lib.remove}</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

export { StudioContext };
