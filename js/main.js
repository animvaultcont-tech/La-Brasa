/* ============================================
   LA BRASA — main.js
   All interactive functionality
============================================ */

'use strict';

/* ============================================
   1. PRELOADER
============================================ */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('hidden');
    // Trigger initial reveals after preloader hides
    document.querySelectorAll('.reveal').forEach(el => {
      if (isInViewport(el)) el.classList.add('visible');
    });
  }, 1900);
});

/* ============================================
   2. CUSTOM CURSOR
============================================ */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

if (cursor && follower) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '0.6';
  });
}

/* ============================================
   3. NAVBAR — scroll behaviour
============================================ */
const navbar = document.getElementById('navbar');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Add scrolled class
  if (scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Hide / show navbar on scroll direction
  if (scrollY > lastScrollY && scrollY > 200) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  lastScrollY = scrollY;
}, { passive: true });

navbar.style.transition = 'transform 0.4s ease, background 0.4s ease, padding 0.4s ease, backdrop-filter 0.4s ease, border-bottom 0.4s ease';

/* ============================================
   4. MOBILE MENU
============================================ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ============================================
   5. SMOOTH SCROLL — nav links
============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================
   6. SCROLL REVEAL
============================================ */
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.88;
}

function revealOnScroll() {
  document.querySelectorAll('.reveal').forEach((el, i) => {
    if (isInViewport(el)) {
      // Stagger siblings
      const siblings = el.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach((sib, idx) => {
        if (sib === el) delay = idx * 80;
      });
      setTimeout(() => el.classList.add('visible'), delay);
    }
  });
}

window.addEventListener('scroll', revealOnScroll, { passive: true });
revealOnScroll(); // run once on load

/* ============================================
   7. MENU TABS
============================================ */
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    const targetContent = document.getElementById('tab-' + target);
    if (targetContent) {
      targetContent.classList.add('active');
      // Trigger reveals in new tab
      setTimeout(() => {
        targetContent.querySelectorAll('.reveal').forEach(el => {
          el.classList.add('visible');
        });
      }, 50);
    }
  });
});

/* ============================================
   8. TESTIMONIAL SLIDER
============================================ */
const track = document.getElementById('testimonialTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('sliderDots');

if (track) {
  const cards = track.querySelectorAll('.testimonial-card');
  const isMobile = () => window.innerWidth < 768;
  let current = 0;
  const total = cards.length;
  const visibleCount = () => isMobile() ? 1 : 2;

  // Build dots
  const buildDots = () => {
    dotsContainer.innerHTML = '';
    const count = total - visibleCount() + 1;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  };

  const updateDots = () => {
    document.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  };

  const goTo = (index) => {
    const maxIndex = total - visibleCount();
    current = Math.max(0, Math.min(index, maxIndex));
    const cardWidth = cards[0].offsetWidth + 32; // gap 2rem = 32px
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    updateDots();
  };

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  buildDots();

  // Auto slide
  let autoSlide = setInterval(() => {
    const maxIndex = total - visibleCount();
    goTo(current < maxIndex ? current + 1 : 0);
  }, 5000);

  // Pause on hover
  track.closest('.testimonial-slider').addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.closest('.testimonial-slider').addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => {
      const maxIndex = total - visibleCount();
      goTo(current < maxIndex ? current + 1 : 0);
    }, 5000);
  });

  window.addEventListener('resize', () => {
    buildDots();
    goTo(0);
  });
}

/* ============================================
   9. RESERVATION FORM
============================================ */
const form = document.getElementById('reservationForm');
const successMsg = document.getElementById('form-success');

// Set minimum date to today
const dateInput = document.getElementById('rdate');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('fname').value.trim();
    const email = document.getElementById('email').value.trim();
    const date = document.getElementById('rdate').value;
    const guests = document.getElementById('guests').value;
    const time = document.getElementById('rtime').value;

    // Basic validation
    if (!name || !email || !date || !guests || !time) {
      shakeForm();
      highlightEmpty([
        { el: document.getElementById('fname'), val: name },
        { el: document.getElementById('email'), val: email },
        { el: document.getElementById('rdate'), val: date },
        { el: document.getElementById('guests'), val: guests },
        { el: document.getElementById('rtime'), val: time },
      ]);
      return;
    }

    if (!isValidEmail(email)) {
      document.getElementById('email').style.borderColor = '#c94c4c';
      document.getElementById('email').focus();
      return;
    }

    // Simulate submission
    const btn = form.querySelector('.btn-submit');
    btn.innerHTML = '<span>Sending...</span>';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      btn.innerHTML = '<span>Confirm Reservation</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
      btn.style.opacity = '1';
      btn.disabled = false;
      successMsg.style.display = 'block';
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      setTimeout(() => {
        successMsg.style.display = 'none';
      }, 6000);
    }, 1400);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function highlightEmpty(fields) {
  fields.forEach(({ el, val }) => {
    if (!val) {
      el.style.borderColor = '#c94c4c';
      el.addEventListener('input', () => { el.style.borderColor = ''; }, { once: true });
    }
  });
}

function shakeForm() {
  const inner = document.querySelector('.reservation-form');
  inner.style.animation = 'shake 0.4s ease';
  setTimeout(() => inner.style.animation = '', 400);
}

// Add shake animation to stylesheet dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-6px); }
    80% { transform: translateX(6px); }
  }
`;
document.head.appendChild(shakeStyle);

/* ============================================
   10. GALLERY — hover text overlay
============================================ */
const galleryItems = document.querySelectorAll('.gallery-item');
const galleryLabels = [
  'Wood-Fired Ribeye', 'Garden Fresh', 'Curated Wines',
  'Chocolate Fondant', 'Seared Sea Bass', 'Specialty Coffee'
];

galleryItems.forEach((item, i) => {
  const label = document.createElement('div');
  label.className = 'gallery-label';
  label.textContent = galleryLabels[i] || '';
  label.style.cssText = `
    position: absolute; bottom: 1.25rem; left: 1.25rem; z-index: 3;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem; font-style: italic;
    color: rgba(255,255,255,0.85);
    opacity: 0; transform: translateY(8px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    pointer-events: none;
    text-shadow: 0 2px 8px rgba(0,0,0,0.6);
  `;
  item.appendChild(label);

  item.addEventListener('mouseenter', () => {
    label.style.opacity = '1';
    label.style.transform = 'translateY(0)';
  });
  item.addEventListener('mouseleave', () => {
    label.style.opacity = '0';
    label.style.transform = 'translateY(8px)';
  });
});

/* ============================================
   11. ACTIVE NAV LINK — on scroll
============================================ */
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

const observerOptions = {
  rootMargin: '-40% 0px -40% 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinksAll.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = 'var(--gold)';
        }
      });
    }
  });
}, observerOptions);

sections.forEach(s => observer.observe(s));

/* ============================================
   12. PARALLAX — hero subtle
============================================ */
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
    }
  }, { passive: true });
}

/* ============================================
   13. NUMBER COUNTER — hero stats
============================================ */
function animateCount(el, end, suffix = '') {
  let start = 0;
  const duration = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * end) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = end + suffix;
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statEls = entry.target.querySelectorAll('.stat strong');
      statEls.forEach(el => {
        const text = el.textContent;
        const num = parseInt(text);
        const suffix = text.replace(num, '');
        if (!isNaN(num)) animateCount(el, num, suffix);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);
