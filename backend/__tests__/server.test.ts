import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';

import { app, getCompaniesWithEmployees } from '../src/server.js';

describe('getCompaniesWithEmployees', () => {
  it('returns every company with employees nested', () => {
    const companies = getCompaniesWithEmployees();
    assert.ok(Array.isArray(companies));
    assert.ok(companies.length > 0, 'expected at least one company');

    for (const company of companies) {
      assert.equal(typeof company.id, 'string');
      assert.equal(typeof company.name, 'string');
      assert.equal(typeof company.avatar, 'string');
      assert.ok(Array.isArray(company.employees));
      for (const employee of company.employees) {
        assert.equal(typeof employee.id, 'string');
        assert.equal(typeof employee.name, 'string');
        assert.equal(typeof employee.pricePerHour, 'number');
      }
    }
  });

  it('only includes employees that belong to the company', () => {
    const companies = getCompaniesWithEmployees();
    const employeeIds = companies.flatMap((c) => c.employees.map((e) => e.id));
    const unique = new Set(employeeIds);
    assert.equal(unique.size, employeeIds.length, 'expected no duplicate employees across companies');
  });
});

describe('GET /api/companies', () => {
  let server: Server;
  let baseUrl: string;

  before(async () => {
    await new Promise<void>((resolve) => {
      server = createServer(app);
      server.listen(0, () => {
        const { port } = server.address() as AddressInfo;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it('responds with 200 and the company list', async () => {
    const res = await fetch(`${baseUrl}/api/companies`);
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.ok(Array.isArray(body));
    assert.ok(body.length > 0);

    const first = body[0];
    assert.ok('id' in first);
    assert.ok('name' in first);
    assert.ok('avatar' in first);
    assert.ok(Array.isArray(first.employees));
  });
});
