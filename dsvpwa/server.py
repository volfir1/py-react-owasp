# server.py
from flask import Flask, session, g, jsonify, request
from flask_cors import CORS
import logging
from datetime import timedelta
import os
import sqlite3
from utils.auth import auth_required
from utils.xml_loader import load_users_from_xml
from routes.auth import auth_bp

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Create and configure app first
app = Flask(__name__)
app.config.update(
    SECRET_KEY=os.environ.get('SECRET_KEY', os.urandom(32)),
    DATABASE=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'users.db'),
    SESSION_COOKIE_SECURE=False,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
    PERMANENT_SESSION_LIFETIME=timedelta(days=1)
)

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row
    return g.db

# Make get_db accessible to blueprints
app.get_db = get_db

def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db():
    db = get_db()
    logger.debug("Initializing database...")
    
    try:
        # Create tables
        db.execute("DROP TABLE IF EXISTS users")
        db.execute('''
            CREATE TABLE users (
                id INTEGER PRIMARY KEY,
                username TEXT UNIQUE,
                firstname TEXT,
                lastname TEXT,
                email TEXT,
                password TEXT,
                role TEXT,
                session_id TEXT,
                last_login TIMESTAMP,
                failed_attempts INTEGER DEFAULT 0,
                locked_until TIMESTAMP
            )
        ''')
        
        # Load and insert users from XML
        users = load_users_from_xml()
        logger.debug(f"Inserting {len(users)} users into database")
        
        db.executemany('''
            INSERT INTO users (
                id, username, firstname, lastname, 
                email, password, role
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', users)
        
        db.commit()
        logger.debug("Database initialized successfully")
        
    except Exception as e:
        logger.error(f"Database initialization error: {str(e)}")
        db.rollback()
        raise

# Configure CORS
CORS(app, 
    resources={
        r"/api/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    },
    supports_credentials=True
)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api')

# Setup database
app.teardown_appcontext(close_db)

@app.before_request
def before_request():
    if request.method == 'OPTIONS':
        return None
        
    if request.endpoint and request.endpoint.startswith(('auth.', 'static')):
        return None

    try:
        if 'user_id' in session:
            db = get_db()
            user = db.execute(
                'SELECT * FROM users WHERE id = ?',
                (session['user_id'],)
            ).fetchone()
            
            if user and user['session_id'] == session.get('session_token'):
                g.user = user
                return None
                
        if not request.endpoint or not request.endpoint.startswith(('auth.', 'static')):
            return jsonify({
                'status': 'error',
                'message': 'Invalid session'
            }), 401
                
    except Exception as e:
        logger.error(f"Before request error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Server error'
        }), 500

if __name__ == '__main__':
    if not os.path.exists(app.config['DATABASE']):
        init_db()
    app.run(debug=True, port=5000)