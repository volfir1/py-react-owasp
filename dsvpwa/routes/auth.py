# routes/auth.py
from flask import Blueprint, jsonify, request, session, g, current_app
import logging
import secrets
from utils.auth import verify_password, check_rate_limit, update_login_attempts

auth_bp = Blueprint('auth', __name__)
logger = logging.getLogger(__name__)

def get_db():
    return current_app.get_db()  # Use the function from the main app

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])  # Removed /api prefix
def login():
    if request.method == 'OPTIONS':
        return '', 204

    if not request.is_json:
        return jsonify({
            'status': 'error',
            'message': 'Content-Type must be application/json'
        }), 415

    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({
                'status': 'error',
                'message': 'Username and password are required'
            }), 400

        # Check rate limiting
        if not check_rate_limit(username):
            return jsonify({
                'status': 'error',
                'message': 'Account is temporarily locked. Please try again later.'
            }), 429

        db = get_db()
        user = db.execute(
            'SELECT * FROM users WHERE username = ?',
            (username,)
        ).fetchone()

        if user is None or not verify_password(user['password'], password):
            update_login_attempts(username, False)
            return jsonify({
                'status': 'error',
                'message': 'Invalid credentials'
            }), 401

        # Successful login
        update_login_attempts(username, True)
        session_token = secrets.token_hex(32)
        
        db.execute(
            'UPDATE users SET session_id = ?, last_login = CURRENT_TIMESTAMP WHERE id = ?',
            (session_token, user['id'])
        )
        db.commit()

        session.permanent = True
        session['user_id'] = user['id']
        session['session_token'] = session_token

        return jsonify({
            'status': 'success',
            'message': 'Login successful',
            'user': {
                'id': user['id'],
                'username': user['username'],
                'firstname': user['firstname'],
                'lastname': user['lastname'],
                'email': user['email'],
                'role': user['role']
            }
        })

    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Internal server error'
        }), 500

@auth_bp.route('/logout', methods=['POST'])  # Removed /api prefix
def logout():
    try:
        if 'user_id' in session:
            db = get_db()
            db.execute(
                'UPDATE users SET session_id = NULL WHERE id = ?',
                (session['user_id'],)
            )
            db.commit()
            session.clear()

        return jsonify({
            'status': 'success',
            'message': 'Logged out successfully'
        })

    except Exception as e:
        logger.error(f"Logout error: {e}")
        return jsonify({
            'status': 'error',
            'message': 'Internal server error'
        }), 500