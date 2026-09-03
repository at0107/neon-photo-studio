'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); 
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    setIsLoggedIn(false);
    router.push('/login'); 
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '15px 30px', 
      background: '#111', 
      color: '#fff',
      fontFamily: 'sans-serif'
    }}>
      <h3 style={{ margin: 0 }}>Neon Photo Studio</h3>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        
        {!isLoggedIn && (
          <>
            <Link href="/register" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>
              Register
            </Link>
            <Link href="/login" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>
              Login
            </Link>
          </>
        )}

        
        {isLoggedIn && (
          <>
            <Link href="/artworks" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>
              Artworks  
            </Link>
            <button 
              onClick={handleLogout}
              style={{
                background: '#ff4d4f',
                color: '#fff',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
                Logout
            </button>
          </>
        )}
        
      </div>
    </nav>
  );
}