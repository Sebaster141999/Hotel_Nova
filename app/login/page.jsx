'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      // Save user in local storage to simulate session persistence
      localStorage.setItem('nova_user', JSON.stringify(data.user));

      if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-light)' }}>
      {/* Left Form Side */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div className="logo" style={{ marginBottom: '40px', textAlign: 'center' }}>
            Nova<span>Lima</span>
          </div>
          
          <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Bienvenido de nuevo</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Ingresa tus datos para acceder a tu cuenta o registrarte.</p>

          {error && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
              {loading ? 'Ingresando...' : 'Iniciar Sesión / Registrarse'}
            </button>
          </form>
          
          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            ¿Eres administrador? Usa <b>admin@novalima.com</b> y <b>admin123</b>
          </div>
        </div>
      </div>

      {/* Right Image Side */}
      <div style={{ flex: 1, position: 'relative', display: 'none' }} className="login-image-wrapper">
        <Image 
          src="https://images.unsplash.com/photo-1551882547-ff40c0d5bf8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
          alt="Lobby Hotel"
          fill
          style={{ objectFit: 'cover' }}
        />
        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 768px) {
            .login-image-wrapper { display: block !important; }
          }
        `}} />
      </div>
    </div>
  );
}
