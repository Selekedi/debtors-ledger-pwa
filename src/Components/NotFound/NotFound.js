import React from 'react';

export default function NotFound() {
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f0f0f0',
      color: '#333'
    }}>
      <h1>404</h1>
      <p>Page Not Found</p>
    </div>
  );
}

