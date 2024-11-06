from flask import Flask, jsonify, request, g
from flask_cors import CORS
import sqlite3
import logging
import xml.etree.ElementTree as ET
import os

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Global database connection
_connection = None

def get_global_db():
    global _connection
    if _connection is None:
        _connection = sqlite3.connect(
            'file::memory:?cache=shared',
            uri=True,
            check_same_thread=False
        )
        _connection.row_factory = sqlite3.Row
    return _connection

def get_db():
    if 'db' not in g:
        g.db = get_global_db()
    return g.db

def find_project_root():
    """Find the DSVPWA root directory"""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    while True:
        if os.path.exists(os.path.join(current_dir, 'db', 'users.xml')):
            logger.debug(f"Found project root at: {current_dir}")
            return current_dir
        parent = os.path.dirname(current_dir)
        if parent == current_dir:  # Reached root directory
            raise FileNotFoundError("Could not find project root with users.xml")
        current_dir = parent

def load_users_from_xml():
    try:
        # Find project root and construct path to users.xml
        project_root = find_project_root()
        xml_path = os.path.join(project_root, 'db', 'users.xml')
        
        logger.debug(f"Attempting to load XML from: {xml_path}")
        
        tree = ET.parse(xml_path)
        root = tree.getroot()
        users = []
        
        for user in root.findall('user'):
            user_id = int(user.get('id'))  # Get the ID from XML
            users.append((
                user_id,
                user.find('username').text,
                user.find('firstname').text,
                user.find('lastname').text,
                user.find('email').text,
                user.find('password').text,
                ''  # SESSION
            ))
            
        logger.debug(f"Successfully loaded {len(users)} users from XML")
        return users
    except Exception as e:
        logger.error(f"Error loading users from XML: {e}")
        raise

def init_db():
    db = get_db()
    logger.debug("Initializing database...")
    
    try:
        # Create tables
        db.execute('''
            CREATE TABLE IF NOT EXISTS users(
                id INTEGER PRIMARY KEY,
                username TEXT,
                firstname TEXT,
                lastname TEXT,
                email TEXT,
                password TEXT,
                session TEXT
            )
        ''')
        
        db.execute('''
            CREATE TABLE IF NOT EXISTS comments(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                comment TEXT,
                time TEXT
            )
        ''')
        
        # Clear existing users
        db.execute("DELETE FROM users")
        
        # Load and insert users from XML
        users = load_users_from_xml()
        db.executemany('''
            INSERT INTO users(id, username, firstname, lastname, email, password, session)
            VALUES(?, ?, ?, ?, ?, ?, ?)
        ''', users)
        
        db.commit()
        logger.debug("Database initialized successfully with XML data")
        
        # Log the inserted users for verification
        result = db.execute("SELECT id, username FROM users ORDER BY id").fetchall()
        logger.debug("Inserted users:")
        for row in result:
            logger.debug(f"ID: {row['id']}, Username: {row['username']}")
            
    except Exception as e:
        logger.error(f"Database initialization error: {e}")
        # If XML loading fails, insert default users
        default_users = [
            (0, 'admin', 'Administrator', 'Administrator', 'admin@localhost', 'admin123', ''),
            (1, 'guest', 'Guest', 'User', 'guest@localhost', 'guest123', '')
        ]
        db.executemany('''
            INSERT INTO users(id, username, firstname, lastname, email, password, session)
            VALUES(?, ?, ?, ?, ?, ?, ?)
        ''', default_users)
        db.commit()
        logger.debug("Database initialized with default users due to error")

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        db = get_db()
        user_id = request.args.get('id')
        
        if not user_id:
            query = "SELECT id, username, firstname, lastname, email FROM users ORDER BY id"
            params = []
        else:
            query = "SELECT id, username, firstname, lastname, email FROM users WHERE id = ?"
            params = [user_id]
        
        logger.debug(f"Executing query: {query} with params: {params}")
        
        cursor = db.execute(query, params)
        result = cursor.fetchall()
        
        users_list = [{
            'id': row['id'],
            'username': row['username'],
            'firstname': row['firstname'],
            'lastname': row['lastname'],
            'email': row['email']
        } for row in result]
        
        logger.debug(f"Found users: {users_list}")
        
        return jsonify({
            'status': 'success',
            'data': users_list
        })
        
    except Exception as e:
        logger.error(f"Error in /api/users endpoint: {e}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({
        'status': 'success',
        'message': 'API is working'
    })

