// ===== Service Worker for ChronoFlow =====

const CACHE_NAME = 'chronoflow-v1';
const API_BASE_URL = 'http://localhost:5000';

// ===== Install Event =====
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching app shell');
                return cache.addAll([
                    '/',
                    '/index.html',
                    '/styles.css',
                    '/app.js',
                    '/manifest.json'
                ]);
            })
    );
    
    self.skipWaiting();
});

// ===== Activate Event =====
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    self.clients.claim();
});

// ===== Fetch Event (Offline Support) =====
self.addEventListener('fetch', (event) => {
    // Skip API requests
    if (event.request.url.startsWith(API_BASE_URL)) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// ===== Background Sync for Notifications =====
self.addEventListener('sync', (event) => {
    console.log('Background sync triggered:', event.tag);
    
    if (event.tag === 'check-events') {
        event.waitUntil(checkEventsForNotifications());
    }
});

// ===== Periodic Background Sync =====
async function checkEventsForNotifications() {
    try {
        // Get user info from IndexedDB
        const user = await getStoredUser();
        if (!user) {
            console.log('No user found in storage');
            return;
        }
        
        // Fetch events from API
        const response = await fetch(`${API_BASE_URL}/get_events?email=${user.email}`);
        const data = await response.json();
        
        if (data.events) {
            const now = new Date();
            
            for (const event of data.events) {
                if (event.triggered) continue;
                
                const eventTime = new Date(`${event.date}T${event.time}`);
                const timeDiff = eventTime - now;
                
                // Check if event is due within the last minute
                if (timeDiff > -60000 && timeDiff <= 0) {
                    showNotification(event);
                    
                    // Mark as triggered (optional - you might want to update backend)
                    // await markEventAsTriggered(event._id, user.email);
                }
            }
        }
    } catch (error) {
        console.error('Background sync error:', error);
    }
}

// ===== Show Notification =====
function showNotification(event) {
    const title = event.title;
    const options = {
        body: event.description || `Event reminder`,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [200, 100, 200, 100, 200],
        tag: event._id,
        requireInteraction: false,
        actions: [
            { action: 'view', title: 'View Details' },
            { action: 'dismiss', title: 'Dismiss' }
        ]
    };
    
    self.registration.showNotification(title, options);
    
    // Play sound if needed
    if (event.reminder === 'sound' || event.reminder === 'both') {
        playSoundNotification(event.soundType);
    }
}

// ===== Notification Click Handler =====
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event);
    
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'dismiss') {
        // Dismiss action
    } else {
        // Default: open app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// ===== Play Sound Notification =====
function playSoundNotification(soundType) {
    const audioContext = new AudioContext();
    
    const frequencies = {
        beep: [800, 1000],
        chime: [523.25, 659.25, 783.99],
        bell: [783.99, 1046.50]
    };

    const freqArray = frequencies[soundType] || frequencies.chime;
    
    freqArray.forEach((freq, index) => {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = soundType === 'bell' ? 'sine' : 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        }, index * 100);
    });
}

// ===== Get Stored User =====
async function getStoredUser() {
    try {
        // Use client-side storage from main app
        // This would need to be stored via postMessage from main app
        return null;
    } catch (error) {
        console.error('Error getting stored user:', error);
        return null;
    }
}

// ===== Message Handler (for communication from main app) =====
self.addEventListener('message', (event) => {
    console.log('Message received in SW:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'STORE_USER') {
        // Store user data for offline access
        event.waitUntil(storeUserData(event.data.user));
    }
});

// ===== Store User Data =====
async function storeUserData(user) {
    try {
        // Store in IndexedDB or similar
        console.log('Storing user data:', user);
    } catch (error) {
        console.error('Error storing user data:', error);
    }
}

// ===== Periodic Check Setup =====
// This is a workaround for browsers that don't support periodic background sync
let lastCheckTime = Date.now();

setInterval(() => {
    const now = Date.now();
    // Check every minute
    if (now - lastCheckTime >= 60000) {
        checkEventsForNotifications();
        lastCheckTime = now;
    }
}, 60000);

console.log('Service Worker loaded');

