/* ── Animated number counters ─────────────────────────────────────────────── */
function animateCount(el, endText, duration = 1200) {
  const match = endText.match(/^(\d+(?:\.\d+)?)/);
  if (!match) return; // non-numeric label (e.g. "AZ") — leave as-is
  const end = parseFloat(match[1]);
  const suffix = endText.slice(match[1].length);
  const isFloat = match[1].includes('.');
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    const value = end * eased;
    el.textContent = (isFloat ? value.toFixed(1) : Math.round(value)) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterEls = document.querySelectorAll('.stat-val, .cgpa-val');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      animateCount(entry.target, entry.target.textContent.trim());
    }
  });
}, { threshold: 0.5 });
counterEls.forEach((el) => counterObserver.observe(el));


/* ── Scroll fade-in ─────────────────────────────────────────────────────────── */
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1 }
);
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));


/* ── Mobile nav toggle ──────────────────────────────────────────────────────── */
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));


/* ── Active nav highlight on scroll ────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 80) current = s.id; });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent2)' : '';
  });
}, { passive: true });


/* ── Contact Form ───────────────────────────────────────────────────────────── */
const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText   = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const formMsg   = document.getElementById('formMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Loading state
  submitBtn.disabled = true;
  btnText.style.display  = 'none';
  btnLoader.style.display = 'inline';
  formMsg.style.display  = 'none';

  const payload = {
    name:    document.getElementById('name').value,
    email:   document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value,
  };

  try {
    const res  = await fetch('/send-message', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    const data = await res.json();

    formMsg.style.display = 'block';
    if (data.success) {
      formMsg.className = 'form-feedback success';
      formMsg.textContent = '✓ ' + data.message;
      form.reset();
    } else {
      formMsg.className = 'form-feedback error';
      formMsg.textContent = '✗ ' + (data.error || 'Something went wrong.');
    }
  } catch {
    formMsg.style.display = 'block';
    formMsg.className = 'form-feedback error';
    formMsg.textContent = '✗ Network error. Please email me directly.';
  } finally {
    submitBtn.disabled = false;
    btnText.style.display  = 'inline';
    btnLoader.style.display = 'none';
  }
});
