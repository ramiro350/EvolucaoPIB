import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const formatCurrency = (value) => {
    return new Intl.NumberFormat('py-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

const IbgeChart = () => {
  const { pibTotal, pibPerCapita, loading, error, selectedVariables } = useSelector((state) => state.ibge);

  if (loading) return <div className="loading">Carregando dados do IBGE...</div>;
  if (error) return <div className="error">Erro: {error}</div>;
  if (!pibTotal && !pibPerCapita) return <div className="no-data">Nenhum dado disponível</div>;

  const EXCHANGE_RATE = 5.5;
  
  const extractDataFromResponse = (responseData, variableName) => {
    try {
      const series = responseData[0]?.resultados[0]?.series;
      if (!series || series.length === 0) return null;

      const brData = series[0]?.serie;
      if (!brData) return null;

      const labels = Object.keys(brData).sort((a, b) => Number(a) - Number(b));
      const values = labels.map(year => {
        const value = parseFloat(brData[year]);

        // convert from BRL → USD
        const valueInUSD = value / EXCHANGE_RATE;

        return variableName === 'pibTotal' 
          ? valueInUSD / 1000 // billions
          : valueInUSD;
      });

      return { labels, values };
    } catch (err) {
      console.error(`Error parsing ${variableName} data:`, err);
      return null;
    }
  };

  const pibTotalData = extractDataFromResponse(pibTotal, 'pibTotal');
  const pibPerCapitaData = extractDataFromResponse(pibPerCapita, 'pibPerCapita');

  if (!pibTotalData && !pibPerCapitaData) {
    return <div>Não foi possível processar os dados</div>;
  }

  const labels = pibTotalData?.labels || pibPerCapitaData?.labels;

  const datasets = [];

  if (selectedVariables.includes('pibTotal') && pibTotalData) {
    datasets.push({
      label: 'PIB Total (em bilhões de $)',
      data: pibTotalData.values,
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      tension: 0.1,
      yAxisID: 'y',
    });
  }

  if (selectedVariables.includes('pibPerCapita') && pibPerCapitaData) {
    datasets.push({
      label: 'PIB Per Capita (em $)',
      data: pibPerCapitaData.values,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      tension: 0.1,
      yAxisID: 'y1',
    });
  }

  const chartData = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          }
        }
      },
      title: {
        display: true,
        text: 'Evolução do PIB Brasileiro',
        font: {
          size: window.innerWidth < 768 ? 14 : 16 
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.dataset.label.includes('PIB Total')) {
                label += `$ ${formatCurrency(context.parsed.y.toFixed(2))} billion`;
              } else {
                label += `$ ${formatCurrency(context.parsed.y.toFixed(2))}`;
              }
            }
            return label;
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 10,
        titleFont: {
          size: window.innerWidth < 768 ? 11 : 13
        },
        bodyFont: {
          size: window.innerWidth < 768 ? 11 : 13
        }
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: selectedVariables.includes('pibTotal'),
        position: 'left',
        title: {
          display: true,
          text: 'PIB Total (bilhões de $)',
          font: {
            size: window.innerWidth < 768 ? 11 : 13
          }
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          }
        }
      },
      y1: {
        type: 'linear',
        display: selectedVariables.includes('pibPerCapita'),
        position: 'right',
        title: {
          display: true,
          text: 'PIB Per Capita ($)',
          font: {
            size: window.innerWidth < 768 ? 11 : 13
          }
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Ano',
          font: {
            size: window.innerWidth < 768 ? 11 : 13
          }
        },
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          },
          maxRotation: window.innerWidth < 768 ? 45 : 0, // Rotate labels on mobile
          autoSkip: true,
          maxTicksLimit: window.innerWidth < 768 ? 10 : 20 // Limit ticks on mobile
        }
      },
    },
    elements: {
      point: {
        radius: window.innerWidth < 768 ? 3 : 4, // Smaller points on mobile
        hoverRadius: window.innerWidth < 768 ? 5 : 6
      },
      line: {
        borderWidth: window.innerWidth < 768 ? 2 : 3 // Thinner lines on mobile
      }
    }
  };

  return (
    <div style={{ 
      position: 'relative', 
      margin: '20px auto',
      width: '95%', // Use percentage width
      maxWidth: '1200px', // Maximum width
      height: window.innerWidth < 768 ? '350px' : '500px', // Responsive height
      minHeight: '300px' // Minimum height
    }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default IbgeChart;