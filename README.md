# ChronoFlow

A full-stack web application for managing events with custom notifications, sound triggers, and PWA support.

## Features

- **User Authentication** - Secure signup/login with JWT tokens
- **Event Management** - Create, update, delete, and filter events
- **Custom Notifications** - Sound alerts and browser notifications
- **PWA Support** - Installable app with offline functionality
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark/Light Mode** - Theme toggle with persistent preferences

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Python, Flask, MongoDB
- **Deployment**: Vercel (Serverless)

## Quick Start

### Prerequisites

- Python 3.12+
- MongoDB Atlas account (or local MongoDB)

### Installation

1. Clone the repository
```bash
git clone https://github.com/gnana1905/FEDF_TEAM6_A1.git
cd FEDF_TEAM6_A1
```

2. Install dependencies
```bash
pip install -r requirements.txt
```

3. Set up environment variables
```bash
# Create .env file or set environment variables
MONGO_URI=mongodb://localhost:27017/chronoflow_db
JWT_SECRET_KEY=your-secret-key
CORS_ORIGINS=http://localhost:5000
DEBUG=true
```

4. Run the application
```bash
python app.py
```

5. Open in browser
```
http://localhost:5000
```

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

See deployment configuration in `vercel.json`

## Project Structure

```
.
├── api/
│   └── index.py          # Vercel serverless function wrapper
├── static/
│   ├── index.html        # Frontend application
│   ├── styles.css        # Styles
│   └── service-worker.js # PWA service worker
├── app.py                # Flask backend
├── config.py             # Configuration
├── requirements.txt      # Python dependencies
├── vercel.json          # Vercel configuration
└── README.md            # This file
```

## API Endpoints

- `POST /api/signup` - Create user account
- `POST /api/login` - User authentication
- `GET /api/events` - Get user events
- `POST /api/events` - Create event
- `PUT /api/events/<id>` - Update event
- `DELETE /api/events/<id>` - Delete event
- `GET /health` - Health check

## License

MIT License

## Author

gnana1905
