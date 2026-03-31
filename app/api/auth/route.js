import { NextResponse } from 'next/server';
import pool, { testAndInitDb } from '../../../lib/db';

export async function POST(request) {
  try {
    // Initial DB run to make sure tables exist
    await testAndInitDb();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Usuario no registrado' }, { status: 404 });
    }

    const user = rows[0];

    // Simple password check (Note: In production, use bcrypt)
    if (password !== user.password) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    return NextResponse.json({ 
      user: { id: user.id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
