# tests/conftest.py
import pytest
import os
import tempfile
from server import create_app
from database import init_db, get_db

@pytest.fixture
def app():
    # Create a temporary file to isolate the database for each test
    db_fd, db_path = tempfile.mkstemp()
    
    app = create_app({
        'TESTING': True,
        'DATABASE': db_path,
        'SECRET_KEY': 'test_key',
        'WTF_CSRF_ENABLED': False,
        'CORS_ORIGINS': ["http://localhost:3000"],
        'CORS_METHODS': ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    })

    # Create the database and load test data
    with app.app_context():
        init_db(app)
        # Add test data
        db = get_db()
        db.execute(
            'INSERT INTO users (username, firstname, lastname, email, password, role) VALUES (?, ?, ?, ?, ?, ?)',
            ('testuser', 'Test', 'User', 'test@example.com', 'pbkdf2:sha256:150000$test$test', 'student')
        )
        db.commit()

    yield app

    # Cleanup - close and remove the temporary database
    os.close(db_fd)
    os.unlink(db_path)

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def auth(client):
    class AuthActions:
        def login(self, username='testuser', password='test'):
            return client.post(
                '/api/login',
                json={'username': username, 'password': password}
            )

        def logout(self):
            return client.post('/api/logout')

    return AuthActions()

@pytest.fixture
def auth_token(auth):
    response = auth.login()
    return response.get_json()['token']