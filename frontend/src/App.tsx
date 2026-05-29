import { useEffect, useState, type ReactNode } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';

type Employee = {
  id: string;
  name: string;
  pricePerHour: number;
};

type Company = {
  id: string;
  name: string;
  avatar: string;
  employees: Employee[];
};

type Proposal = {
  companyName: string;
  employeeName: string;
  startHour: number;
  endHour: number;
};

function formatHour(hour: number): string {
  return String(hour).padStart(2, '0') + ':00';
}

type ButtonProps = {
  children: ReactNode;
  onClick: () => void;
  loading?: boolean;
  danger?: boolean;
};

export function Button({ children, onClick, loading, danger }: ButtonProps) {
  const className = 'primary-button' + (danger ? ' primary-button--danger' : '');
  return (
    <button className={className} type="button" onClick={onClick} disabled={loading}>
      {loading ? 'loading...' : children}
    </button>
  );
}

function MainPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadCompanies() {
      try {
        const res = await fetch('/api/companies');
        if (!res.ok) {
          throw new Error('failed to load companies: ' + res.status);
        }
        const data = await res.json();
        if (!cancelled) {
          setCompanies(data);
          setLoading(false);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message || 'unknown error');
          setLoading(false);
        }
      }
    }
    loadCompanies();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleFindClosestBooking() {
    navigate('/results');
  }

  return (
    <div className="page">
      <Button onClick={handleFindClosestBooking}>Find closest booking</Button>

      <h2 className="section-title">Companies</h2>

      {loading && <div className="loading">Loading companies…</div>}
      {error && <div className="error">Could not load companies: {error}</div>}

      {!loading && !error && (
        <ul className="company-list">
          {companies.map((company) => (
            <li className="company-card" key={company.id}>
              <div className="company-card__avatar" aria-hidden="true">
                {company.avatar}
              </div>
              <div className="company-card__body">
                <div className="company-card__name">{company.name}</div>
                <div className="employee-list__label">plumbers:</div>
                <ul className="employee-list">
                  {company.employees.map((employee) => (
                    <li className="employee-list__item" key={employee.id}>
                      <span className="employee-list__name">{employee.name}</span>
                      <span className="employee-list__price">${employee.pricePerHour}/hr</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ResultsPage() {
  const proposal: Proposal = {
    companyName: 'Company X',
    employeeName: 'Employee Y',
    startHour: 0,
    endHour: 1,
  };

  const [accepted, setAccepted] = useState<boolean>(false);

  function handleAccept() {
    setAccepted(true);
  }

  return (
    <div className="page">
      <Link className="back-link" to="/">
        ← Back
      </Link>

      <h2 className="section-title">Proposed booking</h2>

      <div className="proposal">
        <div className="proposal__row">
          <span className="proposal__label">Company</span>
          <span className="proposal__value">{proposal.companyName}</span>
        </div>
        <div className="proposal__row">
          <span className="proposal__label">Employee</span>
          <span className="proposal__value">{proposal.employeeName}</span>
        </div>
        <div className="proposal__row">
          <span className="proposal__label">Start</span>
          <span className="proposal__value">{formatHour(proposal.startHour)}</span>
        </div>
        <div className="proposal__row">
          <span className="proposal__label">End</span>
          <span className="proposal__value">{formatHour(proposal.endHour)}</span>
        </div>

        {accepted ? (
          <div className="confirmation">Booking confirmed!</div>
        ) : (
          <Button onClick={handleAccept}>Accept</Button>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="layout">
      <header className="navbar">
        <div className="navbar__brand">Emergency Plumbers</div>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
