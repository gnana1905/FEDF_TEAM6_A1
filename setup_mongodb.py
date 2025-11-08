"""
MongoDB Setup Script for ChronoFlow
This script helps set up and verify MongoDB connection
"""

from pymongo import MongoClient
from datetime import datetime

def setup_database():
    try:
        # Connect to MongoDB
        client = MongoClient('mongodb://localhost:27017/')
        
        # Select database (align with app Config default)
        db = client.chronoflow_db
        
        # Create collections if they don't exist
        if 'users' not in db.list_collection_names():
            db.create_collection('users')
            print("✓ Created 'users' collection")
        else:
            print("✓ 'users' collection exists")
        
        if 'events' not in db.list_collection_names():
            db.create_collection('events')
            print("✓ Created 'events' collection")
        else:
            print("✓ 'events' collection exists")
        
        # Create indexes for better performance
        db.users.create_index('email', unique=True)
        db.users.create_index('username', unique=True)
        db.events.create_index('email')
        db.events.create_index([('date', 1), ('time', 1)])
        print("✓ Created indexes")
        
        # Test insert
        test_user = {
            'username': 'test',
            'email': 'test@example.com',
            'password': 'test',
            'created_at': datetime.now()
        }
        
        # Try to insert (will fail if already exists)
        try:
            db.users.insert_one(test_user)
            print("✓ Test user inserted (email: test@example.com)")
        except:
            print("ℹ Test user already exists")
        
        print("\n" + "="*50)
        print("✓ MongoDB setup completed successfully!")
        print("="*50)
        print("\nCollections:")
        for collection in db.list_collection_names():
            count = db[collection].count_documents({})
            print(f"  - {collection}: {count} documents")
        print("\n")
        
        client.close()
        
    except Exception as e:
        print(f"✗ Error setting up database: {str(e)}")
        print("\nMake sure MongoDB is running:")
        print("  Windows: Run 'mongod' in a terminal")
        print("  macOS: brew services start mongodb-community")
        print("  Linux: sudo systemctl start mongod")

if __name__ == '__main__':
    print("\n" + "="*50)
    print("ChronoFlow MongoDB Setup")
    print("="*50 + "\n")
    setup_database()

