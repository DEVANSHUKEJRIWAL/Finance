
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TimeSeriesData } from '../types/data';

interface StockComparisonProps {
  stock1Data: TimeSeriesData[];
  stock2Data: TimeSeriesData[];
  stock1Symbol: string;
  stock2Symbol: string;
}

export function StockComparison({ 
  stock1Data, 
  stock2Data, 
  stock1Symbol, 
  stock2Symbol 
}: StockComparisonProps) {
  const combinedData = stock1Data.map((item, index) => ({
    date: item.date,
    [stock1Symbol]: item.value,
    [stock2Symbol]: stock2Data[index]?.value
  }));

  return (
    <div className="w-full h-[300px]">
      <LineChart
        width={600}
        height={300}
        data={combinedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={stock1Symbol} stroke="#8884d8" />
        <Line type="monotone" dataKey={stock2Symbol} stroke="#82ca9d" />
      </LineChart>
    </div>
  );
}