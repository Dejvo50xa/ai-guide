import {useState} from 'react';
import {Mark} from './Explore.jsx';
export default function SiteNav({catalog = false}) {
  const [open, setOpen] = useState(false);
  const home = catalog ? '/' : '';
  const links = [['Modely',home+'#modely'],['Workflow',home+'#workflow'],['Techniky',home+'#techniky'],['Agenti',home+'#agenti'],['Repozitáře','/repozitare/']];
  return <header className="site-header"><nav className="mx" aria-label="Hlavní navigace">
    <a className="brand" href={home+'#uvod'}><Mark/> promptuj<span>ai</span><small>PROSTOR PRO TVOJE NÁPADY</small></a>
    <div className="desktop-nav">{links.map(([label,url])=><a key={url} href={url} aria-current={catalog&&label==='Repozitáře'?'page':undefined}>{label}</a>)}</div>
    <a className="solid nav-cta" href={home+'#builder'}>Vytvořit prompt ↗</a>
    <button className="menu-toggle" aria-expanded={open} aria-controls="mobile-nav" onClick={()=>setOpen(!open)}>{open?'Zavřít':'Menu'}</button>
  </nav>{open&&<div className="mobile-nav" id="mobile-nav">{[...links,['Slovník',home+'#slovnik'],['Vytvořit prompt',home+'#builder'],['Šablony',home+'#sablony']].map(([label,url])=><a key={url} href={url} onClick={()=>setOpen(false)}>{label}</a>)}</div>}</header>;
}
