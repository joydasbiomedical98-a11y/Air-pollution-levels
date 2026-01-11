from flask import Flask
from views import main
import os
import sys

# Add current directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    # Create Flask app with explicit paths
    template_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
    static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')

    app = Flask(__name__,
                template_folder=template_dir,
                static_folder=static_dir)

    # Enable debug mode
    app.config['DEBUG'] = True

    # Register blueprint
    app.register_blueprint(main)

    print("✅ Flask app initialized successfully")
    print(f"📁 Templates: {template_dir}")
    print(f"📁 Static: {static_dir}")

except Exception as e:
    print(f"❌ Error initializing Flask app: {e}")
    sys.exit(1)

if __name__ == "__main__":
    try:
        print("🚀 Starting Premium Air Quality Monitor...")
        print("🌐 Open your browser to: http://localhost:5000")
        print("🛑 Press Ctrl+C to stop the server")
        app.run(debug=True, port=5000, host='0.0.0.0')
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        print("💡 Try running: pip install flask numpy scikit-learn")
        sys.exit(1)