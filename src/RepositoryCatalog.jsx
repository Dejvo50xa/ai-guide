import {useEffect,useMemo,useRef,useState} from 'react';
import SiteNav from './SiteNav.jsx';
import snapshot from './data/repositories.json';
import {selectRepositories,validCachedStats} from './catalog-utils.mjs';
import './refresh.css';
import './repositories.css';

const categories=[['all','Vše'],['web','UX a webdesign'],['ios','iPhone a SwiftUI'],['android','Android a mobil'],['code','Programování'],['testing','Testování'],['security','Bezpečnost'],['writing','Psaní a čeština'],['marketing','Marketing a SEO'],['docs','Dokumenty'],['data','Data a databáze'],['research','Rešerše a web'],['automation','Automatizace'],['agents','AI agenti'],['video','Video a animace'],['cloud','Cloud a nasazení']];
const types={skill:'Skill',mcp:'MCP server',library:'Knihovna / CLI',platform:'Platforma',collection:'Kolekce'};
const cacheKey='promptujai-repository-stars-v1';
const ids=snapshot.map(r=>r.id);
const number=new Intl.NumberFormat('cs-CZ');
const date=value=>new Date(value).toLocaleDateString('cs-CZ');
function Star(){return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L2 9.6l6.2-.9Z"/></svg>}
function loadCache(){try{return validCachedStats(JSON.parse(localStorage.getItem(cacheKey)),ids)}catch{return {}}}
function RepoCard({repo}){
  const [copied,setCopied]=useState(false);
  const [copyError,setCopyError]=useState(false);
  const timer=useRef();
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  const prompt=`Prostuduj tento repozitář: ${repo.url}\nMůj úkol: ${repo.prompt}\nZjisti, zda je pro můj nástroj a projekt vhodný. Vysvětli způsob zapojení, potřebné přístupy a případné náklady. Nejprve navrhni konkrétní postup.`;
  async function copy(){try{await navigator.clipboard.writeText(prompt);setCopied(true);setCopyError(false);clearTimeout(timer.current);timer.current=setTimeout(()=>setCopied(false),2500)}catch{setCopyError(true)}}
  return <article className="repo-card">
    <div className="repo-card-top"><span className={'repo-type type-'+repo.type}>{types[repo.type]}</span><a className="repo-stars" href={repo.url+'/stargazers'} target="_blank" rel="noopener noreferrer" title={'Hvězdičky načteny '+date(repo.checkedAt)} aria-label={number.format(repo.stars)+' hvězdiček na GitHubu'}><Star/>{number.format(repo.stars)}</a></div>
    <div className="repo-name"><h2><a href={repo.url} target="_blank" rel="noopener noreferrer">{repo.name} <span aria-hidden="true">↗</span></a></h2><span>{repo.id}</span></div>
    <p className="repo-description">{repo.description}</p>
    <div className="repo-tags">{repo.categories.map(id=><span key={id}>{categories.find(c=>c[0]===id)?.[1]}</span>)}</div>
    {(repo.archived||repo.maintenance)&&<p className="repo-maintenance">{repo.archived?'Archivovaný projekt':'Režim údržby'}</p>}
    <details className="repo-setup"><summary>Jak zapojit do AI <span aria-hidden="true">+</span></summary><div><p>{repo.setup}</p><a href={repo.readme} target="_blank" rel="noopener noreferrer">Otevřít návod autora ↗</a><label htmlFor={'prompt-'+repo.id}>Zadání pro tvého asistenta</label><textarea id={'prompt-'+repo.id} readOnly value={prompt} rows={6}/><button type="button" onClick={copy}>{copied?'Zkopírováno':'Kopírovat zadání'}</button><span role="status">{copyError?'Kopírování není dostupné. Označ text v poli a zkopíruj ho ručně.':copied?'Zadání je ve schránce.':''}</span></div></details>
    <div className="repo-card-bottom"><a href={repo.url} target="_blank" rel="noopener noreferrer">Repozitář na GitHubu <span aria-hidden="true">↗</span></a><small>Hvězdičky k {date(repo.checkedAt)} · Kód: {date(repo.pushedAt)}</small></div>
  </article>
}
export default function RepositoryCatalog(){
  const [query,setQuery]=useState('');const [category,setCategory]=useState('all');const [type,setType]=useState('all');const [sort,setSort]=useState('stars');const [limit,setLimit]=useState(12);
  const [stats,setStats]=useState(loadCache);const [refreshing,setRefreshing]=useState(false);const [progress,setProgress]=useState(0);const [notice,setNotice]=useState('');const controller=useRef(null);
  useEffect(()=>()=>controller.current?.abort(),[]);
  const repos=useMemo(()=>snapshot.map(r=>({...r,...stats[r.id]})),[stats]);
  const results=useMemo(()=>selectRepositories(repos,{query,category,type,sort}),[repos,query,category,type,sort]);
  const reset=()=>{setQuery('');setCategory('all');setType('all');setSort('stars');setLimit(12)};
  async function refresh(){
    if(controller.current)return;
    const abort=new AbortController();controller.current=abort;setRefreshing(true);setProgress(0);setNotice('');
    const next={...stats};let success=0,done=0,rateLimited=false;
    try{
      for(let i=0;i<snapshot.length&&!rateLimited;i+=4){
        await Promise.all(snapshot.slice(i,i+4).map(async repo=>{
          const timeout=setTimeout(()=>abort.abort(),20000);
          try{
            const response=await fetch('https://api.github.com/repos/'+repo.id,{signal:abort.signal,headers:{Accept:'application/vnd.github+json'}});
            if(response.status===403||response.status===429){rateLimited=true;return}
            if(!response.ok)throw new Error('GitHub request failed');
            const data=await response.json();
            if(!Number.isSafeInteger(data.stargazers_count)||data.stargazers_count<0)throw new Error('Invalid star count');
            next[repo.id]={stars:data.stargazers_count,checkedAt:new Date().toISOString()};success++;
          }catch{/* Keep the dated snapshot when GitHub is unavailable. */}finally{clearTimeout(timeout);done++;if(!abort.signal.aborted)setProgress(done)}
        }));
        if(abort.signal.aborted)break;
      }
      setStats(next);try{localStorage.setItem(cacheKey,JSON.stringify(next))}catch{/* Cache is optional. */}
      setNotice(success===snapshot.length?'Počty hvězdiček jsou aktualizované.':`Aktualizováno ${success} z ${snapshot.length} repozitářů. ${rateLimited?'GitHub omezil počet požadavků.':'Část dat se nepodařilo načíst.'} U ostatních zůstává poslední dostupný údaj s datem.`);
    }finally{controller.current=null;setRefreshing(false)}
  }
  return <><a className="skip-link" href="#catalog-results">Přejít na repozitáře</a><SiteNav catalog/>
    <main className="repo-page mx">
      <a className="repo-back" href="/">← Zpět na PromptujAI</a>
      <section className="repo-hero"><div><span className="kicker"><span/> KNIHOVNA PRO PRÁCI S AI</span><h1>Najdi repozitář<br/>pro svůj <em>další úkol.</em></h1><p>Skilly pro návrh iPhone aplikace, nástroje na testování webu i pravidla pro lepší české texty. Vyber si oblast a zjisti, jak je zapojit do své práce.</p><a href="#catalog-results" className="solid">Prohlédnout repozitáře <span aria-hidden="true">↓</span></a></div><aside className="repo-hero-aside"><span>VYBRÁNO Z GITHUBU</span><strong>{snapshot.length}</strong><p>repozitářů s popisem<br/>a návodem na zapojení</p><div><b>{categories.length-1}</b> oblastí práce <span> / </span> <b>{Object.keys(types).length}</b> typů nástrojů</div><small>Řazení podle hvězdiček ukazuje popularitu. Jde o vybraný katalog, nikoli žebříček celého GitHubu.</small></aside></section>
      <section className="repo-explainer" aria-label="Způsoby zapojení"><div><b>Skill</b><p>Postup a podklady, podle kterých agent pracuje.</p></div><div><b>MCP server</b><p>Připojení asistenta k nástrojům a datům.</p></div><div><b>Knihovna nebo platforma</b><p>Základ vlastní aplikace či workflow, který vyžaduje nastavení.</p></div></section>
      <section id="catalog-results" className="repo-browser" aria-labelledby="catalog-title">
        <div className="repo-section-heading"><div><span className="kicker">VYBER PODLE TOHO, CO DĚLÁŠ</span><h2 id="catalog-title">Katalog repozitářů</h2></div><button className="repo-refresh" onClick={refresh} disabled={refreshing}>{refreshing?`Načítám ${progress}/${snapshot.length}…`:'Obnovit hvězdičky ↻'}</button></div>
        <p className="repo-source-note">Zdroj počtů: GitHub API. Po obnovení se hodnoty uloží v tomto prohlížeči; datum najdeš u každého repozitáře.</p>
        <p role="status" className="repo-notice">{notice}</p>
        <div className="repo-filters"><label className="repo-search">Hledat repozitář<input type="search" placeholder="Např. SwiftUI, testování, dokumenty…" value={query} onChange={e=>{setQuery(e.target.value);setLimit(12)}}/></label><label>Typ zapojení<select aria-label="Typ zapojení" value={type} onChange={e=>{setType(e.target.value);setLimit(12)}}><option value="all">Všechny typy</option>{Object.entries(types).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label><label>Seřadit<select aria-label="Seřadit" value={sort} onChange={e=>{setSort(e.target.value);setLimit(12)}}><option value="stars">Nejvíce hvězdiček</option><option value="name">Název A–Z</option><option value="updated">Poslední změna kódu</option></select></label></div>
        <div className="repo-categories" role="group" aria-label="Oblast práce">{categories.map(([id,label])=><button key={id} aria-pressed={id===category} onClick={()=>{setCategory(id);setLimit(12)}}>{label}<span>{id==='all'?repos.length:repos.filter(r=>r.categories.includes(id)).length}</span></button>)}</div>
        <div className="repo-results-line"><p aria-live="polite">Nalezeno <strong>{results.length}</strong> / {snapshot.length} repozitářů</p><button onClick={reset} disabled={!query&&category==='all'&&type==='all'&&sort==='stars'}>Zrušit filtry</button></div>
        {results.length?<div className="repo-grid">{results.slice(0,limit).map(repo=><RepoCard key={repo.id} repo={repo}/>)}</div>:<div className="repo-empty"><h3>Pro tuto kombinaci nic nemáme.</h3><p>Zkus kratší výraz nebo jiný typ nástroje.</p><button className="solid" onClick={reset}>Zobrazit celý katalog</button></div>}
        {limit<results.length&&<div className="repo-load"><button className="solid" onClick={()=>setLimit(n=>n+12)}>Zobrazit další repozitáře ({results.length-limit})</button></div>}
      </section>
      <section className="repo-next"><div><span className="kicker">OD REPOZITÁŘE K PRVNÍMU ÚKOLU</span><h2>Začni jedním nástrojem.</h2><p>Otevři návod autora a ověř podporu svého asistenta. V kartě najdeš zadání, které si můžeš upravit a vložit do AI. Konkrétní instalaci zvol podle svého prostředí.</p></div><a className="solid" href="/#builder">Připravit vlastní zadání ↗</a></section>
    </main><footer className="repo-footer mx"><a className="brand" href="/">promptuj<span>ai</span></a><p>Katalog spravuje PromptujAI · <a href="https://github.com/Dejvo50xa/ai-guide" target="_blank" rel="noopener noreferrer">Zdrojový kód webu ↗</a></p></footer></>;
}
