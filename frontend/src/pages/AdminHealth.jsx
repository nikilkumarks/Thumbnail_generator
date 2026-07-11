import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Users, Image, AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const STROKE = 2;

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="admin-stat surface-card">
    <Icon size={20} strokeWidth={STROKE} className={accent ? 'text-accent admin-stat__icon' : 'admin-stat__icon'} />
    <div>
      <p className="text-caption admin-stat__label">{label}</p>
      <p className="admin-stat__value">{value}</p>
    </div>
  </div>
);

const AdminHealth = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.isAdmin) {
      setLoading(false);
      return;
    }
    api.get('/admin/health')
      .then(({ data: d }) => setData(d))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user?.isAdmin) {
    return (
      <div className="page-bg page-scroll auth-page auth-locked-dark">
        <Navbar />
        <div className="legal-page admin-page" style={{ textAlign: 'center' }}>
          <h1 className="text-h2 admin-section-title">Admin access required</h1>
          <p className="text-body-sm" style={{ marginTop: 'var(--space-4)' }}>Set ADMIN_EMAIL in backend/.env to your account email.</p>
          <Link to="/" className="btn-primary" style={{ marginTop: 'var(--space-6)', textDecoration: 'none', display: 'inline-flex' }}>
            <ArrowLeft size={16} /> Back to studio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-bg page-scroll admin-page-wrap">
      <Navbar />
      <main className="legal-page admin-page">
        <div className="admin-page-header">
          <Activity size={28} strokeWidth={STROKE} className="text-accent" />
          <div>
            <h1 className="text-display text-gradient admin-page-title">Health dashboard</h1>
            <p className="text-body-sm">System status & recent failures</p>
          </div>
        </div>

        {loading && <div className="gen-status"><Loader2 className="animate-spin" size={20} /> Loading…</div>}
        {error && <div className="alert-error">{error}</div>}

        {data && (
          <>
            <div className={`admin-status-badge admin-status-badge--${data.status}`}>
              System {data.status}
            </div>

            <div className="admin-stats-grid">
              <StatCard icon={Users} label="Users" value={data.stats.totalUsers} />
              <StatCard icon={Image} label="Generations" value={data.stats.totalGenerations} accent />
              <StatCard icon={AlertTriangle} label="Failures (24h)" value={data.stats.failuresLast24h} />
            </div>

            <section className="admin-section">
              <h2 className="text-h3 admin-section-title">Services</h2>
              <div className="admin-services">
                {Object.entries(data.services).map(([name, status]) => (
                  <div key={name} className="admin-service-row">
                    <span className="text-body-sm admin-service-name">{name}</span>
                    <span className={`service-pill service-pill--${status.includes('online') || status.includes('configured') ? 'ok' : 'bad'}`}>{status}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="admin-section">
              <h2 className="text-h3 admin-section-title">Recent failures</h2>
              {data.recentFailures.length === 0 ? (
                <p className="text-body-sm">No recent failures</p>
              ) : (
                <div className="admin-failures">
                  {data.recentFailures.map((f) => (
                    <div key={f.id} className="admin-failure-row surface-card">
                      <span className="text-caption">{f.type} · {new Date(f.createdAt).toLocaleString()}</span>
                      <p className="text-body-sm admin-failure-error">{f.error}</p>
                      {f.user && <p className="text-caption admin-failure-user">{f.user.email}</p>}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminHealth;
