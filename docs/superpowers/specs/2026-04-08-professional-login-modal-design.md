# Professional Login Modal — Design Spec

**Date:** 2026-04-08  
**Status:** Approved

---

## Overview

Add a modal popup to the Shakoshy landing page (`index.html`) that opens when any "Join as a Professional" button is clicked. The modal has two views — Login and Sign Up as Worker — and supports both English and Arabic (RTL).

---

## Trigger

Both "Join as a Professional" anchor tags (lines 78 and 453 in `index.html`) gain an `onclick` handler that opens the modal. Default `href="#"` behavior is prevented.

---

## Modal Structure

### Shared Elements
- Dark semi-transparent overlay backdrop covering the full viewport
- Centered card (max-width 440px), dark background `#1A1A1A`, border-radius 20px
- Shakoshy icon at the top center of the card
- Close ✕ button (top-right corner), closes modal on click
- Clicking the backdrop also closes the modal
- Language follows the page's existing AR/EN toggle — Arabic uses RTL layout and Noto Naskh Arabic font

---

### View 1 — Login (default)

**English**
- Title: "Login"
- Fields: Email or Phone, Password
- Button: "Login" (orange primary, full width)
- On submit: show inline success message "Welcome back!" (no real auth)
- Footer link: "Don't have an account? **Sign up as a worker**" → switches to View 2

**Arabic**
- Title: "تسجيل الدخول"
- Fields: البريد الإلكتروني أو الهاتف, كلمة المرور
- Button: "تسجيل الدخول"
- Success: "مرحباً بعودتك!"
- Footer link: "ليس لديك حساب؟ **سجّل كعامل**"

---

### View 2 — Sign Up as Worker

**English**
- Title: "Sign up as a worker"
- Fields: Full Name, Email, Phone, Password
- Button: "Create Account" (orange primary, full width)
- On submit: show inline success message "Account created! We'll be in touch."
- Footer link: "Already have an account? **Login**" → switches back to View 1

**Arabic**
- Title: "سجّل كعامل"
- Fields: الاسم الكامل, البريد الإلكتروني, رقم الهاتف, كلمة المرور
- Button: "إنشاء حساب"
- Success: "تم إنشاء حسابك! سنتواصل معك قريباً."
- Footer link: "لديك حساب بالفعل؟ **تسجيل الدخول**"

---

## Behavior

- View switching (Login ↔ Sign Up) happens in-place — no new modal, no page navigation
- Form submission is fake — no API calls. On click of the submit button:
  1. Hide the form fields and buttons
  2. Show the success message
  3. Auto-close modal after 2.5 seconds
- ESC key closes the modal
- Body scroll is locked while modal is open

---

## Styling

| Property | Value |
|---|---|
| Font (EN) | Inter |
| Font (AR) | Noto Naskh Arabic |
| Primary color | `#F97316` |
| Card background | `#1A1A1A` |
| Input background | `#2D2D2D` |
| Border radius (card) | 20px |
| Border radius (inputs/button) | 12px |
| Overlay | `rgba(0,0,0,0.7)` |

All button and input styles match the existing patterns in `style.css`.

---

## Files to Change

| File | Change |
|---|---|
| `index.html` | Add modal HTML markup, update button `onclick` handlers |
| `style.css` | Add modal CSS (overlay, card, inputs, animations) |
| `script.js` | Add modal open/close/view-switch/submit logic |
