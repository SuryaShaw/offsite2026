/* ============================================
   VINE GARDEN FILMS - Event App 2026
   Application Logic
   ============================================ */



document.addEventListener('DOMContentLoaded', () => {
  // ---- Register Service Worker for PWA ----
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => { });
  }

  // ---- State ----
  let currentScreen = 'splash';
  let currentDatePill = 0;
  let currentFilter = 'all';


  // ---- DOM References ----
  const screens = {
    splash: document.getElementById('splash-screen'),
    home: document.getElementById('home-screen'),
    timeline: document.getElementById('timeline-screen'),
    people: document.getElementById('people-screen'),
    help: document.getElementById('help-screen'),

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



  // ---- Start the App ----
  runSplash();
});
