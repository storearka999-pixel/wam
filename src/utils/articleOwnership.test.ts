import assert from 'node:assert/strict';
import test from 'node:test';
import { canManageArticle } from './articleOwnership';

test('article access is limited to its admin unless the requester is a global admin', () => {
  assert.equal(canManageArticle('admin-a', 'admin-a', false), true);
  assert.equal(canManageArticle('admin-a', 'admin-b', false), false);
  assert.equal(canManageArticle(undefined, 'admin-b', false), false);
  assert.equal(canManageArticle('admin-a', 'admin-b', true), true);
});
