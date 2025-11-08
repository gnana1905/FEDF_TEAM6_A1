"""
MongoDB Connection Checker for ChronoFlow
Run this script to check if MongoDB is installed and running
"""
import sys
import os

# Fix Windows console encoding for emojis
if sys.platform == 'win32':
    try:
        os.system('chcp 65001 >nul 2>&1')  # Set UTF-8 encoding
    except:
        pass

def check_mongodb():
    """Check if MongoDB is accessible"""
    print("=" * 60)
    print("Checking MongoDB Connection...")
    print("=" * 60)
    
    try:
        from pymongo import MongoClient
        from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
    except ImportError:
        print("[ERROR] pymongo is not installed!")
        print("\nInstall it with:")
        print("   pip install pymongo")
        return False
    
    # Try to connect to MongoDB
    try:
        print("\nAttempting to connect to MongoDB...")
        print("   URI: mongodb://localhost:27017/")
        
        client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=5000)
        
        # Try to access server info
        client.server_info()
        print("[SUCCESS] MongoDB is running and accessible!")
        
        # List databases
        db_list = client.list_database_names()
        print(f"\nAvailable databases: {', '.join(db_list) if db_list else 'None'}")
        
        # Check if chronoflow_db exists
        if 'chronoflow_db' in db_list:
            db = client['chronoflow_db']
            collections = db.list_collection_names()
            print(f"ChronoFlow database found with {len(collections)} collections")
            if collections:
                print(f"   Collections: {', '.join(collections)}")
        else:
            print("[INFO] ChronoFlow database will be created automatically on first use")
        
        client.close()
        return True
        
    except ConnectionFailure:
        print("\n[ERROR] Cannot connect to MongoDB!")
        print("\nPossible solutions:")
        print("   1. MongoDB is not installed")
        print("   2. MongoDB service is not running")
        print("   3. MongoDB is running on a different port")
        print("\nTo install MongoDB:")
        print("   - Download from: https://www.mongodb.com/try/download/community")
        print("   - Or see MONGODB_SETUP.md for detailed instructions")
        return False
        
    except ServerSelectionTimeoutError:
        print("\n[ERROR] MongoDB server is not responding!")
        print("\nPossible solutions:")
        print("   1. Start MongoDB service:")
        print("      - Open Services (Win+R -> services.msc)")
        print("      - Find 'MongoDB Server' and start it")
        print("   2. Or run in PowerShell (as Admin):")
        print("      net start MongoDB")
        return False
        
    except Exception as e:
        print(f"\n[ERROR] {str(e)}")
        print("\nCheck MONGODB_SETUP.md for installation help")
        return False

if __name__ == '__main__':
    success = check_mongodb()
    print("\n" + "=" * 60)
    if success:
        print("[SUCCESS] Your MongoDB setup is ready! You can run app.py now.")
    else:
        print("[WARNING] Please install and start MongoDB before running the app.")
        print("See MONGODB_SETUP.md for detailed setup instructions")
    print("=" * 60)
    sys.exit(0 if success else 1)

