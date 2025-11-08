# Render Deployment - Required Fixes

## ✅ What I Fixed

1. **Added Gunicorn to requirements.txt** - Required for the start command to work
2. **Fixed background thread initialization** - Now starts even when using gunicorn
3. **Updated start command** - Needs to use `$PORT` environment variable

## 🔧 Required Changes in Render Dashboard

### 1. Build Command
**Current**: `pip install -r requirements.txt` ✅ **CORRECT**

### 2. Start Command
**Current**: `gunicorn app:app` ❌ **NEEDS FIX**

**Change to**: 
```bash
gunicorn app:app --bind 0.0.0.0:$PORT
```

**Why**: Render sets the `PORT` environment variable automatically. Gunicorn needs to bind to `0.0.0.0:$PORT` to accept connections.

### 3. Environment Variables

✅ **MONGO_URI** - Required (make sure it's set correctly)
✅ **JWT_SECRET_KEY** - Required (should be a secure random string)
⚠️ **CORS_ORIGINS** - **IMPORTANT**: Set this to your actual Render URL
   - Example: `https://fedf-team6-a1.onrender.com`
   - Or: `https://fedf-team6-a1.onrender.com,https://www.yourdomain.com` (if you have a custom domain)
✅ **DEBUG** - Set to `False` for production ✅
⚠️ **HOST** - Optional, but set to `0.0.0.0` if you want to be explicit

## 📋 Complete Render Configuration

### Build Command
```
pip install -r requirements.txt
```

### Start Command
```
gunicorn app:app --bind 0.0.0.0:$PORT
```

### Environment Variables
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/chronoflow_db?retryWrites=true&w=majority
JWT_SECRET_KEY=your-generated-secret-key-here-minimum-32-characters
CORS_ORIGINS=https://fedf-team6-a1.onrender.com
DEBUG=False
HOST=0.0.0.0
```

## ⚠️ Important Notes

1. **CORS_ORIGINS**: Make sure this matches your actual Render URL. If your app name is `FEDF_TEAM6_A1`, your URL will be `https://fedf-team6-a1.onrender.com` (Render converts underscores to hyphens and makes it lowercase).

2. **MongoDB Connection**: 
   - If using MongoDB Atlas, make sure to whitelist all IPs (`0.0.0.0/0`) in Network Access
   - Make sure your MongoDB user has read/write permissions

3. **Free Tier Limitations**:
   - Free instances spin down after 15 minutes of inactivity
   - First request after spin-down may take 30-60 seconds
   - Consider upgrading to a paid plan for production use

4. **File Uploads**: 
   - Files uploaded to `static/uploads` will be lost on each deploy (ephemeral filesystem)
   - Consider using cloud storage (AWS S3, Cloudinary) for persistent file storage

## ✅ Next Steps

1. Update the **Start Command** in Render dashboard to: `gunicorn app:app --bind 0.0.0.0:$PORT`
2. Update **CORS_ORIGINS** to your actual Render URL
3. Commit and push these changes to your repository
4. Render will automatically redeploy when you push
5. Check the logs in Render dashboard if deployment fails

## 🐛 Troubleshooting

If deployment fails:
1. Check Render logs for errors
2. Verify all environment variables are set correctly
3. Test MongoDB connection string locally
4. Make sure `gunicorn` is in requirements.txt (it is now!)
5. Verify the start command syntax is correct

