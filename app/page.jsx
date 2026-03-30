'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LogIn, ArrowRight } from 'lucide-react';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main>
      <header className={`header ${scrolled ? 'scrolled' : ''}`} style={{
        background: scrolled ? 'var(--glass-bg)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--glass-border)' : 'none'
      }}>
        <div className="logo" style={{ color: scrolled ? 'var(--text-main)' : 'var(--white)' }}>
          Nova<span>Lima</span>
        </div>
        <nav>
          <Link href="/login" className="btn btn-primary">
            <LogIn size={20} />
            Iniciar Sesión
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Background Image */}
        <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
          <Image 
            src="https://images.unsplash.com/photo-1542314831-c6a4d14d8373?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Hotel Nova Lima"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          {/* Dark Overlay for text readability */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)'
          }}></div>
        </div>

        <div style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          width: '100%',
          padding: '0 5%',
          color: 'var(--white)'
        }}>
          <h1 style={{
            fontSize: '4.5rem',
            fontWeight: 700,
            marginBottom: '1rem',
            lineHeight: 1.1,
            letterSpacing: '-1px'
          }}>
            Lujo y confort en <br/>
            el corazón de la ciudad
          </h1>
          <p style={{
            fontSize: '1.2rem',
            maxWidth: '500px',
            marginBottom: '2rem',
            color: 'rgba(255,255,255,0.8)'
          }}>
            Descubre una experiencia inolvidable. En Nova Lima, cuidamos
            cada detalle para que tu estadía sea absolutamente perfecta.
          </p>
          <Link href="/login" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
            Reserva Ahora
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 5%', background: 'var(--bg-light)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Nuestras Instalaciones</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Disfruta de la mejor gastronomía, spa de clase mundial y atención personalizada las 24 horas del día.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            <div className="card">
              <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Spa & Relax</h3>
              <p style={{ color: 'var(--text-muted)' }}>Desconecta del mundo en nuestro oasis de tranquilidad con masajes y terapias exclusivas.</p>
            </div>
            <div className="card">
              <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Gastronomía</h3>
              <p style={{ color: 'var(--text-muted)' }}>Platos de autor preparados por chefs internacionales en nuestro restaurante premiado.</p>
            </div>
            <div className="card">
              <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Fitness Center</h3>
              <p style={{ color: 'var(--text-muted)' }}>Equipos de última generación para mantener tu rutina al máximo nivel.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
