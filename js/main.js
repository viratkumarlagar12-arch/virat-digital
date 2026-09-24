/* Virat Digital — site behaviour
   - scroll progress bar
   - sticky header state
   - animated mobile nav
   - scroll-reveal animations (staggered)
   - process timeline scroll-fill + active step
   - hero visual pointer parallax
   - contact form validation (front-end only; no backend wired up)
   - footer year
*/
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Scroll progress bar ---- */
  var progress = document.getElementById('scrollProgress');
  function updateProgress() {
    if (!progress) return;
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight - doc.clientHeight;
    var pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
    progress.style.width = pct + '%';
  }

  /* ---- Sticky header state ---- */
  var header = document.getElementById('siteHeader');
  function updateHeader() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateProgress();
      updateHeader();
      updateProcessFill();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  updateProgress();
  updateHeader();

  /* ---- Mobile navigation ---- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');

  function closeNav(returnFocus) {
    if (!nav || !toggle) return;
    var wasOpen = nav.classList.contains('is-open');
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (returnFocus && wasOpen) toggle.focus();
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav(true);
    });

    // Reset mobile menu state if the viewport grows back to desktop.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) closeNav(false);
    });
  }

  /* ---- Scroll-reveal (staggered) ---- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  // Stagger elements that share a parent container.
  var groups = new Map();
  revealEls.forEach(function (el) {
    var parent = el.parentElement;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(el);
  });
  groups.forEach(function (els) {
    els.forEach(function (el, i) {
      el.style.transitionDelay = reduceMotion ? '0ms' : Math.min(i * 90, 360) + 'ms';
    });
  });

  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---- Process timeline ---- */
  var track = document.getElementById('processTrack');
  var fill = document.getElementById('processFill');
  var steps = Array.prototype.slice.call(document.querySelectorAll('[data-step]'));

  function updateProcessFill() {
    if (!track || !fill) return;
    var rect = track.getBoundingClientRect();
    var viewportCenter = window.innerHeight * 0.55;
    var progressed = viewportCenter - rect.top;
    var pct = Math.max(0, Math.min(100, (progressed / rect.height) * 100));
    fill.style.height = pct + '%';
  }
  updateProcessFill();

  if (steps.length && 'IntersectionObserver' in window) {
    var stepObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          entry.target.classList.toggle('is-active', entry.isIntersecting);
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );
    steps.forEach(function (step) { stepObserver.observe(step); });
  }

  /* ---- Hero visual pointer parallax (desktop only) ---- */
  var heroVisual = document.getElementById('heroVisual');
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (heroVisual && canHover && !reduceMotion) {
    heroVisual.addEventListener('mousemove', function (e) {
      var rect = heroVisual.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      heroVisual.style.transform =
        'rotateY(' + (x * 8) + 'deg) rotateX(' + (y * -8) + 'deg)';
    });
    heroVisual.addEventListener('mouseleave', function () {
      heroVisual.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }

  /* ---- Service card glow follows cursor ---- */
  if (canHover) {
    document.querySelectorAll('.service-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width) * 100 + '%');
        card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height) * 100 + '%');
      });
    });
  }

  /* ---- Contact form ---- */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');

  function setError(input, message) {
    var field = input.closest('.field');
    var slot = field && field.querySelector('.error');
    field.classList.toggle('has-error', Boolean(message));
    if (slot) slot.textContent = message || '';
    return !message;
  }

  function validate() {
    var ok = true;
    var name = form.elements.name;
    var email = form.elements.email;
    var message = form.elements.message;

    ok = setError(name, name.value.trim() ? '' : 'Please enter your name.') && ok;
    ok = setError(
      email,
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()) ? '' : 'Please enter a valid email address.'
    ) && ok;
    ok = setError(message, message.value.trim().length >= 10 ? '' : 'Tell me a little more (10+ characters).') && ok;

    return ok;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (note) note.textContent = '';

      if (!validate()) {
        var firstBad = form.querySelector('.has-error input, .has-error textarea');
        if (firstBad) firstBad.focus();
        return;
      }

      // Front-end only for now — connect this to a real endpoint (e.g. Formspree,
      // a serverless function, or your own API) before going live. Until then, be
      // honest with the visitor: nothing has actually been sent anywhere yet.
      form.reset();
      if (note) note.textContent = 'Details captured — please also send them via email or WhatsApp until this form is connected.';
    });

    form.addEventListener('input', function (e) {
      var field = e.target.closest('.field');
      if (field && field.classList.contains('has-error')) setError(e.target, '');
    });
  }

  /* ---- Footer year ---- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
