(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  /* ── 3D page loader ────────────────────────────────────────────────────── */
  const loader = document.getElementById('page-loader');
  if (loader) {
    const hideLoader = () => {
      loader.classList.add('loader-done');
      setTimeout(() => loader.remove(), 700);
    };
    if (document.readyState === 'complete') {
      setTimeout(hideLoader, 500);
    } else {
      window.addEventListener('load', () => setTimeout(hideLoader, 500));
    }
    setTimeout(hideLoader, 2500);
  }

  /* ── Cursor glow (desktop only) ────────────────────────────────────────── */
  const glow = document.getElementById('cursor-glow');
  if (glow && !isTouchDevice) {
    let gx = window.innerWidth / 2, gy = window.innerHeight / 2;
    let cx = gx, cy = gy;
    window.addEventListener('mousemove', (e) => { gx = e.clientX; gy = e.clientY; }, { passive: true });
    function loop() {
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      glow.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    }
    loop();
  } else if (glow) {
    glow.style.display = 'none';
  }

  /* ── Scroll-driven parallax depth on the hero background ─────────────────
     Only active while #hero is actually in view, and clamped so it can never
     drift the layers far enough to look "misplaced". No rotateX here — a
     rotate without a real perspective ancestor just skews the pattern, which
     is what caused the warped/misaligned look on scroll. ────────────────── */
  const heroSection = document.getElementById('hero');
  if (!prefersReducedMotion && heroSection) {
    const heroBg = document.querySelector('.hero-bg');
    const heroLines = document.querySelector('.hero-grid-lines');
    let heroInView = true;
    let ticking = false;

    function applyParallax() {
      if (!heroInView) return;
      const rect = heroSection.getBoundingClientRect();
      const offset = Math.max(0, Math.min(-rect.top, rect.height));
      const bgShift = offset * 0.12;
      const lineShift = offset * 0.06;
      if (heroBg) heroBg.style.transform = `translate3d(0, ${bgShift}px, 0)`;
      if (heroLines) heroLines.style.transform = `translate3d(0, ${lineShift}px, 0)`;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        applyParallax();
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    const heroIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        heroInView = entry.isIntersecting;
        if (heroInView) applyParallax();
      });
    }, { threshold: 0 });
    heroIO.observe(heroSection);

    applyParallax();
  }

  /* ── Magnetic buttons ──────────────────────────────────────────────────── */
  if (!isTouchDevice) {
    document.querySelectorAll('.btn, .social-btn').forEach((btn) => {
      btn.style.transition = 'transform .3s cubic-bezier(.16,1,.3,1)';
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        btn.style.transition = 'transform .05s linear';
        btn.style.transform = `translate3d(${relX * 0.18}px, ${relY * 0.28}px, 0)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform .3s cubic-bezier(.16,1,.3,1)';
        btn.style.transform = 'translate3d(0,0,0)';
      });
    });
  }

  /* ── 3D tilt on cards ──────────────────────────────────────────────────
     Key fix: no CSS transition is applied while the mouse is actively
     moving over the card (that fight between transition + rapid transform
     updates was the "laggy / not working" feel). Transition only kicks in
     on mouseleave, for a smooth snap-back. Updates are also throttled to
     one per animation frame instead of one per mousemove event. ──────── */
  const tiltEls = document.querySelectorAll(
    '.hero-card, .project-card, .cert-card, .achieve-card, .skill-cat, .exp-card, .edu-card'
  );
  if (!isTouchDevice) {
    tiltEls.forEach((el) => {
      el.style.transformStyle = 'preserve-3d';
      el.style.willChange = 'transform';
      el.style.transition = 'transform .4s cubic-bezier(.16,1,.3,1), border-color .2s';

      let glare = el.querySelector('.tilt-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'tilt-glare';
        el.appendChild(glare);
      }

      let raf = null;
      let pendingX = 0.5, pendingY = 0.5;

      function render() {
        raf = null;
        const rotateY = (pendingX - 0.5) * 10;
        const rotateX = (0.5 - pendingY) * 10;
        el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px) scale(1.012)`;
        glare.style.background = `radial-gradient(circle at ${pendingX * 100}% ${pendingY * 100}%, rgba(255,255,255,0.10), transparent 55%)`;
      }

      el.addEventListener('mouseenter', () => {
        el.style.transition = 'border-color .2s';
      });

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        pendingX = (e.clientX - rect.left) / rect.width;
        pendingY = (e.clientY - rect.top) / rect.height;
        if (!raf) raf = requestAnimationFrame(render);
      });

      el.addEventListener('mouseleave', () => {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        el.style.transition = 'transform .4s cubic-bezier(.16,1,.3,1), border-color .2s';
        el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
        glare.style.background = 'transparent';
      });
    });
  }
})();
