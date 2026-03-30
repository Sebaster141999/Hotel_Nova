import { NextResponse } from 'next/server';
import pool, { testAndInitDb } from '../../../lib/db';

export async function GET() {
  try {
    await testAndInitDb();
    
    const { rows } = await pool.query('SELECT * FROM rooms ORDER BY price DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
