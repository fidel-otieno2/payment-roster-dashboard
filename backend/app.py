from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import psycopg2
import psycopg2.extras
import os
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta

app = Flask(__name__)
CORS(app)

# Configurations
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET', 'super-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
jwt = JWTManager(app)

# Database connection
DATABASE_URL = os.getenv('DATABASE_URL')

def get_db_connection():
    conn = psycopg2.connect(DATABASE_URL)
    return conn

# Routes

@app.route('/')
def index():
    return jsonify({"message": "Flask backend running..."})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'employee')

    if not name or not email or not password:
        return jsonify({"error": "Name, email and password are required"}), 400

    hashed_password = generate_password_hash(password)

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            return jsonify({"error": "User already exists"}), 409

        cur.execute(
            "INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s) RETURNING id",
            (name, email, hashed_password, role)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        access_token = create_access_token(identity=user_id)
        return jsonify({"access_token": access_token}), 201
    except Exception as e:
        return jsonify({"error": "Server error"}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        cur.close()
        conn.close()

        if user and check_password_hash(user['password'], password):
            access_token = create_access_token(identity=user['id'])
            return jsonify({"access_token": access_token}), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"error": "Server error"}), 500

@app.route('/api/payments', methods=['GET'])
@jwt_required()
def get_payments():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute("""
            SELECT payments.id, users.name as employee_name, payments.amount, payments.date, payments.status, payments.notes
            FROM payments
            JOIN users ON payments.employee_id = users.id
            ORDER BY payments.date DESC
        """)
        payments = cur.fetchall()
        cur.close()
        conn.close()
        payments_list = [dict(payment) for payment in payments]
        return jsonify(payments_list), 200
    except Exception as e:
        return jsonify({"error": "Server error"}), 500

@app.route('/api/payments', methods=['POST'])
@jwt_required()
def add_payment():
    data = request.get_json()
    employee_id = data.get('employee_id')
    amount = data.get('amount')
    date = data.get('date')
    status = data.get('status')
    notes = data.get('notes')

    if not employee_id or not amount or not date or not status:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO payments (employee_id, amount, date, status, notes)
            VALUES (%s, %s, %s, %s, %s) RETURNING id
        """, (employee_id, amount, date, status, notes))
        payment_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"id": payment_id}), 201
    except Exception as e:
        return jsonify({"error": "Server error"}), 500

@app.route('/api/payments/<int:payment_id>', methods=['PATCH'])
@jwt_required()
def update_payment(payment_id):
    data = request.get_json()
    fields = []
    values = []

    for field in ['employee_id', 'amount', 'date', 'status', 'notes']:
        if field in data:
            fields.append(f"{field} = %s")
            values.append(data[field])

    if not fields:
        return jsonify({"error": "No fields to update"}), 400

    values.append(payment_id)

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        query = f"UPDATE payments SET {', '.join(fields)} WHERE id = %s"
        cur.execute(query, tuple(values))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "Payment updated"}), 200
    except Exception as e:
        return jsonify({"error": "Server error"}), 500

@app.route('/api/payments/<int:payment_id>', methods=['DELETE'])
@jwt_required()
def delete_payment(payment_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM payments WHERE id = %s", (payment_id,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "Payment deleted"}), 200
    except Exception as e:
        return jsonify({"error": "Server error"}), 500

@app.route('/api/backend-url', methods=['GET'])
def get_backend_url():
    backend_url = os.getenv('RENDER_BACKEND_URL', 'https://payment-roster-dashboard-1.onrender.com')
    return jsonify({"backend_url": backend_url})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 4000)), debug=True)
