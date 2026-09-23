const aliases={web:'UX web design rozhrani',ios:'iPhone iOS SwiftUI Apple mobil',android:'Android Compose mobil',code:'kod programovani vyvoj',testing:'testovani testy',security:'bezpecnost audit',writing:'psani cestina texty',marketing:'marketing SEO obsah',docs:'dokumenty prezentace PDF Word',data:'data databaze tabulky SQL Excel',research:'reserse vyzkum vyhledavani',automation:'automatizace workflow',agents:'agenti agent',video:'video animace',cloud:'cloud nasazeni'};
export const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function selectRepositories(repos,{query='',category='all',type='all',sort='stars'}={}) {
  const words=normalize(query).trim().split(/\s+/).filter(Boolean);
  return repos.filter(repo => (category==='all'||repo.categories.includes(category))&&(type==='all'||repo.type===type)&&words.every(word=>normalize([repo.name,repo.id,repo.description,repo.setup,...repo.categories.map(id=>aliases[id]||id)].join(' ')).includes(word)))
    .sort((a,b)=>sort==='name'?a.name.localeCompare(b.name,'cs'):sort==='updated'?Date.parse(b.pushedAt)-Date.parse(a.pushedAt):b.stars-a.stars||a.name.localeCompare(b.name,'cs'));
}
export function validCachedStats(value, ids) {
  if(!value||typeof value!=='object'||Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([id,s])=>ids.includes(id)&&s&&Number.isSafeInteger(s.stars)&&s.stars>=0&&typeof s.checkedAt==='string'&&Number.isFinite(Date.parse(s.checkedAt))&&Date.parse(s.checkedAt)<=Date.now()+60000).map(([id,s])=>[id,{stars:s.stars,checkedAt:s.checkedAt}]));
}
