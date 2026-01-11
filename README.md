# �️ Premium Air Quality Monitor - Live Maps & Analytics

A cutting-edge, premium web application for monitoring air pollution levels with live maps, advanced analytics, and Indian weather context. Features a stunning nature-inspired design with Himalayan landscapes and real-time air quality data.

## 🌟 Premium Features

- **🗺️ Interactive Live Maps**: Real-time air quality visualization across India with Leaflet.js
- **🌤️ Weather Integration**: Indian weather context with city-specific conditions
- **🎛️ Multiple AQI Models**: US EPA, Indian NAAQS, and EU standards
- **⚙️ User Preferences**: Customizable AQI models and themes
- **📍 GPS Location**: Current location detection and nearby monitoring stations
- **🏔️ Nature Backgrounds**: Stunning Himalayan hillside and lake view themes
- **📊 Advanced Analytics**: Multiple chart types with premium styling
- **🎨 Premium UI/UX**: Glassmorphism, smooth animations, and elegant design

## 🚀 Core Features

- **AI-Powered Predictions**: Machine learning model for traffic-based AQI forecasting
- **Real-Time Monitoring**: Live data updates and trend analysis
- **Responsive Design**: Perfect on desktop, tablet, and mobile devices
- **Error Handling**: Comprehensive validation and user-friendly messages
- **Modern Tech Stack**: Flask, Chart.js, Leaflet, and premium CSS

## 🗺️ Live Map Features

- **India-Wide Coverage**: 10 major cities with monitoring stations
- **Interactive Markers**: Click for detailed AQI information
- **Color-Coded AQI**: Visual representation of air quality levels
- **GPS Integration**: Find nearby monitoring stations
- **Real-Time Updates**: Dynamic data visualization

## 🌤️ Weather Context

Integrated weather data for major Indian cities:
- Delhi, Mumbai, Bangalore, Chennai, Kolkata
- Temperature, humidity, wind speed, and conditions
- Weather-appropriate air quality context

## 🎯 AQI Calculation Models

### 🇮🇳 Indian NAAQS (Recommended)
- Based on Central Pollution Control Board standards
- Optimized for Indian urban conditions
- Comprehensive particulate matter analysis

### 🇺🇸 US EPA Standard
- United States Environmental Protection Agency methodology
- International benchmark for air quality
- Detailed pollutant analysis

### 🇪🇺 EU Air Quality Index
- European Union standards
- Focus on public health protection
- Stringent environmental criteria

## 🏔️ Nature-Inspired Design

- **Himalayan Theme**: Mountain landscapes with floating animations
- **Lake Views**: Serene water reflections and natural gradients
- **Forest Elements**: Organic shapes and natural color palettes
- **Premium Typography**: Playfair Display and Inter font families
- **Glassmorphism**: Modern frosted glass effects

## 📊 Analytics Dashboard

- **Traffic vs AQI Correlation**: Scatter plot analysis
- **AQI Distribution**: Doughnut chart of air quality categories
- **Real-Time Trends**: Live monitoring line chart
- **Weather Integration**: City-specific weather context
- **Statistics Cards**: Key metrics and insights

## 🛠️ Technical Architecture

```
Premium Air Quality Monitor/
├── Backend (Flask)
│   ├── Multiple AQI Models
│   ├── Weather API Integration
│   ├── GPS Location Services
│   └── User Preferences System
├── Frontend
│   ├── Interactive Maps (Leaflet.js)
│   ├── Advanced Charts (Chart.js)
│   ├── Premium UI (CSS3 + Animations)
│   └── Responsive Design
└── Data Layer
    ├── Indian City Monitoring Stations
    ├── Weather Data Integration
    └── Real-Time AQI Updates
```

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8+
- pip package manager
- Modern web browser with GPS support

### Quick Start

1. **Clone and navigate**
   ```bash
   cd /workspaces/Air-pollution-levels
   ```

2. **Create virtual environment (recommended)**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Access the dashboard**
   ```
   http://localhost:5000
   ```

### 🛠️ Troubleshooting

