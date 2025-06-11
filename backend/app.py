import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS # Import CORS
from database import get_db, close_db, init_app # Import database functions

app = Flask(__name__, instance_relative_config=True)
CORS(app) # Enable CORS for all origins by default (for dev)

# Ensure instance folder exists
import os
os.makedirs(app.instance_path, exist_ok=True)

# Register database functions with the app
init_app(app)

@app.route('/')
def index():
    return "Flask backend is running!"

# --- API Endpoints for Addresses ---

@app.route('/api/addresses', methods=['GET'])
def get_addresses():
    db = get_db()
    addresses = db.execute('SELECT * FROM addresses').fetchall()
    # Convert Row objects to dictionaries for JSON serialization
    addresses_dict = [dict(row) for row in addresses]
    return jsonify(addresses_dict)


@app.route('/api/addresses', methods=['POST'])
def add_address():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    name = data.get('name')
    postcode = data.get('postcode')
    prefecture = data.get('prefecture')
    city = data.get('city')
    street = data.get('street')
    apartment = data.get('apartment')
    phone = data.get('phone')
    email = data.get('email')

    if not all([name, postcode, prefecture, city, street, phone, email]):
        return jsonify({"error": "Name, postcode, prefecture, city, street, phone ,and email are required"}), 400

    db = get_db()
    try:
        cursor = db.execute(
            'INSERT INTO addresses (name, postcode, prefecture, city, street, apartment, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            (name, postcode, prefecture, city, street, apartment, phone, email)
        )
        db.commit()
        new_id = cursor.lastrowid
        return jsonify({"message": "Address added successfully", "id": new_id}), 201
    except sqlite3.Error as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/api/addresses/<int:id>', methods=['GET'])
def get_address_by_id(id):
    print(f"Fetching address with ID: {id}")
    db = get_db()
    address = db.execute('SELECT * FROM addresses WHERE id = ?', (id,)).fetchone()
    if address is None:
        return jsonify({"message": "Address not found"}), 404
    return jsonify(dict(address))

@app.route('/api/addresses/<int:id>', methods=['PUT'])
def update_address(id):
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    name = data.get('name')
    postcode = data.get('postcode')
    prefecture = data.get('prefecture')
    city = data.get('city')
    street = data.get('street')
    apartment = data.get('apartment')
    phone = data.get('phone')
    email = data.get('email')

    # Basic validation for required fields
    if not all([name, postcode, prefecture, city, street, phone, email]):
        return jsonify({"error": "Name, Postcode, Prefecture, City, Street, Phone, and Email are required"}), 400

    db = get_db()
    try:
        cursor = db.execute(
            'UPDATE addresses SET name=?, postcode=?, prefecture=?, city=?, street=?, apartment=?, phone=?, email=? WHERE id=?',
            (name, postcode, prefecture, city, street, apartment, phone, email, id)
        )
        db.commit()
        if cursor.rowcount == 0:
            return jsonify({"message": "Address not found"}), 404
        return jsonify({"message": "Address updated successfully"}), 200
    except sqlite3.IntegrityError as e:
        db.rollback()
        return jsonify({"error": f"Database integrity error: {e}"}), 400
    except sqlite3.Error as e:
        db.rollback()
        return jsonify({"error": f"Database error: {e}"}), 500
    

@app.route('/api/addresses/<int:id>', methods=['DELETE'])
def delete_address(id):
    db = get_db()
    cursor = db.execute('DELETE FROM addresses WHERE id = ?', (id,))
    db.commit()
    if cursor.rowcount == 0:
        return jsonify({"message": "Address not found"}), 404
    return jsonify({"message": "Address deleted successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True) # debug=True for development, turn off for production