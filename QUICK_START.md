# 🚀 ChronoFlow Quick Start Guide

## Step 1: Install MongoDB

### Option A: Quick Install (Recommended)

1. **Download MongoDB Community Edition:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows, MSI, Latest Version
   - Click Download

2. **Install:**
   - Run the downloaded `.msi` file
   - Choose **Complete** installation
   - ✅ **Check "Install MongoDB as a Service"** (important!)
   - Install MongoDB Compass (optional, helpful GUI tool)

3. **Verify Installation:**
   ```powershell
   python check_mongodb.py
   ```

### Option B: Use MongoDB Atlas (Cloud - No Installation)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free account → Create free cluster (M0)
3. Create database user → Whitelist IP (0.0.0.0/0)
4. Get connection string
5. Update `config.py` with your Atlas connection string

**See MONGODB_SETUP.md for detailed instructions**

---

## Step 2: Install Python Dependencies

```powershell
pip install -r requirements.txt
```

---

## Step 3: Start MongoDB (if using local)

If MongoDB service is not running:
```powershell
# Open Services (Win+R → services.msc)
# Find "MongoDB Server" and click Start
# OR run in PowerShell as Administrator:
net start MongoDB
```

---

## Step 4: Run the Application

```powershell
python app.py
```

You should see:
```
🚀 ChronoFlow Server Starting...
Database: mongodb://localhost:27017/chronoflow_db
✅ Background event checker started
 * Running on http://127.0.0.1:5000
```

---

## Step 5: Open in Browser

Open: **http://localhost:5000**

---

## Troubleshooting

### "Cannot connect to MongoDB"

**Solution 1:** Check if MongoDB is running
```powershell
python check_mongodb.py
```

**Solution 2:** Start MongoDB service
- Open Services (`Win+R` → `services.msc`)
- Find "MongoDB Server (MongoDB)"
- Right-click → Start

**Solution 3:** Install MongoDB
- See MONGODB_SETUP.md for installation guide

### "Module not found" errors

```powershell
pip install -r requirements.txt
```

### Port 5000 already in use

Edit `config.py`:
```python
PORT = 5001  # Change to different port
```

Then access: http://localhost:5001

---

## Need Help?

1. Check `MONGODB_SETUP.md` for MongoDB setup
2. Run `python check_mongodb.py` to diagnose connection issues
3. Check MongoDB logs: `C:\Program Files\MongoDB\Server\7.0\log\mongod.log`

---

## Quick Test Checklist

- [ ] MongoDB installed (`mongod --version` works)
- [ ] MongoDB service running (check Services)
- [ ] Python dependencies installed (`pip install -r requirements.txt`)
- [ ] Connection test passes (`python check_mongodb.py`)
- [ ] App runs without errors (`python app.py`)

