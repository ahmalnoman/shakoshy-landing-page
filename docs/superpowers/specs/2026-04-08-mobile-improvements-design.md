# Mobile Improvements — JoinProfessional Page

**Date:** 2026-04-08
**Scope:** `client/src/pages/JoinProfessional.tsx` only

## Problem

Two issues on the JoinProfessional multi-step registration page:

1. **Mobile feels bare.** Desktop shows a 3-column layout: left sidebar (step indicator + trust signals + testimonial) and right sidebar (live profile preview). Both sidebars are hidden on mobile (`hidden lg:block`), leaving the mobile user with just a thin progress bar and a raw form — no context, no motivation to complete.

2. **Step 1 button is unbalanced.** Steps 2 and 3 show a Back button (left) + Next button (right), which looks balanced. Step 1 has no Back button, so Next floats alone to the right with empty space on the left.

## Design Decisions

### Fix 1 — Step-contextual trust banner (mobile only)

Add a small banner below the mobile step progress bar. It shows a different message per step, contextually relevant to what the user is doing at that moment. The banner is only visible on mobile (`lg:hidden`).

**Messages per step:**

| Step | Icon | Title | Body |
|------|------|-------|------|
| 1 — Account | 🔒 | i18n key `joinPro.mobileTrust1.title` | i18n key `joinPro.mobileTrust1.body` |
| 2 — Profile | ⭐ | i18n key `joinPro.mobileTrust2.title` | i18n key `joinPro.mobileTrust2.body` |
| 3 — Portfolio | 📸 | i18n key `joinPro.mobileTrust3.title` | i18n key `joinPro.mobileTrust3.body` |

**Visual style:** matches the existing inline orange tip cards already used in `StepPortfolio` — `rgba(249,115,22,0.08)` background, `rgba(249,115,22,0.2)` border, 8px border-radius, orange title text, muted body text.

**Implementation:** A single conditional `div` inside the existing `className="lg:hidden"` mobile indicator block. No new component needed.

**Translation strings to add** (both `en` and `ar` in the language context file):

- `joinPro.mobileTrust1.title`: "Create your account" / "إنشاء حسابك"
- `joinPro.mobileTrust1.body`: "Your info is encrypted and never shared" / "معلوماتك مشفرة ومش بتتشارك مع حد"
- `joinPro.mobileTrust2.title`: "Build your profile" / "ابني بروفايلك"
- `joinPro.mobileTrust2.body`: "Pros with a photo get 3× more job requests" / "المحترفين اللي عندهم صورة بياخدوا طلبات أكتر بـ3 مرات"
- `joinPro.mobileTrust3.title`: "Almost there!" / "قربت تخلص!"
- `joinPro.mobileTrust3.body`: "A great portfolio means more bookings and better rates" / "البورتفوليو الكويس بيجيب شغل أكتر وفلوس أحسن"

### Fix 2 — Full-width Next button on step 1

When `step === 1` (no Back button), the Next button becomes full-width instead of floating right. On steps 2 and 3, the layout remains `justify-content: space-between` with Back on the left and Next on the right — unchanged.

The Submit button on step 3 gets a green (`#10B981`) background to visually signal completion, differentiating it from intermediate Next buttons.

**Implementation:** Change the navigation button block condition from:

```
{step > 1 ? <BackButton /> : <div />}
<NextButton />
```

to:

```
{step > 1 ? (
  <BackButton />
  <NextButton />   // right-aligned, normal width
) : (
  <NextButton fullWidth />  // full width
)}
```

In practice this means: when `step === 1`, render a single full-width button div. When `step > 1`, keep the existing `justify-content: space-between` row.

## Scope Boundaries

- No changes to `Home.tsx`, `PostJob.tsx`, or `CategoryBrowse.tsx`
- No changes to desktop layout (sidebars, 3-column grid)
- No changes to button styles site-wide (`.btn-primary` class stays as-is)
- No new components — all changes are inline in `JoinProfessional.tsx`
- Translation strings added to the existing language context file only

## Files to Change

1. `client/src/pages/JoinProfessional.tsx` — trust banner + button layout fix
2. `client/src/i18n/translations.ts` — 6 new translation strings (3 per language)
