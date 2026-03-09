/* ============================================
   VINE GARDEN FILMS - Event App 2026
   Application Logic
   ============================================ */

// ---- Firebase Configuration ----
const firebaseConfig = {
  apiKey: "AIzaSyAV2UyCyjjBdf4lCSFl6sE434Y4zzlT8co",
  authDomain: "offsite-app-f53d6.firebaseapp.com",
  databaseURL: "https://offsite-app-f53d6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "offsite-app-f53d6",
  storageBucket: "offsite-app-f53d6.firebasestorage.app",
  messagingSenderId: "392064911388",
  appId: "1:392064911388:web:c794c6a353c21582c3b7d9",
  measurementId: "G-QPMJY6CS92"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const messagesRef = database.ref('messages');

document.addEventListener('DOMContentLoaded', () => {
  // ---- Register Service Worker for PWA ----
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => { });
  }

  // ---- State ----
  let currentScreen = 'splash';
  let currentDatePill = 0;
  let currentFilter = 'all';
  let chatUserName = localStorage.getItem('vgf_chat_name') || '';

  // ---- DOM References ----
  const screens = {
    splash: document.getElementById('splash-screen'),
    home: document.getElementById('home-screen'),
    timeline: document.getElementById('timeline-screen'),
    people: document.getElementById('people-screen'),
    help: document.getElementById('help-screen'),
    chat: document.getElementById('chat-screen')
  };

  const navItems = document.querySelectorAll('.nav-item');
  const bottomNav = document.getElementById('bottom-nav');

  // ---- Splash Screen Logic ----
  function runSplash() {
    bottomNav.style.display = 'none';
    const enterBtn = document.getElementById('splash-enter-btn');
    if (enterBtn) {
      enterBtn.addEventListener('click', () => {
        navigateTo('home');
      });
    }
  }

  // ---- Navigation Logic ----
  function navigateTo(screenName) {
    // Hide current screen
    Object.values(screens).forEach(s => {
      s.classList.remove('active', 'splash-active');
    });

    // Show target screen
    const target = screens[screenName];
    if (target) {
      target.classList.add('active');
      if (screenName === 'splash') {
        target.classList.add('splash-active');
      }
    }

    // Update bottom nav visibility
    if (screenName === 'splash') {
      bottomNav.style.display = 'none';
    } else {
      bottomNav.style.display = 'flex';
    }

    // Update nav active states
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.dataset.screen === screenName) {
        item.classList.add('active');
      }
    });

    currentScreen = screenName;

    // Trigger entrance animations
    triggerAnimations(screenName);

    // Scroll chat to bottom when navigating to chat
    if (screenName === 'chat') {
      scrollChatToBottom();
    }
  }

  function triggerAnimations(screenName) {
    const screen = screens[screenName];
    if (!screen) return;

    const animElements = screen.querySelectorAll('.animate-fade-in, .animate-slide-up');
    animElements.forEach(el => {
      el.style.animationPlayState = 'running';
    });
  }

  // ---- Bottom Nav Click Handlers ----
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const screen = item.dataset.screen;
      if (screen && screen !== currentScreen) {
        navigateTo(screen);
      }
    });
  });

  // ---- CTA Buttons on Home ----
  document.querySelectorAll('.cta-button').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateTo('timeline');
    });
  });

  // ---- Schedule Tabs (Offsite / Onsite) ----
  const scheduleTabs = document.querySelectorAll('.schedule-tab');
  const offsiteDates = document.getElementById('offsite-dates');
  const onsiteDates = document.getElementById('onsite-dates');
  const scheduleDays = document.querySelectorAll('.schedule-day');

  function showScheduleDay(dateId) {
    scheduleDays.forEach(day => {
      day.style.display = (day.dataset.scheduleDate === dateId) ? 'block' : 'none';
    });
  }

  scheduleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      scheduleTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const schedule = tab.dataset.schedule;
      if (schedule === 'offsite') {
        offsiteDates.style.display = 'flex';
        onsiteDates.style.display = 'none';
        const firstPill = offsiteDates.querySelector('.date-pill');
        offsiteDates.querySelectorAll('.date-pill').forEach(p => p.classList.remove('active'));
        if (firstPill) { firstPill.classList.add('active'); showScheduleDay(firstPill.dataset.date); }
      } else {
        offsiteDates.style.display = 'none';
        onsiteDates.style.display = 'flex';
        const firstPill = onsiteDates.querySelector('.date-pill');
        onsiteDates.querySelectorAll('.date-pill').forEach(p => p.classList.remove('active'));
        if (firstPill) { firstPill.classList.add('active'); showScheduleDay(firstPill.dataset.date); }
      }
    });
  });

  // ---- Date Pills on Schedule ----
  document.querySelectorAll('.date-pills').forEach(container => {
    const pills = container.querySelectorAll('.date-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        showScheduleDay(pill.dataset.date);
      });
    });
  });

  // ---- People Search ----
  const searchInput = document.getElementById('people-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const cards = document.querySelectorAll('.person-card');
      cards.forEach(card => {
        const name = card.querySelector('.person-name').textContent.toLowerCase();
        const role = card.querySelector('.person-role').textContent.toLowerCase();
        if (name.includes(query) || role.includes(query)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // ---- "See All" and Feature Card clicks ----
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('click', () => {
      navigateTo('timeline');
    });
  });

  const seeAllBtn = document.querySelector('.see-all');
  if (seeAllBtn) {
    seeAllBtn.addEventListener('click', () => {
      navigateTo('timeline');
    });
  }

  // ---- RSVP Button Toast ----
  document.querySelectorAll('.rsvp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const originalText = btn.textContent;
      if (btn.textContent.trim() === 'Rsvp Now') {
        btn.textContent = '✓ Rsvp Confirmed';
        btn.classList.remove('primary');
        btn.classList.add('secondary');
        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('secondary');
          btn.classList.add('primary');
        }, 2000);
      }
    });
  });

  // ============================================
  // CHAT FEATURE — Firebase Realtime Database
  // ============================================

  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatNameOverlay = document.getElementById('chat-name-overlay');
  const chatNameInput = document.getElementById('chat-name-input');
  const chatNameSubmit = document.getElementById('chat-name-submit');

  // ---- Chat Name Setup ----
  function initChatName() {
    if (chatUserName) {
      chatNameOverlay.classList.add('hidden');
    } else {
      chatNameOverlay.classList.remove('hidden');
    }
  }

  chatNameSubmit.addEventListener('click', () => {
    const name = chatNameInput.value.trim();
    if (name.length > 0) {
      chatUserName = name;
      localStorage.setItem('vgf_chat_name', name);
      chatNameOverlay.classList.add('hidden');
      chatInput.focus();
    }
  });

  chatNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      chatNameSubmit.click();
    }
  });

  // ---- Send Message ----
  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || !chatUserName) return;

    const message = {
      sender: chatUserName,
      text: text,
      timestamp: Date.now()
    };

    messagesRef.push(message);
    chatInput.value = '';
    chatInput.focus();
  }

  chatSendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // ---- Format Time ----
  function formatTime(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function formatDate(ts) {
    const d = new Date(ts);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // ---- Scroll to Bottom ----
  function scrollChatToBottom() {
    setTimeout(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 50);
  }

  // ---- Render Messages from Firebase ----
  let lastMessageDate = '';

  messagesRef.orderByChild('timestamp').limitToLast(200).on('child_added', (snapshot) => {
    const msg = snapshot.val();
    if (!msg || !msg.text || !msg.sender) return;

    const isSent = msg.sender === chatUserName;
    const msgDate = formatDate(msg.timestamp);

    // Add date separator if needed
    if (msgDate !== lastMessageDate) {
      const dateSep = document.createElement('div');
      dateSep.className = 'chat-date-sep';
      dateSep.innerHTML = `<span>${msgDate}</span>`;
      chatMessages.appendChild(dateSep);
      lastMessageDate = msgDate;
    }

    const msgEl = document.createElement('div');
    msgEl.className = `chat-msg ${isSent ? 'sent' : 'received'}`;

    let senderHtml = `<span class="chat-msg-sender">${escapeHtml(msg.sender)}</span>`;

    msgEl.innerHTML = `
      ${senderHtml}
      <div class="chat-msg-bubble">${escapeHtml(msg.text)}</div>
      <span class="chat-msg-time">${formatTime(msg.timestamp)}</span>
    `;

    chatMessages.appendChild(msgEl);
    scrollChatToBottom();
  });

  // ---- HTML Escape ----
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ---- Initialize Chat ----
  initChatName();

  // ---- Start the App ----
  runSplash();
});
