
import { Stock } from '../types/data';

interface HeatMapProps {
  data: Stock[];
}

export function HeatMap({ data }: HeatMapProps) {
  const getColorForValue = (value: number) => {
    if (value > 0) return `bg-green-${Math.min(Math.floor(value * 100), 900)}`;
    return `bg-red-${Math.min(Math.floor(Math.abs(value) * 100), 900)}`;
  };

  return (
    <div className="grid grid-cols-5 gap-1">
      {data.map((stock) => {
        const performance = stock.ebitdaGrowth;
        return (
          <div
            key={stock.symbol}
            className={`p-2 ${getColorForValue(performance)} rounded text-white text-xs`}
            title={`${stock.name}: ${(performance * 100).toFixed(2)}%`}
          >
            {stock.symbol}
          </div>
        );
      })}
    </div>
  );
}