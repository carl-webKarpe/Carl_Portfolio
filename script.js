/* ==========================================================================
   JHON CARL ALCALA — LIGHT GREEN MOTION PORTFOLIO
   script.js
   ========================================================================== */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;

  /* ------------------------------------------------------------------
     PAGE LOADER
  ------------------------------------------------------------------ */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
      loader.classList.add('hidden');
    }, reduceMotion ? 100 : 900);
  });

  /* ------------------------------------------------------------------
     NAVBAR: scroll shrink + mobile toggle + active link + smooth scroll
  ------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const navH = document.querySelector('.navbar').offsetHeight + 40;
          const top = target.getBoundingClientRect().top + window.scrollY - navH;
          window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      }
    });
  });

  // Active nav link on scroll
  const sections = ['home', 'about', 'projects', 'services', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const navAnchors = document.querySelectorAll('.nav-links a');

  const setActiveLink = () => {
    let currentId = sections[0] ? sections[0].id : '';
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) currentId = sec.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + currentId);
    });
  };
  document.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ------------------------------------------------------------------
     SCROLL REVEAL (Intersection Observer)
  ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ------------------------------------------------------------------
     ANIMATED STAT COUNTERS
  ------------------------------------------------------------------ */
  const statEls = document.querySelectorAll('.stat b[data-count]');
  if (statEls.length) {
    const animateCount = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      if (reduceMotion) { el.textContent = target + '+'; return; }
      let start = 0;
      const duration = 1200;
      const startTime = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + '+';
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => statObserver.observe(el));
  }

  /* ------------------------------------------------------------------
     TOOLS MARQUEE (built + duplicated for seamless infinite loop)
  ------------------------------------------------------------------ */
  const tools = ['PHOTOSHOP', 'ILLUSTRATOR', 'FIGMA', 'CANVA', 'ADOBE XD',];
  const track = document.getElementById('marqueeTrack');
  if (track) {
    const buildSet = () => tools.map(t => `<span class="marquee-item">${t}<span class="sep">•</span></span>`).join('');
    track.innerHTML = buildSet() + buildSet();
  }

  /* ------------------------------------------------------------------
     CUSTOM CURSOR
  ------------------------------------------------------------------ */
  if (!isTouch) {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });

    const animateRing = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateRing);
    };
    requestAnimationFrame(animateRing);

    document.querySelectorAll('a, button, .project-card, .skill-card, .service-card').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
    });
  }

  /* ------------------------------------------------------------------
     MAGNETIC BUTTONS
  ------------------------------------------------------------------ */
  if (!isTouch && !reduceMotion) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.4}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0,0)';
      });
    });
  }

  /* ------------------------------------------------------------------
     HERO PARALLAX (mouse move on decorative elements)
  ------------------------------------------------------------------ */
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual && !isTouch && !reduceMotion) {
    const parallaxEls = heroVisual.querySelectorAll('[data-parallax]');
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      parallaxEls.forEach(el => {
        const strength = parseFloat(el.getAttribute('data-parallax')) || 10;
        el.style.transform = `translate(${px * strength}px, ${py * strength}px)`;
      });
    });
    heroVisual.addEventListener('mouseleave', () => {
      parallaxEls.forEach(el => { el.style.transform = 'translate(0,0)'; });
    });
  }

  /* ------------------------------------------------------------------
     HERO CANVAS PARTICLE SYSTEM (subtle, connects when close)
  ------------------------------------------------------------------ */
  const canvas = document.getElementById('hero-canvas');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    const isMobile = window.innerWidth < 700;
    const COUNT = isMobile ? 18 : 46;
    let mouseX = null, mouseY = null;

    const resize = () => {
      const parent = canvas.parentElement;
      w = canvas.width = parent.offsetWidth;
      h = canvas.height = parent.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['rgba(22,163,74,0.55)', 'rgba(107,114,128,0.4)', 'rgba(22,101,52,0.4)'];

    function Particle() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.r = Math.random() * 1.6 + 0.8;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
      if (mouseX !== null) {
        const dx = this.x - mouseX, dy = this.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          this.x += dx / dist * 0.35;
          this.y += dy / dist * 0.35;
        }
      }
    };
    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    };

    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });
    canvas.parentElement.addEventListener('mouseleave', () => {
      mouseX = null; mouseY = null;
    });

    let rafId;
    function tick() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => { p.update(); p.draw(); });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(107,114,128,${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      rafId = requestAnimationFrame(tick);
    }
    tick();

    // Pause when hero not visible (perf)
    const heroObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!rafId) tick();
        } else {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      });
    }, { threshold: 0 });
    heroObs.observe(document.getElementById('home'));
  }

  /* ------------------------------------------------------------------
     PROJECT FILTER
  ------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cats = card.getAttribute('data-category');
        const match = filter === 'all' || cats.includes(filter);
        card.classList.toggle('filtered-out', !match);
      });
    });
  });

  /* ------------------------------------------------------------------
     PROJECT MODAL
  ------------------------------------------------------------------ */
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalImg = document.getElementById('modalImg');
  const modalCat = document.getElementById('modalCat');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalProcess = document.getElementById('modalProcess');
  const modalTools = document.getElementById('modalTools');
  const modalChallenges = document.getElementById('modalChallenges');
  const modalSolution = document.getElementById('modalSolution');

  function openModal(card) {
    modalImg.src = card.getAttribute('data-img');
    modalImg.alt = card.getAttribute('data-title');
    modalCat.textContent = card.getAttribute('data-cat-label');
    modalTitle.textContent = card.getAttribute('data-title');
    modalDesc.textContent = card.getAttribute('data-desc');
    modalProcess.textContent = card.getAttribute('data-process');
    modalChallenges.textContent = card.getAttribute('data-challenges');
    modalSolution.textContent = card.getAttribute('data-solution');
    modalTools.innerHTML = card.getAttribute('data-tools')
      .split(',')
      .map(t => `<span>${t.trim()}</span>`)
      .join('');
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      openModal(card);
    });
  });
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
  });

  /* ------------------------------------------------------------------
     MOTION DEMO 03 — INTERACT (card follows mouse slightly)
  ------------------------------------------------------------------ */
  const interactDemo = document.getElementById('interactDemo');
  const interactCard = document.getElementById('interactCard');
  if (interactDemo && interactCard && !isTouch && !reduceMotion) {
    interactDemo.addEventListener('mousemove', (e) => {
      const rect = interactDemo.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      interactCard.style.transform = `translate(${x * 30}px, ${y * 24}px) rotate(${x * 8}deg)`;
    });
    interactDemo.addEventListener('mouseleave', () => {
      interactCard.style.transform = 'translate(0,0) rotate(0deg)';
    });
  }

  /* ------------------------------------------------------------------
     CONTACT FORM VALIDATION
  ------------------------------------------------------------------ */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  function setError(fieldId, hasError) {
    document.getElementById(fieldId).classList.toggle('error', hasError);
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      formSuccess.classList.remove('show');

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const type = document.getElementById('type').value;
      const message = document.getElementById('message').value.trim();

      let valid = true;

      if (name.length < 2) { setError('field-name', true); valid = false; }
      else setError('field-name', false);

      if (!validateEmail(email)) { setError('field-email', true); valid = false; }
      else setError('field-email', false);

      if (!type) { setError('field-type', true); valid = false; }
      else setError('field-type', false);

      if (message.length < 6) { setError('field-message', true); valid = false; }
      else setError('field-message', false);

      if (valid) {
        formSuccess.classList.add('show');
        form.reset();
        setTimeout(() => formSuccess.classList.remove('show'), 6000);
      } else {
        const firstError = form.querySelector('.field.error input, .field.error select, .field.error textarea');
        if (firstError) firstError.focus();
      }
    });
  }

})();
