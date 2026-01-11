from flask import Flask, render_template, request
import os

# Create Flask app with explicit paths
template_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')

app = Flask(__name__,
            template_folder=template_dir,
            static_folder=static_dir)

@app.route('/', methods=['GET', 'POST'])
def home():
    prediction = None
    error = None

    if request.method == 'POST':
        try:
            traffic = float(request.form.get('traffic', 0))
            if traffic < 0 or traffic > 100:
                error = "Traffic density must be between 0 and 100"
            else:
                # Simple prediction (placeholder)
                prediction = traffic * 2.5
        except ValueError:
            error = "Please enter a valid number"

    return render_template('simple_index.html',
                         prediction=prediction,
                         error=error)

if __name__ == '__main__':
    print("🚀 Starting Simple Air Quality Monitor...")
    print(f"Templates: {template_dir}")
    print(f"Static: {static_dir}")
    app.run(debug=True, port=5000, host='0.0.0.0')