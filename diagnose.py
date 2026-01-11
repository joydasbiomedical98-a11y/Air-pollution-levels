#!/usr/bin/env python3
"""
Simple test script to diagnose Flask app issues
"""

import sys
import os

print("🔍 Diagnosing Flask app issues...")
print(f"Python version: {sys.version}")
print(f"Current directory: {os.getcwd()}")

try:
    print("Testing Flask import...")
    from flask import Flask
    print("✅ Flask imported successfully")

    print("Testing numpy import...")
    import numpy as np
    print("✅ NumPy imported successfully")

    print("Testing scikit-learn import...")
    from sklearn.linear_model import LinearRegression
    print("✅ Scikit-learn imported successfully")

    print("Testing views import...")
    from views import main
    print("✅ Views imported successfully")

    print("Testing Flask app creation...")
    app = Flask(__name__)
    app.register_blueprint(main)
    print("✅ Flask app created successfully")

    print("Testing model creation...")
    X = np.array([[10], [20], [30], [40], [50]])
    y = np.array([50, 70, 90, 110, 130])
    model = LinearRegression()
    model.fit(X, y)
    prediction = model.predict([[25]])[0]
    print(f"✅ Model prediction test: {prediction:.2f}")

    print("\n🎉 All tests passed! The app should run fine.")
    print("Try running: python app.py")

except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Try installing missing dependencies:")
    print("pip install flask numpy scikit-learn")
    sys.exit(1)

except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)