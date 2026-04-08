# Professional Login Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual (EN/AR) login/sign-up modal to the Shakoshy landing page that opens when any "Join as a Professional" button is clicked.

**Architecture:** Pure HTML/CSS/JS — no frameworks. Modal markup is injected directly into `index.html`. Styles are appended to `style.css`. Logic (open/close, view switch, language toggle, fake submit) lives in `script.js`. The modal manages its own EN/AR state independently from the rest of the page since the static landing page has no existing language toggle.

**Tech Stack:** Vanilla HTML5, CSS3 (CSS variables), Vanilla JavaScript (ES5-compatible)

---

## File Map

| File | Change |
|---|---|
| `index.html` | Add modal HTML at end of `<body>`, add `id="joinProfBtn1"` and `id="joinProfBtn2"` to the two CTA buttons |
| `style.css` | Append modal CSS: overlay, card, inputs, language toggle, success state, RTL support, animations |
| `script.js` | Append modal JS inside existing `DOMContentLoaded` listener: open, close, view switch, language toggle, fake submit |

---

## Task 1: Add modal HTML to index.html

**Files:**
- Modify: `index.html` — add `id` attributes to both CTA buttons, add modal markup before `</body>`

- [ ] **Step 1: Add IDs to both "Join as a Professional" buttons**

In `index.html` line 78, change:
```html
<a href="#" class="btn btn-outline btn-lg">Join as a Professional</a>
```
to:
```html
<a href="#" class="btn btn-outline btn-lg" id="joinProfBtn1">Join as a Professional</a>
```

In `index.html` line 453, change:
```html
<a href="#" class="btn btn-dark btn-lg">Join as a Professional</a>
```
to:
```html
<a href="#" class="btn btn-dark btn-lg" id="joinProfBtn2">Join as a Professional</a>
```

- [ ] **Step 2: Add modal markup before `</body>`**

Insert the following block immediately before the closing `</body>` tag:

```html
<!-- ===== PROFESSIONAL LOGIN MODAL ===== -->
<div id="proModal" class="pro-modal-overlay" aria-hidden="true">
  <div class="pro-modal-card" role="dialog" aria-modal="true">

    <!-- Header -->
    <div class="pro-modal-header">
      <div class="pro-modal-logo">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      </div>
      <button class="pro-modal-lang" id="proModalLang">العربية</button>
      <button class="pro-modal-close" id="proModalClose" aria-label="Close">✕</button>
    </div>

    <!-- LOGIN VIEW -->
    <div id="proViewLogin" class="pro-modal-view">
      <h2 class="pro-modal-title" data-en="Login" data-ar="تسجيل الدخول">Login</h2>

      <div class="pro-modal-form" id="proLoginForm">
        <div class="pro-field">
          <label data-en="Email or Phone" data-ar="البريد الإلكتروني أو الهاتف">Email or Phone</label>
          <input type="text" class="pro-input" id="loginEmail" autocomplete="username" />
        </div>
        <div class="pro-field">
          <label data-en="Password" data-ar="كلمة المرور">Password</label>
          <input type="password" class="pro-input" id="loginPassword" autocomplete="current-password" />
        </div>
        <button class="btn btn-primary btn-full pro-submit" id="proLoginSubmit" data-en="Login" data-ar="تسجيل الدخول">Login</button>
      </div>

      <div class="pro-modal-success" id="proLoginSuccess" style="display:none">
        <div class="pro-success-icon">✓</div>
        <p data-en="Welcome back!" data-ar="مرحباً بعودتك!">Welcome back!</p>
      </div>

      <p class="pro-modal-switch">
        <span data-en="Don't have an account?" data-ar="ليس لديك حساب؟">Don't have an account?</span>
        <a href="#" id="goToSignup" data-en="Sign up as a worker" data-ar="سجّل كعامل">Sign up as a worker</a>
      </p>
    </div>

    <!-- SIGN UP VIEW -->
    <div id="proViewSignup" class="pro-modal-view" style="display:none">
      <h2 class="pro-modal-title" data-en="Sign up as a worker" data-ar="سجّل كعامل">Sign up as a worker</h2>

      <div class="pro-modal-form" id="proSignupForm">
        <div class="pro-field">
          <label data-en="Full Name" data-ar="الاسم الكامل">Full Name</label>
          <input type="text" class="pro-input" id="signupName" autocomplete="name" />
        </div>
        <div class="pro-field">
          <label data-en="Email" data-ar="البريد الإلكتروني">Email</label>
          <input type="email" class="pro-input" id="signupEmail" autocomplete="email" />
        </div>
        <div class="pro-field">
          <label data-en="Phone" data-ar="رقم الهاتف">Phone</label>
          <input type="tel" class="pro-input" id="signupPhone" autocomplete="tel" />
        </div>
        <div class="pro-field">
          <label data-en="Password" data-ar="كلمة المرور">Password</label>
          <input type="password" class="pro-input" id="signupPassword" autocomplete="new-password" />
        </div>
        <button class="btn btn-primary btn-full pro-submit" id="proSignupSubmit" data-en="Create Account" data-ar="إنشاء حساب">Create Account</button>
      </div>

      <div class="pro-modal-success" id="proSignupSuccess" style="display:none">
        <div class="pro-success-icon">✓</div>
        <p data-en="Account created! We'll be in touch." data-ar="تم إنشاء حسابك! سنتواصل معك قريباً.">Account created! We'll be in touch.</p>
      </div>

      <p class="pro-modal-switch">
        <span data-en="Already have an account?" data-ar="لديك حساب بالفعل؟">Already have an account?</span>
        <a href="#" id="goToLogin" data-en="Login" data-ar="تسجيل الدخول">Login</a>
      </p>
    </div>

  </div>
</div>
<!-- ===== END PROFESSIONAL LOGIN MODAL ===== -->
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add professional login modal HTML markup"
```

