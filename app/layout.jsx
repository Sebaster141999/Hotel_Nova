import './globals.css';

export const metadata = {
  title: 'Nova Lima - Hotel Elegance',
  description: 'Reserva tu estadía de lujo en Nova Lima, descansa como mereces.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
