'use client';

import { useState, useEffect } from 'react';

interface Artwork {
  id: number;
  title: string;
  imageUrl: string;
  userId: number;
  user?: { email: string };
}

export default function ArtworksPage() {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [message, setMessage] = useState('');

  const fetchArtworks = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/artworks');
      const data = await res.json();
      if (data.success) {
        setArtworks(data.artworks);
      }
    } catch (error) {
      console.error('Error fetching artworks:', error);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("Please log in to add an artwork");
      return;
    }

    try {
      const res = await fetch('http://localhost:5001/api/artworks', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ title, imageUrl, filter: 'normal' }), 
      });

      const data = await res.json();
      
      if (res.ok) {
        alert("Artwork added successfully!");
        setTitle('');
        setImageUrl('');
      } else {
        alert(data.error || "An error occurred");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', background: '#fff', color: '#333', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2>Artworks Gallery</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px', background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
        <h3>Add New Artwork</h3>
        <input
          type="text"
          placeholder="Artwork Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: '8px', color: '#000', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <input
          type="text"
          placeholder="Artwork Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
          style={{ padding: '8px', color: '#000', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button type="submit" style={{ padding: '10px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Add Artwork
        </button>
        {message && <p style={{ fontWeight: 'bold', color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
      </form>

      <h3>Existing Artworks</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {artworks.map((art) => (
          <div key={art.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '6px', background: '#fff' }}>
            <h4 style={{ margin: '0 0 5px 0' }}>{art.title}</h4>
            <p style={{ fontSize: '14px', color: '#666', margin: '0 0 10px 0' }}>Artist: {art.user?.email || `User ID: ${art.userId}`}</p>
            {art.imageUrl && <img src={art.imageUrl} alt={art.title} style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />}
          </div>
        ))}
      </div>
    </div>
  );
}