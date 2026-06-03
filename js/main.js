// ─── NAVBAR SCROLL ───
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 50);
});

// ─── HAMBURGER (custom toggle fallback) ───
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = navLinks.classList.contains('open') ? 'rotate(45deg) translate(5px,5px)' : '';
  spans[1].style.opacity   = navLinks.classList.contains('open') ? '0' : '1';
  spans[2].style.transform = navLinks.classList.contains('open') ? 'rotate(-45deg) translate(5px,-5px)' : '';
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks?.classList.remove('open'));
});

// ─── SCROLL REVEAL ───
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

// ─── COUNTER ANIMATION ───
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current) + (el.dataset.suffix || '');
  }, 16);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

// ─── ACTIVE NAV LINK ───
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});

// ─── CHAR COUNTER ───
const msgField = document.getElementById('message');
const charCount = document.getElementById('charCount');
msgField?.addEventListener('input', () => {
  if (charCount) charCount.textContent = msgField.value.length + ' / 1000';
});

// ─── FORM VALIDATION + FORMSPREE AJAX SUBMISSION ───
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', async function (e) {
  e.preventDefault();

  // Clear previous errors
  let valid = true;
  this.querySelectorAll('[required]').forEach(f => {
    f.style.borderColor = '';
    const err = document.getElementById(f.id + '-err');
    if (err) err.style.display = 'none';
  });

  // Validate required fields
  this.querySelectorAll('[required]').forEach(f => {
    if (!f.value.trim()) {
      f.style.borderColor = '#ff6584';
      const err = document.getElementById(f.id + '-err');
      if (err) err.style.display = 'flex';
      valid = false;
    }
  });

  // Validate email format
  const emailField = document.getElementById('email');
  if (emailField && emailField.value.trim()) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.style.borderColor = '#ff6584';
      const emailErr = document.getElementById('email-err');
      if (emailErr) emailErr.style.display = 'flex';
      valid = false;
    }
  }

  if (!valid) return;

  // Loading state
  const btn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  if (btn) { btn.disabled = true; btn.style.opacity = '0.75'; }
  if (btnText) btnText.textContent = 'Sending...';

  // Submit to Formspree via fetch (AJAX — stays on page)
  try {
    const res = await fetch(this.action, {
      method: 'POST',
      body: new FormData(this),
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      // Show success card, hide form
      this.style.display = 'none';
      const successCard = document.getElementById('successCard');
      if (successCard) {
        successCard.style.display  = 'flex';
        successCard.style.flexDirection = 'column';
        successCard.style.alignItems    = 'center';
        successCard.style.textAlign     = 'center';
      }
    } else {
      const data = await res.json().catch(() => ({}));
      const msg = (data.errors || []).map(err => err.message).join(', ') || 'Something went wrong. Please try again.';
      alert('Error: ' + msg);
      if (btn)     { btn.disabled = false; btn.style.opacity = ''; }
      if (btnText) btnText.textContent = 'Send Message';
    }
  } catch {
    alert('Network error. Please check your connection and try again.');
    if (btn)     { btn.disabled = false; btn.style.opacity = ''; }
    if (btnText) btnText.textContent = 'Send Message';
  }
});

// ─── RESET FORM (Send Another Message button) ───
function resetForm() {
  const form        = document.getElementById('contactForm');
  const successCard = document.getElementById('successCard');
  const btn         = document.getElementById('submitBtn');
  const btnText     = document.getElementById('btnText');
  if (form)        { form.reset(); form.style.display = ''; }
  if (successCard) successCard.style.display = 'none';
  if (btn)         { btn.disabled = false; btn.style.opacity = ''; }
  if (btnText)     btnText.textContent = 'Send Message';
  if (charCount)   charCount.textContent = '0 / 1000';
}

// ─── SMOOTH SCROLL FOR ANCHOR LINKS ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
