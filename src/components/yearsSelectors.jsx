import React from 'react';

const YearSelector = ({ 
  startYear, 
  endYear, 
  onStartYearChange, 
  onEndYearChange, 
  onUpdate, 
  loading,
  currentYear 
}) => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f5f5f5', 
      borderRadius: '8px',
      margin: '20px 0',
      textAlign: 'center'
    }}>
      <h3>Selecionar Período</h3>
      
      <div style={{ marginBottom: '15px', display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
        <div>
          <label style={{ marginRight: '10px' }}>
            Ano Inicial:
            <input
              type="number"
              min="2000"
              max={currentYear}
              value={startYear}
              onChange={(e) => onStartYearChange(e.target.value)}
              style={{ marginLeft: '5px', padding: '5px', width: '80px' }}
            />
          </label>
        </div>
        
        <div>
          <label style={{ marginRight: '10px' }}>
            Ano Final:
            <input
              type="number"
              min="2000"
              max={currentYear}
              value={endYear}
              onChange={(e) => onEndYearChange(e.target.value)}
              style={{ marginLeft: '5px', padding: '5px', width: '80px' }}
            />
          </label>
        </div>
      </div>

      <button
        onClick={onUpdate}
        disabled={loading || startYear > endYear}
        style={{
          padding: '10px 20px',
          backgroundColor: loading || startYear > endYear ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading || startYear > endYear ? 'not-allowed' : 'pointer',
          marginRight: '10px'
        }}
      >
        {loading ? 'Carregando...' : 'Atualizar Dados'}
      </button>

      {startYear > endYear && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Ano inicial não pode ser maior que ano final!
        </div>
      )}

      <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
        Período selecionado: {startYear}-{endYear}
      </div>
    </div>
  );
};

export default YearSelector;