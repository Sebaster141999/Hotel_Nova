import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, roomId, date, cardNumber } = body;

    if (!userId || !roomId || !date) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    // Mock payment gateway validation
    if (!cardNumber || cardNumber.length < 16) {
      return NextResponse.json({ error: 'Datos de tarjeta inválidos' }, { status: 400 });
    }

    // Insert reservation
    const { rows } = await pool.query(
      'INSERT INTO reservations (user_id, room_id, date, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, roomId, date, 'active']
    );

    return NextResponse.json({ message: 'Reserva creada exitosamente', reservation: rows[0] });
  } catch (error) {
    console.error('Reservation error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let query = `
      SELECT r.id, r.date, r.status, rm.name as room_name, rm.price, rm.image_url 
      FROM reservations r 
      JOIN rooms rm ON r.room_id = rm.id
    `;
    let params = [];

    if (userId) {
      query += ' WHERE r.user_id = $1';
      params.push(userId);
    }
    
    query += ' ORDER BY r.created_at DESC';

    const { rows } = await pool.query(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
