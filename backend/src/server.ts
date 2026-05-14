import express, { NextFunction, Request, Response } from 'express';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3001;

export type Company = {
  id: string;
  name: string;
  avatar: string;
};

export type Employee = {
  id: string;
  name: string;
  companyId: string;
  pricePerHour: number;
};

export type Booking = {
  id: string;
  employeeId: string;
  startHour: number;
};

export type CompanyWithEmployees = Company & {
  employees: Array<{ id: string; name: string; pricePerHour: number }>;
};

const DATA_DIR = join(__dirname, 'data');

function tablePath(name: string): string {
  return join(DATA_DIR, name + '.json');
}

function readTable<T>(name: string): T[] {
  try {
    const raw = readFileSync(tablePath(name), 'utf-8');
    return JSON.parse(raw) as T[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw err;
  }
}

function writeTable<T>(name: string, records: T[]): void {
  writeFileSync(tablePath(name), JSON.stringify(records, null, 2) + '\n', 'utf-8');
}

export const db = {
  findAll<T>(name: string): T[] {
    return readTable<T>(name);
  },

  findOne<T extends { id: string }>(name: string, id: string): T | undefined {
    return readTable<T>(name).find((record) => record.id === id);
  },

  findBy<T>(name: string, predicate: (record: T) => boolean): T[] {
    return readTable<T>(name).filter(predicate);
  },

  create<T extends { id: string }>(name: string, record: T): T {
    const table = readTable<T>(name);
    if (table.some((existing) => existing.id === record.id)) {
      throw new Error('record with id ' + record.id + ' already exists in ' + name);
    }
    table.push(record);
    writeTable(name, table);
    return record;
  },

  delete(name: string, id: string): boolean {
    const table = readTable<{ id: string }>(name);
    const idx = table.findIndex((record) => record.id === id);
    if (idx === -1) return false;
    table.splice(idx, 1);
    writeTable(name, table);
    return true;
  },
};

export function getCompaniesWithEmployees(): CompanyWithEmployees[] {
  const companies = db.findAll<Company>('companies');
  const employees = db.findAll<Employee>('employees');
  return companies.map((company) => ({
    ...company,
    employees: employees
      .filter((e) => e.companyId === company.id)
      .map((e) => ({ id: e.id, name: e.name, pricePerHour: e.pricePerHour })),
  }));
}

function nowStamp(): string {
  return new Date().toISOString();
}

function logRequest(req: Request) {
  console.log('[' + nowStamp() + '] ' + req.method + ' ' + req.url);
}

const app = express();
app.use(express.json());

app.use((req: Request, _res: Response, next: NextFunction) => {
  logRequest(req);
  next();
});

app.get('/api/companies', (_req: Request, res: Response) => {
  res.json(getCompaniesWithEmployees());
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'not found', path: req.url });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('unhandled error', err);
  res.status(500).json({ error: 'internal server error' });
});

export { app };

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log('---');
    console.log('backend listening on http://localhost:' + PORT);
    console.log(
      'loaded ' +
        db.findAll<Company>('companies').length +
        ' companies, ' +
        db.findAll<Employee>('employees').length +
        ' employees, ' +
        db.findAll<Booking>('bookings').length +
        ' bookings',
    );
    console.log('---');
  });
}
