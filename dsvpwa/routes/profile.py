# routes/profile.py
from flask import Blueprint, jsonify, request, g
from utils.auth import auth_required
from database import get_db
import logging

logger = logging.getLogger(__name__)

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/', methods=['GET'])
@auth_required
def get_profile():
    try:
        user = g.user  # Accessing authenticated user from g
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

@profile_bp.route('/dashboard', methods=['GET'])
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

@profile_bp.route('/update', methods=['PUT'])
@auth_required
def update_profile():
    try:
        if not request.is_json:
            return jsonify({
                'status': 'error',
                'message': 'Content-Type must be application/json'
            }), 415

        data = request.get_json()
        user = g.user
        db = get_db()

        # Fields that can be updated
        allowed_updates = {
            'firstname': str,
            'lastname': str,
            'email': str
        }

        updates = {}
        for field, field_type in allowed_updates.items():
            if field in data:
                # Validate field type
                try:
                    updates[field] = field_type(data[field])
                except ValueError:
                    return jsonify({
                        'status': 'error',
                        'message': f'Invalid type for field {field}'
                    }), 400

        if 'email' in updates and not validate_email(updates['email']):
            return jsonify({
                'status': 'error',
                'message': 'Invalid email format'
            }), 400

        # Check if email is already taken by another user
        if 'email' in updates:
            existing = db.execute(
                'SELECT id FROM users WHERE email = ? AND id != ?',
                (updates['email'], user['id'])
            ).fetchone()
            if existing:
                return jsonify({
                    'status': 'error',
                    'message': 'Email already taken'
                }), 409

        # Build update query
        if updates:
            query = 'UPDATE users SET '
            query += ', '.join(f'{k} = ?' for k in updates.keys())
            query += ' WHERE id = ?'
            
            db.execute(query, (*updates.values(), user['id']))
            db.commit()

            return jsonify({
                'status': 'success',
                'message': 'Profile updated successfully'
            })
        
        return jsonify({
            'status': 'error',
            'message': 'No valid fields to update'
        }), 400

    except Exception as e:
        logger.error(f"Profile update error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Internal server error'
        }), 500