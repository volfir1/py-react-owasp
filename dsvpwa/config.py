# config.py
import os
import secrets
from datetime import timedelta

class Config:
    # Base configuration
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    SECRET_KEY = os.environ.get('SECRET_KEY') or secrets.token_hex(32)
    DATABASE = os.path.join(BASE_DIR, 'users.db')
    
    # Security headers
    SECURITY_HEADERS = {
        'Content-Security-Policy': "default-src 'self'",
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    }
    
    # Session settings
    SESSION_COOKIE_NAME = 'session'
    SESSION_COOKIE_SECURE = False  # Set to True in production
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    SESSION_COOKIE_DOMAIN = 'localhost'  # Change in production
    PERMANENT_SESSION_LIFETIME = timedelta(days=1)
    SESSION_TYPE = 'filesystem'
    
    # CORS settings
    CORS_ORIGINS = ["http://localhost:3000"]
    CORS_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    CORS_HEADERS = ["Content-Type", "Authorization"]
    
    # Auth settings
    MAX_LOGIN_ATTEMPTS = 5
    LOCKOUT_TIME = timedelta(minutes=30)