# Vercel Deployment - Quick Start

## 🚀 Fast Deployment (5 Minutes)

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login
```bash
vercel login
```

### 3. Deploy
```bash
vercel
```

Follow prompts, then set environment variables in dashboard.

## 📋 Required Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET_KEY=your-secret-key-32-chars-minimum
CORS_ORIGINS=https://your-app.vercel.app
DEBUG=false
```

## ⚠️ Important Notes

1. **Background threads are disabled** - Use Vercel Cron Jobs instead
2. **File uploads** - Use cloud storage (Vercel Blob, S3, etc.)
3. **Cold starts** - First request may take 1-3 seconds

## 🔗 Files Created

- `vercel.json` - Vercel configuration
- `api/index.py` - Serverless function wrapper
- `.vercelignore` - Files to exclude
- `app.py` - Updated to detect serverless environment

## 📚 Full Documentation

- **Deployment Guide**: See `DEPLOY_TO_VERCEL.md`
- **Error Explanation**: See `VERCEL_ERROR_EXPLANATION.md`

## ✅ Test After Deployment

Visit: `https://your-app.vercel.app/health`

Should return: `{"status": "healthy", "database": "connected"}`

