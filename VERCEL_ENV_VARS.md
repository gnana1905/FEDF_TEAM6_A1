# Vercel Environment Variables Guide

## 📋 Required Environment Variables

Set these in your Vercel project for the app to work correctly:

### 1. `MONGO_URI` (Required)
**Description**: MongoDB connection string  
**Example**: 
```
mongodb+srv://username:password@cluster.mongodb.net/chronoflow_db?retryWrites=true&w=majority
```
**How to get**:
- MongoDB Atlas: Copy connection string from your cluster
- Make sure to replace `<password>` with your actual password
- Whitelist all IPs (`0.0.0.0/0`) in Network Access for Vercel

### 2. `JWT_SECRET_KEY` (Required)
**Description**: Secret key for JWT token signing and verification  
**Example**: 
```
your-super-secret-key-at-least-32-characters-long-random-string
```
**How to generate**:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```
**Important**: 
- Must be at least 32 characters
- Keep it secret! Never commit to git
- Use different keys for development and production

### 3. `CORS_ORIGINS` (Recommended)
**Description**: Allowed CORS origins (comma-separated)  
**Example**: 
```
https://your-app-name.vercel.app,https://www.yourdomain.com
```
**Default**: `*` (allows all origins - less secure)  
**Best Practice**: Set to your actual Vercel URL(s)

### 4. `DEBUG` (Recommended)
**Description**: Enable/disable debug mode  
**Value**: `false` (for production)  
**Default**: `true`  
**Important**: Always set to `false` in production for security

### 5. `VERCEL` (Auto-set)
**Description**: Automatically set by Vercel to `1`  
**Purpose**: Used by app to detect serverless environment  
**Action**: No need to set manually

## 🔧 How to Set Environment Variables

### Method 1: Vercel Dashboard (Recommended)

1. Go to https://vercel.com
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter:
   - **Key**: `MONGO_URI`
   - **Value**: Your MongoDB connection string
   - **Environment**: Select all (Production, Preview, Development)
6. Click **Save**
7. Repeat for each variable

### Method 2: Vercel CLI

#### Add a single variable:
```bash
vercel env add MONGO_URI
```
Then paste the value when prompted.

#### Add multiple variables:
```bash
# Add MONGO_URI
vercel env add MONGO_URI production

# Add JWT_SECRET_KEY
vercel env add JWT_SECRET_KEY production

# Add CORS_ORIGINS
vercel env add CORS_ORIGINS production

# Add DEBUG
vercel env add DEBUG production
```

#### Set value directly:
```bash
vercel env add MONGO_URI production <<< "mongodb+srv://user:pass@cluster.mongodb.net/db"
```

### Method 3: Using `.env` file (Local Development Only)

Create `.env.local` in your project root:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/chronoflow_db
JWT_SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:3000
DEBUG=true
```

**Note**: `.env` files are NOT deployed to Vercel. You must set variables in the dashboard or CLI.

## 📝 Complete Environment Variables List

### For Production (Vercel)

```bash
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/chronoflow_db?retryWrites=true&w=majority
JWT_SECRET_KEY=your-generated-secret-key-minimum-32-characters
CORS_ORIGINS=https://your-app-name.vercel.app
DEBUG=false
VERCEL=1
```

### For Development (Local)

```bash
MONGO_URI=mongodb://localhost:27017/chronoflow_db
JWT_SECRET_KEY=dev-secret-key-change-in-production
CORS_ORIGINS=http://localhost:5000,http://localhost:3000
DEBUG=true
```

## 🔍 Verify Environment Variables

### Check in Vercel Dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Verify all variables are set correctly

### Check via CLI:
```bash
vercel env ls
```

### Test in Code:
Add this temporarily to `app.py` to verify:
```python
import os
print("MONGO_URI:", os.environ.get('MONGO_URI', 'NOT SET'))
print("JWT_SECRET_KEY:", "SET" if os.environ.get('JWT_SECRET_KEY') else "NOT SET")
print("CORS_ORIGINS:", os.environ.get('CORS_ORIGINS', 'NOT SET'))
print("DEBUG:", os.environ.get('DEBUG', 'NOT SET'))
```

## ⚠️ Important Notes

### 1. Environment Scope
When adding variables, choose the environment:
- **Production**: Live production deployments
- **Preview**: Pull request previews
- **Development**: Local development with `vercel dev`

**Best Practice**: Set variables for all environments, or at least Production and Preview.

### 2. Variable Updates
After adding/updating environment variables:
- **Redeploy** your project for changes to take effect
- Go to Deployments → Click "..." → "Redeploy"

### 3. Security
- ✅ Never commit `.env` files to git
- ✅ Use different keys for dev/prod
- ✅ Rotate secrets periodically
- ✅ Use Vercel's encrypted environment variables (automatic)

### 4. MongoDB Connection
- Ensure MongoDB Atlas allows connections from Vercel
- Network Access: Add `0.0.0.0/0` (all IPs) or Vercel's IP ranges
- Database User: Must have read/write permissions

## 🐛 Troubleshooting

### Variable Not Found
**Error**: `KeyError` or `None` value  
**Solution**:
1. Check variable name (case-sensitive)
2. Verify it's set in correct environment
3. Redeploy after adding variables

### MongoDB Connection Fails
**Error**: `ServerSelectionTimeoutError`  
**Solution**:
1. Verify `MONGO_URI` is correct
2. Check MongoDB Atlas Network Access
3. Verify username/password in connection string
4. Test connection string locally first

### CORS Errors
**Error**: CORS policy blocking requests  
**Solution**:
1. Set `CORS_ORIGINS` to your Vercel URL
2. Include protocol: `https://your-app.vercel.app`
3. No trailing slashes
4. Redeploy after updating

## 📚 Quick Reference

### Minimum Required Variables:
```
MONGO_URI
JWT_SECRET_KEY
```

### Recommended Variables:
```
MONGO_URI
JWT_SECRET_KEY
CORS_ORIGINS
DEBUG
```

### Auto-set by Vercel:
```
VERCEL=1
```

## 🔗 Related Documentation

- [Vercel Environment Variables Docs](https://vercel.com/docs/environment-variables)
- [Vercel CLI Environment Variables](https://vercel.com/docs/cli/env)
- [MongoDB Atlas Connection String](https://www.mongodb.com/docs/atlas/connection-string/)

## ✅ Checklist

Before deploying, ensure:
- [ ] `MONGO_URI` is set and correct
- [ ] `JWT_SECRET_KEY` is set (32+ characters)
- [ ] `CORS_ORIGINS` includes your Vercel URL
- [ ] `DEBUG` is set to `false` for production
- [ ] Variables are set for Production environment
- [ ] MongoDB Atlas network access allows Vercel
- [ ] Tested connection string locally

---

**After setting variables, remember to redeploy your project!**

