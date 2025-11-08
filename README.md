# ChronoFlow - Interactive Timeline with Custom Event Triggers

A beautiful, full-stack web application for managing events with custom notifications, sound triggers, and PWA support.

![ChronoFlow Preview](https://img.shields.io/badge/Status-Ready-success) ![Python](https://img.shields.io/badge/Python-3.8+-blue) ![Flask](https://img.shields.io/badge/Flask-3.0-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen)

## ✨ Features

### 🎨 Frontend
- **Beautiful Landing Page** with animated particles and gradients
- **User Authentication** - Signup/Login with secure password hashing
- **Interactive Timeline** - Add, view, filter, and search events
- **Custom Event Creation**:
  - Title, date, time, category (Work/School/Personal)
  - Description and optional image upload
  - Background color picker
  - Custom sound selection (Beep, Chime, Bell)
  - Reminder types (Notification, Sound, or Both)
  - Sound preview
- **Statistics Dashboard** - Track total events and category counts
- **Theme Toggle** - Light/Dark mode with persistent preferences
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Smooth Animations** - Gradient text, sparkles, and transitions

### ⚙️ Backend
- **Flask REST API** with MongoDB integration
- **Secure Authentication** using Werkzeug password hashing
- **Background Event Checker** - Automated notification system
- **CRUD Operations** for events
- **CORS Enabled** for cross-origin requests

### 🔔 Notifications & PWA
- **Service Worker** for offline support
- **Background Notifications** even when tab is closed
- **Sound Alerts** - Play custom sounds on event triggers
- **PWA Installable** - Add to home screen on mobile
- **Offline Caching** - Basic offline functionality

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** installed
- **MongoDB** installed and running
- **pip** package manager

### Installation Steps

1. **Clone or download the project**
```bash
cd final-chronoflow
```

2. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

3. **Start MongoDB**
   
   **Windows:**
   ```bash
   # Open a new terminal and run:
   mongod
   ```
   
   **macOS:**
   ```bash
   brew services start mongodb-community
   ```
   
   **Linux:**
   ```bash
   sudo systemctl start mongod
   ```

4. **Setup MongoDB database (Optional)**
```bash
python setup_mongodb.py
```

5. **Start the Flask backend**
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

6. **Open the frontend**

   Simply open `index.html` in your web browser, or use a local server:

   **Python:**
   ```bash
   python -m http.server 8000
   ```

   **Node.js:**
   ```bash
   npx serve .
   ```

   Then visit: `http://localhost:8000`

7. **Allow notifications** when prompted by your browser

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Visit the site
2. Click the install icon in the address bar
3. Click "Install"

### Mobile (Android)
1. Visit the site in Chrome
2. Tap the menu (⋮)
3. Select "Add to Home Screen"

### iOS Safari
1. Visit the site
2. Tap the Share button
3. Select "Add to Home Screen"

## 🎯 Usage Guide

### Creating an Account
1. Click "Sign Up" on the landing page
2. Enter username, email, and password
3. Click "Create Your Account"

### Adding Events
1. Click "Add Event" button
2. Fill in the event details:
   - Title (required)
   - Date & Time (required)
   - Category: Work, School, or Personal
   - Description (optional)
   - Reminder type: Notification, Sound, or Both
   - Sound type: Beep, Chime, or Bell (with preview)
   - Background color or upload image
3. Click "Add Event"

### Managing Events
- **Search**: Use the search bar to find events by title or description
- **Filter**: Select a category to show only specific events
- **Delete**: Click the delete button on any event
- **Statistics**: View total events and category counts at the top

### Notifications
- Events trigger at their scheduled time
- Notifications work even when the browser is closed
- Custom sounds play based on your selection
- Toast notifications appear in-app

## 📂 Project Structure

```
final-chronoflow/
│
├── index.html           # Main HTML file (landing + dashboard)
├── styles.css           # Complete styling with modern design
├── app.js              # Frontend JavaScript logic
├── service-worker.js   # PWA & background notifications
├── manifest.json       # PWA manifest
│
├── app.py              # Flask backend server
├── requirements.txt    # Python dependencies
├── setup_mongodb.py    # MongoDB setup script
│
└── README.md           # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /signup` - Create new user account
- `POST /login` - Authenticate existing user

### Events
- `POST /add_event` - Add a new event
- `GET /get_events?email=xxx` - Get all events for a user
- `DELETE /delete_event/<id>` - Delete an event by ID
- `PUT /update_event/<id>` - Update an existing event

### Utility
- `GET /health` - Server health check

## 🎨 Customization

### Changing Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6c5ce7;
    --secondary-color: #00b894;
    --accent-color: #fd79a8;
}
```

### Adding Categories
1. Update `index.html` category selectors
2. Add corresponding CSS in `styles.css`
3. Update statistics logic in `app.js`

### Sound Customization
Modify the `frequencies` object in `app.js`:
```javascript
const frequencies = {
    beep: [800, 1000],
    chime: [523.25, 659.25, 783.99],
    bell: [783.99, 1046.50],
    custom: [/* your frequencies */]
};
```

## 🐛 Troubleshooting

### MongoDB not connecting
- Ensure MongoDB is running: `mongod`
- Check connection string in `app.py`
- Verify MongoDB is installed: `mongod --version`

### Service Worker not registering
- Ensure you're using HTTPS or localhost
- Clear browser cache and reload
- Check browser console for errors

### Background notifications not working
- Allow notification permissions when prompted
- Check if browser supports notifications
- Verify Service Worker is active (DevTools > Application)

### Flask server errors
- Check if port 5000 is available
- Verify all dependencies are installed: `pip list`
- Review Flask logs for specific errors

## 🔒 Security Notes

- Passwords are hashed using Werkzeug (production-ready)
- CORS is enabled for development (configure properly for production)
- No sensitive data in URLs
- Session storage for local authentication

## 🚢 Production Deployment

For production deployment:

1. **Use a production WSGI server:**
```bash
pip install gunicorn
gunicorn -w 4 app:app
```

2. **Secure MongoDB:**
   - Enable authentication
   - Use connection string with credentials
   - Configure firewall rules

3. **Update CORS settings:**
```python
CORS(app, resources={r"/*": {"origins": ["https://yourdomain.com"]}})
```

4. **Use environment variables:**
```python
import os
app.config['MONGO_URI'] = os.environ.get('MONGO_URI')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
```

5. **Enable HTTPS:**
   - Service Workers require HTTPS in production
   - Use Let's Encrypt or similar

## 📝 Future Enhancements

- [ ] Export timeline as CSV/PDF
- [ ] Public share links for timelines
- [ ] Email notifications
- [ ] Recurring events
- [ ] Event collaboration features
- [ ] Analytics dashboard
- [ ] AI-powered timeline generation
- [ ] Mobile app (React Native)

## 🤝 Contributing

Feel free to fork, modify, and use this project for your own purposes!

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with Flask, MongoDB, and vanilla JavaScript
- Modern UI inspired by gradient design trends
- PWA features powered by Service Workers

---

**Enjoy managing your timeline with ChronoFlow! ⏰✨**

