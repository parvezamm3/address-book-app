import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, session
from flask_cors import CORS
# Flask-Login imports
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
import sqlite3
from database import get_db, close_db, init_app
from ldap3 import Server, Connection, SIMPLE, SAFE_SYNC, SUBTREE, ALL
from ldap3.core.exceptions import LDAPException, LDAPBindError, LDAPSocketOpenError, LDAPInvalidCredentialsResult
from ldap3.utils.conv import escape_filter_chars
from ldap3.utils.log import set_library_log_detail_level, EXTENDED, OFF
from ldap3.utils.conv import escape_filter_chars
import logging
load_dotenv()
app = Flask(__name__, instance_relative_config=True)
set_library_log_detail_level(OFF)
# Set a default secret key if not provided in environment
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

# Enable CORS for all origins and allow credentials (cookies, HTTP auth)
# This is crucial for React frontend to send cookies for session management
CORS(app, supports_credentials=True)

# Ensure instance folder exists
os.makedirs(app.instance_path, exist_ok=True)

# Register database functions with the app
init_app(app)

# --- Flask-Login Setup ---
login_manager = LoginManager()
login_manager.init_app(app)
# This tells Flask-Login where to redirect if an unauthenticated user tries to access a @login_required route
login_manager.login_view = 'login'

# In a real application, you would fetch user details from a database
# or an external service like Active Directory.
# This simple User class is for Flask-Login's internal management.
class User(UserMixin):
    def __init__(self, id, username):
        self.id = id
        self.username = username

    def get_id(self):
        return str(self.id)

    @property
    def is_authenticated(self):
        return True # For simplicity, always true if user is logged in

    @property
    def is_anonymous(self):
        return False

# This is a callback that Flask-Login uses to reload the user object from the user ID stored in the session.
@login_manager.user_loader
def load_user(user_id):
    if user_id == "1": # Our simulated user ID
        return User(id="1", username="testuser")
    return None


# --- LDAP Configuration ---
LDAP_CONFIG = {
    'server': os.getenv('LDAP_SERVER'),
    'port': int(os.getenv('LDAP_PORT')),
    'use_ssl': os.getenv('LDAP_USE_SSL').lower() == 'true',
    'domain': os.getenv('LDAP_DOMAIN'),
    'timeout': int(os.getenv('LDAP_TIMEOUT')),
    'pool_size': int(os.getenv('LDAP_POOL_SIZE')),
    'pool_lifetime': int(os.getenv('LDAP_POOL_LIFETIME')),
    'max_retries': int(os.getenv('LDAP_MAX_RETRIES')),
    'retry_delay': int(os.getenv('LDAP_RETRY_DELAY')),
}



# # Helper function to establish an LDAP connection
# def get_ldap_connection(username, password, use_service_account_for_search=False):
#     print(f"Attempting LDAP connection to {LDAP_CONFIG['server']}:{LDAP_CONFIG['port']} for user: {username}")
#     try:
#         # Determine the user DN for binding based on the context
#         safe_username = escape_filter_chars(username)
#         user_dn = f'{safe_username}@{LDAP_CONFIG["domain"]}'
#         password_for_bind = password
#         print(username, password)
#         LDAP_SERVER = 'ldap://fppdci.fpsv.local'
#         server_obj =  Server(
#             LDAP_SERVER,
#             port=LDAP_CONFIG['port'],
#             use_ssl=LDAP_CONFIG['use_ssl'],
#             get_info=ALL,
#             connect_timeout=LDAP_CONFIG['timeout']
#         )

#         conn = Connection(
#             server_obj,
#             user=user_dn,
#             password=password_for_bind,
#             authentication=SIMPLE,
#             client_strategy=SAFE_SYNC,
#             read_only=True, # Recommended for web apps
#             lazy=False,
#             raise_exceptions=True
#         )
#         print(conn.response)

#         # Attempt to bind
#         if not conn.bind():
#             print(f"LDAP bind failed for {user_dn}: {conn.result.get('description', 'No description')}")
#             return None, conn.result.get('description', 'Invalid credentials or connection issue.')
#         else:
#             print(print("Default Naming Context:", server_obj.info.other['defaultNamingContext']))
        
