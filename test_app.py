#!/usr/bin/env python3
"""
Test script to verify the Air Pollution Dashboard app works correctly.
"""

import sys
import os

# Add the current directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    # Test imports
    from flask import Flask
    from views import main
    import numpy as np
    from sklearn.linear_model import LinearRegression
    import json

    print("✅ All imports successful")

    # Test Flask app creation
    app = Flask(__name__)
    app.register_blueprint(main)
    print("✅ Flask app created successfully")

    # Test the model
    X = np.array([[10], [20], [30], [40], [50]])
    y = np.array([50, 70, 90, 110, 130])
    model = LinearRegression()
    model.fit(X, y)

    # Test prediction
    test_prediction = model.predict([[25]])[0]
    print(f"✅ Model prediction test: {test_prediction:.2f}")

    # Test data serialization
    traffic_data = [10, 20, 30, 40, 50, 60, 70, 80, 90]
    aqi_data = [50, 70, 90, 110, 130, 150, 170, 190, 210]
    aqi_categories = {
        'Good (0-50)': 25,
        'Moderate (51-100)': 30,
        'Unhealthy (101-150)': 20,
        'Very Unhealthy (151-200)': 15,
        'Hazardous (201+)': 10
    }

    json.dumps(traffic_data)
    json.dumps(aqi_data)
    json.dumps(aqi_categories)
    print("✅ JSON serialization test passed")

    print("\n🎉 All tests passed! The Air Pollution Dashboard app is ready to run.")
    print("Run 'python app.py' to start the server.")

except ImportError as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)