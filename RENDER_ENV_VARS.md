# Environment Variables for Render Deployment

## Required Environment Variables

Set these in your Render dashboard under your Web Service → Environment section:

### 1. `MONGO_URI` (Required)
- **Description**: MongoDB connection string
- **Example**: `mongodb+srv://username:password@cluster.mongodb.net/chronoflow_db?retryWrites=true&w=majority`
- **How to get**: 
  - Create a MongoDB database on Render (MongoDB service) OR
  - Use MongoDB Atlas (recommended for free tier)
  - Copy the connection string from your MongoDB provider

### 2. `JWT_SECRET_KEY` (Required)
- **Description**: Secret key for JWT token signing and verification
- **Example**: Generate a secure random string (at least 32 characters)
- **How to generate**: 
  - Use Python: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
  - Or use an online generator for a secure random string
- **Important**: Keep this secret! Never commit it to git.

### 3. `CORS_ORIGINS` (Recommended)
- **Description**: Allowed CORS origins (comma-separated)
- **Example**: `https://your-app-name.onrender.com,https://www.yourdomain.com`
- **Default**: `*` (allows all origins - less secure for production)
- **Note**: Set this to your Render app URL(s) for better security

### 4. `DEBUG` (Recommended)
- **Description**: Enable/disable debug mode
- **Value**: `False` (for production)
- **Default**: `True`
- **Important**: Always set to `False` in production for security

### 5. `HOST` (Optional)
- **Description**: Host address to bind the server
- **Value**: `0.0.0.0` (required for Render)
- **Default**: `0.0.0.0`

### 6. `PORT` (Optional)
- **Description**: Port number for the server
- **Note**: Render automatically sets the `PORT` environment variable
- **Default**: `5000`
- **Important**: Your app already reads this from environment, so Render will handle it automatically

## Quick Setup Guide

1. **Create a MongoDB Database**:
   - Go to Render Dashboard → New → MongoDB
   - Or use MongoDB Atlas (free tier available)
   - Copy the connection string

2. **Generate JWT Secret Key**:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

3. **In Render Dashboard - Web Service Configuration**:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT`
   - Go to your Web Service → Environment
   - Add the following variables:
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET_KEY`: Your generated secret key
     - `CORS_ORIGINS`: Your Render app URL (e.g., `https://fedf-team6-a1.onrender.com`)
     - `DEBUG`: `False`
     - `HOST`: `0.0.0.0` (optional, but recommended)

## Example Environment Variables (Render Dashboard)

```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/chronoflow_db?retryWrites=true&w=majority
JWT_SECRET_KEY=your-super-secret-key-at-least-32-characters-long
CORS_ORIGINS=https://chrono-flow.onrender.com
DEBUG=False
HOST=0.0.0.0
```

## Additional Notes

- Render automatically provides the `PORT` environment variable, so you don't need to set it manually
- Make sure your MongoDB database allows connections from Render's IP addresses (if using MongoDB Atlas, whitelist all IPs: `0.0.0.0/0`)
- The `UPLOAD_FOLDER` is set to `static/uploads` - make sure this directory exists in your repository
- For file uploads to persist, consider using cloud storage (AWS S3, Cloudinary) instead of local storage on Render

