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
      // If user doesn't exist, register them automatically for this demo
      const newUser = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [email.split('@')[0], email, password, 'user']
      );
      return NextResponse.json({ user: { id: newUser.rows[0].id, name: newUser.rows[0].name, email: newUser.rows[0].email, role: newUser.rows[0].role } });
    }

    const user = rows[0];

    // Simple password check (Note: In production, use bcrypt)
    if (password !== user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({ 
      user: { id: user.id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
