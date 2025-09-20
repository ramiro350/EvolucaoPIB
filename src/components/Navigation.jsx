import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav style={{ 
      backgroundColor: '#343a40', 
      padding: '1rem 0',
      marginBottom: '20px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'right',
        gap: '20px'
      }}>
        <Link 
          to="/" 
          style={{ 
            color: location.pathname === '/' ? '#ffffff' : '#cccccc',
            textDecoration: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            backgroundColor: location.pathname === '/' ? '#495057' : 'transparent',
            fontWeight: 'bold'
          }}
        >
          📊 Gráfico
        </Link>
        <Link 
          to="/tabela" 
          style={{ 
            color: location.pathname === '/tabela' ? '#ffffff' : '#cccccc',
            textDecoration: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            backgroundColor: location.pathname === '/tabela' ? '#495057' : 'transparent',
            fontWeight: 'bold'
          }}
        >
          📋 Tabela
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;