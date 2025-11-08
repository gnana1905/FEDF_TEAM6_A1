// ===== Configuration =====
const API_BASE_URL = 'http://localhost:5000';

// ===== State Management =====
let currentUser = null;
let allEvents = [];
let filteredEvents = [];
let uploadedImageBase64 = null;

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', async () => {
    // Hide preloader after page load
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
    }, 1500);

    // Initialize particles
    initParticles();

    // Check if user is logged in
    checkAuthStatus();

    // Setup event listeners
    setupEventListeners();

    // Register service worker
    registerServiceWorker();
});

// ===== Check Authentication =====
function checkAuthStatus() {
    const user = localStorage.getItem('currentUser');
    const theme = localStorage.getItem('theme') || 'light';

    if (user) {
        currentUser = JSON.parse(user);
        showDashboard();
    } else {
        showLandingPage();
    }

    setTheme(theme);
}

// ===== Setup Event Listeners =====
function setupEventListeners() {
    // Auth forms
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    
    // Add event form
    document.getElementById('add-event-form').addEventListener('submit', handleAddEvent);
    
    // Search and filter
    document.getElementById('search-input').addEventListener('input', filterEvents);
    document.getElementById('category-filter').addEventListener('change', filterEvents);
    
    // Close modal on outside click
    window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    };
}

// ===== Show/Hide Pages =====
function showLandingPage() {
    document.getElementById('landing-page').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('username-display').textContent = currentUser.username;
    loadEvents();
}

// ===== Modal Management =====
function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
    if (modalId === 'add-event-modal') {
        document.getElementById('add-event-form').reset();
        uploadedImageBase64 = null;
        document.getElementById('image-preview').classList.remove('show');
    }
}

