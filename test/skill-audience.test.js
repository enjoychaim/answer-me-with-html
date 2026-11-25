import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SKILL = readFileSync(fileURLToPath(new URL('../skills/answer-me-with-html/SKILL.md', import.meta.url)), 'utf8');

const section = (start, end) => {
  const from = SKILL.indexOf(start);
  assert.ok(from >= 0, `${start} is gone from SKILL.md`);
  const to = SKILL.indexOf(end, from + start.length);
  return SKILL.slice(from, to < 0 ? undefined : to);
};

const step1 = section('## 1. Decide: produce a page or not', '## 2. Workflow');
const step5 = section('5. Reply in the terminal', '\n## ');

// One test per acceptance scenario of #320: a delegated report is not a user reply, so it gets the
// findings the parent asked for rather than a two-line answer plus a page link.
test('#320 scenario 1: a delegated research report returns findings and renders no page', () => {
  assert.match(step1, /An internal report returned to another agent is not one/);
  assert.match(step1, /delegated research, implementation, a review or a progress report, return the text or structure it asked for, with the findings and the evidence\. Render no page\./);
});

test('#320 scenario 4: a page the parent asked for comes back with the verification details', () => {
  assert.match(step1, /explicitly asks for a page, render it, and return the page path together with the verification details/);
  assert.match(step5, /If a parent agent asked for the page, also return the verification details it asked for/);
});

test('#320 scenario 5: delegation alone never starts a video', () => {
  assert.match(step1, /A video needs an explicit video request; delegation alone never authorizes one/);
  assert.match(SKILL, /Use only when the user explicitly asks for a video/);
});

test('#320: the line limit is for user replies', () => {
  assert.match(step5, /The 2–3 line limit is for replies to the user/);
});
