
import test from 'node:test';
import assert from 'node:assert/strict';

// Mock localStorage
global.localStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = String(value);
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  },
};


import { getData, setData } from './storage.js';

test('should store and retrieve user bookmarks correctly', () => {
  const testUser = '1';
  const bookmarks = [
    {
      url: 'https://example.com',
      title: 'Example',
      description: 'An example site',
      createdAt: new Date().toISOString(),
    },
  ];

  setData(testUser, bookmarks);
  const result = getData(testUser);

  assert.deepStrictEqual(result, bookmarks);
});
