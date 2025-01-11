import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface Stock {
  symbol: string;
  netIncome: number;
  totalRevenue: number;
  earningsPerShare: number;
  totalEquity: number;
}

interface StockMetricsProps {
  data: Stock[];
}

interface StockData {
  symbol: string;
  peRatio: number;
  pbRatio: number;
  returns: number;
  volatility: number;
}

export function StockMetrics({ data }: StockMetricsProps) {
  const [stockMetrics, setStockMetrics] = useState<StockData[]>([]);

  useEffect(() => {
    if (data) {
      setStockMetrics(processStockData(data));
    }
  }, [data]);

  const getTop10Companies = (data: Stock[]) => {
    const top10 = data
      .reduce((acc: Record<string, number>, curr) => {
        acc[curr.symbol] = (acc[curr.symbol] || 0) + curr.netIncome;
        return acc;
      }, {});
    return Object.keys(top10)
      .sort((a, b) => top10[b] - top10[a])
      .slice(0, 10);
  };

  const calculateVolatility = (companyData: Stock[]) => {
    const returns = companyData.map((item) => item.netIncome / item.totalRevenue);
    const mean = returns.reduce((sum, value) => sum + value, 0) / returns.length;
    const squaredDiffs = returns.map((value) => Math.pow(value - mean, 2));
    const variance = squaredDiffs.reduce((sum, value) => sum + value, 0) / squaredDiffs.length;
    return Math.sqrt(variance);
  };

  const processStockData = (data: Stock[]): StockData[] => {
    const top10Companies = getTop10Companies(data);
    const stockData: StockData[] = [];

    // Calculate Returns, Volatility, P/E Ratio, and P/B Ratio for top 10 companies
    top10Companies.forEach((company) => {
      const companyData = data.filter((item) => item.symbol === company);

      if (companyData.length > 0) {
        const returns = companyData.reduce((acc, item) => {
          // Ensure that item has 'netIncome' and 'totalRevenue' before performing the calculation
          if (item.netIncome && item.totalRevenue) {
            return acc + item.netIncome / item.totalRevenue;
          }
          return acc;
        }, 0);

        const volatility = calculateVolatility(companyData);

        // Calculate P/E and P/B ratios (ensure the fields exist)
        const peRatio = companyData[0].earningsPerShare && companyData[0].totalRevenue
          ? companyData[0].totalRevenue / companyData[0].earningsPerShare
          : 0;
        const pbRatio = companyData[0].totalRevenue && companyData[0].totalEquity
          ? companyData[0].totalRevenue / companyData[0].totalEquity
          : 0;

        stockData.push({
          symbol: company,
          peRatio,
          pbRatio,
          returns,
          volatility,
        });
      }
    });

    return stockData;
  };

  return (
    <div className="w-full h-[300px]">
      <LineChart
        width={600}
        height={300}
        data={stockMetrics}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="symbol" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line key="peRatio" type="monotone" dataKey="peRatio" stroke="#8884d8" name="P/E Ratio" />
        <Line key="pbRatio" type="monotone" dataKey="pbRatio" stroke="#82ca9d" name="P/B Ratio" />
      </LineChart>
    </div>
  );
}