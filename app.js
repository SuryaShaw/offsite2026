/* ============================================
   VINE GARDEN FILMS - Event App 2026
   Application Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
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
    help: document.getElementById('help-screen')
  };

  const navItems = document.querySelectorAll('.nav-item');
  const bottomNav = document.getElementById('bottom-nav');
  const progressFill = document.getElementById('progress-fill');
  const progressPercent = document.getElementById('progress-percent');

  // ---- Splash Screen Logic ----
  function runSplash() {
    bottomNav.style.display = 'none';
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      if (progress > 100) progress = 100;
      progressFill.style.width = progress + '%';
      progressPercent.textContent = progress + '%';

      if (progress >= 100) {
        clearInterval(interval);
        // Wait a moment then transition
        setTimeout(() => {
          navigateTo('home');
        }, 500);
      }
    }, 30);
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

  // ---- Date Pills on Timeline ----
  const datePills = document.querySelectorAll('.date-pill');
  datePills.forEach((pill, index) => {
    pill.addEventListener('click', () => {
      datePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentDatePill = index;
    });
  });

  // ---- Filter Pills on People ----
  const filterPills = document.querySelectorAll('.filter-pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.dataset.filter;
      filterPeople(currentFilter);
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

  // ---- Filter People by Category ----
  function filterPeople(category) {
    const cards = document.querySelectorAll('.person-card');
    cards.forEach(card => {
      if (category === 'all') {
        card.style.display = 'flex';
      } else {
        const cardCategory = card.dataset.category;
        card.style.display = (cardCategory === category) ? 'flex' : 'none';
      }
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
      if (btn.textContent.trim() === 'RSVP NOW') {
        btn.textContent = '✓ RSVP CONFIRMED';
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
