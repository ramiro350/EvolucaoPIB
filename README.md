📊 Analisador de PIB Brasileiro

Uma aplicação React para visualizar e analisar dados do PIB (Produto Interno Bruto) do Brasil, consumindo dados diretamente da API do IBGE (Instituto Brasileiro de Geografia e Estatística).
✨ Funcionalidades

    📈 Visualização em Gráfico: Gráfico de linhas interativo com PIB Total e PIB Per Capita

    📊 Visualização em Tabela: Tabela paginada com dados detalhados

    🎯 Controles Flexíveis: Selecione o período de anos desejado

    🔧 Multiplas Variáveis: Escolha entre visualizar PIB Total, PIB Per Capita ou ambos

    💱 Conversão Automática: Dados convertidos de Reais para Dólares automaticamente

    📱 Responsivo: Funciona perfeitamente em desktop e mobile

🚀 Tecnologias Utilizadas

    React 18 - Framework principal

    Redux Toolkit - Gerenciamento de estado

    Chart.js + React-Chartjs-2 - Visualização de gráficos

    React Router - Navegação entre páginas

    Axios - Requisições HTTP para a API do IBGE

    Vitest - Framework de testes

    Testing Library - Testes de componentes

📋 Pré-requisitos

    Node.js 16+

    npm ou yarn

⚡ Instalação Rápida

1. Clone o repositório

git clone (https://github.com/ramiro350/EvolucaoPIB.git)

2. Instale as dependências

3. Execute o projeto

npm run dev

4. Acesse a aplicação

Abra seu navegador e vá para: http://localhost:5173

🎮 Como Usar

Navegação Principal

    - Página Inicial (/) : Gráfico interativo do PIB

    - Página de Tabela (/tabela) : Dados em formato de tabela


Controles do Gráfico/Tabela
1. Seleção de Período

    Ano Inicial: Selecione o ano de início (2000-2022)

    Ano Final: Selecione o ano de término (2000-2022)

2. Seleção de Variáveis

    PIB Total: Mostra o PIB total em bilhões de dólares

    PIB Per Capita: Mostra o PIB per capita em dólares

3. Ações

    Atualizar Dados: Busca os dados com os parâmetros selecionados

🧪 Executando Testes

  # Executar todos os testes
  npx vitest

🔌 API Utilizada

A aplicação consome dados da API oficial do IBGE:

    PIB Total: https://servicodados.ibge.gov.br/api/v3/agregados/6784/periodos/{ano-inicial}-{ano-final}/variaveis/9808?localidades=BR

    PIB Per Capita: https://servicodados.ibge.gov.br/api/v3/agregados/6784/periodos/{ano-inicial}-{ano-final}/variaveis/9812?localidades=BR
