import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIbgeData, setYearsRange, setSelectedVariables } from '../store/ibgeSlice';

const ChartControls = () => {
  const dispatch = useDispatch();
  const { loading, yearsRange, selectedVariables } = useSelector((state) => state.ibge);
  
  const [startYear, setStartYear] = useState(yearsRange.start);
  const [endYear, setEndYear] = useState(yearsRange.end);

  const handleFetchData = () => {
    const newRange = { 
      start: parseInt(startYear), 
      end: parseInt(endYear) 
    };

    console.log(newRange)
    dispatch(setYearsRange({start: newRange.start, end: newRange.end}));
    dispatch(fetchIbgeData({ startYear: newRange.start, endYear: newRange.end }));
  };

  const handleVariableToggle = (variable) => {
    const newSelectedVariables = selectedVariables.includes(variable)
      ? selectedVariables.filter(v => v !== variable)
      : [...selectedVariables, variable];
    
    dispatch(setSelectedVariables(newSelectedVariables));
  };

  const currentYear = new Date().getFullYear();

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f5f5f5', 
      borderRadius: '8px',
      margin: '20px auto'
    }}>
      <h3>Configurações do Gráfico - PIB Brasileiro</h3>
      
      <div style={{ marginBottom: '15px', display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <label style={{ marginRight: '10px' }}>
            Ano Inicial:
            <input
              type="number"
              min="2000"
              max="2022"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
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
              max="2022"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              style={{ marginLeft: '5px', padding: '5px', width: '80px' }}
            />
          </label>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ marginRight: '15px', fontWeight: 'bold' }}>Variáveis:</label>
        
        <label style={{ marginRight: '15px' }}>
          <input
            type="checkbox"
            checked={selectedVariables.includes('pibTotal')}
            onChange={() => handleVariableToggle('pibTotal')}
            style={{ marginRight: '5px' }}
          />
          PIB Total
        </label>
        
        <label>
          <input
            type="checkbox"
            checked={selectedVariables.includes('pibPerCapita')}
            onChange={() => handleVariableToggle('pibPerCapita')}
            style={{ marginRight: '5px' }}
          />
          PIB Per Capita
        </label>
      </div>

      <button
        onClick={handleFetchData}
        disabled={loading || selectedVariables.length === 0 || startYear > endYear}
        style={{
          padding: '10px 20px',
          backgroundColor: loading || selectedVariables.length === 0 || startYear > endYear ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading || selectedVariables.length === 0 || startYear > endYear ? 'not-allowed' : 'pointer',
          marginRight: '10px'
        }}
      >
        {loading ? 'Carregando...' : 'Atualizar Dados'}
      </button>

      {selectedVariables.length === 0 && (
        <span style={{ color: 'red' }}>Selecione pelo menos uma variável</span>
      )}

      {startYear > endYear && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Ano inicial não pode ser maior que ano final!
        </div>
      )}
    </div>
  );
};

export default ChartControls;