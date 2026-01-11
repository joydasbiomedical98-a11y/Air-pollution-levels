from flask import Blueprint, render_template, request, jsonify
import numpy as np
from sklearn.linear_model import LinearRegression
import json
import random
from datetime import datetime
import os

# Create blueprint
main = Blueprint('main', __name__)

try:
    # Sample air pollution data
    # X = traffic density (example)
    # y = pollution level (AQI)
    X = np.array([[10], [20], [30], [40], [50]])
    y = np.array([50, 70, 90, 110, 130])

    # Train Linear Regression model
    model = LinearRegression()
    model.fit(X, y)
    print("✅ ML model trained successfully")

except Exception as e:
    print(f"❌ Error training ML model: {e}")
    model = None

# AQI calculation models
def calculate_us_epa_aqi(pm25, pm10, no2, so2, co, o3):
    """US EPA AQI calculation"""
    # Simplified AQI calculation based on PM2.5 (main pollutant in Indian cities)
    if pm25 <= 12.0:
        aqi = (50/12.0) * pm25
    elif pm25 <= 35.4:
        aqi = (49/23.4) * (pm25 - 12.0) + 51
    elif pm25 <= 55.4:
        aqi = (49/20.0) * (pm25 - 35.4) + 101
    elif pm25 <= 150.4:
        aqi = (49/95.0) * (pm25 - 55.4) + 151
    elif pm25 <= 250.4:
        aqi = (99/100.0) * (pm25 - 150.4) + 201
    else:
        aqi = (99/99.9) * (pm25 - 250.4) + 301

    return min(500, max(0, aqi))

def calculate_indian_naaqs_aqi(pm25, pm10, no2, so2, co, o3):
    """Indian NAAQS AQI calculation"""
    # Based on CPCB (Central Pollution Control Board) standards
    if pm25 <= 30:
        aqi = (50/30) * pm25
    elif pm25 <= 60:
        aqi = (49/30) * (pm25 - 30) + 51
    elif pm25 <= 90:
        aqi = (49/30) * (pm25 - 60) + 101
    elif pm25 <= 120:
        aqi = (49/30) * (pm25 - 90) + 151
    elif pm25 <= 250:
        aqi = (99/130) * (pm25 - 120) + 201
    else:
        aqi = (99/130) * (pm25 - 250) + 301

    return min(500, max(0, aqi))

def calculate_eu_aqi(pm25, pm10, no2, so2, co, o3):
    """EU AQI calculation"""
    # Based on European Air Quality Index
    if pm25 <= 10:
        aqi = (25/10) * pm25
    elif pm25 <= 20:
        aqi = (24/10) * (pm25 - 10) + 26
    elif pm25 <= 25:
        aqi = (24/5) * (pm25 - 20) + 51
    elif pm25 <= 50:
        aqi = (49/25) * (pm25 - 25) + 76
    else:
        aqi = (24/25) * (pm25 - 50) + 126

    return min(150, max(0, aqi))

# Sample monitoring stations data (Indian cities)
monitoring_stations = [
    {"name": "Delhi - ITO", "lat": 28.6280, "lng": 77.2200, "aqi": 285, "city": "Delhi"},
    {"name": "Mumbai - Bandra", "lat": 19.0596, "lng": 72.8295, "aqi": 165, "city": "Mumbai"},
    {"name": "Bangalore - Hebbal", "lat": 13.0358, "lng": 77.6320, "aqi": 95, "city": "Bangalore"},
    {"name": "Chennai - T. Nagar", "lat": 13.0827, "lng": 80.2707, "aqi": 125, "city": "Chennai"},
    {"name": "Kolkata - Rabindra Sarobar", "lat": 22.5122, "lng": 88.3639, "aqi": 198, "city": "Kolkata"},
    {"name": "Hyderabad - Zoo Park", "lat": 17.3497, "lng": 78.4515, "aqi": 142, "city": "Hyderabad"},
    {"name": "Pune - Shivajinagar", "lat": 18.5308, "lng": 73.8475, "aqi": 178, "city": "Pune"},
    {"name": "Ahmedabad - Maninagar", "lat": 22.9908, "lng": 72.6041, "aqi": 203, "city": "Ahmedabad"},
    {"name": "Jaipur - JLN Marg", "lat": 26.9124, "lng": 75.7873, "aqi": 156, "city": "Jaipur"},
    {"name": "Lucknow - Talkatora", "lat": 26.8467, "lng": 80.9462, "aqi": 189, "city": "Lucknow"}
]

# Weather data for Indian context
weather_data = {
    "Delhi": {"temp": 32, "humidity": 45, "wind_speed": 12, "condition": "Hazy", "icon": "🌫️"},
    "Mumbai": {"temp": 31, "humidity": 78, "wind_speed": 18, "condition": "Humid", "icon": "🌤️"},
    "Bangalore": {"temp": 28, "humidity": 65, "wind_speed": 8, "condition": "Pleasant", "icon": "☀️"},
    "Chennai": {"temp": 34, "humidity": 72, "wind_speed": 15, "condition": "Hot", "icon": "🌞"},
    "Kolkata": {"temp": 33, "humidity": 80, "wind_speed": 10, "condition": "Humid", "icon": "🌧️"}
}

