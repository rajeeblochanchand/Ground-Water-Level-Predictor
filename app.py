from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd
import numpy as np
from datetime import datetime

app = Flask(__name__)

# Load the trained Random Forest model and label encoder
rf_model = joblib.load(r"models/groundwater_rf_model.pkl")
label_encoder = joblib.load(r"models/label_encoder.pkl")

# Load the datasets
station_gse_df = pd.read_csv(r"station_and_gse.csv")
historical_data_df = pd.read_csv(r"C:\Users\hp\OneDrive\Documents\Desktop\al ml\website\data_ready_to_train.csv")

def prepare_input_features(station_name, input_date):
    encoded_station = label_encoder.transform([station_name])[0]
    wlm_gse_value = station_gse_df.loc[station_gse_df['STATION'] == station_name, 'WLM_GSE'].values[0]
    input_date = pd.to_datetime(input_date)
    year = input_date.year
    month = input_date.month
    day = input_date.day
    month_sine = np.sin(2 * np.pi * month / 12)
    month_cosine = np.cos(2 * np.pi * month / 12)
    
    # Filter data
    station_data = historical_data_df[historical_data_df['STATION'] == station_name].copy()
    
    # Convert 'datetime' column to datetime format
    station_data['datetime'] = pd.to_datetime(station_data['datetime'], errors='coerce')

    # Ensure 'datetime' column is of datetime type
    if not pd.api.types.is_datetime64_any_dtype(station_data['datetime']):
        raise ValueError("The 'datetime' column is not in datetime format.")

    # Drop rows where 'datetime' conversion failed
    station_data = station_data.dropna(subset=['datetime'])

    # Ensure there is data left after dropping
    if station_data.empty:
        raise ValueError("No valid datetime entries in the filtered station data.")

    # Filter similar months' data
    similar_months_data = station_data[(station_data['datetime'].dt.month >= 1) & (station_data['datetime'].dt.month <= month)]
    
    # Handle cases where similar_months_data may be empty
    wse_trend_mean = similar_months_data['WSE'].mean() if not similar_months_data.empty else 0
    wse_lag_1 = similar_months_data['WSE'].iloc[-1] if not similar_months_data.empty else wse_trend_mean
    wse_lag_7 = similar_months_data['WSE'].iloc[-7] if len(similar_months_data) >= 7 else wse_lag_1
    wse_lag_30 = similar_months_data['WSE'].iloc[-30] if len(similar_months_data) >= 30 else wse_lag_1
    wse_rolling_mean_7 = similar_months_data['WSE'].rolling(7).mean().iloc[-1] if len(similar_months_data) >= 7 else wse_trend_mean
    wse_rolling_std_7 = similar_months_data['WSE'].rolling(7).std().iloc[-1] if len(similar_months_data) >= 7 else wse_trend_mean
    wse_rolling_median_7 = similar_months_data['WSE'].rolling(7).median().iloc[-1] if len(similar_months_data) >= 7 else wse_trend_mean
    wse_rolling_mean_30 = similar_months_data['WSE'].rolling(30).mean().iloc[-1] if len(similar_months_data) >= 30 else wse_trend_mean
    wse_rolling_std_30 = similar_months_data['WSE'].rolling(30).std().iloc[-1] if len(similar_months_data) >= 30 else wse_trend_mean
    wse_rolling_median_30 = similar_months_data['WSE'].rolling(30).median().iloc[-1] if len(similar_months_data) >= 30 else wse_trend_mean
    
    features_df = pd.DataFrame({
        'STATION_ENCODED': [encoded_station],
        'year': [year],
        'month': [month],
        'day': [day],
        'WLM_GSE': [wlm_gse_value],
        'WSE_LAG_1': [wse_lag_1],
        'WSE_LAG_7': [wse_lag_7],
        'WSE_LAG_30': [wse_lag_30],
        'WSE_ROLLING_MEAN_7': [wse_rolling_mean_7],
        'WSE_ROLLING_STD_7': [wse_rolling_std_7],
        'WSE_ROLLING_MEDIAN_7': [wse_rolling_median_7],
        'WSE_ROLLING_MEAN_30': [wse_rolling_mean_30],
        'WSE_ROLLING_STD_30': [wse_rolling_std_30],
        'WSE_ROLLING_MEDIAN_30': [wse_rolling_median_30],
        'Month_Sine': [month_sine],
        'Month_Cosine': [month_cosine]
    })
    return features_df

@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        data = request.get_json()
        station_name = data.get('station_name')
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        try:
            start_date = pd.to_datetime(start_date)
            end_date = pd.to_datetime(end_date) if end_date else start_date

            date_range = pd.date_range(start=start_date, end=end_date)
            predictions = []
            for single_date in date_range:
                input_features = prepare_input_features(station_name, single_date)
                prediction = rf_model.predict(input_features)
                predictions.append(prediction[0])

            max_wse = max(predictions)
            min_wse = min(predictions)
            mean_wse = np.mean(predictions)

            result = {
                'dates': [str(date.date()) for date in date_range],
                'predictions': predictions,
                'max_wse': max_wse,
                'min_wse': min_wse,
                'mean_wse': mean_wse
            }

            return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)})

    return render_template('goto.html')

if __name__ == '__main__':
    app.run(debug=True)
