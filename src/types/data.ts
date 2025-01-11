export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  marketCap: number;
  peRatio: number;
  pbRatio: number;
  deRatio: number;
  eps: number;
  freeCashFlow: number;
  roe: number;
  dividendYield: number;
  ebitdaGrowth: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface StockPerformance {
  symbol: string;
  returns: number;
  volatility: number;
}