// Premium Air Pollution Dashboard JavaScript
let map;
let markers = [];
let currentLocation = null;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeMap();
    initializeCharts();
    initializeWeather();
    setupSettingsPanel();

    // Add loading animation to form submission
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const button = form.querySelector('.btn');
            if (button) {
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
                button.disabled = true;
                // Re-enable button after 2 seconds (in case of error)
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-search"></i> Analyze Air Quality';
                    button.disabled = false;
                }, 2000);
            }
        });
    }

    // Add smooth scrolling for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards for animation
    document.querySelectorAll('.analytics-card, .chart-card, .map-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });
});

// Initialize Leaflet Map
function initializeMap() {
    if (typeof L === 'undefined') {
        console.warn('Leaflet not loaded. Map will not be displayed.');
        return;
    }

    // Initialize map centered on India
    map = L.map('aqi-map').setView([20.5937, 78.9629], 5);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
    }).addTo(map);

    // Add monitoring stations
    updateMapMarkers();

    // Add current location marker if available
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            L.marker([currentLocation.lat, currentLocation.lng], {
                icon: L.divIcon({
                    className: 'current-location-marker',
                    html: '<div style="background: #4CAF50; border: 3px solid white; border-radius: 50%; width: 20px; height: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"></div>',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                })
            }).addTo(map).bindPopup('<b>Your Location</b><br>Current GPS position');
        });
    }
}

// Update map markers with AQI data
function updateMapMarkers() {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Parse monitoring stations data
    let stations;
    try {
        stations = JSON.parse(window.monitoringStations || '[]');
    } catch (e) {
        stations = [];
    }

    stations.forEach(station => {
        const aqi = station.aqi || 50;
        const color = getAQIColor(aqi);

        const marker = L.circleMarker([station.lat, station.lng], {
            color: color,
            fillColor: color,
            fillOpacity: 0.7,
            radius: Math.max(8, Math.min(20, aqi / 15)),
            weight: 2
        }).addTo(map);

        marker.bindPopup(`
            <div style="font-family: Inter, sans-serif; max-width: 200px;">
                <h4 style="margin: 0 0 8px 0; color: #2c3e50;">${station.name}</h4>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <div style="width: 12px; height: 12px; border-radius: 50%; background: ${color};"></div>
                    <span style="font-weight: 600;">AQI: ${aqi}</span>
                </div>
                <div style="font-size: 0.9rem; color: #7f8c8d;">
                    City: ${station.city}<br>
                    Status: ${getAQIStatus(aqi).status}
                </div>
            </div>
        `);

        markers.push(marker);
    });
}

// Get AQI color based on value
function getAQIColor(aqi) {
    if (aqi <= 50) return '#00e400';
    if (aqi <= 100) return '#ffff00';
    if (aqi <= 150) return '#ff7e00';
    if (aqi <= 200) return '#ff0000';
    if (aqi <= 300) return '#8f3f97';
    return '#7e0023';
}

// Show all monitoring stations
function showAllStations() {
    if (map) {
        map.setView([20.5937, 78.9629], 5);
    }
    document.querySelectorAll('.map-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.map-btn:first-child').classList.add('active');
}

// Show nearby stations (within 500km of current location)
function showNearbyStations() {
    if (currentLocation && map) {
        map.setView([currentLocation.lat, currentLocation.lng], 8);
    }
    document.querySelectorAll('.map-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.map-btn:last-child').classList.add('active');
}

// Get current location
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            if (map) {
                map.setView([currentLocation.lat, currentLocation.lng], 10);
                L.marker([currentLocation.lat, currentLocation.lng]).addTo(map)
                    .bindPopup('<b>Your Current Location</b><br>Latitude: ' + currentLocation.lat.toFixed(4) + '<br>Longitude: ' + currentLocation.lng.toFixed(4))
                    .openPopup();
            }

            // Show success message
            showNotification('Location found! Showing nearby air quality data.', 'success');
        }, function(error) {
            showNotification('Unable to get your location. Please enable location services.', 'error');
        });
    } else {
        showNotification('Geolocation is not supported by this browser.', 'error');
    }
}

