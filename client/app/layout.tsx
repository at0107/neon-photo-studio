import './globals.css';
import Navbar from '@/components/Navbar'; 

export const metadata = {
  title: 'Neon Photo Studio',
  description: 'Full-stack Next.js and Express app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  Id:
  return (
    <html lang="hy">
      <body style={{ margin: 0, background: '#f0f2f5' }}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}