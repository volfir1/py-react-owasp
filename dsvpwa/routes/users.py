# routes/users.py
from flask import Blueprint, jsonify, request, g, current_app
from utils.auth import auth_required
import logging

users_bp = Blueprint('users', __name__)
logger = logging.getLogger(__name__)

def get_db():
    return current_app.get_db()

@users_bp.route('/users', methods=['GET'])
@auth_required
def get_users():
    """Get all users or search by ID"""
    try:
        user_id = request.args.get('id')
        db = get_db()
        
        if user_id:
            # Search for specific user
            query = '''
                SELECT id, username, firstname, lastname, email, role 
                FROM users 
                WHERE id = ?
            '''
            users = db.execute(query, (user_id,)).fetchall()
        else:
            # Get all users
            query = '''
                SELECT id, username, firstname, lastname, email, role 
                FROM users
            '''
            users = db.execute(query).fetchall()
        
        # Convert rows to dictionaries
        users_list = [{
            'id': user['id'],
            'username': user['username'],
            'firstname': user['firstname'],
            'lastname': user['lastname'],
            'email': user['email'],
            'role': user['role']
        } for user in users]

        return jsonify({
            'status': 'success',
            'data': users_list
        })

    except Exception as e:
        logger.error(f"Error fetching users: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Internal server error'
        }), 500

@users_bp.route('/users', methods=['POST'])
@auth_required
def create_user():
    """Create a new user"""
    try:
        if not request.is_json:
            return jsonify({
                'status': 'error',
                'message': 'Content-Type must be application/json'
            }), 415

        # Check if user has admin role
        if g.user['role'] != 'admin':
            return jsonify({
                'status': 'error',
                'message': 'Unauthorized'
            }), 403

        data = request.get_json()
        required_fields = ['username', 'firstname', 'lastname', 'email', 'password', 'role']
        
        # Validate required fields
        if not all(field in data for field in required_fields):
            return jsonify({
                'status': 'error',
                'message': 'Missing required fields'
            }), 400

        db = get_db()
        
        # Check if username already exists
        existing_user = db.execute(
            'SELECT id FROM users WHERE username = ?',
            (data['username'],)
        ).fetchone()
        
        if existing_user:
            return jsonify({
                'status': 'error',
                'message': 'Username already exists'
            }), 409

        # Insert new user
        cursor = db.execute('''
            INSERT INTO users (username, firstname, lastname, email, password, role)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            data['username'],
            data['firstname'],
            data['lastname'],
            data['email'],
            data['password'],  # Note: Should be hashed in production
            data['role']
        ))
        
        db.commit()

        # Get the created user
        new_user = db.execute(
            'SELECT id, username, firstname, lastname, email, role FROM users WHERE id = ?',
            (cursor.lastrowid,)
        ).fetchone()

        return jsonify({
            'status': 'success',
            'message': 'User created successfully',
            'data': {
                'id': new_user['id'],
                'username': new_user['username'],
                'firstname': new_user['firstname'],
                'lastname': new_user['lastname'],
                'email': new_user['email'],
                'role': new_user['role']
            }
        }), 201

    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Internal server error'
        }), 500