---

## Task 2: Add modal CSS to style.css

**Files:**
- Modify: `style.css` — append modal styles at the end of the file

- [ ] **Step 1: Append the following CSS to the very end of `style.css`**

```css
/* ============================================================
   PROFESSIONAL LOGIN MODAL
   ============================================================ */

.pro-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;
  padding: 16px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.pro-modal-overlay.open {
  opacity: 1;
  pointer-events: all;
}

.pro-modal-card {
  background: var(--dark);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 440px;
  padding: 32px;
  box-shadow: var(--shadow-lg);
  transform: translateY(16px) scale(0.98);
  transition: transform 0.25s ease;
  position: relative;
}

.pro-modal-overlay.open .pro-modal-card {
  transform: translateY(0) scale(1);
}

/* RTL support */
.pro-modal-card.rtl {
  direction: rtl;
  font-family: 'Noto Naskh Arabic', serif;
}

/* Header row */
.pro-modal-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  gap: 8px;
}

.pro-modal-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--primary);
  border-radius: var(--radius);
  flex-shrink: 0;
}

.pro-modal-lang {
  margin-left: auto;
  background: var(--dark-2);
  color: var(--gray-400);
  border: 1px solid var(--dark-3);
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--font);
  transition: color 0.15s, border-color 0.15s;
}

.pro-modal-card.rtl .pro-modal-lang {
  margin-left: 0;
  margin-right: auto;
  font-family: 'Noto Naskh Arabic', serif;
}

.pro-modal-lang:hover {
  color: var(--white);
  border-color: var(--gray-400);
}

.pro-modal-close {
  background: none;
  border: none;
  color: var(--gray-400);
  font-size: 18px;
  cursor: pointer;
  line-height: 1;
  padding: 4px;
  border-radius: 6px;
  transition: color 0.15s;
  flex-shrink: 0;
}

.pro-modal-close:hover {
  color: var(--white);
}

/* Title */
.pro-modal-title {
  color: var(--white);
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 24px;
}

/* Form */
.pro-field {
  margin-bottom: 16px;
}

.pro-field label {
  display: block;
  color: var(--gray-400);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
}

.pro-input {
  width: 100%;
  background: var(--dark-2);
  border: 1.5px solid var(--dark-3);
  border-radius: var(--radius);
  color: var(--white);
  font-family: var(--font);
  font-size: 15px;
  padding: 12px 14px;
  outline: none;
  transition: border-color 0.15s;
}

.pro-modal-card.rtl .pro-input {
  font-family: 'Noto Naskh Arabic', serif;
}

.pro-input::placeholder {
  color: var(--dark-3);
}

.pro-input:focus {
  border-color: var(--primary);
}

.pro-modal-form .pro-submit {
  margin-top: 8px;
  width: 100%;
  font-size: 15px;
  padding: 14px;
}

/* Switch link */
.pro-modal-switch {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: var(--gray-400);
}

.pro-modal-switch a {
  color: var(--primary);
  font-weight: 600;
  margin-left: 4px;
}

.pro-modal-card.rtl .pro-modal-switch a {
  margin-left: 0;
  margin-right: 4px;
}

/* Success state */
.pro-modal-success {
  text-align: center;
  padding: 24px 0 8px;
}

.pro-success-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: rgba(249, 115, 22, 0.15);
  color: var(--primary);
  border-radius: 50%;
  font-size: 24px;
  margin-bottom: 16px;
}

.pro-modal-success p {
  color: var(--white);
  font-size: 17px;
  font-weight: 600;
}
```

