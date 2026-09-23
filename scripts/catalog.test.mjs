import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {selectRepositories,validCachedStats} from '../src/catalog-utils.mjs';
const repos=JSON.parse(readFileSync(new URL('../src/data/repositories.json',import.meta.url),'utf8'));
test('catalog metadata is complete and all categories have content',()=>{
  assert.equal(new Set(repos.map(r=>r.id)).size,repos.length);
  for(const r of repos){assert.ok(Number.isSafeInteger(r.stars)&&r.stars>=0);assert.ok(Number.isFinite(Date.parse(r.checkedAt)));assert.equal(new URL(r.url).hostname,'github.com');assert.ok(r.description&&r.setup&&r.prompt&&r.categories.length);}
  assert.equal(new Set(repos.flatMap(r=>r.categories)).size,15);
});
test('highest star counts first without mutating source data',()=>{
  const before=JSON.stringify(repos),sorted=selectRepositories(repos);
  for(let i=1;i<sorted.length;i++)assert.ok(sorted[i-1].stars>=sorted[i].stars);
  assert.equal(JSON.stringify(repos),before);
});
test('category, type and accent-insensitive query combine',()=>{
  const found=selectRepositories(repos,{category:'writing',type:'skill',query:'ceske'});
  assert.ok(found.some(r=>r.id==='nowork-ai/anti-ai-slop-cz'));
  assert.ok(found.every(r=>r.categories.includes('writing')&&r.type==='skill'));
  assert.equal(selectRepositories(repos,{query:'not-a-real-repo-908080'}).length,0);
  assert.ok(selectRepositories(repos,{query:'iphone'}).length>0);
});
test('invalid cached API values cannot replace the snapshot',()=>{
  const now=new Date().toISOString(),id=repos[0].id;
  assert.deepEqual(validCachedStats({[id]:{stars:-1,checkedAt:now}},[id]),{});
  assert.deepEqual(validCachedStats({[id]:{stars:1,checkedAt:'bad'}},[id]),{});
  assert.deepEqual(validCachedStats({unknown:{stars:1,checkedAt:now}},[id]),{});
  assert.equal(validCachedStats({[id]:{stars:123,checkedAt:now}},[id])[id].stars,123);
});
