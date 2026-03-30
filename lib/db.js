import { Pool } from 'pg';

const connectionString = "postgresql://neondb_owner:npg_WfT1rAauUvG9@ep-still-sky-amijw979-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require";

let pool;

if (!pool) {
  pool = new Pool({
    connectionString,
  });
}

export default pool;

// Utils function for creating tables on first load if they don't exist
export async function testAndInitDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image_url VARCHAR(255),
        is_available BOOLEAN DEFAULT true
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        room_id INTEGER REFERENCES rooms(id),
        date VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert dummy rooms if none exist
    const res = await client.query('SELECT COUNT(*) FROM rooms');
    if (res.rows[0].count === '0') {
      await client.query(`
        INSERT INTO rooms (name, description, price, image_url) VALUES 
        ('Suite Presidencial', 'Lujo absoluto con vista panorámica y jacuzzi privado.', 450.00, 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
        ('Habitación Deluxe', 'Confort y elegancia con cama King y balcón.', 250.00, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
        ('Habitación Doble Estándar', 'Ideal para parejas o viajes rápidos. Comodidad asegurada.', 120.00, 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')
      `);
    }

    // Insert default admin admin@novalima.com
    const adminRes = await client.query('SELECT * FROM users WHERE email = $1', ['admin@novalima.com']);
    if (adminRes.rowCount === 0) {
      await client.query(`
        INSERT INTO users (name, email, password, role) VALUES 
        ('Admin Nova', 'admin@novalima.com', 'admin123', 'admin')
      `);
    }
  } finally {
    client.release();
  }
}