# User preferences (in a real app, this would be stored in a database)
user_preferences = {
    "aqi_model": "indian_naaqs",  # Options: us_epa, indian_naaqs, eu
    "notifications": True,
    "theme": "nature",  # Options: nature, urban, minimal
    "units": "metric",
    "language": "en"
}

# Sample data for charts
traffic_data = [10, 20, 30, 40, 50, 60, 70, 80, 90]
aqi_data = [50, 70, 90, 110, 130, 150, 170, 190, 210]

# AQI categories data
aqi_categories = {
    'Good (0-50)': 25,
    'Moderate (51-100)': 30,
    'Unhealthy (101-150)': 20,
    'Very Unhealthy (151-200)': 15,
    'Hazardous (201+)': 10
}

# Colors for AQI categories
aqi_colors = {
    'Good': '#00e400',
    'Moderate': '#ffff00',
    'Unhealthy for Sensitive Groups': '#ff7e00',
    'Unhealthy': '#ff0000',
    'Very Unhealthy': '#8f3f97',
    'Hazardous': '#7e0023'
}

@main.route("/", methods=["GET", "POST"])
def index():
    prediction = None
    aqi_status = None
    error = None
    selected_model = user_preferences.get("aqi_model", "indian_naaqs")

    if request.method == "POST":
        try:
            traffic = float(request.form["traffic"])
            if traffic < 0 or traffic > 100:
                error = "Traffic density must be between 0 and 100"
            elif model is None:
                error = "Machine learning model not available. Please check your installation."
            else:
                # Get user preferences from form if provided
                selected_model = request.form.get("aqi_model", selected_model)

                # Calculate prediction using selected model
                prediction = model.predict([[traffic]])[0]

                # Apply selected AQI calculation model
                if selected_model == "us_epa":
                    prediction = calculate_us_epa_aqi(prediction * 0.1, prediction * 0.2, 20, 10, 1, 30)
                elif selected_model == "indian_naaqs":
                    prediction = calculate_indian_naaqs_aqi(prediction * 0.1, prediction * 0.2, 20, 10, 1, 30)
                elif selected_model == "eu":
                    prediction = calculate_eu_aqi(prediction * 0.1, prediction * 0.2, 20, 10, 1, 30)

                # Determine AQI status
                if prediction <= 50:
                    aqi_status = "Good"
                elif prediction <= 100:
                    aqi_status = "Moderate"
                elif prediction <= 150:
                    aqi_status = "Unhealthy for Sensitive Groups"
                elif prediction <= 200:
                    aqi_status = "Unhealthy"
                elif prediction <= 300:
                    aqi_status = "Very Unhealthy"
                else:
                    aqi_status = "Hazardous"
        except ValueError:
            error = "Please enter a valid number for traffic density"
        except Exception as e:
            error = f"An error occurred: {str(e)}"

    return render_template("index.html",
                         prediction=prediction,
                         aqi_status=aqi_status,
                         error=error,
                         traffic_data=json.dumps(traffic_data),
                         aqi_data=json.dumps(aqi_data),
                         aqi_categories=json.dumps(aqi_categories),
                         aqi_colors=json.dumps(aqi_colors),
                         monitoring_stations=json.dumps(monitoring_stations),
                         weather_data=json.dumps(weather_data),
                         user_preferences=json.dumps(user_preferences),
                         selected_model=selected_model)

@main.route("/api/monitoring-stations")
def get_monitoring_stations():
    """API endpoint for monitoring stations data"""
    return jsonify(monitoring_stations)

@main.route("/api/weather/<city>")
def get_weather(city):
    """API endpoint for weather data"""
    weather = weather_data.get(city, {"temp": 30, "humidity": 60, "wind_speed": 10, "condition": "Clear", "icon": "☀️"})
    return jsonify(weather)

@main.route("/api/aqi-models")
def get_aqi_models():
    """API endpoint for available AQI models"""
    models = {
        "us_epa": {"name": "US EPA Standard", "description": "United States Environmental Protection Agency standard"},
        "indian_naaqs": {"name": "Indian NAAQS", "description": "National Ambient Air Quality Standards (India)"},
        "eu": {"name": "EU Air Quality Index", "description": "European Union air quality standards"}
    }
    return jsonify(models)

@main.route("/api/update-preferences", methods=["POST"])
def update_preferences():
    """API endpoint to update user preferences"""
    global user_preferences
    data = request.get_json()
    if data:
        user_preferences.update(data)
    return jsonify({"success": True, "preferences": user_preferences})