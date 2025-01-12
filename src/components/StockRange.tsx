import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

interface StockData {
  date: string;
  symbol: string;
  close: number;
}

const StockComparison: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedStock1, setSelectedStock1] = useState<string>('');
  const [selectedStock2, setSelectedStock2] = useState<string>('');
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [filteredData, setFilteredData] = useState<{ [key: string]: StockData[] }>({});

  useEffect(() => {
    // Fetch stock data from MongoDB
    axios.get('/api/stocks')
      .then((response) => {
        setStockData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching stock data:', error);
      });
  }, []);

  const symbols = Array.from(new Set(stockData.map((data) => data.symbol)));

  useEffect(() => {
    if (startDate && endDate && selectedStock1 && selectedStock2) {
      const start = startDate.toISOString().split('T')[0];
      const end = endDate.toISOString().split('T')[0];

      const stock1Data = stockData.filter(
        (data) =>
          data.symbol === selectedStock1 &&
          data.date >= start &&
          data.date <= end
      );

      const stock2Data = stockData.filter(
        (data) =>
          data.symbol === selectedStock2 &&
          data.date >= start &&
          data.date <= end
      );

      setFilteredData({ [selectedStock1]: stock1Data, [selectedStock2]: stock2Data });
    }
  }, [startDate, endDate, selectedStock1, selectedStock2, stockData]);

  const chartData = {
    labels: filteredData[selectedStock1]?.map((data) => data.date) || [],
    datasets: [
      {
        label: selectedStock1,
        data: filteredData[selectedStock1]?.map((data) => data.close) || [],
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false,
      },
      {
        label: selectedStock2,
        data: filteredData[selectedStock2]?.map((data) => data.close) || [],
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h1>Stock Price Comparison</h1>

      <div>
        <label>Start Date: </label>
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />

        <label>End Date: </label>
        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
      </div>

      <div>
        <label>Select Stock 1: </label>
        <select
          value={selectedStock1}
          onChange={(e) => setSelectedStock1(e.target.value)}
        >
          <option value="">--Select--</option>
          {symbols.map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol}
            </option>
          ))}
        </select>

        <label>Select Stock 2: </label>
        <select
          value={selectedStock2}
          onChange={(e) => setSelectedStock2(e.target.value)}
        >
          <option value="">--Select--</option>
          {symbols.map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol}
            </option>
          ))}
        </select>
      </div>

      {filteredData[selectedStock1] && filteredData[selectedStock2] && (
        <Line data={chartData} />
      )}
    </div>
  );
};

export default StockComparison;