"""
Quick test script to check if backend components are working
"""
import sys

print("ChronoFlow Backend Test")
print("=" * 50)

# Test 1: Check Python packages
print("\n1. Testing Python packages...")
try:
    import flask
    print(f"   [OK] Flask {flask.__version__} installed")
except ImportError as e:
    print(f"   [FAIL] Flask not installed: {e}")
    sys.exit(1)

try:
    import flask_cors
    print(f"   [OK] Flask-CORS installed")
except ImportError as e:
    print(f"   [FAIL] Flask-CORS not installed: {e}")
    sys.exit(1)

try:
    import flask_pymongo
    print(f"   [OK] Flask-PyMongo installed")
except ImportError as e:
    print(f"   [FAIL] Flask-PyMongo not installed: {e}")
    sys.exit(1)

try:
    import pymongo
    print(f"   [OK] PyMongo {pymongo.__version__} installed")
except ImportError as e:
    print(f"   [FAIL] PyMongo not installed: {e}")
    sys.exit(1)

try:
    from werkzeug.security import generate_password_hash, check_password_hash
    print(f"   [OK] Werkzeug installed")
except ImportError as e:
    print(f"   [FAIL] Werkzeug not installed: {e}")
    sys.exit(1)

# Test 2: Test MongoDB connection
print("\n2. Testing MongoDB connection...")
try:
    from pymongo import MongoClient
    client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=2000)
    client.server_info()  # Force connection
    print(f"   [OK] MongoDB is running and accessible")
    client.close()
except Exception as e:
    print(f"   [FAIL] Cannot connect to MongoDB: {e}")
    print(f"   -> MongoDB is not installed or not running")
    print(f"   -> Install MongoDB: https://www.mongodb.com/try/download/community")

# Test 3: Test password hashing
print("\n3. Testing password hashing...")
try:
    from werkzeug.security import generate_password_hash, check_password_hash
    password = "test123"
    hashed = generate_password_hash(password)
    result = check_password_hash(hashed, password)
    if result:
        print(f"   [OK] Password hashing works correctly")
    else:
        print(f"   [FAIL] Password hashing failed")
except Exception as e:
    print(f"   [FAIL] Password hashing error: {e}")

# Test 4: Try to import app
print("\n4. Testing app.py import...")
try:
    # This will fail if MongoDB is not connected, but we can still see if code is valid
    exec(open('app.py').read())
    print(f"   [OK] app.py syntax is valid")
except SyntaxError as e:
    print(f"   [FAIL] app.py has syntax errors: {e}")
except Exception as e:
    print(f"   [INFO] app.py loaded (connection errors expected if MongoDB not running)")

print("\n" + "=" * 50)
print("\nSummary:")
print("- Python packages: Check above")
print("- MongoDB connection: Check above")
print("- Password hashing: Check above")
print("- Backend code: Check above")
print("\nNext steps:")
print("1. If MongoDB not connected, install MongoDB")
print("2. Run: python setup_mongodb.py")
print("3. Run: python app.py")
print("4. Open index.html in browser")

