// ============================================================
// SHAKOSHY – Website JavaScript
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ---- Mobile hamburger menu ----
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', function () {
    mobileMenu.classList.toggle('open');
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    if (mobileMenu.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ---- Intersection Observer for fade-in animations ----
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add fade-in class to elements
  const animatedEls = document.querySelectorAll(
    '.how-step, .category-card, .trust-feature, .stat-item, .problem-card, .how-column'
  );

  animatedEls.forEach(function (el, i) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease ' + (i * 0.07) + 's, transform 0.5s ease ' + (i * 0.07) + 's';
    observer.observe(el);
  });

  // Add visible class handler
  const style = document.createElement('style');
  style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);

  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', function () {
    let current = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });

  // Add active nav link style
  const navStyle = document.createElement('style');
  navStyle.textContent = '.nav-links a.active { color: var(--primary) !important; background: rgba(249,115,22,0.08) !important; }';
  document.head.appendChild(navStyle);

  // ---- Professional Login Modal ----
  var proModal = document.getElementById('proModal');
  var proModalCard = proModal.querySelector('.pro-modal-card');
  var proModalClose = document.getElementById('proModalClose');
  var proModalLang = document.getElementById('proModalLang');
  var proViewLogin = document.getElementById('proViewLogin');
  var proViewSignup = document.getElementById('proViewSignup');
  var goToSignup = document.getElementById('goToSignup');
  var goToLogin = document.getElementById('goToLogin');
  var proLoginSubmit = document.getElementById('proLoginSubmit');
  var proSignupSubmit = document.getElementById('proSignupSubmit');
  var proLoginForm = document.getElementById('proLoginForm');
  var proSignupForm = document.getElementById('proSignupForm');
  var proLoginSuccess = document.getElementById('proLoginSuccess');
  var proSignupSuccess = document.getElementById('proSignupSuccess');

  var isArabic = false;

  function openModal() {
    proModal.classList.add('open');
    proModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    showView('login');
    resetForms();
  }

  function closeModal() {
    proModal.classList.remove('open');
    proModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showView(view) {
    if (view === 'login') {
      proViewLogin.style.display = '';
      proViewSignup.style.display = 'none';
    } else {
      proViewLogin.style.display = 'none';
      proViewSignup.style.display = '';
    }
  }

  function resetForms() {
    proLoginForm.style.display = '';
    proSignupForm.style.display = '';
    proLoginSuccess.style.display = 'none';
    proSignupSuccess.style.display = 'none';
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('signupName').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPhone').value = '';
    document.getElementById('signupPassword').value = '';
  }

  function applyLang() {
    var attr = isArabic ? 'data-ar' : 'data-en';
    proModal.querySelectorAll('[data-en]').forEach(function (el) {
      el.textContent = el.getAttribute(attr);
    });
    proModalCard.classList.toggle('rtl', isArabic);
    proModalLang.textContent = isArabic ? 'English' : 'العربية';
  }

  var btn1 = document.getElementById('joinProfBtn1');
  var btn2 = document.getElementById('joinProfBtn2');
  if (btn1) {
    btn1.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
  }
  if (btn2) {
    btn2.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
  }

  proModalClose.addEventListener('click', closeModal);
  proModal.addEventListener('click', function (e) {
    if (e.target === proModal) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  goToSignup.addEventListener('click', function (e) { e.preventDefault(); showView('signup'); });
  goToLogin.addEventListener('click', function (e) { e.preventDefault(); showView('login'); });

  proModalLang.addEventListener('click', function () {
    isArabic = !isArabic;
    applyLang();
  });

  proLoginSubmit.addEventListener('click', function () {
    proLoginForm.style.display = 'none';
    proLoginSuccess.style.display = '';
    setTimeout(closeModal, 2500);
  });

  proSignupSubmit.addEventListener('click', function () {
    proSignupForm.style.display = 'none';
    proSignupSuccess.style.display = '';
    setTimeout(closeModal, 2500);
  });

});
