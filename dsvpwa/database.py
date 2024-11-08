import sqlite3
import logging
import os
from flask import g

logger = logging.getLogger(__name__)

def get_db():
    """Get database connection"""
    if 'db' not in g:
        g.db = sqlite3.connect(
            'users.db',
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row
    return g.db

def close_db(e=None):
    """Close database connection"""
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db(app):
    """Initialize database with schema"""
    with app.app_context():
        db = get_db()
        logger.debug("Initializing database...")
        
        try:
            # Drop existing tables
            db.execute("DROP TABLE IF EXISTS users")
            db.execute("DROP TABLE IF EXISTS comments")
            
            # Create tables
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
            
            db.execute('''
                CREATE TABLE comments (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    comment TEXT,
                    time TEXT
                )
            ''')
            
            # Insert default admin user if needed
            from auth import hash_password
            default_admin = (
                1,                          # id
                'admin',                    # username
                'Admin',                    # firstname
                'User',                     # lastname
                'admin@example.com',        # email
                hash_password('admin123'),  # password
                'admin'                     # role
            )
            
            db.execute('''
                INSERT INTO users (
                    id, username, firstname, lastname, 
                    email, password, role
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', default_admin)
            
            db.commit()
            logger.debug("Database initialized successfully")
            
        except Exception as e:
            logger.error(f"Database initialization error: {str(e)}")
            db.rollback()
            raise