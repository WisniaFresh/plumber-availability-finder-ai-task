import { afterEach, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { randomUUID } from 'node:crypto';

import { db } from '../src/server.js';

const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data');

type Row = { id: string; label: string; score?: number };

describe('db', () => {
  let table: string;

  beforeEach(() => {
    table = `__test_${randomUUID()}`;
  });

  afterEach(async () => {
    await rm(join(DATA_DIR, `${table}.json`), { force: true });
  });

  describe('findAll', () => {
    it('returns an empty array when the table file does not exist', () => {
      assert.deepEqual(db.findAll<Row>(table), []);
    });

    it('returns every record after writes, in insertion order', () => {
      db.create<Row>(table, { id: 'a', label: 'first' });
      db.create<Row>(table, { id: 'b', label: 'second' });

      assert.deepEqual(db.findAll<Row>(table), [
        { id: 'a', label: 'first' },
        { id: 'b', label: 'second' },
      ]);
    });

    it('returns a fresh array each call (callers cannot mutate the store)', () => {
      db.create<Row>(table, { id: 'a', label: 'first' });

      const first = db.findAll<Row>(table);
      first.push({ id: 'mutated', label: 'leak' });

      assert.deepEqual(db.findAll<Row>(table), [{ id: 'a', label: 'first' }]);
    });
  });

  describe('findOne', () => {
    it('returns the record for a known id', () => {
      db.create<Row>(table, { id: 'a', label: 'first' });

      assert.deepEqual(db.findOne<Row>(table, 'a'), { id: 'a', label: 'first' });
    });

    it('returns undefined for an unknown id', () => {
      assert.equal(db.findOne<Row>(table, 'missing'), undefined);
    });
  });

  describe('findBy', () => {
    it('returns records that match the predicate', () => {
      db.create<Row>(table, { id: 'a', label: 'first', score: 1 });
      db.create<Row>(table, { id: 'b', label: 'second', score: 2 });
      db.create<Row>(table, { id: 'c', label: 'third', score: 3 });

      const matched = db.findBy<Row>(table, (r) => (r.score ?? 0) >= 2);

      assert.deepEqual(matched, [
        { id: 'b', label: 'second', score: 2 },
        { id: 'c', label: 'third', score: 3 },
      ]);
    });

    it('returns an empty array when nothing matches', () => {
      db.create<Row>(table, { id: 'a', label: 'first' });

      assert.deepEqual(
        db.findBy<Row>(table, () => false),
        [],
      );
    });
  });

  describe('create', () => {
    it('persists the record so it is readable by findOne', () => {
      db.create<Row>(table, { id: 'a', label: 'first' });

      assert.deepEqual(db.findOne<Row>(table, 'a'), { id: 'a', label: 'first' });
    });

    it('returns the created record', () => {
      const created = db.create<Row>(table, { id: 'a', label: 'first' });

      assert.deepEqual(created, { id: 'a', label: 'first' });
    });

    it('throws when a record with the same id already exists', () => {
      db.create<Row>(table, { id: 'a', label: 'first' });

      assert.throws(
        () => db.create<Row>(table, { id: 'a', label: 'duplicate' }),
        /already exists/,
      );
    });
  });

  describe('delete', () => {
    it('removes the record so findOne returns undefined', () => {
      db.create<Row>(table, { id: 'a', label: 'first' });

      const removed = db.delete(table, 'a');

      assert.equal(removed, true);
      assert.equal(db.findOne<Row>(table, 'a'), undefined);
    });

    it('returns false for an unknown id and leaves the table intact', () => {
      db.create<Row>(table, { id: 'a', label: 'first' });

      const removed = db.delete(table, 'missing');

      assert.equal(removed, false);
      assert.deepEqual(db.findAll<Row>(table), [{ id: 'a', label: 'first' }]);
    });
  });
});

describe('db over the seed data', () => {
  it('reads every company via findAll', () => {
    const companies = db.findAll<{ id: string; name: string }>('companies');
    assert.ok(companies.length > 0, 'expected seeded companies');
    for (const company of companies) {
      assert.equal(typeof company.id, 'string');
      assert.equal(typeof company.name, 'string');
    }
  });

  it('reads a known seeded company via findOne', () => {
    const company = db.findOne<{ id: string; name: string }>('companies', 'co-001');
    assert.ok(company);
    assert.equal(company?.name, 'Acme Plumbing');
  });

  it('filters employees by companyId via findBy', () => {
    const employees = db.findBy<{ id: string; companyId: string }>(
      'employees',
      (e) => e.companyId === 'co-001',
    );
    assert.ok(employees.length > 0, 'expected at least one employee for co-001');
    for (const employee of employees) {
      assert.equal(employee.companyId, 'co-001');
    }
  });
});
