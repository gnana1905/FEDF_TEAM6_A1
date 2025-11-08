# Vercel Framework Configuration Guide

## 🎯 Your Project Framework

**Backend Framework**: **Flask** (Python)  
**Frontend**: **Vanilla JavaScript** (No framework - HTML/CSS/JS)

## 📋 Vercel Framework Preset

When deploying to Vercel, you should select:

### Option 1: "Other" (Recommended)
- **Framework Preset**: **Other**
- **Build Command**: Leave empty (or `pip install -r requirements.txt`)
- **Output Directory**: Leave empty
- **Install Command**: `pip install -r requirements.txt`

**Why "Other"?**
- Vercel doesn't have a specific Flask preset
- Your app uses custom `vercel.json` configuration
- The `@vercel/python` runtime handles Flask automatically

### Option 2: Auto-detect
- Vercel will try to auto-detect
- May not detect Flask correctly
- Better to explicitly set to "Other"

## 🔧 Current Configuration

Your `vercel.json` already handles framework configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.py",
      "use": "@vercel/python"  // This tells Vercel to use Python runtime
    }
  ],
  "routes": [
    // Your routing configuration
  ]
}
```

**What this means:**
- `@vercel/python` = Python runtime for serverless functions
- Automatically handles WSGI apps (like Flask)
- No need for framework-specific presets

## 🚀 Deployment Settings

### In Vercel Dashboard:

1. **Framework Preset**: `Other`
2. **Root Directory**: `./` (root of repository)
3. **Build Command**: 
   ```
   pip install -r requirements.txt
   ```
   (Optional - Vercel auto-detects Python projects)
4. **Output Directory**: Leave empty
5. **Install Command**: 
   ```
   pip install -r requirements.txt
   ```
   (Optional)

### Why These Settings?

- **No Build Step Needed**: Flask doesn't require compilation
- **Install Dependencies**: Vercel needs to install Python packages
- **Serverless Functions**: `api/index.py` is the entry point
- **Static Files**: Served from `static/` directory automatically

## 📦 Framework Detection

Vercel detects your project type by:

1. **File Structure**:
   - `requirements.txt` → Python project
   - `api/` directory → Serverless functions
   - `vercel.json` → Custom configuration

2. **Runtime Detection**:
   - `@vercel/python` in `vercel.json` → Python runtime
   - Flask app in `api/index.py` → WSGI application

3. **Auto-configuration**:
   - Vercel automatically converts Flask WSGI → Serverless function
   - No manual framework setup needed

## ⚙️ Framework-Specific Settings

### Flask-Specific Configuration

Your Flask app works with Vercel because:

1. **WSGI Compatibility**:
   ```python
   # Vercel automatically handles this:
   from app import app  # WSGI application
   ```

2. **Serverless Adapter**:
   ```python
   # api/index.py wraps your Flask app
   # Vercel converts WSGI → Serverless function
   ```

3. **No Framework Changes Needed**:
   - Your Flask code works as-is
   - No special Vercel decorators required
   - Standard Flask routes work

### Frontend Framework

**Your Frontend**: Vanilla JavaScript (No framework)

- **No Build Step**: HTML/CSS/JS served directly
- **Static Files**: Served from `static/` directory
- **No Framework Preset Needed**: Just static files

## 🔍 Verification

### Check Framework Detection:

After deployment, check:
1. **Vercel Dashboard** → Your Project → Settings
2. **Framework**: Should show "Other" or auto-detected
3. **Build Logs**: Should show Python installation
4. **Function Logs**: Should show Flask app loading

### Test Framework:

```bash
# Deploy and check logs
vercel deploy

# Check function logs
vercel logs
```

## 📚 Framework Alternatives

If you wanted to use other frameworks:

### Backend Alternatives:
- **FastAPI**: Similar setup, use `@vercel/python`
- **Django**: More complex, may need custom config
- **Express.js**: Use `@vercel/node`

### Frontend Alternatives:
- **React**: Use `@vercel/react` or `create-react-app`
- **Next.js**: Use `@vercel/next`
- **Vue**: Use `@vercel/vue`
- **Svelte**: Use `@vercel/svelte`

**Your Current Setup**: Perfect for Flask + Vanilla JS

## ✅ Summary

**Your Framework Stack:**
- ✅ Backend: Flask (Python) - Configured via `@vercel/python`
- ✅ Frontend: Vanilla JavaScript - No framework needed
- ✅ Configuration: `vercel.json` handles everything

**Vercel Settings:**
- Framework Preset: **Other**
- Build Command: `pip install -r requirements.txt` (optional)
- Everything else: Auto-detected or handled by `vercel.json`

**No Additional Configuration Needed!** Your `vercel.json` already has everything configured correctly.

## 🎯 Quick Reference

| Setting | Value |
|---------|-------|
| Framework Preset | Other |
| Build Command | `pip install -r requirements.txt` (optional) |
| Output Directory | (empty) |
| Install Command | `pip install -r requirements.txt` (optional) |
| Runtime | Python 3.12 (from `runtime.txt`) |
| Function Handler | `api/index.py` |
| Framework | Flask (auto-detected by `@vercel/python`) |

---

**Your configuration is already correct!** Just select "Other" as the framework preset when deploying.

