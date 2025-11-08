# MongoDB Setup Guide for ChronoFlow

## Option 1: Install MongoDB Locally (Recommended for Development)

### Step 1: Download MongoDB Community Edition

1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - **Version**: Latest (7.0 or newer)
   - **Platform**: Windows
   - **Package**: MSI
3. Click **Download**

### Step 2: Install MongoDB

1. Run the downloaded `.msi` file
2. Choose **Complete** installation
3. **Important**: Check "Install MongoDB as a Service" during installation
4. Choose **Install MongoDB Compass** (optional but helpful)
5. Complete the installation

### Step 3: Verify Installation

Open PowerShell or Command Prompt and run:
```powershell
mongod --version
```

If you see version information, MongoDB is installed!

### Step 4: Start MongoDB Service

MongoDB should start automatically as a Windows service. To verify:

1. Open **Services** (Press `Win + R`, type `services.msc`, press Enter)
2. Look for **MongoDB Server (MongoDB)**
3. Make sure it's **Running**

If not running:
- Right-click → **Start**
- Right-click → **Properties** → Set **Startup type** to **Automatic**

### Step 5: Test Connection

Open a new terminal and run:
```powershell
mongosh
```

If you see `test>` prompt, MongoDB is working!

Type `exit` to quit.

---

## Option 2: Use MongoDB Atlas (Cloud - Free Tier)

If you prefer cloud-based MongoDB (no local installation needed):

### Step 1: Create Free Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for free account
3. Choose **Free Shared Cluster** (M0)

### Step 2: Create Cluster

1. Choose a cloud provider (AWS, Google Cloud, or Azure)
2. Choose a region closest to you
3. Click **Create Cluster** (takes 3-5 minutes)

### Step 3: Create Database User

1. Go to **Database Access** → **Add New Database User**
2. Username: `chronoflow_user`
3. Password: Create a strong password (save it!)
4. Database User Privileges: **Read and write to any database**
5. Click **Add User**

### Step 4: Whitelist IP Address

1. Go to **Network Access** → **Add IP Address**
2. Click **Allow Access from Anywhere** (for development)
   - Or add your specific IP: `0.0.0.0/0`
3. Click **Confirm**

### Step 5: Get Connection String

1. Go to **Clusters** → Click **Connect**
2. Choose **Connect your application**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your database user credentials

### Step 6: Update Configuration

Edit `config.py` and change:
```python
MONGO_URI = 'mongodb+srv://chronoflow_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/chronoflow_db?retryWrites=true&w=majority'
```

---

## Quick Test: Check if MongoDB is Running

Run this command in PowerShell:
```powershell
Test-NetConnection -ComputerName localhost -Port 27017
```

If `TcpTestSucceeded : True`, MongoDB is running!

---

## Troubleshooting

### MongoDB Service Won't Start

1. Open PowerShell as **Administrator**
2. Run:
   ```powershell
   net start MongoDB
   ```

### Change MongoDB Port

If port 27017 is in use, edit `config.py`:
```python
MONGO_URI = 'mongodb://localhost:27018/chronoflow_db'  # Changed port
```

### Check MongoDB Logs

Default log location:
```
C:\Program Files\MongoDB\Server\7.0\log\mongod.log
```

---

## Verify Everything Works

After setup, run your Flask app:
```powershell
python app.py
```

You should see:
```
🚀 ChronoFlow Server Starting...
Database: mongodb://localhost:27017/chronoflow_db
✅ Background event checker started
```

If you see errors about MongoDB connection, check:
1. MongoDB service is running
2. Port 27017 is not blocked by firewall
3. Connection string in `config.py` is correct

---

## Need Help?

- MongoDB Documentation: https://docs.mongodb.com/
- MongoDB Community Forum: https://developer.mongodb.com/community/forums/

