# Quick Setup Guide for ChronoFlow

## 🚀 Windows Setup (Step-by-Step)

### 1. Install Prerequisites

**Python:**
- Download from https://www.python.org/downloads/
- Install with "Add Python to PATH" checked
- Verify: Open Command Prompt and type `python --version`

**MongoDB:**
- Download from https://www.mongodb.com/try/download/community
- Run the installer (MSI)
- Choose "Complete" installation
- Optionally install MongoDB Compass (GUI)
- MongoDB will be installed to: `C:\Program Files\MongoDB\Server\[version]\bin\`

### 2. Start MongoDB

Open a **NEW** Command Prompt or PowerShell window and run:
```bash
mongod
```

Keep this window open! This runs the MongoDB server.

### 3. Install Python Dependencies

In your project directory, open Command Prompt and run:
```bash
pip install -r requirements.txt
```

### 4. Setup MongoDB Database (Optional but Recommended)

```bash
python setup_mongodb.py
```

This will create the necessary collections and indexes.

### 5. Start the Flask Backend

Open a **NEW** Command Prompt window in your project directory:
```bash
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

**Keep this window open!** This is your backend server.

### 6. Generate PWA Icons

1. Open `create_icons.html` in your browser
2. Click the "Download Icons" button
3. Move the downloaded icons to the project root folder

### 7. Start the Frontend

**Option A: Simple (recommended for development)**
- Just open `index.html` in your browser
- Navigate to the file and double-click it

**Option B: With Local Server**
Open a **THIRD** Command Prompt window:
```bash
python -m http.server 8000
```

Then visit: `http://localhost:8000`

### 8. Allow Notifications

When prompted by your browser, click "Allow" to enable notifications.

---

## 🎯 Quick Start Script

**Windows:** Double-click `start.bat`

Or manually:
```bash
start.bat
```

---

## 🍎 macOS Setup

### 1. Install Prerequisites

**Python:**
```bash
brew install python3
```

**MongoDB:**
```bash
brew tap mongodb/brew
brew install mongodb-community
```

### 2. Start MongoDB
```bash
brew services start mongodb-community
```

### 3. Install Dependencies
```bash
pip3 install -r requirements.txt
```

### 4. Setup Database
```bash
python3 setup_mongodb.py
```

### 5. Start Backend
```bash
python3 app.py
```

### 6. Start Frontend
```bash
python3 -m http.server 8000
```

Visit: `http://localhost:8000`

---

## 🐧 Linux Setup

### 1. Install Prerequisites

**Ubuntu/Debian:**
```bash
# MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Python (usually pre-installed)
sudo apt-get install python3-pip
```

### 2. Start MongoDB
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 3. Install Dependencies
```bash
pip3 install -r requirements.txt
```

### 4. Setup Database
```bash
python3 setup_mongodb.py
```

### 5. Run the Application
```bash
python3 app.py
```

In another terminal:
```bash
python3 -m http.server 8000
```

---

## 🐛 Troubleshooting

### MongoDB won't start

**Windows:**
- Make sure MongoDB is installed
- Check if `mongod.exe` exists in `C:\Program Files\MongoDB\Server\[version]\bin\`
- Make sure the directory `C:\data\db` exists (MongoDB needs this)
- Run: `mkdir C:\data\db`

**macOS/Linux:**
- Check if MongoDB service is running: `brew services list` (macOS) or `sudo systemctl status mongod` (Linux)
- Check logs: `/var/log/mongodb/mongod.log`

### Port 5000 already in use

**Windows:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with the number from above)
taskkill /PID [PID] /F
```

**macOS/Linux:**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9
```

### Flask/pymongo import errors

Make sure all dependencies are installed:
```bash
pip install --upgrade -r requirements.txt
```

### "Service Worker registration failed"

- Make sure you're using `localhost` or `127.0.0.1`
- Clear browser cache
- Service Workers require HTTPS in production (localhost is fine for development)

---

## ✅ Verify Everything Works

1. **Backend running?** Visit: http://localhost:5000/health
   - Should show: `{"status": "healthy", ...}`

2. **Frontend loads?** Open `index.html` in browser
   - Should see landing page with particles

3. **Can sign up?** Click "Sign Up" and create an account
   - Should redirect to dashboard

4. **Can add event?** Click "Add Event" and fill the form
   - Should see event in timeline

5. **Notifications work?** Create an event for 1 minute from now
   - Should see notification at the right time

---

## 📱 Testing PWA Features

1. **Install PWA:**
   - Chrome/Edge: Look for install icon in address bar
   - Mobile: Add to Home Screen

2. **Test offline:**
   - Install PWA
   - Turn off internet
   - Should still load (cached files)

3. **Background notifications:**
   - Create event for future time
   - Close browser tab
   - Should still get notification

---

## 🎓 Next Steps

- Read the full `README.md` for detailed documentation
- Customize colors and sounds in the code
- Add more categories if needed
- Deploy to a server for production use

---

**Need help?** Check the main README.md or review the code comments!

