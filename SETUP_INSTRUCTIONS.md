# ChronoFlow Full-Stack Setup Instructions

## ✅ Complete Integration Summary

The ChronoFlow application has been successfully integrated with:
- **Backend**: Flask with MongoDB
- **Frontend**: Enhanced HTML/CSS/JavaScript from `oldone.html`
- **Authentication**: JWT token-based
- **Database**: MongoDB with user and event collections
- **Real-time**: Background notification service

## 📁 File Structure

```
final-chronoflow/
├── app.py                  # Flask backend with all API endpoints
├── config.py              # Configuration settings
├── requirements.txt       # Python dependencies (updated with PyJWT)
├── static/
│   ├── index.html        # Integrated frontend (from oldone.html + API)
│   └── uploads/          # Directory for uploaded photos
├── oldone.html           # Original frontend (reference)
├── INTEGRATION_GUIDE.md  # Detailed integration documentation
└── SETUP_INSTRUCTIONS.md # This file
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start MongoDB
Ensure MongoDB is running on `localhost:27017`
- Windows: Check MongoDB service is running
- Linux/Mac: `sudo systemctl start mongod` or `brew services start mongodb-community`

### 3. Run the Application
```bash
python app.py
```

The server will start on `http://localhost:5000`

### 4. Access the Application
Open your browser and navigate to:
```
http://localhost:5000
```

## 🔑 Key Features

### Authentication
- **Sign Up**: Create new user account with username, email, and password
- **Login**: Authenticate with email and password
- **JWT Tokens**: Secure token-based authentication (24-hour expiration)
- **Auto-login**: Token persists across browser sessions

### Event Management
- **Create Events**: Add events with date, time, title, description, category
- **Edit Events**: Update existing events
- **Delete Events**: Remove events with confirmation
- **Photo Upload**: Attach photos to events (stored as base64)
- **Categories**: Work, Personal, School, Milestone, Achievement, Innovation, Discovery, Launch, Birthday

### Reminders & Notifications
- **Reminder Types**: None, Popup, Sound, Both
- **Sound Types**: Default, Chime, Beep, Bell, Birthday Song
- **Background Service**: Checks for due events every 10 seconds
- **Real-time Triggers**: Automatic notifications when events are due

### UI Features
- **Dark/Light Theme**: Toggle between themes
- **Timeline Visualization**: Interactive timeline with event points
- **Statistics**: View event counts by category
- **Filters**: Filter events by category
- **Background Customization**: Custom background colors
- **Responsive Design**: Works on desktop and mobile

## 📡 API Endpoints

### Authentication
- `POST /api/signup` - Create new user
- `POST /api/login` - Authenticate user
- `POST /api/logout` - Logout user
- `GET /api/me` - Get current user profile

### Events
- `POST /api/events` - Create new event
- `GET /api/events` - Get user's events
- `PUT /api/events/<event_id>` - Update event
- `DELETE /api/events/<event_id>` - Delete event
- `GET /api/events/stats` - Get event statistics

### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings

### File Upload
- `POST /api/upload` - Upload event photo

## 🔧 Configuration

Edit `config.py` to customize:
- MongoDB connection string
- JWT secret key (change in production!)
- File upload settings
- CORS origins

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or check service status
- Verify connection string in `config.py`
- Check MongoDB is listening on port 27017

### API Authentication Errors
- Clear browser localStorage: `localStorage.clear()`
- Re-login to get a new token
- Check token expiration (24 hours)

### Photo Upload Issues
- Check `static/uploads/` directory exists
- Verify file size is under 16MB
- Check file format is supported (png, jpg, jpeg, gif, webp)

### Events Not Loading
- Check browser console for errors
- Verify user is logged in
- Check MongoDB connection
- Verify events exist in database

## 📝 Testing

1. **Sign Up**: Create a new account
2. **Login**: Use credentials to login
3. **Add Event**: Create an event with all fields
4. **Edit Event**: Modify an existing event
5. **Delete Event**: Remove an event
6. **Load Samples**: Use "Load Sample Events" button
7. **Filter**: Test category filters
8. **Visualization**: View timeline visualization
9. **Theme**: Toggle dark/light mode
10. **Reminders**: Create events with reminders and wait for triggers

## 🔐 Security Notes

- **JWT Secret**: Change `JWT_SECRET_KEY` in `config.py` for production
- **Password Hashing**: Passwords are hashed with bcrypt
- **CORS**: Configure allowed origins in `config.py`
- **File Upload**: Validate file types and sizes

## 📚 Additional Resources

- See `INTEGRATION_GUIDE.md` for detailed integration documentation
- Original frontend code preserved in `oldone.html`
- API documentation in `app.py` comments

## ✨ Next Steps

1. **Deploy**: Set up production environment
2. **Database**: Configure production MongoDB
3. **Security**: Update JWT secret and CORS settings
4. **Monitoring**: Add logging and error tracking
5. **Testing**: Create comprehensive test suite

---

**Enjoy your ChronoFlow timeline application!** 🎉

