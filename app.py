from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson import ObjectId
from datetime import datetime, timedelta
import hashlib
import threading
import time
import os
import jwt
import base64
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo.errors import DuplicateKeyError, ServerSelectionTimeoutError
import re
from werkzeug.utils import secure_filename
from config import Config

# Initialize Flask app
app = Flask(__name__, static_folder='static', static_url_path='')
app.config.from_object(Config)

# Initialize extensions
CORS(app, origins=Config.CORS_ORIGINS, supports_credentials=True)
mongo = PyMongo(app)

# Ensure upload directory exists
os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

# Background thread for checking events
event_check_thread = None
stop_event_check = threading.Event()

# ===== Helper Functions =====
def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

def generate_token(user_id):
    """Generate JWT token for user"""
    payload = {
        'user_id': str(user_id),
        'exp': datetime.utcnow() + Config.JWT_ACCESS_TOKEN_EXPIRES,
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm='HS256')

def verify_token(token):
    """Verify JWT token and return user_id"""
    try:
        payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
        return payload.get('user_id')
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def get_current_user():
    """Get current user from token in request"""
    token = request.headers.get('Authorization')
    if not token:
        return None
    
    # Remove 'Bearer ' prefix if present
    if token.startswith('Bearer '):
        token = token[7:]
    
    user_id = verify_token(token)
    if not user_id:
        return None
    
    user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    if user:
        user['_id'] = str(user['_id'])
        user.pop('password', None)
    return user

