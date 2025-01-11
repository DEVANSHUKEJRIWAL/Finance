import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockAnalysis = () => {
    const [returnsVolatility, setReturnsVolatility] = useState<any[]>([]);
    const [dummyPortfolio, setDummyPortfolio] = useState<any[]>([]);
    const [mostTraded, setMostTraded] = useState<any[]>([]);
    const [priceToRatios, setPriceToRatios] = useState<any[]>([]);
    const [stockComparison, setStockComparison] = useState<any[]>([]);
    const [profitProjections, setProfitProjections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rvData = await axios.get(' http://127.0.0.1:5000/returns-volatility');
                console.log('Returns Volatility Data:', rvData.data); // Log the data to inspect
                setReturnsVolatility(rvData.data);

                const ppData = await axios.get('http://127.0.0.1:5000/dummy-portfolio');
                console.log('Dummy Portfolio:', ppData.data);
                 setProfitProjections(ppData.data);

                // const dpData = await axios.get('http://127.0.0.1:5000/dummy-portfolio');
                // setDummyPortfolio(dpData.data);

                // const mtData = await axios.get('http://127.0.0.1:5000/most-traded');
                // setMostTraded(mtData.data);

                // const ptData = await axios.get('http://127.0.0.1:5000/price-to-ratios');
                // setPriceToRatios(ptData.data);

                // const scData = await axios.get('http://127.0.0.1:5000/stock-comparison');
                // setStockComparison(scData.data);

                

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading data...</p>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">Stock Analysis Dashboard</h1>

            {/* Task 1: Returns and Volatility */}
            <h2 className="mt-5">Returns and Volatility (Top 10 Companies)</h2>
            {Array.isArray(returnsVolatility) && returnsVolatility.length > 0 ? (
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Ticker Symbol</th>
                            <th>Returns</th>
                            <th>Volatility</th>
                        </tr>
                    </thead>
                    <tbody>
                        {returnsVolatility.map((item, index) => (
                            <tr key={index}>
                                <td>{item['Ticker Symbol']}</td>
                                <td>{item.Returns.toFixed(2)}</td>
                                <td>{item.Volatility.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No data available for Returns and Volatility.</p>
            )}

            {/* Task 2: Dummy Portfolio */}
            <h2 className="mt-5">Dummy Portfolio</h2>
            {Array.isArray(dummyPortfolio) && dummyPortfolio.length > 0 ? (
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Ticker Symbol</th>
                            <th>Price</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyPortfolio.map((stock, index) => (
                            <tr key={index}>
                                <td>{stock['Ticker Symbol']}</td>
                                <td>{stock['Price']}</td>
                                <td>100</td> {/* Equal quantity */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No data available for Dummy Portfolio.</p>
            )}

            {/* Task 3: Heatmap for Most Traded Stocks */}
            <h2 className="mt-5">Most Traded Stocks Heatmap</h2>
            {Array.isArray(mostTraded) && mostTraded.length > 0 ? (
                <div className="row row-cols-5 g-2">
                    {mostTraded.map((stock, index) => (
                        <div
                            key={index}
                            className="col text-center text-white p-2 rounded"
                            style={{
                                backgroundColor: `rgba(255, 0, 0, ${parseFloat(stock['Price']) / 1000})`,
                            }}
                        >
                            {stock['Ticker Symbol']}<br />${stock['Price']}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No data available for Most Traded Stocks.</p>
            )}

            {/* Task 4: Time Series for Price-to-Earnings and Price-to-Book Ratios */}
            <h2 className="mt-5">Price-to-Earnings and Price-to-Book Ratios (Time Series)</h2>
            {Array.isArray(priceToRatios) && priceToRatios.length > 0 ? (
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Date</th>
                            <th>Price-to-Earnings</th>
                            <th>Price-to-Book</th>
                        </tr>
                    </thead>
                    <tbody>
                        {priceToRatios.map((item, index) => (
                            <tr key={index}>
                                <td>{item.Date}</td>
                                <td>{item['Price-to-Earnings']}</td>
                                <td>{item['Price-to-Book']}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No data available for Price-to-Earnings and Price-to-Book Ratios.</p>
            )}

            {/* Task 5: Stock Comparison */}
            <h2 className="mt-5">Stock Comparison</h2>
            {Array.isArray(stockComparison) && stockComparison.length > 0 ? (
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Date</th>
                            <th>Stock 1 Price</th>
                            <th>Stock 2 Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockComparison.map((item, index) => (
                            <tr key={index}>
                                <td>{item.Date}</td>
                                <td>{item['Stock 1 Price']}</td>
                                <td>{item['Stock 2 Price']}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No data available for Stock Comparison.</p>
            )}

            {/* Task 6: Profit Projections */}
            <h2 className="mt-5">Profit Projections</h2>
            {Array.isArray(profitProjections) && profitProjections.length > 0 ? (
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Ticker Symbol</th>
                            <th>Profit Projection</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profitProjections.map((item, index) => (
                            <tr key={index}>
                                <td>{item['Ticker Symbol']}</td>
                                <td>{item['Profit Projection']}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No data available for Profit Projections.</p>
            )}
        </div>
    );
};

export default StockAnalysis;