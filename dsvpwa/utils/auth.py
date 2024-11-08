# utils/auth.py
from functools import wraps
from flask import session, jsonify, g
import bcrypt
from datetime import datetime, timedelta
from database import get_db  # Changed from .db to database

def hash_password(password):
    """Hash a password for storing."""
    if isinstance(password, str):
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    return password

def verify_password(stored_password, provided_password):
    """Verify a stored password against one provided by user"""
    try:
        if isinstance(stored_password, str) and isinstance(provided_password, str):
            return bcrypt.checkpw(
                provided_password.encode('utf-8'),
                stored_password.encode('utf-8')
            )
        return False
    except Exception:
        return False

def check_rate_limit(username):
    """Check if user has exceeded login attempts"""
    db = get_db()
    user = db.execute(
        'SELECT failed_attempts, locked_until FROM users WHERE username = ?',
        (username,)
    ).fetchone()
    
    if not user:
        return True
        
    if user['locked_until']:
        lock_time = datetime.fromisoformat(user['locked_until']) \
            if isinstance(user['locked_until'], str) \
            else user['locked_until']
            
        if lock_time > datetime.now():
            return False
            
    return user['failed_attempts'] < 5

def update_login_attempts(username, success):
    """Update login attempts for user"""
    db = get_db()
    if success:
        # Reset on successful login
        db.execute('''
            UPDATE users 
            SET failed_attempts = 0, 
                locked_until = NULL 
            WHERE username = ?
        ''', (username,))
    else:
        # Increment failed attempts and lock if necessary
        user = db.execute(
            'SELECT failed_attempts FROM users WHERE username = ?',
            (username,)
        ).fetchone()
        
        if user:
            new_attempts = (user['failed_attempts'] or 0) + 1
            locked_until = None
            
            if new_attempts >= 5:
                locked_until = (datetime.now() + timedelta(minutes=30)).isoformat()
                
            db.execute('''
                UPDATE users 
                SET failed_attempts = ?,
                    locked_until = ?
                WHERE username = ?
            ''', (new_attempts, locked_until, username))
            
    db.commit()

def auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({
                'status': 'error',
                'message': 'Authentication required'
            }), 401
            
        db = get_db()
        user = db.execute(
            'SELECT * FROM users WHERE id = ?',
            (session['user_id'],)
        ).fetchone()
        
        if not user or user['session_id'] != session.get('session_token'):
            session.clear()
            return jsonify({
                'status': 'error',
                'message': 'Invalid session'
            }), 401
            
        g.user = user
        return f(*args, **kwargs)
    return decorated_function