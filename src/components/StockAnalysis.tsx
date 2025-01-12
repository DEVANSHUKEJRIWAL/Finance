import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart3, Users, DollarSign, UserPlus, Menu, Bell, Settings, Search } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface Stock {
    tickerSymbol: string;
    price: number;
}

interface ProfitProjection {
    tickerSymbol: string;
    projection: number;
}

const StockAnalysis = () => {
    const [returnsVolatility, setReturnsVolatility] = useState<any[]>([]);
    const [dummyPortfolio, setDummyPortfolio] = useState<Stock[]>([]);
    const [priceToRatios, setPriceToRatios] = useState<ProfitProjection[]>([]);
    const [loading, setLoading] = useState(true);
    const [stockComparison, setStockComparison] = useState<any[]>([]);
    const [selectedStock1, setSelectedStock1] = useState('AAPL');
    const [selectedStock2, setSelectedStock2] = useState('GOOGL');

    const [dateRange, setDateRange] = useState({
        start: '2024-01-01',
        end: '2024-03-14'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch returns volatility data
                const rvData = await axios.get('http://127.0.0.1:5000/returns-volatility');
                const combinedData = rvData.data.reduce((acc: any[], item: any) => {
                    // Check if the ticker already exists
                    const existingTicker = acc.find((entry) => entry['Ticker Symbol'] === item['Ticker Symbol']);
                    if (existingTicker) {
                        // If it exists, update the existing entry (combine returns and volatility)
                        existingTicker.Returns = item.Returns;
                        existingTicker.Volatility = item.Volatility;
                    } else {
                        // If not, add new entry to the accumulator
                        acc.push({ 'Ticker Symbol': item['Ticker Symbol'], Returns: item.Returns, Volatility: item.Volatility });
                    }
                    return acc;
                }, []);
                setReturnsVolatility(rvData.data);


                // Fetch dummy portfolio data and convert object to array
                const dpData = await axios.get('http://127.0.0.1:5000/dummy-portfolio');
                const portfolioArray = Object.entries(dpData.data.dummy_portfolio).map(([tickerSymbol, price]) => ({
                    tickerSymbol,
                    price
                }));
                setDummyPortfolio(portfolioArray);

                // Fetch profit projection data and convert object to array
                const ptData = await axios.get('http://127.0.0.1:5000/profit-projection');
                const projectionArray = Object.entries(ptData.data).map(([tickerSymbol, projection]) => ({
                    tickerSymbol,
                    projection,
                }));
                setPriceToRatios(projectionArray);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [selectedStock1, selectedStock2, dateRange]); // Added dependencies for stock 

    const portfolioChartData = {
        labels: dummyPortfolio.map(item => item.tickerSymbol),
        datasets: [
            {
                label: 'Stock Price',
                data: dummyPortfolio.map(item => item.price),
                backgroundColor: 'rgba(255,0,0, 0.5)',
                borderColor: 'rgb(53, 162, 235)',
                borderWidth: 1,
            },
        ],
    };

    const returnsVolatilityData = {
        labels: returnsVolatility.map(item => item['Ticker Symbol']),
        datasets: [
            {
                label: 'Returns',
                data: returnsVolatility.map(item => item.Returns),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                yAxisID: 'y',
            },
            {
                label: 'Volatility',
                data: returnsVolatility.map(item => item.Volatility),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                yAxisID: 'y1',
            },
        ],
    };

    const profitProjectionData = {
        labels: priceToRatios.map(item => item.tickerSymbol),
        datasets: [
            {
                label: 'Projected Net Income',
                data: priceToRatios.map(item => item.projection),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: 'white',
                },
            },
            title: {
                display: true,
                text: 'Portfolio Analysis',
                color: 'white',
            },
        },
        scales: {
            y: {
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
            },
            x: {
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
            },
        },
    };

    const returnsVolatilityOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: 'white',
                },
            },
            title: {
                display: true,
                text: 'Returns and Volatility Analysis',
                color: 'white',
            },
        },
        scales: {
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                title: {
                    display: true,
                    text: 'Returns (%)',
                    color: 'white',
                },
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                title: {
                    display: true,
                    text: 'Volatility (%)',
                    color: 'white',
                },
            },
            x: {
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
            },
        },
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const totalPortfolioValue = dummyPortfolio.reduce((sum, stock) => sum + stock.price, 0);
    const averageStockPrice = totalPortfolioValue / dummyPortfolio.length;
    const averageProjection = priceToRatios.reduce((sum, item) => sum + item.projection, 0) / priceToRatios.length;

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white">
                <div className="p-4 font-bold text-xl border-b border-gray-700">Stock Analysis</div>
                <nav className="mt-4">
                    <a href="#" className="flex items-center px-4 py-3 bg-blue-500 text-white">
                        <BarChart3 className="mr-3" size={20} />
                        Dashboard
                    </a>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {/* Top Navigation */}
                <div className="bg-white p-4 shadow-sm flex justify-between items-center">
                    <div className="flex items-center">
                        <h1 className="text-xl font-semibold text-gray-700">Market Overview</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search stocks..."
                                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <Bell size={20} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <Settings size={20} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6">
                    {/* Stats Cards */}
                    {/* Charts Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-6 rounded-xl text-white col-span-1">
                            <h3 className="font-semibold mb-4">Portfolio Overview</h3>
                            <div className="h-[300px]">
                                <Bar options={chartOptions} data={portfolioChartData} />
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-400 to-green-500 p-6 rounded-xl text-white col-span-1">
                            <h3 className="font-semibold mb-4">Returns vs Volatility</h3>
                            <div className="h-[300px]">
                                <Line options={returnsVolatilityOptions} data={returnsVolatilityData} />
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-400 to-purple-500 p-6 rounded-xl text-white col-span-1">
                            <h3 className="font-semibold mb-4">Profit Projections</h3>
                            <div className="h-[300px]">
                                <Bar options={chartOptions} data={profitProjectionData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chatbot button */}
            <div className="fixed bottom-6 right-6">
                <a
                    href="https://insightai-uz0g.onrender.com/" // Replace with the link to your chatbot
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
                >
                    <span className="text-lg font-bold">?</span>
                </a>
            </div>
        </div>
    );
};

export default StockAnalysis;