- [ ] **Step 2: Commit**

```bash
git add style.css
git commit -m "feat: add professional login modal CSS"
```

---

## Task 3: Add modal JavaScript to script.js

**Files:**
- Modify: `script.js` — append modal logic inside the existing `DOMContentLoaded` listener (before the closing `});`)

- [ ] **Step 1: Append the following JS inside the `DOMContentLoaded` block in `script.js`, just before the final `});`**

```javascript
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
    // reset to login view and English state
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

  // Open via both CTA buttons
  var btn1 = document.getElementById('joinProfBtn1');
  var btn2 = document.getElementById('joinProfBtn2');
  if (btn1) {
    btn1.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
  }
  if (btn2) {
    btn2.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
  }

  // Close
  proModalClose.addEventListener('click', closeModal);
  proModal.addEventListener('click', function (e) {
    if (e.target === proModal) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  // View switching
  goToSignup.addEventListener('click', function (e) { e.preventDefault(); showView('signup'); });
  goToLogin.addEventListener('click', function (e) { e.preventDefault(); showView('login'); });

  // Language toggle
  proModalLang.addEventListener('click', function () {
    isArabic = !isArabic;
    applyLang();
  });

  // Fake login submit
  proLoginSubmit.addEventListener('click', function () {
    proLoginForm.style.display = 'none';
    proLoginSuccess.style.display = '';
    setTimeout(closeModal, 2500);
  });

  // Fake signup submit
  proSignupSubmit.addEventListener('click', function () {
    proSignupForm.style.display = 'none';
    proSignupSuccess.style.display = '';
    setTimeout(closeModal, 2500);
  });
```

- [ ] **Step 2: Commit**

```bash
git add script.js
git commit -m "feat: add professional login modal JavaScript logic"
```

---

## Task 4: Final push

- [ ] **Step 1: Push all commits**

```bash
git push
```

Expected output: `main -> main` with 3 new commits.

- [ ] **Step 2: Verify manually**
  - Open `index.html` in a browser
  - Click "Join as a Professional" in the hero section — modal opens
  - Click "Join as a Professional" in the CTA section — modal opens
  - Click "العربية" — all text switches to Arabic, layout goes RTL
  - Click "English" — switches back
  - Click "Sign up as a worker" link — switches to sign-up view
  - Click "Login" link — switches back
  - Click "Login" button — success message appears, modal closes after 2.5s
  - Click "Create Account" button — success message appears, modal closes after 2.5s
  - Click backdrop or press ESC — modal closes
