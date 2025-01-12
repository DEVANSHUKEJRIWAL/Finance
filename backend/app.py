from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
import io
import base64

# Initialize Flask app
app = Flask(__name__)
CORS(app)


# Connect to MongoDB
client = MongoClient('mongodb+srv://srivastavanandinee:hz0IL73wGrLHi6iT@cluster0.k5cq4.mongodb.net/')  # Replace with your MongoDB URI
db = client['FinancialDashboard']  # Replace with your database name
collection = db['fundamentals']  # Replace with your collection name

# Load data from MongoDB
def load_data():
    data = pd.DataFrame(list(collection.find()))
    if '_id' in data.columns:
        data.drop('_id', axis=1, inplace=True)  # Drop MongoDB's default ID field
    return data

# Route 1: Get Top 10 Companies' Returns and Volatility
@app.route('/returns-volatility', methods=['GET'])
def get_returns_volatility():
    data = load_data()
    data['Returns'] = data['Net Income'] / data['Total Revenue']
    data['Volatility'] = data['Returns'].rolling(window=5).std()
    top_10_companies = data.groupby('Ticker Symbol')['Net Income'].sum().nlargest(10).index
    results = data[data['Ticker Symbol'].isin(top_10_companies)][['Ticker Symbol', 'Returns', 'Volatility']]
    return jsonify(results.to_dict(orient='records'))

# Route 2: Dummy Portfolio Bar Chart
@app.route('/dummy-portfolio', methods=['GET'])
def dummy_portfolio():
    data = load_data()  # Assuming `load_data` reads and returns your dataset
    print(data)
    top_10_companies = data.groupby('Ticker Symbol')['Net Income'].sum().nlargest(10).index
    dummy_portfolio = data[data['Ticker Symbol'].isin(top_10_companies)].groupby('Ticker Symbol')['Total Revenue'].sum()
    dummy_portfolio_data = dummy_portfolio.to_dict()
    return jsonify({'dummy_portfolio': dummy_portfolio_data})
    

# Route 3: Heatmap for Top 50 Most Traded Stocks
# @app.route('/heatmap', methods=['GET'])
# def heatmap():
#     data = load_data()
#     data['Investments'] = data['Total Revenue']  # Proxy for trading activity

#     # Select the top 50 stocks by trading activity
#     top_50_stocks = data.nlargest(50, 'Trading Activity')

#     # Create a pivot table for the data
#     pivot_table = top_50_stocks.pivot_table(index='Ticker Symbol', columns='Period Ending', values='Trading Activity')

#     # Convert the pivot table to a dictionary format for JSON output
#     heatmap_data = pivot_table.fillna(0).to_dict()  # Replace NaN with 0 for easier interpretation

#     # Return the data as JSON
#     return jsonify({'heatmap_data': heatmap_data})

# Route 4: Profit Projection for Top 10 Companies
@app.route('/profit-projection', methods=['GET'])
def profit_projection():
    data = load_data()
    top_companies = data.groupby('Ticker Symbol')['Net Income'].sum().nlargest(10).index
    projections = {}
    for company in top_companies:
        company_data = data[data['Ticker Symbol'] == company]
        x = np.arange(len(company_data))
        y = company_data['Net Income']
        if len(x) > 1:  # Ensure there is enough data for regression
            coeffs = np.polyfit(x, y, deg=1)  # Linear regression
            projections[company] = coeffs[0] * (len(x) + 1) + coeffs[1]  # Next year's projection
    return jsonify(projections)

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)