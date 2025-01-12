import React, { useState, useEffect } from 'react';
import { BarChart, LineChart, TrendingUp } from 'lucide-react';

import { loadCSVData } from './utils/csvLoader';
import type { Stock, TimeSeriesData } from './types/data';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2023-12-31');
  const [selectedStock1, setSelectedStock1] = useState('AAPL');
  const [selectedStock2, setSelectedStock2] = useState('GOOGL');

  useEffect(() => {
    const loadData = async () => {
      try {
        // In a real application, these would be actual CSV files
        const fundamentalsData = await loadCSVData('/data/fundamentals.csv');
        const pricesData = await loadCSVData('/data/prices.csv');
        // Process and combine the data
        setStocks(fundamentalsData as Stock[]);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (email: string, password: string) => {
    // In a real application, this would validate credentials against a backend
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Financial Dashboard
            </h1>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Top Performers */}
          <DashboardCard title="Top Performers">
            <div className="space-y-4">
              {stocks.slice(0, 5).map((stock) => (
                <div key={stock.symbol} className="flex justify-between items-center">
                  <span className="font-medium">{stock.symbol}</span>
                  <span className="text-green-600">+{(stock.roe * 100).toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Key Metrics */}
          <DashboardCard title="Key Metrics">
            <StockMetrics data={stocks} />
          </DashboardCard>

          {/* Market Overview */}
          <DashboardCard title="Market Overview">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Market Cap</span>
                <span className="font-medium">$2.8T</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Avg P/E Ratio</span>
                <span className="font-medium">28.5</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Avg ROE</span>
                <span className="font-medium">35%</span>
              </div>
            </div>
          </DashboardCard>

          {/* Stock Performance Heatmap */}
          <DashboardCard title="Performance Heatmap">
            <HeatMap data={stocks} />
          </DashboardCard>

          {/* Stock Comparison */}
          <DashboardCard title="Stock Comparison">
            <div className="space-y-4">
              <div className="flex gap-4">
                <select
                  value={selectedStock1}
                  onChange={(e) => setSelectedStock1(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  {stocks.map((stock) => (
                    <option key={stock.symbol} value={stock.symbol}>
                      {stock.symbol}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedStock2}
                  onChange={(e) => setSelectedStock2(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  {stocks.map((stock) => (
                    <option key={stock.symbol} value={stock.symbol}>
                      {stock.symbol}
                    </option>
                  ))}
                </select>
              </div>
              <StockComparison
                stock1Data={[]} // This would be populated with actual time series data
                stock2Data={[]}
                stock1Symbol={selectedStock1}
                stock2Symbol={selectedStock2}
              />
            </div>
          </DashboardCard>
        </div>
      </main>
    </div>
  );
}

export default App;