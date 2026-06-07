document.addEventListener('DOMContentLoaded', () => {

  const preloader = document.getElementById('preloader');
  if (preloader) {
    const dismiss = () => preloader.classList.add('done');
    window.addEventListener('load', () => setTimeout(dismiss, 1300));
    setTimeout(dismiss, 2600);
  }

  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  const burger   = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  let backdrop = null;
  let navLinksOriginalParent = navLinks ? navLinks.parentNode : null;
  let navLinksNextSibling    = navLinks ? navLinks.nextSibling : null;

  const closeMenu = () => {
    burger  && burger.classList.remove('open');
    if (navLinks) {
      navLinks.classList.remove('open');
      // Move navLinks back into nav if it was moved to body
      if (navLinks.parentNode === document.body && navLinksOriginalParent) {
        navLinksOriginalParent.insertBefore(navLinks, navLinksNextSibling);
      }
    }
    document.body.style.overflow = '';
    if (backdrop && backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
      backdrop = null;
    }
  };

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('open');
      if (!isOpen) {
        burger.classList.add('open');
        document.body.appendChild(navLinks);
        navLinks.classList.add('open');
        document.body.style.overflow = 'hidden';
        backdrop = document.createElement('div');
        backdrop.className = 'nav-backdrop';
        backdrop.addEventListener('click', closeMenu);
        document.body.insertBefore(backdrop, navLinks);
      } else {
        closeMenu();
      }
    });

    navLinks.querySelectorAll('.nl').forEach(l => {
      l.addEventListener('click', (e) => {
        const href = l.getAttribute('href');
        e.preventDefault();
        closeMenu();
        if (href) {
          document.body.style.opacity = '0';
          setTimeout(() => { window.location.href = href; }, 300);
        }
      });
    });
  }

  const revealEls = document.querySelectorAll('.reveal-up, .reveal-right, .reveal-fade');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach(el => observer.observe(el));

  const autoRevealSelectors = [
    '.wp', '.lls-card', '.llb-card', '.tic-card', '.tr-item',
    '.add-card', '.ps-step', '.svg-card', '.path-card',
    '.sd-header', '.sd-description', '.sd-includes',
    '.hstat', '.stefan-card', '.wv-map-card'
  ];

  document.querySelectorAll(autoRevealSelectors.join(', ')).forEach((el, i) => {
    if (!el.classList.contains('reveal-up') && !el.classList.contains('reveal-right') && !el.classList.contains('reveal-fade')) {
      el.classList.add('reveal-up');
      el.style.transitionDelay = `${(i % 5) * 0.07}s`;
      observer.observe(el);
    }
  });

  const statusEl = document.getElementById('openStatus');
  if (statusEl) {
    const now  = new Date();
    const day  = now.getDay();
    const h    = now.getHours() + now.getMinutes() / 60;
    const open = day >= 1 && day <= 5 && h >= 12.5 && h < 17.5;

    const base = 'padding:8px 16px;border-radius:8px;font-size:0.78rem;font-weight:600;display:inline-block;margin-top:12px;letter-spacing:0.04em;';
    if (open) {
      statusEl.textContent = '● Open Now';
      statusEl.style.cssText = base + 'color:#1A6B35;background:#E8F5EE;';
    } else if (day === 0 || day === 6) {
      statusEl.textContent = '● Closed — Reopens Monday at 12:30pm';
      statusEl.style.cssText = base + 'color:#C0392B;background:#FDECEA;';
    } else if (h < 12.5) {
      statusEl.textContent = '● Opens today at 12:30pm';
      statusEl.style.cssText = base + 'color:#B8630A;background:#FEF3E6;';
    } else {
      statusEl.textContent = '● Closed — Opens tomorrow at 12:30pm';
      statusEl.style.cssText = base + 'color:#C0392B;background:#FDECEA;';
    }
  }

  const form = document.getElementById('contactForm');
  if (form) {
    const get = id => document.getElementById(id);
    const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const showErr = (el, msg) => { if (el) el.textContent = msg; };
    const clearErr = el => { if (el) el.textContent = ''; };

    get('f-name')  && get('f-name').addEventListener('blur',  () => get('f-name').value.trim().length < 2  ? showErr(get('nameErr'), 'Please enter your name')  : clearErr(get('nameErr')));
    get('f-email') && get('f-email').addEventListener('blur', () => !isEmail(get('f-email').value.trim())   ? showErr(get('emailErr'), 'Valid email required')    : clearErr(get('emailErr')));
    get('f-msg')   && get('f-msg').addEventListener('blur',   () => get('f-msg').value.trim().length < 5   ? showErr(get('msgErr'), 'Please enter a message')    : clearErr(get('msgErr')));

    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      if (!get('f-name')  || get('f-name').value.trim().length < 2)  { showErr(get('nameErr'), 'Please enter your name');  ok = false; } else clearErr(get('nameErr'));
      if (!get('f-email') || !isEmail(get('f-email').value.trim()))   { showErr(get('emailErr'), 'Valid email required');   ok = false; } else clearErr(get('emailErr'));
      if (!get('f-msg')   || get('f-msg').value.trim().length < 5)    { showErr(get('msgErr'), 'Please enter a message');   ok = false; } else clearErr(get('msgErr'));
      if (!ok) return;

      const btn = get('submitBtn');
      if (get('btnTxt'))  get('btnTxt').style.display  = 'none';
      if (get('btnLoad')) get('btnLoad').style.display = 'inline';
      if (btn) btn.disabled = true;

      setTimeout(() => {
        form.style.display = 'none';
        const s = get('formSuccess');
        if (s) { s.style.display = 'block'; s.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      }, 1400);
    });
  }

  document.body.style.opacity    = '0';
  document.body.style.transition = 'opacity 0.35s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => { document.body.style.opacity = '1'; }));

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http')) return;
    if (link.classList.contains('nl')) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 300);
    });
  });

  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroBg.style.transform = `translateY(${y * 0.25}px)`;
    }, { passive: true });
  }

  const heroStats = document.querySelectorAll('.hstat-val');
  if (heroStats.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    heroStats.forEach(s => {
      s.classList.add('reveal-fade');
      statsObserver.observe(s);
    });
  }

});
