# Deploy to Render - Step by Step Guide

## 🚀 Quick Deployment Steps

Since your code is already on GitHub at `https://github.com/gnana1905/FEDF_TEAM6_A1`, follow these steps:

### Step 1: Connect GitHub Repository to Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Web Service"**
3. **Connect your GitHub account** (if not already connected)
4. **Select Repository**: Choose `gnana1905/FEDF_TEAM6_A1`
5. **Click "Connect"**

### Step 2: Configure Your Service

Render will auto-detect Flask, but you need to verify/update these settings:

#### Service Settings:
- **Name**: `fedf-team6-a1` (or keep `FEDF_TEAM6_A1`)
- **Region**: Choose closest to you (Oregon recommended)
- **Branch**: `main`
- **Root Directory**: Leave empty (or set if your app is in a subfolder)
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT`

#### Environment Variables:
Click "Add Environment Variable" and add:

1. **MONGO_URI**
   - Value: Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/chronoflow_db?retryWrites=true&w=majority`

2. **JWT_SECRET_KEY**
   - Value: A secure random string (minimum 32 characters)
   - Generate with: `python -c "import secrets; print(secrets.token_urlsafe(32))"`

3. **CORS_ORIGINS**
   - Value: `https://fedf-team6-a1.onrender.com`
   - Or your actual Render URL if different

4. **DEBUG**
   - Value: `false`

5. **HOST** (Optional)
   - Value: `0.0.0.0`

### Step 3: Deploy

1. **Click "Create Web Service"**
2. Render will start building and deploying your app
3. **Monitor the logs** in the Render dashboard
4. Wait for deployment to complete (usually 2-5 minutes)

### Step 4: Verify Deployment

1. Once deployed, your app will be available at: `https://fedf-team6-a1.onrender.com`
2. **Test the health endpoint**: `https://fedf-team6-a1.onrender.com/health`
3. **Check logs** if anything fails

## 📋 Checklist Before Deploying

- [x] Code pushed to GitHub
- [x] `gunicorn` added to `requirements.txt`
- [x] Background thread initialization fixed in `app.py`
- [ ] MongoDB database created (MongoDB Atlas or Render MongoDB)
- [ ] MongoDB connection string ready
- [ ] JWT_SECRET_KEY generated
- [ ] MongoDB network access configured (if using Atlas, whitelist `0.0.0.0/0`)

## 🔧 Configuration Summary

### Build Command
```
pip install -r requirements.txt
```

### Start Command
```
gunicorn app:app --bind 0.0.0.0:$PORT
```

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET_KEY` | Secret key for JWT tokens | `your-secret-key-here` |
| `CORS_ORIGINS` | Allowed CORS origins | `https://fedf-team6-a1.onrender.com` |
| `DEBUG` | Debug mode | `false` |
| `HOST` | Host address | `0.0.0.0` |

## 🐛 Troubleshooting

### Deployment Fails

1. **Check Build Logs**: Look for errors in the build phase
2. **Check Runtime Logs**: Look for errors after deployment starts
3. **Common Issues**:
   - Missing dependencies in `requirements.txt`
   - Incorrect start command
   - MongoDB connection issues
   - Environment variables not set

### App Crashes After Deployment

1. **Check Runtime Logs**: Look for Python errors
2. **Verify Environment Variables**: Make sure all are set correctly
3. **Test MongoDB Connection**: Verify MONGO_URI is correct
4. **Check Port Binding**: Ensure gunicorn binds to `0.0.0.0:$PORT`

### MongoDB Connection Issues

1. **If using MongoDB Atlas**:
   - Whitelist all IPs: `0.0.0.0/0` in Network Access
   - Verify connection string format
   - Check username/password are correct

2. **If using Render MongoDB**:
   - Copy the connection string from Render MongoDB dashboard
   - Use the internal connection string if available

### CORS Errors

1. **Update CORS_ORIGINS**: Make sure it matches your Render URL exactly
2. **Check Frontend**: Verify API calls use the correct Render URL
3. **Browser Console**: Check for CORS error messages

## 🔄 Automatic Deployments

Render automatically deploys when you push to the connected branch (usually `main`). 

To trigger a manual deployment:
1. Go to your service in Render dashboard
2. Click "Manual Deploy" → "Deploy latest commit"

## 📝 Notes

- **Free Tier**: Apps spin down after 15 minutes of inactivity
- **First Request**: May take 30-60 seconds if app was spun down
- **File Uploads**: Files in `static/uploads` are ephemeral (lost on redeploy)
- **Logs**: Available in Render dashboard under "Logs" tab
- **Environment Variables**: Can be updated without redeploying (some changes require restart)

## 🔗 Useful Links

- Render Dashboard: https://dashboard.render.com
- Render Docs: https://render.com/docs
- Your App URL: https://fedf-team6-a1.onrender.com
- GitHub Repo: https://github.com/gnana1905/FEDF_TEAM6_A1

## ✅ After Deployment

Once your app is deployed:

1. **Test the API**: Visit `https://fedf-team6-a1.onrender.com/health`
2. **Update Frontend**: Update your frontend to use the Render URL instead of localhost
3. **Test Authentication**: Try signing up and logging in
4. **Test Events**: Create, update, and delete events
5. **Monitor Logs**: Keep an eye on logs for any errors

Good luck with your deployment! 🚀

