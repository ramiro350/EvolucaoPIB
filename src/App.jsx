import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { fetchIbgeData } from './store/ibgeSlice';
import Navigation from './components/Navigation';
import ChartControls from './components/chartControls';
import IbgeChart from './components/ibgeChart';
import DataTable from './components/DataTable';
import './App.css';

function ChartPage() {
  return (
    <>
      <ChartControls />
      <IbgeChart />
    </>
  );
}

function TablePage() {
  return <DataTable />;
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIbgeData());
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Navigation />
        <header style={{ textAlign: 'center', padding: '20px' }}>
          <h1>Evolução do PIB Brasileiro - IBGE</h1>
          <p>Comparativo entre PIB Total e PIB Per Capita</p>
        </header>


        <main>
          <Routes>
            <Route path="/" element={<ChartPage />} />
            <Route path="/tabela" element={<TablePage />} />
          </Routes>
        </main>

        <footer style={{ 
          textAlign: 'center', 
          marginTop: '40px', 
          padding: '20px',
          backgroundColor: '#f8f9fa',
          fontSize: '14px'
        }}>
          <p>Dados provenientes da API do IBGE - Agregado 6784</p>
          <p>PIB Total (variável 9808) | PIB Per Capita (variável 9812)</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;