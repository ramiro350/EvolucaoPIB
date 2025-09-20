import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIbgeData, setYearsRange, setSelectedVariables } from '../store/ibgeSlice';

const DataTable = () => {
  const dispatch = useDispatch();
  const { pibTotal, pibPerCapita, loading, error, yearsRange, selectedVariables } = useSelector((state) => state.ibge);

  const EXCHANGE_RATE = 5.5;
  
  const [startYear, setStartYear] = useState(yearsRange.start);
  const [endYear, setEndYear] = useState(yearsRange.end);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const handleFetchData = () => {
    const newRange = { 
      start: parseInt(startYear), 
      end: parseInt(endYear) 
    };

    console.log(newRange);
    dispatch(setYearsRange({start: newRange.start, end: newRange.end}));
    dispatch(fetchIbgeData({ startYear: newRange.start, endYear: newRange.end }));
    setCurrentPage(1); // Reset to first page when new data is fetched
  };

  const handleVariableToggle = (variable) => {
    const newSelectedVariables = selectedVariables.includes(variable)
      ? selectedVariables.filter(v => v !== variable)
      : [...selectedVariables, variable];
    
    dispatch(setSelectedVariables(newSelectedVariables));
  };

  const currentYear = new Date().getFullYear();

  if (loading) return <div className="loading">Carregando dados do IBGE...</div>;
  if (error) return <div className="error">Erro: {error}</div>;
  if (!pibTotal && !pibPerCapita) return <div className="no-data">Nenhum dado disponível</div>;


  const extractTableData = () => {
  try {
    const pibTotalSeries = pibTotal[0]?.resultados[0]?.series[0]?.serie;
    const pibPerCapitaSeries = pibPerCapita[0]?.resultados[0]?.series[0]?.serie;

    if (!pibTotalSeries || !pibPerCapitaSeries) return [];

    // Pega todos os anos e ordena em ordem DECRESCENTE
    const years = Array.from(
      new Set([
        ...Object.keys(pibTotalSeries),
        ...Object.keys(pibPerCapitaSeries)
      ])
    ).sort((a, b) => Number(b) - Number(a)); // <-- agora decrescente

    return years.map(year => {
      const pibTotalValue = parseFloat(pibTotalSeries[year]) / 1000; // bilhões BRL
      const pibPerCapitaValue = parseFloat(pibPerCapitaSeries[year]);

      // converte BRL → USD
      const pibTotalUSD = isNaN(pibTotalValue) ? 'N/A' : (pibTotalValue / EXCHANGE_RATE).toFixed(2);
      const pibPerCapitaUSD = isNaN(pibPerCapitaValue) ? 'N/A' : (pibPerCapitaValue / EXCHANGE_RATE).toFixed(2);

      return {
        ano: year,
        pibTotal: pibTotalUSD,
        pibPerCapita: pibPerCapitaUSD
      };
    });
  } catch (err) {
    console.error('Error processing table data:', err);
    return [];
  }
};


  const tableData = extractTableData();
  const totalPages = Math.ceil(tableData.length / recordsPerPage);

  // Get current records for the current page
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = tableData.slice(indexOfFirstRecord, indexOfLastRecord);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;
    
    if (totalPages <= maxPageButtons) {
      // Show all pages if total pages is less than max
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      if (currentPage <= 3) {
        // Show first 4 pages and last page
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first page and last 4 pages
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Show pages around current page
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('py-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div style={{ padding: '20px', margin: '0 auto' }}>
      
      {/* Controls - Same as ChartControls */}
      <div
  style={{
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    margin: '20px auto',
  }}
>
  {/* Cabeçalho com título e botão alinhados */}
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',
    }}
  >
    <h3 style={{ margin: 0 }}>Configurações da Tabela - PIB Brasileiro</h3>

    
  </div>

  {/* Inputs de ano */}
  <div
    style={{
      marginBottom: '15px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '15px',
    }}
  >
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

  {/* Checkboxes alinhados à esquerda */}
  <div style={{
      marginBottom: '15px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '15px',}}>
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

  {/* Mensagens de erro */}
  {selectedVariables.length === 0 && (
    <span style={{ color: 'red' }}>Selecione pelo menos uma variável</span>
  )}

  {startYear > endYear && (
    <div style={{ color: 'red', marginTop: '10px' }}>
      Ano inicial não pode ser maior que ano final!
    </div>
  )}
  <button
      onClick={handleFetchData}
      disabled={loading || selectedVariables.length === 0 || startYear > endYear}
      style={{
        padding: '10px 20px',
        backgroundColor:
          loading || selectedVariables.length === 0 || startYear > endYear
            ? '#ccc'
            : '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor:
          loading || selectedVariables.length === 0 || startYear > endYear
            ? 'not-allowed'
            : 'pointer',
      }}
    >
      {loading ? 'Carregando...' : 'Atualizar Dados'}
    </button>
</div>


      {/* Table */}
      {tableData.length === 0 ? (
        <div className="no-data">Nenhum dado disponível para exibir</div>
      ) : (
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              maxWidth: '1000px',
              borderCollapse: 'collapse', 
              marginTop: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'left', 
                    borderBottom: '2px solid #dee2e6',
                    fontWeight: 'bold'
                  }}>
                    Ano
                  </th>
                  {selectedVariables.includes('pibTotal') && (
                    <th style={{ 
                      padding: '12px', 
                      textAlign: 'right', 
                      borderBottom: '2px solid #dee2e6',
                      fontWeight: 'bold'
                    }}>
                      PIB Total (Bilhões $)
                    </th>
                  )}
                  {selectedVariables.includes('pibPerCapita') && (
                    <th style={{ 
                      padding: '12px', 
                      textAlign: 'right', 
                      borderBottom: '2px solid #dee2e6',
                      fontWeight: 'bold'
                    }}>
                      PIB Per Capita ($)
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((row, index) => (
                  <tr 
                    key={row.ano} 
                    style={{ 
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                      borderBottom: '1px solid #dee2e6'
                    }}
                  >
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>
                      {row.ano}
                    </td>
                    {selectedVariables.includes('pibTotal') && (
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        {row.pibTotal !== 'N/A' ? `${formatCurrency(row.pibTotal)} bi` : 'N/A'}
                      </td>
                    )}
                    {selectedVariables.includes('pibPerCapita') && (
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        {row.pibPerCapita !== 'N/A' ? `${formatCurrency(row.pibPerCapita)}` : 'N/A'}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}
          {totalPages > 1 && (
            <div style={{ 
              marginTop: '20px', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  backgroundColor: currentPage === 1 ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Anterior
              </button>

              {getPageNumbers().map((number, index) => (
                number === '...' ? (
                  <span key={`ellipsis-${index}`} style={{ padding: '8px' }}>...</span>
                ) : (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: currentPage === number ? '#007bff' : '#f8f9fa',
                      color: currentPage === number ? 'white' : '#007bff',
                      border: `1px solid ${currentPage === number ? '#007bff' : '#dee2e6'}`,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: currentPage === number ? 'bold' : 'normal'
                    }}
                  >
                    {number}
                  </button>
                )
              ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 16px',
                  backgroundColor: currentPage === totalPages ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Próxima
              </button>
            </div>
          )}

          <div style={{ 
            textAlign: 'center', 
            marginTop: '10px', 
            color: '#666',
            fontSize: '14px'
          }}>
            Mostrando {indexOfFirstRecord + 1} - {Math.min(indexOfLastRecord, tableData.length)} de {tableData.length} registros
          </div>

      {tableData.length > 0 && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#e7f3ff', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h4>Resumo Estatístico ({startYear}-{endYear})</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div>
              <strong>Período:</strong> {tableData.length} anos
            </div>
            {selectedVariables.includes('pibTotal') && (
              <div>
                <strong>PIB Total Médio:</strong> {formatCurrency((tableData.reduce((sum, row) => sum + (row.pibTotal !== 'N/A' ? parseFloat(row.pibTotal) : 0), 0) / tableData.length).toFixed(2))} bi/ano
              </div>
            )}
            {selectedVariables.includes('pibPerCapita') && (
              <div>
                <strong>PIB Per Capita Médio:</strong> {formatCurrency(tableData.reduce((sum, row) => sum + (row.pibPerCapita !== 'N/A' ? parseFloat(row.pibPerCapita) : 0), 0) / tableData.length)}
              </div>
            )}
            {selectedVariables.includes('pibTotal') && tableData.length > 1 && (
              <div>
                <strong>Crescimento Total:</strong> {(((parseFloat(tableData[0].pibTotal) - parseFloat(tableData[tableData.length - 1].pibTotal)) / parseFloat(tableData[tableData.length - 1].pibTotal)) * 100).toFixed(2)}%
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Fonte:</strong> IBGE - Instituto Brasileiro de Geografia e Estatística</p>
        <p><strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
      </div>
    </div>
  );
};

export default DataTable;