'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LogIn, ArrowRight, Sparkles, Utensils, BedDouble } from 'lucide-react';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
        }
      });
    }, { threshold: 0.1 });

    sectionRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const setRef = (el, id) => {
    if (el && !sectionRefs.current.includes(el)) {
      el.id = id;
      sectionRefs.current.push(el);
    }
  };

  return (
    <main>
      <header className={`header ${scrolled ? 'scrolled' : ''}`} style={{
        background: scrolled ? 'var(--glass-bg)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--glass-border)' : 'none'
      }}>
        <div className="logo animate-fade-in" style={{ color: scrolled ? 'var(--text-main)' : 'var(--white)' }}>
          Nova<span>Lima</span>
        </div>
        <nav className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
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
        <div style={{ position: 'absolute', inset: 0, zIndex: -1 }} className="animate-zoom-in">
          <Image
            src="/images/hero.png"
            alt="Hotel Nova Lima Exterior"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          {/* Dark Overlay for text readability */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 100%)'
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
          <h1 className="animate-slide-up" style={{
            fontSize: '5rem',
            fontWeight: 700,
            marginBottom: '1rem',
            lineHeight: 1.1,
            letterSpacing: '-1.5px',
            textShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            Lujo y confort en <br />
            el corazón de la ciudad
          </h1>
          <p className="animate-slide-up-delay-1" style={{
            fontSize: '1.25rem',
            maxWidth: '550px',
            marginBottom: '2.5rem',
            color: 'rgba(255,255,255,0.9)',
            textShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}>
            Descubre una experiencia inolvidable. En Nova Lima, cuidamos
            cada detalle para que tu estadía sea absolutamente perfecta.
          </p>
          <div className="animate-slide-up-delay-2">
            <Link href="/login" className="btn btn-primary pulse-button" style={{
              padding: '18px 36px',
              fontSize: '1.15rem',
              borderRadius: '30px'
            }}>
              Reserva Ahora
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="animate-fade-in" style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          color: 'var(--white)',
          animationDelay: '1s'
        }}>
          <span style={{ fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Explorar</span>
          <div style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(to bottom, var(--primary), transparent)',
            borderRadius: '1px'
          }}></div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={el => setRef(el, 'features-section')}
        style={{ padding: '100px 5%', background: 'var(--bg-light)' }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className={`section-title ${isVisible['features-section'] ? 'animate-slide-up' : ''}`} style={{ fontSize: '2.8rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
            Experiencias Exclusivas
          </h2>
          <p className={`${isVisible['features-section'] ? 'animate-slide-up-delay-1' : ''}`} style={{ color: 'var(--text-muted)', marginBottom: '4rem', maxWidth: '650px', margin: '0 auto 4rem', fontSize: '1.1rem' }}>
            Disfruta de la mejor gastronomía, relájate en nuestro spa de clase mundial y descansa en las suites más premium de la ciudad.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px'
          }}>
            {/* Card 1 */}
            <div className={`card ${isVisible['features-section'] ? 'animate-slide-up' : ''}`} style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
              <div className="img-zoom-container" style={{ height: '240px', width: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                <Image
                  src="/images/spa.png"
                  alt="Spa y Relax"
                  fill
                  className="img-zoom"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                <div style={{ background: 'rgba(201, 162, 91, 0.1)', padding: '12px', borderRadius: '50%', color: 'var(--primary)', marginBottom: '20px' }}>
                  <Sparkles size={24} />
                </div>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '15px' }}>Spa & Relax Oasis</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  Desconecta del mundo en nuestro oasis de tranquilidad. Piscinas termales, masajes holísticos y terapias exclusivas diseñadas para rejuvenecer cuerpo y mente.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className={`card ${isVisible['features-section'] ? 'animate-slide-up-delay-1' : ''}`} style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
              <div className="img-zoom-container" style={{ height: '240px', width: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                <Image
                  src="/images/gastro.png"
                  alt="Alta Gastronomía"
                  fill
                  className="img-zoom"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                <div style={{ background: 'rgba(201, 162, 91, 0.1)', padding: '12px', borderRadius: '50%', color: 'var(--primary)', marginBottom: '20px' }}>
                  <Utensils size={24} />
                </div>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '15px' }}>Restaurante Estelar</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  Platos de autor preparados por chefs internacionales en nuestro restaurante premiado. Una fusión de sabores locales e internacionales para los paladares más exigentes.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className={`card ${isVisible['features-section'] ? 'animate-slide-up-delay-2' : ''}`} style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
              <div className="img-zoom-container" style={{ height: '240px', width: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                <Image
                  src="/images/suite.png"
                  alt="Suites de Lujo"
                  fill
                  className="img-zoom"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                <div style={{ background: 'rgba(201, 162, 91, 0.1)', padding: '12px', borderRadius: '50%', color: 'var(--primary)', marginBottom: '20px' }}>
                  <BedDouble size={24} />
                </div>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '15px' }}>Suites Panorámicas</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  Despierta con las mejores vistas de la ciudad. Habitaciones con tecnología inteligente, ropa de cama premium y servicio de conserjería las 24 horas a un botón de distancia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

