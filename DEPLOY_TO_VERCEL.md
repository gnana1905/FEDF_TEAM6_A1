# Deploying ChronoFlow to Vercel - Complete Guide

## 🎯 Understanding Vercel vs Traditional Hosting

### Key Differences

**Traditional Hosting (Render, Heroku):**
- Long-running server process
- Background threads/workers can run continuously
- Persistent connections (e.g., MongoDB connection pooling)
- Stateful - server maintains state between requests

**Vercel (Serverless):**
- Stateless functions - each request may use a different function instance
- Functions are short-lived (typically < 10 seconds execution time)
- No background threads or long-running processes
- Each function invocation is isolated

## 📋 Pre-Deployment Checklist

- [x] Created `vercel.json` configuration
- [x] Created `api/index.py` serverless wrapper
- [x] Updated `app.py` to detect serverless environment
- [x] Disabled background threads for serverless
- [ ] MongoDB Atlas connection string ready
- [ ] Environment variables prepared

## 🚀 Deployment Steps

### Step 1: Install Vercel CLI (Optional but Recommended)

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

**Option A: Using Vercel CLI**
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No** (for first deployment)
- Project name? **fedf-team6-a1** (or your choice)
- Directory? **./** (current directory)
- Override settings? **No**

**Option B: Using Vercel Dashboard**
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository: `gnana1905/FEDF_TEAM6_A1`
4. Configure:
   - Framework Preset: **Other**
   - Root Directory: **./**
   - Build Command: Leave empty (Vercel auto-detects)
   - Output Directory: Leave empty
   - Install Command: `pip install -r requirements.txt`

### Step 4: Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `MONGO_URI` | `mongodb+srv://...` | MongoDB connection string |
| `JWT_SECRET_KEY` | `your-secret-key` | JWT signing key (32+ chars) |
| `CORS_ORIGINS` | `https://your-app.vercel.app` | Your Vercel app URL |
| `DEBUG` | `false` | Production mode |
| `VERCEL` | `1` | Auto-set by Vercel |

### Step 5: Redeploy

After setting environment variables, trigger a new deployment:
- Vercel Dashboard → Deployments → Click "..." → "Redeploy"
- Or push a new commit to trigger auto-deploy

## ⚠️ Important Limitations & Considerations

### 1. Background Threads Disabled

**Problem:** Your app has a background thread that checks for due events every 10 seconds.

**Solution:** In serverless environments, this is automatically disabled. You have two options:

**Option A: Use Vercel Cron Jobs (Recommended)**
Create `vercel.json` cron configuration:
```json
{
  "crons": [{
    "path": "/api/check-events",
    "schedule": "*/1 * * * *"
  }]
}
```

Then create an endpoint that checks events:
```python
@app.route('/api/check-events', methods=['GET'])
def check_events_endpoint():
    # Your event checking logic here
    # This will be called by Vercel cron every minute
    pass
```

**Option B: Use External Service**
- Use a service like cron-job.org
- Call your `/api/check-events` endpoint periodically
- Or use MongoDB Change Streams with a separate worker

### 2. File Uploads

**Problem:** Uploaded files are stored in `static/uploads/` which is ephemeral in serverless.

**Solution:** Use cloud storage:
- **Vercel Blob Storage** (recommended for Vercel)
- **AWS S3**
- **Cloudinary**
- **MongoDB GridFS**

### 3. Cold Starts

**Problem:** First request after inactivity may take 1-3 seconds (cold start).

**Solution:**
- Use Vercel Pro plan for better performance
- Keep functions warm with periodic pings
- Optimize imports (lazy loading)

### 4. MongoDB Connection Pooling

**Problem:** Each function invocation creates a new MongoDB connection.

**Solution:** 
- MongoDB Atlas handles connection pooling automatically
- Connections are reused within the same function instance
- Consider using MongoDB connection string with `maxPoolSize` parameter

## 🔧 Configuration Files Explained

### `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.py"
    },
    {
      "src": "/(.*)",
      "dest": "api/index.py"
    }
  ]
}
```

**What it does:**
- Tells Vercel to use Python runtime for `api/index.py`
- Routes all requests to the Flask app
- Handles both API routes and static file serving

### `api/index.py`

```python
from app import app
# Vercel automatically handles WSGI apps
```

**What it does:**
- Imports your Flask app
- Vercel's Python runtime automatically converts WSGI apps to serverless functions
- No manual request/response handling needed

## 🐛 Troubleshooting

### Error: FUNCTION_INVOCATION_FAILED

**Common Causes:**

1. **Import Errors**
   - Check that all dependencies are in `requirements.txt`
   - Verify Python version compatibility
   - Check import paths

2. **Environment Variables Missing**
   - Ensure all required env vars are set in Vercel dashboard
   - Check variable names match exactly (case-sensitive)

3. **MongoDB Connection Issues**
   - Verify MongoDB Atlas network access allows all IPs (`0.0.0.0/0`)
   - Check connection string format
   - Ensure MongoDB user has proper permissions

4. **Timeout Issues**
   - Vercel free tier: 10 seconds max execution time
   - Vercel Pro: 60 seconds max
   - Optimize slow operations or use background jobs

5. **File System Issues**
   - `/tmp` is the only writable directory in serverless
   - Don't write to project directory
   - Use cloud storage for uploads

### Debugging Steps

1. **Check Function Logs**
   - Vercel Dashboard → Your Project → Functions → View Logs
   - Look for error messages and stack traces

2. **Test Locally**
   ```bash
   vercel dev
   ```
   - Runs Vercel environment locally
   - Helps catch issues before deployment

3. **Check Build Logs**
   - Vercel Dashboard → Deployments → Click deployment → View Build Logs
   - Look for installation or build errors

## 📊 Performance Optimization

### 1. Reduce Cold Starts
- Minimize imports at module level
- Use lazy imports where possible
- Keep function code small

### 2. Optimize Database Queries
- Use indexes on frequently queried fields
- Implement connection pooling
- Cache frequently accessed data

### 3. Static Assets
- Serve static files from Vercel's CDN
- Use `public/` directory for static files
- Enable caching headers

## 🔄 Migration from Render to Vercel

### What Changes:
- ✅ Background threads → Cron jobs or external service
- ✅ File uploads → Cloud storage
- ✅ Long-running processes → Stateless functions
- ✅ Persistent connections → Connection pooling

### What Stays the Same:
- ✅ Flask app code (mostly)
- ✅ API endpoints
- ✅ MongoDB connection
- ✅ Authentication logic

## 📚 Additional Resources

- [Vercel Python Documentation](https://vercel.com/docs/functions/serverless-functions/runtimes/python)
- [Vercel Serverless Functions Guide](https://vercel.com/docs/functions)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)

## ✅ Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Verify MongoDB connection
- [ ] Test authentication (signup/login)
- [ ] Test event creation/update/delete
- [ ] Check static file serving
- [ ] Monitor function logs for errors
- [ ] Set up cron job for event checking (if needed)
- [ ] Configure custom domain (optional)

## 🎉 Success!

Once deployed, your app will be available at:
- `https://your-project-name.vercel.app`
- Or your custom domain if configured

Test the health endpoint:
```
https://your-project-name.vercel.app/health
```

Good luck with your deployment! 🚀

