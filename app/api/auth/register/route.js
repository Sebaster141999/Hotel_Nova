import { NextResponse } from 'next/server';
import pool, { testAndInitDb } from '../../../../lib/db';

export async function POST(request) {
  try {
    // Initial DB run to make sure tables exist
    await testAndInitDb();

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nombre, email y contraseña son requeridos' }, { status: 400 });
    }

    // Check if user already exists
    const existsCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (existsCheck.rows.length > 0) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 409 });
    }

    // Create new user
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, password, 'user']
    );

    const user = result.rows[0];

    return NextResponse.json({ 
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      message: 'Usuario registrado exitosamente'
    }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Error al registrarse' }, { status: 500 });
  }
}
