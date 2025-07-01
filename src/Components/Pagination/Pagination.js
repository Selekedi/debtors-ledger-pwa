import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];

  // Only show a window of 5 pages max
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '20px' }}>
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {pages.map((page) => (
        <button 
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            fontWeight: currentPage === page ? 'bold' : 'normal',
            background: currentPage === page ? '#ddd' : 'transparent',
            border: '1px solid #ccc',
            padding: '4px 8px',
            color:"#000"
          }}
        >
          {page}
        </button>
      ))}

      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}
