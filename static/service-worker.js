// Enhanced Service Worker for ChronoFlow
// Handles background notifications and sound triggers

const CACHE_NAME = 'chronoflow-v1';
const API_BASE_URL = self.location.origin || 'http://localhost:5000';

// Install Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(self.clients.claim());
});

// Handle fetch requests
self.addEventListener('fetch', (event) => {
    // Allow API calls to pass through
    if (event.request.url.includes('/api/')) {
        return;
    }
    
    // Cache static assets
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Handle background sync for event checking
self.addEventListener('sync', (event) => {
    if (event.tag === 'check-events') {
        event.waitUntil(checkEventsForNotifications());
    }
});

// Check events and trigger notifications
async function checkEventsForNotifications() {
    try {
        // Get stored user token from IndexedDB or postMessage
        const token = await getStoredUser();
        
        if (!token) {
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/api/events`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            return;
        }
        
        const data = await response.json();
        const events = data.events || [];
        
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        const currentTime = now.toTimeString().split(' ')[0];
        
        events.forEach(event => {
            if (!event.triggered && 
                event.date === currentDate && 
                event.time === currentTime) {
                
                // Trigger notification
                if (event.reminder === 'popup' || event.reminder === 'both') {
                    showNotification(
                        event.category === 'birthday' ? `🎂 ${event.title}` : `🔔 ${event.title}`,
                        event.description,
                        event.photo
                    );
                }
                
                // Trigger sound (via postMessage to main thread)
                if (event.reminder === 'sound' || event.reminder === 'both') {
                    self.clients.matchAll().then(clients => {
                        clients.forEach(client => {
                            client.postMessage({
                                type: 'PLAY_SOUND',
                                isBirthday: event.category === 'birthday'
                            });
                        });
                    });
                }
                
                // Mark as triggered
                fetch(`${API_BASE_URL}/api/events/${event._id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ triggered: true })
                });
            }
        });
    } catch (error) {
        console.error('Error checking events:', error);
    }
}

// Show system notification
function showNotification(title, body, imageUrl = null) {
    const options = {
        body: body,
        icon: imageUrl || '/static/favicon.ico',
        badge: '/static/favicon.ico',
        tag: 'chronoflow-reminder',
        requireInteraction: true,
        vibrate: [200, 100, 200],
        actions: [
            {
                action: 'view',
                title: 'View Event'
            },
            {
                action: 'dismiss',
                title: 'Dismiss'
            }
        ]
    };
    
    return self.registration.showNotification(title, options);
}

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            self.clients.matchAll().then(clients => {
                if (clients.length) {
                    clients[0].focus();
                } else {
                    self.clients.openWindow('/');
                }
            })
        );
    }
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    } else if (event.data.type === 'STORE_USER') {
        storeUserData(event.data.token);
    } else if (event.data.type === 'CLEAR_USER') {
        // Clear any stored token on logout
        self.userToken = null;
    } else if (event.data.type === 'CHECK_EVENTS') {
        checkEventsForNotifications();
    }
});

// Store user token (simplified - in production use IndexedDB)
async function storeUserData(token) {
    // Store in a simple way (in production, use IndexedDB)
    self.userToken = token;
}

// Get stored user token
async function getStoredUser() {
    // In production, retrieve from IndexedDB
    return self.userToken || null;
}

// Periodic background sync (fallback for browsers that support it)
setInterval(() => {
    checkEventsForNotifications();
}, 60000); // Check every minute

console.log('Service Worker registered successfully');