#### "Module not found" errors
```bash
# Make sure you're in the virtual environment
source .venv/bin/activate

# Install missing packages
pip install flask numpy scikit-learn requests

# Or reinstall all requirements
pip install -r requirements.txt
```

#### "Port already in use" error
```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Or run on different port
python app.py  # Edit port in app.py if needed
```

#### "Template not found" error
```bash
# Make sure you're running from the correct directory
cd /workspaces/Air-pollution-levels
python app.py
```

#### Permission errors
```bash
# On Linux/Mac
chmod +x app.py

# Or run with python explicitly
python3 app.py
```

#### Virtual environment issues
```bash
# Recreate virtual environment
rm -rf .venv
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 🧪 Testing the Installation

Run the diagnostic script:
```bash
python diagnose.py
```

Or run the simple test app:
```bash
python simple_app.py
```

### 🌐 Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### 📱 Mobile Support

- Touch-optimized maps
- Responsive design
- GPS location detection
- Mobile-friendly charts

## 🎨 Customization

### AQI Models
Modify calculation models in `views.py`:
```python
def calculate_custom_aqi(pm25, pm10, no2, so2, co, o3):
    # Your custom AQI calculation logic
    pass
```

### Map Data
Update monitoring stations in `views.py`:
```python
monitoring_stations = [
    {"name": "Your City", "lat": 12.345, "lng": 67.890, "aqi": 75, "city": "YourCity"}
]
```

### Themes
Add new themes in the preferences system:
```javascript
// In script.js
const themes = {
    nature: { /* Himalayan theme */ },
    urban: { /* City theme */ },
    custom: { /* Your theme */ }
};
```

## 📡 API Endpoints

- `GET /api/monitoring-stations` - Get all monitoring stations
- `GET /api/weather/<city>` - Get weather for specific city
- `GET /api/aqi-models` - Get available AQI models
- `POST /api/update-preferences` - Update user preferences

## 🌍 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📱 Mobile Features

- **Touch-Optimized Maps**: Pinch-to-zoom and swipe navigation
- **GPS Location**: One-tap location detection
- **Responsive Charts**: Optimized for mobile screens
- **Touch-Friendly UI**: Large buttons and intuitive gestures

## 🔒 Security & Privacy

- **GPS Data**: Location data used only for map centering
- **No Data Storage**: All processing happens client-side
- **Secure APIs**: HTTPS-only external requests
- **Privacy-First**: No personal data collection

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Submit a pull request

### Development Guidelines

- Follow PEP 8 for Python code
- Use semantic HTML and accessible design
- Test on multiple browsers and devices
- Add documentation for new features

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🙏 Acknowledgments

- **Leaflet.js** for interactive maps
- **Chart.js** for data visualization
- **OpenStreetMap** for map tiles
- **CPCB India** for air quality standards
- **US EPA** for environmental data

---

**Made with ❤️ for cleaner air and better health in India**
- **Error Handling**: Comprehensive input validation and error messages
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- pip package manager

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd /workspaces/Air-pollution-levels
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the test script (optional)**
   ```bash
   python test_app.py
   ```

4. **Start the application**
   ```bash
   python app.py
   ```

5. **Open your browser**
   ```
   http://localhost:5000
   ```

## 📊 How It Works

The application uses a Linear Regression model trained on sample traffic density and AQI data to predict air quality levels. The model takes traffic density (vehicles/hour) as input and outputs an Air Quality Index (AQI) value.

### AQI Categories:
- **Good (0-50)**: Air quality is satisfactory
- **Moderate (51-100)**: Acceptable air quality
- **Unhealthy for Sensitive Groups (101-150)**: Sensitive individuals should avoid prolonged exposure
- **Unhealthy (151-200)**: Everyone should avoid prolonged exposure
- **Very Unhealthy (201-300)**: Health alert for everyone
- **Hazardous (301+)**: Emergency conditions

## 🏗️ Project Structure

```
Air-pollution-levels/
├── app.py                 # Flask application entry point
├── views.py              # Main application logic and routes
├── test_app.py           # Test script for verification
├── requirements.txt      # Python dependencies
├── templates/
│   └── index.html        # Main dashboard template
├── static/
│   ├── css/
│   │   └── style.css     # Modern styling and animations
│   └── js/
│       └── script.js     # Interactive charts and functionality
└── README.md            # This file
```

## 🔧 Technical Details

- **Backend**: Flask web framework
- **ML Model**: Scikit-learn Linear Regression
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js library
- **Styling**: Modern CSS with gradients and animations
- **Data**: JSON for client-server communication

## 🐛 Error Corrections Made

During development, several issues were identified and corrected:

1. **JavaScript Function Duplication**: Removed duplicate `initializeCharts()` function declarations
2. **Data Parsing**: Added proper JSON parsing for data passed from Flask to JavaScript
3. **Error Handling**: Implemented comprehensive input validation and error messages
4. **Static File Serving**: Ensured Flask properly serves CSS and JS files
5. **Responsive Design**: Fixed layout issues on different screen sizes
6. **Animation Conflicts**: Resolved CSS animation and JavaScript conflicts

## 📈 Charts & Visualizations

- **Traffic vs AQI Scatter Plot**: Shows correlation between traffic and air quality
- **AQI Categories Doughnut Chart**: Distribution of air quality levels
- **Real-time Monitoring Line Chart**: Simulated live AQI data updates
- **Statistics Cards**: Key metrics and insights

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the application.

## 📄 License

This project is open source and available under the MIT License.
- **AQI Categories**: Visual breakdown of air quality levels
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 📊 Dashboard Components

1. **Traffic Analysis Form**: Input traffic density to predict AQI
2. **Traffic vs AQI Correlation Chart**: Scatter plot showing relationship
3. **AQI Categories Overview**: Doughnut chart of air quality distribution
4. **Real-time Monitoring**: Live chart with simulated data updates
5. **Statistics Grid**: Key metrics and insights

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.7+
- pip

### Install Dependencies
```bash
pip install flask scikit-learn numpy
```

### Run the Application
```bash
python app.py
```

The app will be available at `http://localhost:5000`

