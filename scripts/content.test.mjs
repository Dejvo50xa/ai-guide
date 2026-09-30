import test from 'node:test';
import assert from 'node:assert/strict';
import cs from '../src/content/cs.js';
import en from '../src/content/en.js';
import {checkPrompt, partIds} from '../src/practice.mjs';

// Walks both content trees in parallel and reports any key, type or list-length mismatch.
function compare(a, b, path, problems) {
  const kind = value => Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;
  if (kind(a) !== kind(b)) return problems.push(`${path}: ${kind(a)} vs ${kind(b)}`);
  if (kind(a) === 'array') {
    if (a.length !== b.length) problems.push(`${path}: length ${a.length} vs ${b.length}`);
    a.slice(0, b.length).forEach((item, i) => compare(item, b[i], `${path}[${i}]`, problems));
  } else if (kind(a) === 'object') {
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (!(key in a) || !(key in b)) problems.push(`${path}.${key}: missing in ${key in a ? 'en' : 'cs'}`);
      else compare(a[key], b[key], `${path}.${key}`, problems);
    }
  } else if (kind(a) === 'string' && (!a.trim() || !b.trim())) {
    problems.push(`${path}: empty string`);
  }
}

test('Czech and English content have the same structure', () => {
  const problems = [];
  compare(cs, en, 'content', problems);
  assert.deepEqual(problems, []);
});

test('ids, anchors and data keys match between languages', () => {
  const ids = content => ({
    presets: content.presets.map(p => p.id),
    models: content.models.items.map(m => [m.name, m.brand, m.type, m.tasks.join()]),
    tasks: content.models.tasks.map(t => t[0]),
    workflows: content.workflows.items.map(w => w.id),
    paths: content.paths.items.map(p => p.id),
    techniques: content.techniques.items.map(t => [t.id, t.lvl]),
    exercises: content.practice.exercises.map(e => e.id),
    anchors: [...content.nav.links, ...content.nav.extra].map(l => l[1]),
    categories: content.catalog.categories.map(c => c[0]),
    types: Object.keys(content.catalog.types),
  });
  assert.deepEqual(ids(en), ids(cs));
});

test('every preset and path format is one of the builder formats', () => {
  for (const content of [cs, en]) {
    const formats = new Set(content.builder.formats);
    const used = [...content.presets.map(p => p.fields.format), ...content.paths.items.flatMap(p => p.tasks.map(t => t.fields.format))];
    for (const format of used) assert.ok(formats.has(format), `${content.lang}: unknown format ${format}`);
  }
});

test('practice checker finds every part in the model answers', () => {
  for (const content of [cs, en]) {
    for (const exercise of content.practice.exercises) {
      const missing = checkPrompt(exercise.model, content.lang).filter(r => !r.found).map(r => r.id);
      assert.deepEqual(missing, [], `${content.lang}/${exercise.id} model answer is missing ${missing}`);
    }
  }
});

test('practice checker finds at most the task in the weak prompts', () => {
  for (const content of [cs, en]) {
    for (const exercise of content.practice.exercises) {
      const found = checkPrompt(exercise.weak, content.lang).filter(r => r.found).map(r => r.id);
      assert.ok(found.every(id => id === 'task' || id === 'context'), `${content.lang}/${exercise.id} weak prompt matched ${found}`);
      assert.ok(found.length <= 2);
    }
  }
});

test('practice checker ignores accents and curly apostrophes', () => {
  const byId = results => Object.fromEntries(results.map(r => [r.id, r.found]));
  assert.equal(byId(checkPrompt('Jsi editor. Napiš shrnutí do 3 odrážek, nic nedomýšlej.', 'cs')).role, true);
  assert.equal(byId(checkPrompt('You’re an editor. Don’t add facts.', 'en')).limits, true);
  assert.deepEqual(checkPrompt('', 'en').map(r => r.id), partIds);
  assert.ok(checkPrompt('', 'en').every(r => !r.found));
});
