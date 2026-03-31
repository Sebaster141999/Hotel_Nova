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
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      position: 'relative',
      padding: '20px'
    }}>
      {/* Absolute Fullscreen Background */}
      <div style={{ 
        position: 'absolute', 
        top: 0, left: 0, right: 0, bottom: 0, 
        zIndex: -2 
      }}>
        <Image 
          src="/images/hero.png"
          alt="Hotel Background"
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
          priority
        />
      </div>

      {/* Dark Overlay for better contrast */}
      <div style={{ 
        position: 'absolute', 
        top: 0, left: 0, right: 0, bottom: 0, 
        background: 'linear-gradient(135deg, rgba(18,18,18,0.7) 0%, rgba(18,18,18,0.3) 100%)',
        zIndex: -1 
      }}></div>

      {/* Glassmorphism Login Card */}
      <div className="animate-zoom-in" style={{ 
        width: '100%', 
        maxWidth: '440px', 
        background: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '48px 40px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.5)'
      }}>
        <div className="logo" style={{ marginBottom: '10px', textAlign: 'center', fontSize: '2.4rem' }}>
          Nova<span>Lima</span>
        </div>
        
        <h1 style={{ fontSize: '1.8rem', marginBottom: '8px', textAlign: 'center', fontWeight: '700' }}>
          ¡Bienvenido!
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '36px', textAlign: 'center', fontSize: '1.05rem' }}>
          Nos alegra verte de nuevo. Ingresa para continuar.
        </p>

        {error && (
          <div className="animate-slide-up" style={{ 
            background: '#fee2e2', color: '#b91c1c', 
            padding: '14px', borderRadius: '12px', 
            marginBottom: '24px', fontSize: '0.95rem',
            border: '1px solid #f87171'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ fontSize: '0.95rem', marginLeft: '4px' }}>Correo Electrónico</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                background: '#f8f9fa',
                border: '1px solid transparent',
                borderRadius: '12px',
                padding: '16px',
              }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label className="form-label" style={{ fontSize: '0.95rem', marginLeft: '4px' }}>Contraseña</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                background: '#f8f9fa',
                border: '1px solid transparent',
                borderRadius: '12px',
                padding: '16px',
              }}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary pulse-button" 
            style={{ 
              width: '100%', 
              padding: '16px', 
              fontSize: '1.1rem',
              borderRadius: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '700'
            }} 
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.9rem', color: '#777' }}>
          <p style={{ marginBottom: '8px' }}>¿Aún no tienes cuenta? <b>Regístrate aquí</b></p>
          <div style={{ height: '1px', background: '#eee', margin: '20px 0' }}></div>
          <p>¿Administrador? Usa <b>admin@novalima.com</b></p>
          <p>y contraseña <b>admin123</b></p>
        </div>
      </div>
    </div>
  );
}