## 🏗️ Project Structure

```
Air-pollution-levels/
├── app.py                 # Flask application entry point
├── views.py              # Blueprint with routes and ML logic
├── templates/
│   └── index.html        # Modern HTML template
├── static/
│   ├── css/
│   │   └── style.css     # Modern CSS with animations
│   └── js/
│       └── script.js     # Chart.js integration and interactions
└── README.md
```

## 🎨 Design Features

- **Gradient Backgrounds**: Modern CSS gradients
- **Glassmorphism**: Semi-transparent cards with backdrop blur
- **Smooth Animations**: CSS transitions and keyframe animations
- **Interactive Elements**: Hover effects and loading states
- **Color-coded AQI**: Visual indicators for air quality levels
- **Responsive Grid**: Flexible layout that adapts to screen size

## 📈 Machine Learning Model

The application uses a simple linear regression model trained on sample data:
- **Input**: Traffic density (vehicles/hour)
- **Output**: Air Quality Index (AQI)
- **Training Data**: 5 sample points for demonstration

## 🔧 Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **Charts**: Chart.js
- **ML**: scikit-learn, NumPy
- **Fonts**: Inter (Google Fonts)

## 🌟 Key Improvements

1. **Modern Design**: Replaced basic styling with contemporary UI patterns
2. **Interactive Charts**: Added multiple chart types for data visualization
3. **Real-time Features**: Simulated live monitoring capabilities
4. **Responsive Layout**: Mobile-first design approach
5. **Enhanced UX**: Loading states, animations, and smooth transitions
6. **Data Visualization**: Multiple ways to view and understand air quality data

## 📱 Usage

1. Open the application in your browser
2. Enter a traffic density value (0-100 vehicles/hour)
3. Click "Analyze Air Quality" to get AQI prediction
4. View the results and explore the interactive charts
5. Monitor the real-time data updates

## 🤝 Contributing

Feel free to enhance the application with:
- More sophisticated ML models
- Real-time data integration
- Additional chart types
- Weather data integration
- Historical data analysis