/* Virat Digital — site behaviour
   - theme toggle (follows the device until the visitor picks; the choice is remembered)
   - sticky header state
   - mobile navigation
   - current section highlighted in the nav
   - process steps: rail fill and active steps
   - service links preselect the contact form's service
   - contact form validation (front-end only; no backend wired up)
   - footer year
*/
(function () {
  'use strict';

  var root = document.documentElement;
  var THEME_KEY = 'vd-theme';                                      // same key as the <head> script
  var THEME_COLORS = { dark: '#0e0f28', light: '#f5f5f9' };       // --ink-950, --ink-50
  var lightQuery = window.matchMedia('(prefers-color-scheme: light)');
  var desktopQuery = window.matchMedia('(min-width: 64em)');     // lg breakpoint in tokens.css

  /* ---- Theme ---- */
  var themeToggle = document.getElementById('themeToggle');

  function savedTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }

  function applyTheme(theme) {
    // Switch without transitions so text and backgrounds change together.
    root.classList.add('theme-switching');
    root.setAttribute('data-theme', theme);
    void root.offsetWidth;
    requestAnimationFrame(function () { root.classList.remove('theme-switching'); });

    document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
      meta.setAttribute('content', THEME_COLORS[theme]);
    });
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    }
  }

  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      applyTheme(next);
    });
  }

  // Keep following the device setting until the visitor picks a theme.
  lightQuery.addEventListener('change', function (e) {
    if (!savedTheme()) applyTheme(e.matches ? 'light' : 'dark');
  });

  /* ---- Sticky header state ---- */
  var header = document.getElementById('siteHeader');
  function updateHeader() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }

  /* ---- Process steps ---- */
  var steps = document.getElementById('processSteps');
  var stepItems = steps ? Array.prototype.slice.call(steps.querySelectorAll('.step')) : [];

  function updateProcess() {
    if (!steps) return;
    var line = window.innerHeight * 0.55;
    var rect = steps.getBoundingClientRect();
    var progress = Math.max(0, Math.min(1, (line - rect.top) / rect.height));
    steps.style.setProperty('--steps-progress', progress.toFixed(3));
    stepItems.forEach(function (step) {
      step.classList.toggle('is-active', step.getBoundingClientRect().top < line);
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateHeader();
      updateProcess();
      ticking = false;
    });
  }, { passive: true });
  window.addEventListener('resize', updateProcess);
  updateHeader();
  updateProcess();

  /* ---- Mobile navigation ---- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');

  function setMenu(open, returnFocus) {
    if (!nav || !toggle) return;
    var wasOpen = nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    if (header) header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open && wasOpen && returnFocus) toggle.focus();
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(!nav.classList.contains('is-open'), false);
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false, false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) setMenu(false, true);
    });

    // Close the panel if keyboard focus moves past it into the page.
    document.addEventListener('focusin', function (e) {
      if (nav.classList.contains('is-open') && header && !header.contains(e.target)) setMenu(false, false);
    });

    // Reset the mobile menu if the viewport grows to desktop.
    desktopQuery.addEventListener('change', function (e) {
      if (e.matches) setMenu(false, false);
    });
  }

  /* ---- Current section in the nav ---- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var linkFor = {};
  navLinks.forEach(function (link) { linkFor[link.getAttribute('href').slice(1)] = link; });

  if ('IntersectionObserver' in window && navLinks.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) { link.removeAttribute('aria-current'); });
        var link = linkFor[entry.target.id];
        if (link) link.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* ---- Contact form ---- */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  var serviceSelect = document.getElementById('service');

  // "Start a design project" etc. open the form with that service selected.
  document.querySelectorAll('[data-service]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (serviceSelect) serviceSelect.value = link.getAttribute('data-service');
    });
  });

  function setError(input, message) {
    var field = input.closest('.field');
    var slot = field && field.querySelector('.field-error');
    if (field) field.classList.toggle('has-error', Boolean(message));
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
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
        var firstBad = form.querySelector('[aria-invalid="true"]');
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
