/* ── Contact form typing effect ────────────────────────────────────────────
   Adds, per field: a blinking terminal-style cursor next to the label while
   focused, a pulsing cyan glow on the border while actively typing, and a
   scanning light sweep underneath. All feedback is transient — it settles
   back to the normal focus state ~500ms after the last keystroke. ────────── */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = form.querySelectorAll('.form-group input, .form-group textarea');

  fields.forEach((field) => {
    const group = field.closest('.form-group');
    if (!group) return;

    // Blinking cursor after the label text
    const label = group.querySelector('label');
    if (label && !label.querySelector('.label-cursor')) {
      const cursor = document.createElement('span');
      cursor.className = 'label-cursor';
      cursor.setAttribute('aria-hidden', 'true');
      label.appendChild(cursor);
    }

    // Wrap the field so we can position a scan-bar under it
    let wrap = field.parentElement;
    if (!wrap.classList.contains('field-wrap')) {
      wrap = document.createElement('div');
      wrap.className = 'field-wrap';
      field.parentNode.insertBefore(wrap, field);
      wrap.appendChild(field);
      const bar = document.createElement('span');
      bar.className = 'scan-bar';
      bar.setAttribute('aria-hidden', 'true');
      wrap.appendChild(bar);
    }

    let typingTimeout;

    field.addEventListener('focus', () => group.classList.add('field-focused'));

    field.addEventListener('blur', () => {
      group.classList.remove('field-focused');
      field.classList.remove('is-typing');
      wrap.classList.remove('is-typing');
      clearTimeout(typingTimeout);
    });

    field.addEventListener('input', () => {
      field.classList.add('is-typing');
      wrap.classList.add('is-typing');
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        field.classList.remove('is-typing');
        wrap.classList.remove('is-typing');
      }, 500);
    });
  });
})();
