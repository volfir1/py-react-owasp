from flask import Flask, render_template, request, jsonify, g
import sqlite3
import subprocess
import xml.etree.ElementTree as ET
import os
import time

app = Flask(__name__)

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            'file::memory:?cache=shared',
            uri=True,
            check_same_thread=False
        )
        g.db.row_factory = sqlite3.Row
    return g.db

def load_attacks():
    tree = ET.parse('./db/attacks.xml')
    attacks = []
    for attack in tree.findall('attack'):
        attacks.append({
            'title': attack.findtext('title'),
            'route': attack.findtext('route'),
            'description': attack.findtext('description')
        })
    return attacks

@app.route('/')
def index():
    return render_template('index.html', 
                         attacks=load_attacks(),
                         content="Welcome to DSVPWA")

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        db = get_db()
        try:
            # Deliberately vulnerable to SQL injection
            query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
            user = db.execute(query).fetchone()
            if user:
                return redirect('/')
            error = "Invalid credentials"
        except Exception as e:
            error = str(e)
    
    return render_template('login.html', 
                         attacks=load_attacks(),
                         error=error)

@app.route('/users')
def users():
    db = get_db()
    user_id = request.args.get('id', '')
    try:
        # SQL Injection vulnerability
        query = f"SELECT * FROM users WHERE id={user_id}"
        users = db.execute(query).fetchall()
        content = render_template('users_table.html', users=users)
    except Exception as e:
        content = str(e)
    
    return render_template('users.html',
                         attacks=load_attacks(),
                         content=content)

@app.route('/post')
def post():
    # XSS Reflected vulnerability
    msg = request.args.get('msg', 'No message')
    return render_template('post.html',
                         attacks=load_attacks(),
                         content=msg)

@app.route('/guestbook')
def guestbook():
    db = get_db()
    if 'comment' in request.args:
        # XSS Stored vulnerability
        comment = request.args.get('comment')
        db.execute('INSERT INTO comments (comment, time) VALUES (?, ?)',
                  [comment, time.ctime()])
        db.commit()
        content = 'Thank you for your comment!'
    else:
        comments = db.execute('SELECT * FROM comments ORDER BY time DESC').fetchall()
        content = render_template('comments_table.html', comments=comments)
    
    return render_template('guestbook.html',
                         attacks=load_attacks(),
                         content=content)

@app.route('/diag')
def diagnostics():
    if app.config.get('RISK_LEVEL', 0) < 3:
        content = 'This feature requires higher risk level'
    else:
        domain = request.args.get('domain', '')
        if domain:
            # Command Injection vulnerability
            command = 'nslookup' if os.name == 'nt' else 'host'
            try:
                output = subprocess.check_output(
                    f'{command} {domain}',
                    shell=True,
                    stderr=subprocess.STDOUT,
                    text=True
                )
                content = f'<pre>{output}</pre>'
            except subprocess.CalledProcessError as e:
                content = str(e)
        else:
            content = 'Please enter a domain'
    
    return render_template('diag.html',
                         attacks=load_attacks(),
                         content=content)

@app.route('/docs')
def documents():
    path = request.args.get('path', 'docs/cursus.txt')
    try:
        # Path Traversal vulnerability
        with open(path, 'r') as f:
            content = f'<pre>{f.read()}</pre>'
    except Exception as e:
        content = str(e)
    
    return render_template('docs.html',
                         attacks=load_attacks(),
                         content=content)

# Additional utility routes
@app.route('/set_session')
def set_session():
    # Session Fixation vulnerability
    session = request.args.get('session')
    response = redirect(request.args.get('path', '/'))
    if session:
        response.set_cookie('SESSIONID', session)
    return response

@app.route('/check_session')
def check_session():
    # Session Hijacking check
    db = get_db()
    session_id = request.cookies.get('SESSIONID')
    if session_id:
        user = db.execute('SELECT * FROM users WHERE session = ?', 
                         [session_id]).fetchone()
        if user:
            return f'Logged in as {user["username"]}'
    return 'Not logged in'

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500

if __name__ == '__main__':
    app.run(debug=True)
        
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
