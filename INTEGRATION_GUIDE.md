# ChronoFlow Full-Stack Integration Guide

## Overview
This guide explains how the frontend from `oldone.html` has been integrated with the Flask backend API.

## Key Integration Points

### 1. Authentication
- **Signup**: Replaced localStorage with `/api/signup` endpoint
- **Login**: Replaced localStorage with `/api/login` endpoint, stores JWT token
- **Token Management**: JWT token stored in localStorage/sessionStorage

### 2. Event Management
- **Create Event**: Uses `POST /api/events` with JWT token in Authorization header
- **Get Events**: Uses `GET /api/events` with JWT token
- **Update Event**: Uses `PUT /api/events/<event_id>` with JWT token
- **Delete Event**: Uses `DELETE /api/events/<event_id>` with JWT token

### 3. API Configuration
- Base URL: `http://localhost:5000`
- All API requests include `Authorization: Bearer <token>` header
- Error handling for network failures and authentication errors

## File Structure
```
final-chronoflow/
├── app.py              # Flask backend with all API endpoints
├── config.py           # Configuration settings
├── requirements.txt    # Python dependencies
├── static/
│   ├── index.html      # Integrated frontend (from oldone.html + API calls)
│   └── uploads/       # Directory for uploaded event photos
└── oldone.html         # Original frontend (for reference)
```

## Running the Application

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Start MongoDB** (if not running):
   ```bash
   # MongoDB should be running on localhost:27017
   ```

3. **Run Flask Server**:
   ```bash
   python app.py
   ```

4. **Access Application**:
   - Open browser to `http://localhost:5000`
   - The frontend will be served from `static/index.html`

## API Endpoints

### Authentication
- `POST /api/signup` - Create new user account
- `POST /api/login` - Authenticate and get JWT token
- `POST /api/logout` - Logout (client-side token removal)
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

## Frontend Changes

### JavaScript Modifications
1. **API Helper Functions**: Added functions to make authenticated API calls
2. **Token Storage**: JWT tokens stored in localStorage
3. **Event Sync**: All events synced with MongoDB via API
4. **Error Handling**: Comprehensive error handling for API failures

### Key Functions
- `apiCall()` - Generic function for authenticated API calls
- `loadEventsFromAPI()` - Load events from backend
- `saveEventToAPI()` - Save event to backend
- `deleteEventFromAPI()` - Delete event from backend
- `updateEventInAPI()` - Update event in backend

## Testing

1. **Create Account**: Sign up with username, email, and password
2. **Login**: Use credentials to login
3. **Add Event**: Create events with photos, reminders, etc.
4. **Edit/Delete**: Test event modifications
5. **Check Background Service**: Verify event reminders trigger correctly

## Notes

- All user data is stored in MongoDB
- Events are user-specific (filtered by user_id)
- Background service checks for due events every 10 seconds
- File uploads are stored in `static/uploads/` directory
- JWT tokens expire after 24 hours

