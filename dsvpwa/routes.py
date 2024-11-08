# routes/auth_routes.py
from flask import jsonify, request, session, g
from . import auth_bp
from database import get_db
from auth import verify_password, check_rate_limit, update_login_attempts
import secrets
import logging

logger = logging.getLogger(__name__)

@auth_bp.route('/api/login', methods=['POST', 'OPTIONS'])
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

        if not check_rate_limit(username):
            return jsonify({
                'status': 'error',
                'message': 'Account is temporarily locked'
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

        update_login_attempts(username, True)
        session_token = secrets.token_hex(32)
        
        db.execute(
            'UPDATE users SET session_id = ?, last_login = CURRENT_TIMESTAMP WHERE id = ?',
            (session_token, user['id'])
        )
        db.commit()

        session.clear()
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

@auth_bp.route('/api/logout', methods=['POST'])
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

# routes/profile_routes.py
from flask import jsonify, g
from . import profile_bp
from auth import auth_required
import logging

logger = logging.getLogger(__name__)

@profile_bp.route('/api/profile', methods=['GET'])
@auth_required
def get_profile():
    try:
        user = g.user
        return jsonify({
            'status': 'success',
            'data': {
                'id': user['id'],
                'username': user['username'],
                'firstname': user['firstname'],
                'lastname': user['lastname'],
                'email': user['email'],
                'role': user['role']
            }
        })
    except Exception as e:
        logger.error(f"Profile error: {e}")
        return jsonify({
            'status': 'error',
            'message': 'Internal server error'
        }), 500

@profile_bp.route('/api/dashboard', methods=['GET'])
@auth_required
def get_dashboard():
    try:
        user = g.user
        db = get_db()
        
        total_users = db.execute('SELECT COUNT(*) as count FROM users').fetchone()['count']
        
        dashboard_data = {
            'user_info': {
                'id': user['id'],
                'name': f"{user['firstname']} {user['lastname']}",
                'role': user['role'],
                'email': user['email']
            },
            'statistics': {
                'total_users': total_users
            }
        }
        
        if user['role'] == 'admin':
            admin_stats = db.execute('''
                SELECT 
                    COUNT(*) FILTER (WHERE role = 'student') as total_students,
                    COUNT(*) FILTER (WHERE role = 'admin') as total_admins
                FROM users
            ''').fetchone()
            
            dashboard_data['statistics'].update({
                'total_students': admin_stats['total_students'],
                'total_admins': admin_stats['total_admins']
            })
        
        return jsonify({
            'status': 'success',
            'data': dashboard_data
        })
    except Exception as e:
        logger.error(f"Dashboard error: {e}")
        return jsonify({
            'status': 'error',
            'message': 'Internal server error'
        }), 500