#         print(f"LDAP bind successful for {user_dn}")
#         return server_obj,conn, None
#     except LDAPInvalidCredentialsResult:
#         print(f"LDAP bind failed: Invalid credentials for user {username}")
#         return None, None, "Invalid username or password."
#     except LDAPBindError as e:
#         print(f"LDAP bind error for user {username}: {e}")
#         return None, None, f"Authentication server error: {e}"
#     except LDAPSocketOpenError as e:
#         print(f"LDAP connection error to {LDAP_CONFIG['server']}:{LDAP_CONFIG['port']}: {e}")
#         return None, None, f"Cannot connect to authentication server: {e}"
#     except LDAPException as e:
#         print(f"General LDAP error for user {username}: {e}")
#         return None, None, f"Authentication server error: {e}"
#     except Exception as e:
#         print(f"Unexpected error in get_ldap_connection for user {username}: {e}")
#         return None, None, f"Internal server error: {e}"

# --- API Endpoints ---
@app.route('/')
def index():
    return "Flask backend is running!"

@app.route('/api/login', methods=['POST'])
def login():
    """
    Handles user login with Active Directory authentication.
    """
    global global_var
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    # print(username, password)

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    try:
        # Sanitize username to prevent LDAP injection
        safe_username = escape_filter_chars(username)
        user_dn = f'{safe_username}@{LDAP_CONFIG["domain"]}'
        
        server = Server(
            LDAP_CONFIG['server'],
            port=LDAP_CONFIG['port'],
            use_ssl=LDAP_CONFIG['use_ssl'],
            get_info=ALL,
            connect_timeout=LDAP_CONFIG['timeout']
        )
        
        conn = Connection(
            server,
            user=user_dn,
            password=password,
            authentication=SIMPLE,
            client_strategy=SAFE_SYNC,
            # auto_bind=AUTO_BIND_TLS_BEFORE_BIND,
            read_only=True,
            lazy=False,
            raise_exceptions=True
        )
        # print(conn)
        if conn.bind():
            # Authentication successful
            print(f"AD Authentication successful for {username}")
            user = User(id="1", username=username)
            login_user(user)
            # print(user)
            return jsonify({"message": "Login successful", "username": username}), 200
        else:
            print(f"AD Authentication failed for {username}: {conn.result['description']}")
            return jsonify({"error": "Invalid username or password"}), 401

    except LDAPInvalidCredentialsResult:
        return jsonify({"error": "Invalid username or password"}), 401
    except LDAPBindError as e:
        print(f"LDAP bind error: {e}")
        return jsonify({"error": "Authentication server error"}), 500
    except LDAPSocketOpenError as e:
        print(f"LDAP connection error: {e}")
        return jsonify({"error": "Cannot connect to authentication server"}), 503
    except LDAPException as e:
        print(f"LDAP error: {e}")
        return jsonify({"error": "Authentication server error"}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/logout', methods=['POST'])
@login_required # Ensure only logged-in users can logout (though typically, this isn't strictly necessary)
def logout():
    """
    Logs out the current user.
    """
    logout_user() # Logs the user out via Flask-Login
    return jsonify({"message": "Logged out successfully"}), 200

@app.route('/api/check_auth', methods=['GET'])
def check_auth():
    """
    Checks if a user is currently authenticated.
    Used by the frontend to maintain session state on page refresh.
    """
    if current_user.is_authenticated:
        return jsonify({"isAuthenticated": True, "username": current_user.username}), 200
    else:
        return jsonify({"isAuthenticated": False}), 200

# --- Protected Address API Endpoints ---
@app.route('/api/addresses', methods=['GET'])
@login_required
def get_addresses():
    db = get_db()
    addresses = db.execute('SELECT * FROM addresses').fetchall()
    # Convert Row objects to dictionaries for JSON serialization
    addresses_dict = [dict(row) for row in addresses]
    return jsonify(addresses_dict)


@app.route('/api/addresses', methods=['POST'])
def add_address():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    name = data.get('name')
    postcode = data.get('postcode')
    prefecture = data.get('prefecture')
    city = data.get('city')
    street = data.get('street')
    apartment = data.get('apartment')
    phone = data.get('phone')
    email = data.get('email')

    if not all([name, postcode, prefecture, city, street, phone, email]):
        return jsonify({"error": "Name, postcode, prefecture, city, street, phone ,and email are required"}), 400

    db = get_db()
    try:
        cursor = db.execute(
            'INSERT INTO addresses (name, postcode, prefecture, city, street, apartment, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            (name, postcode, prefecture, city, street, apartment, phone, email)
        )
        db.commit()
        new_id = cursor.lastrowid
        return jsonify({"message": "Address added successfully", "id": new_id}), 201
    except sqlite3.IntegrityError as e:
        db.rollback()
        return jsonify({"error": f"Database integrity error: {e}"}), 400
    except sqlite3.Error as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/api/addresses/<int:id>', methods=['GET'])
def get_address_by_id(id):
    print(f"Fetching address with ID: {id}")
    db = get_db()
    address = db.execute('SELECT * FROM addresses WHERE id = ?', (id,)).fetchone()
    if address is None:
        return jsonify({"message": "Address not found"}), 404
    return jsonify(dict(address))

@app.route('/api/addresses/<int:id>', methods=['PUT'])
def update_address(id):
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    name = data.get('name')
    postcode = data.get('postcode')
    prefecture = data.get('prefecture')
    city = data.get('city')
    street = data.get('street')
    apartment = data.get('apartment')
    phone = data.get('phone')
    email = data.get('email')

    # Basic validation for required fields
    if not all([name, postcode, prefecture, city, street, phone, email]):
        return jsonify({"error": "Name, Postcode, Prefecture, City, Street, Phone, and Email are required"}), 400

    db = get_db()
    try:
        cursor = db.execute(
            'UPDATE addresses SET name=?, postcode=?, prefecture=?, city=?, street=?, apartment=?, phone=?, email=? WHERE id=?',
            (name, postcode, prefecture, city, street, apartment, phone, email, id)
        )
        db.commit()
        if cursor.rowcount == 0:
            return jsonify({"message": "Address not found"}), 404
        return jsonify({"message": "Address updated successfully"}), 200
    except sqlite3.IntegrityError as e:
        db.rollback()
        return jsonify({"error": f"Database integrity error: {e}"}), 400
    except sqlite3.Error as e:
        db.rollback()
        return jsonify({"error": f"Database error: {e}"}), 500
    

@app.route('/api/addresses/<int:id>', methods=['DELETE'])
def delete_address(id):
    db = get_db()
    cursor = db.execute('DELETE FROM addresses WHERE id = ?', (id,))
    db.commit()
    if cursor.rowcount == 0:
        return jsonify({"message": "Address not found"}), 404
    return jsonify({"message": "Address deleted successfully"}), 200


# --- NEW LDAP Info Endpoints ---

# @app.route('/api/ldap/users', methods=['GET'])
# @login_required
# def get_ldap_users():
#     """Fetches a list of users from the LDAP server."""
#     server, conn, error_message = get_ldap_connection(DEMO_AD_USERNAME, DEMO_AD_PASSWORD)

#     if not conn:
#         print(f"Failed to establish LDAP connection for /api/ldap/users: {error_message}")
#         return jsonify({"error": f"Failed to connect to LDAP for user search: {error_message}"}), 500
#     try:
#         SEARCH_BASE = 'CN=Users,DC=fpsv,DC=local'
#         search_filter = '(&(objectClass=user)(objectCategory=person))'
#         attributes = ['sAMAccountName', 'cn', 'mail', 'displayName', 'description', 'userPrincipalName']
#         print(f"Performing LDAP search with base_dn='{LDAP_CONFIG['base_dn']}', filter='{search_filter}'")
#         conn.search(
#             search_base=SEARCH_BASE,
#             search_filter=search_filter,
#             search_scope=SUBTREE,
#             attributes=attributes,
#             size_limit=0
#         )

#         users_data = []
#         if conn.entries:
#             print(f"Found {len(conn.entries)} LDAP entries.")
#             for entry in conn.entries:
#                 user_info = {
#                     'sAMAccountName': str(entry.sAMAccountName.value) if 'sAMAccountName' in entry else None,
#                     'cn': str(entry.cn.value) if 'cn' in entry else None,
#                     'mail': str(entry.mail.value) if 'mail' in entry else None,
#                     'displayName': str(entry.displayName.value) if 'displayName' in entry else None,
#                     'description': str(entry.description.value) if 'description' in entry else None,
#                     'userPrincipalName': str(entry.userPrincipalName.value) if 'userPrincipalName' in entry else None,
#                     'dn': str(entry.entry_dn)
#                 }
#                 users_data.append(user_info)
#         else:
#             print(f"No LDAP entries found for filter '{search_filter}' at base '{LDAP_CONFIG['base_dn']}'.")

#         conn.unbind()
#         return jsonify(users_data), 200

#     except LDAPException as e:
#         print(f"LDAP search error for /api/ldap/users: {e}")
#         return jsonify({"error": f"LDAP search failed: {e}"}), 500
#     except Exception as e:
#         print(f"Unexpected error during LDAP search for /api/ldap/users: {e}")
#         return jsonify({"error": f"An unexpected error occurred during LDAP search: {e}"}), 500

# @app.route('/api/ldap/users/count', methods=['GET'])
# @login_required
# def get_ldap_users_count():
#     """
#     Gets the total count of users from the LDAP server using a service account (or demo user).
#     """
#     server, conn, error_message = get_ldap_connection(DEMO_AD_USERNAME, DEMO_AD_PASSWORD)
#     logging.basicConfig(level=logging.DEBUG)
#     if not conn:
#         print(f"Failed to establish LDAP connection for /api/ldap/users/count: {error_message}")
#         return jsonify({"error": f"Failed to connect to LDAP for user count: {error_message}"}), 500

#     try:
#         # search_filter = f'(sAMAccountName={'ys admin'})'
#         # attributes = ['cn', 'mail', 'memberOf', 'distinguishedName', 'givenName', 'sn']

#         # conn.search(search_base=LDAP_CONFIG['base_dn'],
#         #             search_filter=search_filter,
#         #             search_scope=SUBTREE,
#         #             attributes=attributes)
#         # search_filter = '(objectClass=user)' # More specific for AD users
#         # search_filter='(&(objectCategory=person)(objectClass=user))' # More specific for AD users
#         search_filter = '(sAMAccountName=parvez427)'
#         SEARCH_BASE = server.info.other['defaultNamingContext'][0]
#         # SEARCH_BASE = 'CN=Users,DC=fpsv,DC=local'
#         print(f"Performing LDAP count with base_dn='{SEARCH_BASE}', filter='{search_filter}'")
        
#         # SEARCH_BASE = 'DC=something,DC=local'
#         conn.search(
#             search_base=SEARCH_BASE,
#             search_filter=search_filter,
#             search_scope=SUBTREE,
#             attributes=['sAMAccountName', 'cn', 'mail'],
#             # attributes=['1.1'], # Requesting a dummy attribute for efficiency
#             size_limit=0 # Return all matching entries
#         )
#         print(conn.entries)
#         count = len(conn.entries) # Number of entries found
#         print(f"LDAP user count: {count}")
#         conn.unbind()
#         return jsonify({"userCount": count}), 200
#     except LDAPException as e:
#         print(f"LDAP count error for /api/ldap/users/count: {e.with_traceback()}")
#         return jsonify({"error": f"LDAP count failed: {e}"}), 500
#     except Exception as e:
#         print(f"An unexpected error occurred during LDAP count for /api/ldap/users/count: {e}")
#         return jsonify({"error": f"An unexpected error occurred during LDAP count: {e}"}), 500

if __name__ == '__main__':
    app.run(debug=True) # debug=True for development, turn off for production