// Initialize weather data
function initializeWeather() {
    const weatherCities = document.querySelectorAll('.weather-city');
    weatherCities.forEach(city => {
        const cityName = city.dataset.city;
        updateWeatherDisplay(cityName);
    });
}

// Update weather display for a city
function updateWeatherDisplay(cityName) {
    let weatherData;
    try {
        weatherData = JSON.parse(window.weatherData || '{}');
    } catch (e) {
        weatherData = {};
    }

    const cityElement = document.querySelector(`[data-city="${cityName}"]`);
    if (cityElement && weatherData[cityName]) {
        const weather = weatherData[cityName];
        cityElement.querySelector('.temp').textContent = weather.temp + '°C';
        cityElement.querySelector('.condition').textContent = weather.condition;
    }
}

// Settings panel functionality
function toggleSettings() {
    const panel = document.getElementById('settings-panel');
    panel.classList.toggle('active');
}

// Setup settings panel
function setupSettingsPanel() {
    const form = document.getElementById('preferences-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);

            fetch('/api/update-preferences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    aqi_model: formData.get('aqi_model'),
                    theme: formData.get('theme')
                })
            })
            .then(response => response.json())
            .then(data => {
                showNotification('Preferences updated successfully!', 'success');
                toggleSettings();
                // Reload page to apply new settings
                setTimeout(() => location.reload(), 1000);
            })
            .catch(error => {
                showNotification('Failed to update preferences.', 'error');
            });
        });
    }

    // Close settings panel when clicking outside
    document.addEventListener('click', function(e) {
        const panel = document.getElementById('settings-panel');
        const settingsBtn = document.querySelector('.settings-btn');

        if (!panel.contains(e.target) && !settingsBtn.contains(e.target)) {
            panel.classList.remove('active');
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function initializeCharts() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded. Charts will not be displayed.');
        return;
    }

    // Traffic vs AQI Relationship Chart
    const trafficChartCtx = document.getElementById('trafficChart');
    if (trafficChartCtx) {
        // Parse data from Flask (comes as JSON strings)
        let trafficData, aqiData;
        try {
            trafficData = JSON.parse(window.trafficData || '[10, 20, 30, 40, 50, 60, 70, 80, 90]');
            aqiData = JSON.parse(window.aqiData || '[50, 70, 90, 110, 130, 150, 170, 190, 210]');
        } catch (e) {
            // Fallback to default data if parsing fails
            trafficData = [10, 20, 30, 40, 50, 60, 70, 80, 90];
            aqiData = [50, 70, 90, 110, 130, 150, 170, 190, 210];
        }

        const scatterData = trafficData.map((traffic, index) => ({
            x: traffic,
            y: aqiData[index] || (traffic * 2 + 30)
        }));

        new Chart(trafficChartCtx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Traffic Density vs AQI',
                    data: scatterData,
                    backgroundColor: 'rgba(102, 126, 234, 0.6)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }, {
                    label: 'Regression Line',
                    data: [
                        { x: 0, y: 30 }, { x: 100, y: 230 }
                    ],
                    type: 'line',
                    borderColor: 'rgba(245, 87, 108, 1)',
                    borderWidth: 3,
                    fill: false,
                    pointRadius: 0,
                    tension: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Traffic Density vs Air Quality Index',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        padding: 20
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        cornerRadius: 8,
                        displayColors: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Traffic Density (vehicles/hour)',
                            font: {
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Air Quality Index (AQI)',
                            font: {
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    // AQI Categories Chart
    const aqiCategoriesCtx = document.getElementById('aqiCategoriesChart');
    if (aqiCategoriesCtx) {
        // Parse AQI categories data from Flask
        let aqiCategories;
        try {
            aqiCategories = JSON.parse(window.aqiCategories || '{"Good (0-50)": 25, "Moderate (51-100)": 30, "Unhealthy (101-150)": 20, "Very Unhealthy (151-200)": 15, "Hazardous (201+)": 10}');
        } catch (e) {
            aqiCategories = {"Good (0-50)": 25, "Moderate (51-100)": 30, "Unhealthy (101-150)": 20, "Very Unhealthy (151-200)": 15, "Hazardous (201+)": 10};
        }

        const labels = Object.keys(aqiCategories);
        const data = Object.values(aqiCategories);

        new Chart(aqiCategoriesCtx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        'rgba(0, 228, 0, 0.8)',
                        'rgba(255, 255, 0, 0.8)',
                        'rgba(255, 126, 0, 0.8)',
                        'rgba(255, 0, 0, 0.8)',
                        'rgba(143, 63, 151, 0.8)'
                    ],
                    borderColor: [
                        'rgba(0, 228, 0, 1)',
                        'rgba(255, 255, 0, 1)',
                        'rgba(255, 126, 0, 1)',
                        'rgba(255, 0, 0, 1)',
                        'rgba(143, 63, 151, 1)'
                    ],
                    borderWidth: 2,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'AQI Categories Distribution',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        padding: 20
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true,
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    // Real-time data simulation (for demo purposes)
    const realtimeChartCtx = document.getElementById('realtimeChart');
    if (realtimeChartCtx) {
        const realtimeData = [];
        const maxDataPoints = 20;

        const realtimeChart = new Chart(realtimeChartCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Real-time AQI',
                    data: realtimeData,
                    borderColor: 'rgba(102, 126, 234, 1)',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Real-time Air Quality Monitoring',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        padding: 20
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'AQI',
                            font: {
                                weight: 'bold'
                            }
                        },
                        min: 0,
                        max: 250
                    }
                },
                animation: {
                    duration: 0
                }
            }
        });

        // Simulate real-time data updates
        function addDataPoint() {
            const now = new Date();
            const timeLabel = now.toLocaleTimeString();
            const aqiValue = Math.floor(Math.random() * 100) + 50; // Random AQI between 50-150

            realtimeData.push(aqiValue);
            realtimeChart.data.labels.push(timeLabel);

            if (realtimeData.length > maxDataPoints) {
                realtimeData.shift();
                realtimeChart.data.labels.shift();
            }

            realtimeChart.update();
        }

        // Update every 3 seconds
        setInterval(addDataPoint, 3000);
    }
}

// Utility function to get AQI status
function getAQIStatus(aqi) {
    let aqiColors;
    try {
        aqiColors = JSON.parse(window.aqiColors || '{"Good": "#00e400", "Moderate": "#ffff00", "Unhealthy for Sensitive Groups": "#ff7e00", "Unhealthy": "#ff0000", "Very Unhealthy": "#8f3f97", "Hazardous": "#7e0023"}');
    } catch (e) {
        aqiColors = {"Good": "#00e400", "Moderate": "#ffff00", "Unhealthy for Sensitive Groups": "#ff7e00", "Unhealthy": "#ff0000", "Very Unhealthy": "#8f3f97", "Hazardous": "#7e0023"};
    }

    if (aqi <= 50) return { status: 'Good', color: aqiColors['Good'] };
    if (aqi <= 100) return { status: 'Moderate', color: aqiColors['Moderate'] };
    if (aqi <= 150) return { status: 'Unhealthy for Sensitive Groups', color: aqiColors['Unhealthy for Sensitive Groups'] };
    if (aqi <= 200) return { status: 'Unhealthy', color: aqiColors['Unhealthy'] };
    if (aqi <= 300) return { status: 'Very Unhealthy', color: aqiColors['Very Unhealthy'] };
    return { status: 'Hazardous', color: aqiColors['Hazardous'] };
}

// Function to update result display with animations
function updateResult(prediction) {
    const resultCard = document.querySelector('.result-card');
    if (resultCard && prediction) {
        const aqiInfo = getAQIStatus(prediction);
        const aqiValueElement = resultCard.querySelector('.aqi-value');
        const aqiStatusElement = resultCard.querySelector('.aqi-status');

        if (aqiValueElement) {
            aqiValueElement.textContent = prediction.toFixed(1);
            aqiValueElement.style.color = aqiInfo.color;
        }

        if (aqiStatusElement) {
            aqiStatusElement.textContent = aqiInfo.status;
        }

        // Add success animation
        resultCard.style.animation = 'none';
        setTimeout(() => {
            resultCard.style.animation = 'slideIn 0.5s ease-out';
        }, 10);
    }
}

// Export functions for global use
window.AirPollutionDashboard = {
    updateResult: updateResult,
    getAQIStatus: getAQIStatus
};