@app.route('/api/comments', methods=['GET'])
def get_comments():
    try:
        db = get_db()
        # Get all comments ordered by time
        query = "SELECT * FROM comments ORDER BY time DESC LIMIT 100"  # Limit to prevent overload
        cursor = db.execute(query)
        comments = cursor.fetchall()
        
        return jsonify({
            'status': 'success',
            'comments': [{
                'comment': row['comment'],
                'time': row['time']
            } for row in comments]
        })
    except Exception as e:
        logger.error(f"Error in /api/comments endpoint: {e}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/comment', methods=['GET'])
def post_comment():
    try:
        db = get_db()
        msg = request.args.get('msg')
        
        if msg:
            # Add timestamp to prevent exact duplicates
            current_time = datetime.datetime.now().isoformat()
            query = f"INSERT INTO comments (comment, time) VALUES ('{msg}', '{current_time}')"
            db.execute(query)
            db.commit()
            
            return jsonify({
                'status': 'success',
                'message': 'Comment posted successfully'
            })
    except Exception as e:
        logger.error(f"Error in post_comment endpoint: {e}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

# Initialize database when starting the app
with app.app_context():
    init_db()

# Add these routes:
@app.route('/xss', methods=['GET'])
def xss_test():
    try:
        msg = request.args.get('msg', '')
        # Intentionally vulnerable - no escaping
        return f"<div>{msg}</div>"
    except Exception as e:
        logger.error(f"XSS Test Error: {e}")
        return str(e)

@app.route('/sqli', methods=['GET'])
def sql_injection():
    try:
        db = get_db()
        user_id = request.args.get('id', '')
        # Intentionally vulnerable - direct string concatenation
        query = f"SELECT * FROM users WHERE id = {user_id}"
        cursor = db.execute(query)
        result = cursor.fetchall()
        return jsonify([dict(row) for row in result])
    except Exception as e:
        logger.error(f"SQL Injection Test Error: {e}")
        return str(e)

@app.route('/session', methods=['GET'])
def session_test():
    try:
        session_id = request.args.get('id', '')
        response = jsonify({'message': 'Session updated'})
        response.set_cookie('SESSIONID', session_id)
        return response
    except Exception as e:
        logger.error(f"Session Test Error: {e}")
        return str(e)
        
if __name__ == '__main__':
    app.run(debug=True, port=5000)

# #orignial code 
# class VulnHTTPServer(ThreadingHTTPServer):
#     users = []
#     for user in ET.parse('./db/users.xml').findall("user"):
#         users.append((
#             user.findtext('username'),
#             user.findtext('firstname'),
#             user.findtext('lastname'),
#             user.findtext('email'),
#             user.findtext('password'),
#             '' # SESSION
#         ))

#     connection = sqlite3.connect(
#         'file::memory:?cache=shared',
#         uri=True,
#         isolation_level=None,
#         check_same_thread=False
#     )

#     connection.execute('''
#         CREATE TABLE users(
#             id INTEGER PRIMARY KEY AUTOINCREMENT,
#             username TEXT,
#             firstname TEXT,
#             lastname TEXT,
#             email TEXT,
#             password TEXT,
#             session TEXT
#         )''')

#     connection.execute('''
#         CREATE TABLE comments(
#             id INTEGER PRIMARY KEY AUTOINCREMENT,
#             comment TEXT,
#             time TEXT
#         )''')

#     connection.executemany('''
#         INSERT INTO users(id, username, firstname, lastname, email, password, session) VALUES(NULL, ?, ?, ?, ?, ?, ?)''',
#         users)