// ===== Authentication =====
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            currentUser = data.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            closeModal('login-modal');
            showDashboard();
            showNotification('Welcome back!', 'success');
        } else {
            showNotification(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Connection error. Please check if server is running.', 'error');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Account created successfully!', 'success');
            closeModal('signup-modal');
            // Auto login
            setTimeout(() => {
                document.getElementById('login-email').value = email;
                document.getElementById('login-password').value = password;
                document.getElementById('login-form').dispatchEvent(new Event('submit', { bubbles: true }));
            }, 500);
        } else {
            showNotification(data.message || 'Signup failed', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showNotification('Connection error. Please check if server is running.', 'error');
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    showLandingPage();
    showNotification('Logged out successfully', 'success');
}

// ===== Theme Management =====
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const themeIcon = document.querySelector('.theme-icon');
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ===== Load Events =====
async function loadEvents() {
    if (!currentUser) return;

    try {
        const response = await fetch(`${API_BASE_URL}/get_events?email=${currentUser.email}`);
        const data = await response.json();

        if (response.ok) {
            allEvents = data.events;
            filteredEvents = [...allEvents];
            renderTimeline();
            updateStatistics();
        } else {
            showNotification(data.message || 'Failed to load events', 'error');
        }
    } catch (error) {
        console.error('Load events error:', error);
        showNotification('Failed to load events', 'error');
    }
}

// ===== Add Event =====
async function handleAddEvent(e) {
    e.preventDefault();
    
    const eventData = {
        email: currentUser.email,
        title: document.getElementById('event-title').value,
        description: document.getElementById('event-description').value,
        date: document.getElementById('event-date').value,
        time: document.getElementById('event-time').value,
        category: document.getElementById('event-category').value,
        reminder: document.getElementById('event-reminder').value,
        soundType: document.getElementById('event-sound').value,
        photo: uploadedImageBase64 || null,
        triggered: false,
        bgColor: document.getElementById('event-bg-color').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/add_event`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Event added successfully!', 'success');
            closeModal('add-event-modal');
            loadEvents();
        } else {
            showNotification(data.message || 'Failed to add event', 'error');
        }
    } catch (error) {
        console.error('Add event error:', error);
        showNotification('Failed to add event', 'error');
    }
}

// ===== Delete Event =====
async function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/delete_event/${eventId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Event deleted successfully', 'success');
            loadEvents();
        } else {
            showNotification(data.message || 'Failed to delete event', 'error');
        }
    } catch (error) {
        console.error('Delete event error:', error);
        showNotification('Failed to delete event', 'error');
    }
}

// ===== Filter Events =====
function filterEvents() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;

    filteredEvents = allEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm) ||
                            (event.description && event.description.toLowerCase().includes(searchTerm));
        const matchesCategory = !categoryFilter || event.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    renderTimeline();
}

// ===== Render Timeline =====
function renderTimeline() {
    const timelineEl = document.getElementById('timeline');
    
    if (filteredEvents.length === 0) {
        timelineEl.innerHTML = '<div class="empty-timeline"><h3>📅 No events found</h3><p>Add your first event to get started!</p></div>';
        return;
    }

    // Sort events by date and time
    const sortedEvents = [...filteredEvents].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
    });

    timelineEl.innerHTML = sortedEvents.map(event => `
        <div class="timeline-item ${event.category}" style="background: linear-gradient(135deg, ${event.bgColor || 'rgba(108, 92, 231, 0.1)'} 0%, rgba(118, 75, 162, 0.1) 100%); border-left-color: ${event.bgColor || '#6c5ce7'};">
            <div class="event-header">
                <h3 class="event-title">${escapeHtml(event.title)}</h3>
                <button class="delete-btn" onclick="deleteEvent('${event._id}')">🗑️ Delete</button>
            </div>
            <div class="event-details">
                <div class="event-detail">
                    <span>📅</span>
                    <span>${formatDate(event.date)} at ${formatTime(event.time)}</span>
                </div>
                <div class="event-detail">
                    <span>🏷️</span>
                    <span>${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</span>
                </div>
                <div class="event-detail">
                    <span>🔔</span>
                    <span>${event.reminder}</span>
                </div>
                <div class="event-detail">
                    <span>🔊</span>
                    <span>${event.soundType}</span>
                </div>
            </div>
            ${event.description ? `<div class="event-description">${escapeHtml(event.description)}</div>` : ''}
            ${event.photo ? `
                <div class="event-image">
                    <img src="${event.photo}" alt="${escapeHtml(event.title)}">
                </div>
            ` : ''}
        </div>
    `).join('');
}

// ===== Update Statistics =====
function updateStatistics() {
    const total = allEvents.length;
    const work = allEvents.filter(e => e.category === 'work').length;
    const school = allEvents.filter(e => e.category === 'school').length;
    const personal = allEvents.filter(e => e.category === 'personal').length;

    document.getElementById('total-events').textContent = total;
    document.getElementById('work-events').textContent = work;
    document.getElementById('school-events').textContent = school;
    document.getElementById('personal-events').textContent = personal;
}

// ===== Sound Preview =====
function previewSound() {
    const soundType = document.getElementById('event-sound').value;
    playSound(soundType);
}

function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const frequencies = {
        beep: [800, 1000],
        chime: [523.25, 659.25, 783.99],
        bell: [783.99, 1046.50]
    };

    const freqArray = frequencies[type] || frequencies.chime;
    
    freqArray.forEach((freq, index) => {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = type === 'bell' ? 'sine' : 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        }, index * 100);
    });
}

// ===== Image Upload =====
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedImageBase64 = e.target.result;
        const preview = document.getElementById('image-preview');
        preview.innerHTML = `<img src="${uploadedImageBase64}" alt="Preview">`;
        preview.classList.add('show');
    };
    reader.readAsDataURL(file);
}

// ===== Particles Animation =====
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let particle of particles) {
            particle.update();
            particle.draw();
        }

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / 120)})`;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ===== Service Worker Registration =====
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration.scope);
                checkForNotifications();
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }
}

// ===== Check for Notifications =====
async function checkForNotifications() {
    if (!currentUser) return;

    try {
        const response = await fetch(`${API_BASE_URL}/get_events?email=${currentUser.email}`);
        const data = await response.json();

        if (response.ok && data.events) {
            const now = new Date();
            
            for (const event of data.events) {
                if (event.triggered) continue;
                
                const eventTime = new Date(`${event.date}T${event.time}`);
                const timeDiff = eventTime - now;
                
                // Check if event is due within the last minute
                if (timeDiff > -60000 && timeDiff <= 0) {
                    triggerNotification(event);
                }
            }
        }
    } catch (error) {
        console.error('Notification check error:', error);
    }
}

// ===== Trigger Notification =====
function triggerNotification(event) {
    if ('Notification' in window && Notification.permission === 'granted') {
        const options = {
            body: event.description || event.title,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            vibrate: [200, 100, 200],
            tag: event._id
        };

        new Notification(event.title, options);
    }

    // Play sound
    if (event.reminder === 'sound' || event.reminder === 'both') {
        playSound(event.soundType);
    }

    // Show in-app notification
    showNotification(`🔔 ${event.title}`, 'success');
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// ===== Show Notification Toast =====
function showNotification(message, type = 'info') {
    const toast = document.getElementById('notification-toast');
    toast.innerHTML = `<p>${message}</p>`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== Utility Functions =====
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== Periodic Notification Check =====
setInterval(checkForNotifications, 60000); // Check every minute

