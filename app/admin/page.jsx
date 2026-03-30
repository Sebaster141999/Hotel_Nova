'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Users, DollarSign, CalendarCheck } from 'lucide-react';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('nova_user');
    if (!storedUser) {
      router.push('/login');
    } else {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'admin') {
        router.push('/dashboard');
      } else {
        fetchMetrics();
      }
    }
  }, [router]);

  const fetchMetrics = async () => {
    const res = await fetch('/api/admin/metrics');
    const data = await res.json();
    setMetrics(data);
  };

  const logout = () => {
    localStorage.removeItem('nova_user');
    router.push('/');
  };

  if (!metrics) return <div style={{ padding: '40px' }}>Cargando métricas del sistema...</div>;

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <header className="header" style={{ background: 'var(--white)', borderBottom: '1px solid #eee' }}>
        <div className="logo" style={{ color: 'var(--primary)' }}>
          Nova<span>Admin</span>
        </div>
        <button className="btn btn-outline" onClick={logout} style={{ padding: '8px 16px' }}>
          <LogOut size={16} /> Cerrar Sesión
        </button>
      </header>

      <main style={{ padding: '100px 5% 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '30px', color: 'var(--text-main)' }}>Panel Administrativo</h1>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: 'rgba(201,162,91,0.1)', padding: '15px', borderRadius: '50%', color: 'var(--primary)' }}>
              <Users size={32} />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>Clientes Registrados</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{metrics.totalUsers}</h2>
            </div>
          </div>
          
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: 'rgba(34,197,94,0.1)', padding: '15px', borderRadius: '50%', color: '#22c55e' }}>
              <CalendarCheck size={32} />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>Reservas Totales</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{metrics.totalReservations}</h2>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: 'rgba(59,130,246,0.1)', padding: '15px', borderRadius: '50%', color: '#3b82f6' }}>
              <DollarSign size={32} />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>Ingresos Estimados</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>${Number(metrics.estimatedRevenue).toLocaleString()}</h2>
            </div>
          </div>
        </div>

        {/* Top Users Table */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Top Clientes (Por Reservaciones)</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', color: '#666', fontSize: '0.9rem' }}>
                  <th style={{ padding: '12px 15px', borderBottom: '1px solid #ddd' }}>Nombre</th>
                  <th style={{ padding: '12px 15px', borderBottom: '1px solid #ddd' }}>Correo</th>
                  <th style={{ padding: '12px 15px', borderBottom: '1px solid #ddd' }}>Reservas</th>
                </tr>
              </thead>
              <tbody>
                {metrics.topUsers && metrics.topUsers.length > 0 ? (
                  metrics.topUsers.map((u, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px 15px', fontWeight: 600 }}>{u.name}</td>
                      <td style={{ padding: '12px 15px', color: 'var(--text-muted)' }}>{u.email}</td>
                      <td style={{ padding: '12px 15px' }}>
                        <span style={{ 
                          background: 'rgba(201,162,91,0.1)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600
                        }}>
                          {u.reservation_count}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>Aún no hay clientes con reservaciones.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
