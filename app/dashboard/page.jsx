'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogOut, Calendar, CreditCard, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' | 'reservations'
  
  // Modal state
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [date, setDate] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('nova_user');
    if (!storedUser) {
      router.push('/login');
    } else {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role === 'admin') {
        router.push('/admin');
      } else {
        setUser(parsedUser);
        fetchRooms();
        fetchReservations(parsedUser.id);
      }
    }
  }, [router]);

  const fetchRooms = async () => {
    const res = await fetch('/api/rooms');
    const data = await res.json();
    setRooms(data);
  };

  const fetchReservations = async (userId) => {
    const res = await fetch(`/api/reservations?userId=${userId}`);
    const data = await res.json();
    setReservations(data);
  };

  const logout = () => {
    localStorage.removeItem('nova_user');
    router.push('/');
  };

  const handleReservation = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          roomId: selectedRoom.id,
          date,
          cardNumber
        })
      });
      if (res.ok) {
        setPaymentSuccess(true);
        fetchReservations(user.id);
        setTimeout(() => {
          setSelectedRoom(null);
          setPaymentSuccess(false);
          setActiveTab('reservations');
        }, 2000);
      } else {
        alert("Error en el pago. Verifique su tarjeta.");
      }
    } catch (err) {
      alert("Error procesando reserva.");
    }
  };

  if (!user) return <div style={{ padding: '40px' }}>Cargando...</div>;

  return (
    <div>
      <header className="header" style={{ background: 'var(--white)', borderBottom: '1px solid #eee' }}>
        <div className="logo" style={{ color: 'var(--primary)' }}>
          Nova<span>Lima</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontWeight: 600 }}>Hola, {user.name}</span>
          <button className="btn btn-outline" onClick={logout} style={{ padding: '8px 16px' }}>
            <LogOut size={16} /> Salir
          </button>
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <button 
              className={`sidebar-link ${activeTab === 'rooms' ? 'active' : ''}`}
              onClick={() => setActiveTab('rooms')}
              style={{ width: '100%', textAlign: 'left', background: activeTab === 'rooms' ? 'rgba(201,162,91,0.1)' : 'transparent', border: 'none' }}
            >
              <Calendar size={20} /> Reservar Habitación
            </button>
            <button 
              className={`sidebar-link ${activeTab === 'reservations' ? 'active' : ''}`}
              onClick={() => setActiveTab('reservations')}
              style={{ width: '100%', textAlign: 'left', background: activeTab === 'reservations' ? 'rgba(201,162,91,0.1)' : 'transparent', border: 'none' }}
            >
              <Clock size={20} /> Mis Reservas
            </button>
          </nav>
        </aside>

        <main className="dashboard-content">
          <h2 style={{ fontSize: '2rem', marginBottom: '30px' }}>
            {activeTab === 'rooms' ? 'Habitaciones Disponibles' : 'Tus Reservas Activas'}
          </h2>

          {activeTab === 'rooms' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {rooms.map(room => (
                <div key={room.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', height: '200px' }}>
                    <Image src={room.image_url} alt={room.name} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{room.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '15px', flex: 1 }}>{room.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>${room.price} <small style={{ fontSize: '0.8rem', color: '#999' }}>/ noche</small></span>
                      <button className="btn btn-primary" onClick={() => setSelectedRoom(room)}>
                        Reservar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reservations' && (
            <div>
              {reservations.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No tienes reservaciones activas.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {reservations.map(res => (
                    <div key={res.id} className="card" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <div style={{ position: 'relative', width: '100px', height: '80px', borderRadius: '8px', overflow: 'hidden' }}>
                        <Image src={res.image_url} alt={res.room_name} fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '5px' }}>{res.room_name}</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          Fecha de reserva: <strong>{res.date}</strong>
                        </p>
                      </div>
                      <div>
                        <span style={{ 
                          background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px'
                        }}>
                          <CheckCircle size={14} /> Activa
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Payment Modal */}
      {selectedRoom && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(5px)'
        }}>
          <div style={{ background: 'var(--white)', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '500px', position: 'relative' }}>
            {paymentSuccess ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <CheckCircle size={60} color="#22c55e" style={{ margin: '0 auto 20px' }} />
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>¡Pago Completado!</h3>
                <p style={{ color: 'var(--text-muted)' }}>Tu reserva ha sido confirmada exitosamente.</p>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setSelectedRoom(null)}
                  style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', fontSize: '1.5rem', color: '#999' }}
                >
                  &times;
                </button>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Completar Reserva</h3>
                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                  <strong>{selectedRoom.name}</strong>
                  <div style={{ color: 'var(--primary)', fontWeight: 'bold', marginTop: '5px' }}>${selectedRoom.price} / noche</div>
                </div>
                
                <form onSubmit={handleReservation}>
                  <div className="form-group">
                    <label className="form-label">Fecha de llegada</label>
                    <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Número de Tarjeta (Pasarela de Pago Segura)</label>
                    <div style={{ position: 'relative' }}>
                      <CreditCard size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                      <input 
                        type="text" 
                        className="form-input" 
                        style={{ paddingLeft: '45px' }} 
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                        minLength="16"
                        maxLength="16"
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Pagar y Confirmar
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
