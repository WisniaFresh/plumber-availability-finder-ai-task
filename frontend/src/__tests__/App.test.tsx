import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import App from '../App';

type FetchMockResponse = {
  ok: boolean;
  status?: number;
  json: () => Promise<unknown>;
};

function mockFetch(routes: Record<string, unknown>) {
  global.fetch = jest.fn((input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : input.toString();
    if (url in routes) {
      const response: FetchMockResponse = {
        ok: true,
        status: 200,
        json: () => Promise.resolve(routes[url]),
      };
      return Promise.resolve(response as unknown as Response);
    }
    return Promise.reject(new Error(`Unexpected fetch: ${url}`));
  }) as unknown as typeof fetch;
}

const SAMPLE_COMPANY = {
  id: 'co-001',
  name: 'Acme Plumbing',
  avatar: '🔧',
  employees: [
    { id: 'emp-001', name: 'John Doe', pricePerHour: 65 },
    { id: 'emp-002', name: 'Jane Smith', pricePerHour: 80 },
  ],
};

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe('App — main page', () => {
  it('renders the "Find closest booking" button', async () => {
    mockFetch({ '/api/companies': [] });

    renderAt('/');

    expect(screen.getByRole('button', { name: /find closest booking/i })).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/loading companies/i)).not.toBeInTheDocument());
  });

  it('renders a company card with its employees and price-per-hour from the API', async () => {
    mockFetch({ '/api/companies': [SAMPLE_COMPANY] });

    renderAt('/');

    expect(await screen.findByText(SAMPLE_COMPANY.name)).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('$65/hr')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('$80/hr')).toBeInTheDocument();
  });

  it('shows a loading state while companies are being fetched', async () => {
    mockFetch({ '/api/companies': [SAMPLE_COMPANY] });

    renderAt('/');

    expect(screen.getByText(/loading companies/i)).toBeInTheDocument();
    await screen.findByText(SAMPLE_COMPANY.name);
  });
});

describe('App — results page', () => {
  it('renders the placeholder proposal and an Accept button', async () => {
    mockFetch({ '/api/companies': [] });

    renderAt('/results');

    expect(screen.getByText(/proposed booking/i)).toBeInTheDocument();
    expect(screen.getByText(/company x/i)).toBeInTheDocument();
    expect(screen.getByText(/employee y/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument();
  });
});
