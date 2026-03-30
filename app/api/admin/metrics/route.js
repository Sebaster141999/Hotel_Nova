import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function GET() {
  try {
    const usersCount = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'user'");
    const reservationsCount = await pool.query('SELECT COUNT(*) FROM reservations');
    const totalRevenue = await pool.query(`
      SELECT SUM(rm.price) 
      FROM reservations r 
      JOIN rooms rm ON r.room_id = rm.id
    `);

    // Top users by reservations
    const topUsers = await pool.query(`
      SELECT u.name, u.email, COUNT(r.id) as reservation_count
      FROM users u
      LEFT JOIN reservations r ON u.id = r.user_id
      WHERE u.role = 'user'
      GROUP BY u.id
      ORDER BY reservation_count DESC
      LIMIT 10
    `);

    return NextResponse.json({
      totalUsers: parseInt(usersCount.rows[0].count),
      totalReservations: parseInt(reservationsCount.rows[0].count),
      estimatedRevenue: totalRevenue.rows[0].sum || 0,
      topUsers: topUsers.rows
    });
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