def require_auth(f):
    """Decorator to require authentication"""
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({'message': 'Authentication required'}), 401
        return f(user, *args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

def jsonify_mongo_object(obj):
    """Convert MongoDB object to JSON-serializable dict"""
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, dict):
        return {k: jsonify_mongo_object(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [jsonify_mongo_object(item) for item in obj]
    if isinstance(obj, datetime):
        return obj.isoformat()
    return obj

# ===== Authentication Routes =====
@app.route('/api/signup', methods=['POST'])
def signup():
    """Create new user account"""
    try:
        data = request.json
        username = data.get('username', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        # Validation
        if not username or not email or not password:
            return jsonify({'message': 'All fields are required'}), 400
        
        if len(password) < 6:
            return jsonify({'message': 'Password must be at least 6 characters'}), 400

        # Basic email format validation
        email_regex = r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
        if not re.match(email_regex, email):
            return jsonify({'message': 'Please enter a valid email address'}), 400
        
        # Check if user already exists
        if mongo.db.users.find_one({'$or': [{'email': email}, {'username': username}]}):
            return jsonify({'message': 'User already exists'}), 409
        
        # Create new user
        hashed_password = generate_password_hash(password)
        user = {
            'username': username,
            'email': email,
            'password': hashed_password,
            'created_at': datetime.now()
        }
        
        try:
            result = mongo.db.users.insert_one(user)
        except DuplicateKeyError:
            return jsonify({'message': 'User already exists'}), 409
        except ServerSelectionTimeoutError:
            return jsonify({'message': 'Database unavailable. Please try again later.'}), 503
        except Exception as e:
            return jsonify({'message': f'Unexpected error creating user: {str(e)}'}), 500
        user_id = str(result.inserted_id)
        token = generate_token(result.inserted_id)
        
        user.pop('password', None)
        user['_id'] = user_id
        
        return jsonify({
            'message': 'User created successfully',
            'user': jsonify_mongo_object(user),
            'token': token
        }), 201
        
    except ServerSelectionTimeoutError:
        return jsonify({'message': 'Database unavailable. Please try again later.'}), 503
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """Authenticate user and return token"""
    try:
        data = request.json
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400
        
        user = mongo.db.users.find_one({'email': email})
        if not user:
            return jsonify({'message': 'Invalid credentials'}), 401
        
        if not check_password_hash(user['password'], password):
            return jsonify({'message': 'Invalid credentials'}), 401
        
        # Generate token
        token = generate_token(user['_id'])
        
        user['_id'] = str(user['_id'])
        user.pop('password', None)
        
        return jsonify({
            'message': 'Login successful',
            'user': jsonify_mongo_object(user),
            'token': token
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/logout', methods=['POST'])
@require_auth
def logout(user):
    """Logout user (client-side token removal)"""
    return jsonify({'message': 'Logged out successfully'}), 200

@app.route('/api/me', methods=['GET'])
@require_auth
def get_current_user_profile(user):
    """Get current user profile"""
    return jsonify({
        'user': jsonify_mongo_object(user)
    }), 200

# ===== Event Routes =====
@app.route('/api/events', methods=['POST'])
@require_auth
def create_event(user):
    """Create new event"""
    try:
        data = request.json
        user_id = user['_id']
        
        # Required fields
        title = data.get('title', '').strip()
        date = data.get('date', '')
        category = data.get('category', 'personal')
        
        if not title or not date or not category:
            return jsonify({'message': 'Title, date, and category are required'}), 400
        
        # Create event object
        event = {
            'user_id': ObjectId(user_id),
            'email': user.get('email'),
            'title': title,
            'description': data.get('description', '').strip(),
            'category': category,
            'date': date,
            'time': data.get('time', '00:00:00'),
            'reminder': data.get('reminder', 'none'),
            'sound_type': data.get('soundType') or data.get('sound_type') or 'default',
            'color': data.get('color', data.get('bgColor', 'default')),
            'photo': data.get('photo'),  # Base64 string or URL
            'triggered': False,
            'created_at': datetime.now()
        }
        
        result = mongo.db.events.insert_one(event)
        event['_id'] = str(result.inserted_id)
        event['user_id'] = user_id
        
        return jsonify({
            'message': 'Event created successfully',
            'event': jsonify_mongo_object(event)
        }), 201
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/events', methods=['GET'])
@require_auth
def get_events(user):
    """Get user's events"""
    try:
        user_id = user['_id']
        
        # Optional filters
        category = request.args.get('category')
        date_from = request.args.get('date_from')
        date_to = request.args.get('date_to')
        
        query = {'user_id': ObjectId(user_id)}
        
        if category:
            query['category'] = category
        
        if date_from:
            query['date'] = {'$gte': date_from}
        if date_to:
            if 'date' in query and isinstance(query['date'], dict):
                query['date']['$lte'] = date_to
            else:
                query['date'] = {'$lte': date_to}
        
        events = list(mongo.db.events.find(query).sort('date', 1))
        
        # Convert to JSON-serializable format
        events_list = [jsonify_mongo_object(event) for event in events]
        
        return jsonify({
            'message': 'Events retrieved successfully',
            'events': events_list,
            'count': len(events_list)
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/events/<event_id>', methods=['PUT'])
@require_auth
def update_event(user, event_id):
    """Update event"""
    try:
        if not ObjectId.is_valid(event_id):
            return jsonify({'message': 'Invalid event ID'}), 400
        
        user_id = user['_id']
        data = request.json
        
        # Check if event exists and belongs to user
        event = mongo.db.events.find_one({
            '_id': ObjectId(event_id),
            'user_id': ObjectId(user_id)
        })
        
        if not event:
            return jsonify({'message': 'Event not found'}), 404
        
        # Prepare update data
        update_data = {}
        if 'title' in data:
            update_data['title'] = data['title'].strip()
        if 'description' in data:
            update_data['description'] = data['description'].strip()
        if 'category' in data:
            update_data['category'] = data['category']
        if 'date' in data:
            update_data['date'] = data['date']
        if 'time' in data:
            update_data['time'] = data['time']
        if 'reminder' in data:
            update_data['reminder'] = data['reminder']
        if 'soundType' in data or 'sound_type' in data:
            update_data['sound_type'] = data.get('soundType') or data.get('sound_type')
        if 'color' in data or 'bgColor' in data:
            update_data['color'] = data.get('color') or data.get('bgColor')
        if 'photo' in data:
            update_data['photo'] = data['photo']
        if 'triggered' in data:
            update_data['triggered'] = data['triggered']
        
        update_data['updated_at'] = datetime.now()
        
        result = mongo.db.events.update_one(
            {'_id': ObjectId(event_id), 'user_id': ObjectId(user_id)},
            {'$set': update_data}
        )
        
        if result.modified_count == 0:
            return jsonify({'message': 'No changes made'}), 200
        
        # Return updated event
        updated_event = mongo.db.events.find_one({'_id': ObjectId(event_id)})
        
        return jsonify({
            'message': 'Event updated successfully',
            'event': jsonify_mongo_object(updated_event)
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/events/<event_id>', methods=['DELETE'])
@require_auth
def delete_event(user, event_id):
    """Delete event"""
    try:
        if not ObjectId.is_valid(event_id):
            return jsonify({'message': 'Invalid event ID'}), 400
        
        user_id = user['_id']
        
        result = mongo.db.events.delete_one({
            '_id': ObjectId(event_id),
            'user_id': ObjectId(user_id)
        })
        
        if result.deleted_count == 0:
            return jsonify({'message': 'Event not found'}), 404
        
        return jsonify({'message': 'Event deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/events/stats', methods=['GET'])
@require_auth
def get_event_stats(user):
    """Get event statistics"""
    try:
        user_id = user['_id']
        
        pipeline = [
            {'$match': {'user_id': ObjectId(user_id)}},
            {'$group': {
                '_id': '$category',
                'count': {'$sum': 1}
            }}
        ]
        
        category_stats = list(mongo.db.events.aggregate(pipeline))
        
        total_events = mongo.db.events.count_documents({'user_id': ObjectId(user_id)})
        
        stats = {
            'total': total_events,
            'by_category': {item['_id']: item['count'] for item in category_stats}
        }
        
        return jsonify({
            'message': 'Statistics retrieved successfully',
            'stats': stats
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# ===== User Settings Routes =====
@app.route('/api/settings', methods=['GET'])
@require_auth
def get_user_settings(user):
    """Get user settings"""
    try:
        user_id = user['_id']
        
        settings = mongo.db.user_settings.find_one({'user_id': ObjectId(user_id)})
        
        if not settings:
            # Return default settings
            default_settings = {
                'theme': 'light',
                'background_color': None,
                'notification_preferences': {
                    'sound_enabled': True,
                    'popup_enabled': True
                }
            }
            return jsonify({
                'message': 'Settings retrieved successfully',
                'settings': default_settings
            }), 200
        
        settings['_id'] = str(settings['_id'])
        settings['user_id'] = user_id
        
        return jsonify({
            'message': 'Settings retrieved successfully',
            'settings': jsonify_mongo_object(settings)
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/settings', methods=['PUT'])
@require_auth
def update_user_settings(user):
    """Update user settings"""
    try:
        user_id = user['_id']
        data = request.json
        
        settings_data = {
            'user_id': ObjectId(user_id),
            'updated_at': datetime.now()
        }
        
        if 'theme' in data:
            settings_data['theme'] = data['theme']
        if 'background_color' in data:
            settings_data['background_color'] = data['background_color']
        if 'notification_preferences' in data:
            settings_data['notification_preferences'] = data['notification_preferences']
        
        result = mongo.db.user_settings.update_one(
            {'user_id': ObjectId(user_id)},
            {'$set': settings_data},
            upsert=True
        )
        
        return jsonify({
            'message': 'Settings updated successfully',
            'settings': jsonify_mongo_object(settings_data)
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# ===== File Upload Route =====
@app.route('/api/upload', methods=['POST'])
@require_auth
def upload_file(user):
    """Upload file (photo) for events"""
    try:
        if 'file' not in request.files:
            return jsonify({'message': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'message': 'No file selected'}), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            # Add timestamp to make unique
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            filename = f"{timestamp}_{filename}"
            filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
            file.save(filepath)
            
            # Return URL or base64
            url = f"/static/uploads/{filename}"
            
            # Optionally return base64
            with open(filepath, 'rb') as f:
                file_data = f.read()
                base64_data = base64.b64encode(file_data).decode('utf-8')
                data_url = f"data:image/{filename.rsplit('.', 1)[1]};base64,{base64_data}"
            
            return jsonify({
                'message': 'File uploaded successfully',
                'url': url,
                'base64': data_url,
                'filename': filename
            }), 200
        
        return jsonify({'message': 'Invalid file type'}), 400
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# ===== Background Event Checker =====
def check_events():
    """Background thread to check for due events"""
    while not stop_event_check.is_set():
        try:
            current_time = datetime.now()
            current_date_str = current_time.strftime('%Y-%m-%d')
            current_time_str = current_time.strftime('%H:%M:%S')
            
            # Find events that are due (within current minute)
            due_events = mongo.db.events.find({
                'triggered': False,
                'date': current_date_str,
                'time': {'$regex': f'^{current_time_str[:5]}'}  # Match HH:MM
            })
            
            for event in due_events:
                # Mark as triggered
                mongo.db.events.update_one(
                    {'_id': event['_id']},
                    {'$set': {'triggered': True, 'triggered_at': datetime.now()}}
                )
                
                # Log triggered event
                print(f"[{datetime.now()}] Event triggered: {event.get('title', 'Unknown')} for user {event.get('user_id')}")
            
        except Exception as e:
            print(f"Error checking events: {str(e)}")
        
        # Check every 10 seconds
        stop_event_check.wait(10)

# ===== Health Check =====
@app.route('/health', methods=['GET'])
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        # Check MongoDB connection
        mongo.db.command('ping')
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'timestamp': datetime.now().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'database': 'disconnected',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

# ===== Serve Frontend =====
@app.route('/')
def index():
    """Serve the main frontend page"""
    return send_from_directory('static', 'index.html')

@app.route('/service-worker.js')
def service_worker():
    """Serve the service worker file"""
    return send_from_directory('static', 'service-worker.js')

# ===== Initialize Background Thread =====
def start_background_checker():
    """Start background event checker thread"""
    global event_check_thread
    if event_check_thread is None or not event_check_thread.is_alive():
        stop_event_check.clear()
        event_check_thread = threading.Thread(target=check_events, daemon=True)
        event_check_thread.start()
        print("✅ Background event checker started")

# ===== Startup =====
# Start background thread when app is imported (for production with gunicorn)
# This ensures the thread starts even when not running via __main__
try:
    start_background_checker()
except Exception as e:
    print(f"Warning: Could not start background checker: {e}")

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 ChronoFlow Server Starting...")
    print("="*50)
    print(f"Database: {app.config['MONGO_URI']}")
    print(f"Upload Folder: {Config.UPLOAD_FOLDER}")
    print("="*50 + "\n")
    
    app.run(debug=Config.DEBUG, host=Config.HOST, port=Config.PORT)
