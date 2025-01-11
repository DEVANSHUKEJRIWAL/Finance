import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = 'mongodb://localhost:27017/stockData';
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as mongoose.ConnectOptions).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define TypeScript Types for Schema
interface Stock {
    "Ticker Symbol": string;
    Returns?: number;
    Volatility?: number;
    Date?: string;
    Price?: number;
    "Price-to-Earnings"?: number;
    "Price-to-Book"?: number;
    "Profit Projection"?: number;
}

// Define Mongoose Schema and Model
const StockSchema = new mongoose.Schema<Stock>({
    "Ticker Symbol": { type: String, required: true },
    Returns: { type: Number },
    Volatility: { type: Number },
    Date: { type: String },
    Price: { type: Number },
    "Price-to-Earnings": { type: Number },
    "Price-to-Book": { type: Number },
    "Profit Projection": { type: Number },
});

const StockModel = mongoose.model<Stock>('Stock', StockSchema);

// API Endpoints

// Fetch Returns and Volatility Data
app.get('/api/returns-volatility', async (req: Request, res: Response) => {
    try {
        const data = await StockModel.find({}, { "Ticker Symbol": 1, Returns: 1, Volatility: 1, _id: 0 }).limit(10);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch returns-volatility data' });
    }
});

// Fetch Dummy Portfolio
app.get('/api/dummy-portfolio', async (req: Request, res: Response) => {
    try {
        const data = await StockModel.find({}, { "Ticker Symbol": 1, Price: 1, _id: 0 }).limit(10);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch dummy portfolio data' });
    }
});

// Fetch Most Traded Stocks
app.get('/api/most-traded', async (req: Request, res: Response) => {
    try {
        const data = await StockModel.find({}, { "Ticker Symbol": 1, Price: 1, _id: 0 }).sort({ Price: -1 }).limit(10);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch most traded stocks data' });
    }
});

// Fetch Price-to-Ratios
app.get('/api/price-to-ratios', async (req: Request, res: Response) => {
    try {
        const data = await StockModel.find({}, { Date: 1, "Price-to-Earnings": 1, "Price-to-Book": 1, _id: 0 }).limit(10);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch price-to-ratios data' });
    }
});

// Fetch Profit Projections
app.get('/api/profit-projections', async (req: Request, res: Response) => {
    try {
        const data = await StockModel.find({}, { "Ticker Symbol": 1, "Profit Projection": 1, _id: 0 }).limit(10);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch profit projections' });
    }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});