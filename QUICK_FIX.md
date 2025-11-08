# Quick Fix for Signup/Login Issue

## Problem
Signup and login are not working because MongoDB is not installed or the backend server is not running.

## Solution Steps

### Step 1: Install MongoDB

**Option A: Install MongoDB Community Edition (Recommended)**

1. **Download MongoDB:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select: Windows x64
   - Version: Latest stable
   - Package: MSI
   - Click "Download"

2. **Install MongoDB:**
   - Run the downloaded MSI installer
   - Choose "Complete" installation
   - Check "Install MongoDB as a Service"
   - Keep default settings
   - Click "Install"

3. **Verify Installation:**
   ```powershell
   mongod --version
   ```

**Option B: Use MongoDB Atlas Cloud (Free)** - If you don't want to install locally

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create a free cluster
4. Get connection string
5. Update `app.py` line 12 with your connection string

### Step 2: Start MongoDB Service

**Windows:**
```powershell
# MongoDB should start automatically if installed as a service
# Check if running:
net start MongoDB

# If not installed as service, run manually:
mongod
```

**Manual Start (if needed):**
1. Create data directory:
   ```powershell
   mkdir C:\data\db
   ```

2. Start MongoDB:
   ```powershell
   mongod --dbpath C:\data\db
   ```

### Step 3: Install Python Dependencies

```powershell
pip install -r requirements.txt
```

### Step 4: Setup Database

```powershell
python setup_mongodb.py
```

You should see:
```
✓ Created 'users' collection
✓ Created 'events' collection
✓ Created indexes
✓ MongoDB setup completed successfully!
```

### Step 5: Start Flask Backend

Open a new PowerShell terminal and run:
```powershell
python app.py
```

You should see:
```
==================================================
🚀 ChronoFlow Server Starting...
==================================================
Database: mongodb://localhost:27017/chronoflow
==================================================
Background event checker started
 * Running on http://0.0.0.0:5000
```

**Keep this terminal open!**

### Step 6: Open Frontend

1. Open `index.html` in your browser
2. Click "Sign Up"
3. Create an account
4. Click "Login"

---

## Testing

1. **Test Backend:**
   Open browser and go to: http://localhost:5000/health
   
   Should see:
   ```json
   {"status": "healthy", "database": "connected", ...}
   ```

2. **Test Signup:**
   - Click "Sign Up"
   - Enter username, email, password
   - Click "Sign Up"
   - Should see "Account created successfully!"

3. **Test Login:**
   - Click "Login"
   - Enter email and password
   - Click "Login"
   - Should see dashboard with timeline

---

## Common Issues

### Issue: "mongod: command not found"
**Solution:** MongoDB is not installed or not in PATH. Install MongoDB (Step 1).

### Issue: "Connection refused" or "Cannot connect to MongoDB"
**Solution:** MongoDB service is not running. Start MongoDB (Step 2).

### Issue: Backend starts but crashes
**Solution:** Check if MongoDB is running. Run `setup_mongodb.py` first.

### Issue: Frontend shows "Connection error"
**Solution:** Backend is not running. Start backend server (Step 5).

### Issue: Port 5000 already in use
**Solution:** Kill the process using port 5000:
```powershell
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F
```

---

## Alternative: Use Simple JSON Storage (No MongoDB)

If you want to test without MongoDB, I can create a version that uses JSON files instead. Let me know!

