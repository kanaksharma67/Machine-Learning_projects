from flask import Flask, jsonify, request
from flask_cors import CORS
import util

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
util.load_save_artifacts()

@app.route('/get_location')
def get_location():
    return jsonify({
        'locations': util.get_location()
    })

@app.route('/prediction', methods=['POST'])
def predict_home_price():
    data = request.get_json()

    sqft = data['total_sqft']
    location = data['location']
    bhk = data['bhk']
    bath = data['bath']

    price = util.predict_price(location, sqft, bath, bhk)
    return jsonify({'price': price})

if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(debug=True)
