# Shakoshy – Home Services & Construction Ecosystem

A modern, high-performance website for Shakoshy, the Middle East & Africa's trusted home services and construction marketplace platform.

## 🎯 Overview

Shakoshy connects homeowners, businesses, craftsmen, and suppliers across the region through one unified platform. This website showcases the platform's key features, services, and value proposition.

## 🎨 Design System

- **Primary Color**: Orange (#F97316) – Energy, Trust, Action
- **Dark Backgrounds**: #111111 / #1A1A1A – Authority, Premium
- **Typography**: 
  - Barlow Condensed (Display)
  - Barlow (Body)
  - Inter (UI)
- **Design Philosophy**: Bold Industrial · Orange Energy · Dark Authority

## 📦 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + Custom CSS
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Routing**: Wouter

## 🚀 Features

### Sections
- **Hero**: Eye-catching headline with live job card mockup
- **Stats Bar**: Animated counters (5,000+ professionals, 20K+ jobs, 98% satisfaction, 15+ cities)
- **Problem Section**: Before/After comparison with professional team image
- **How It Works**: Dual workflow for clients and professionals
- **Service Categories**: 6 service types with icons and descriptions
- **Trust Engine**: Features highlighting platform reliability
- **Mobile App**: App showcase with download links
- **CTA**: Call-to-action section
- **Footer**: Comprehensive navigation and social links

### Interactive Elements
- Fade-in animations on scroll
- Animated counter numbers
- Responsive navbar with mobile hamburger menu
- Hover effects on buttons and cards
- Smooth scroll navigation

## 📁 Project Structure

```
shakoshy-website/
├── client/
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   │   ├── Home.tsx     # Main page with all sections
│   │   │   └── NotFound.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css        # Global styles & design tokens
│   └── index.html
├── server/
│   └── index.ts             # Express server for production
├── shared/
│   └── const.ts
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🖼️ Images

All images are hosted on CDN and embedded via URL:
- Hero background: Dubai construction site at golden hour
- Professionals team: Skilled workers in branded orange uniforms
- Home renovation: Modern kitchen interior with contractor
- App mockup: Smartphone showing job listing interface
- Trust section: Client-contractor handshake

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- pnpm 10+

### Local Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

The dev server will run on `http://localhost:3000`

## 📝 Environment Variables

No environment variables required for static deployment. For production with analytics:
- `VITE_ANALYTICS_ENDPOINT` – Analytics service URL
- `VITE_ANALYTICS_WEBSITE_ID` – Analytics website ID

## 🎯 Key Components

### Home.tsx
Main page component containing:
- `Navbar` – Fixed navigation with scroll detection
- `Hero` – Hero section with job card mockup
- `StatsBar` – Animated statistics
- `ProblemSection` – Problem/solution comparison
- `HowItWorks` – Two-column workflow guide
- `Categories` – Service category grid
- `TrustSection` – Trust features showcase
- `AppSection` – Mobile app promotion
- `CTASection` – Call-to-action
- `Footer` – Site footer

### Hooks
- `useInView()` – Intersection Observer for scroll animations
- `Counter()` – Animated number counter component

## 🎨 Customization

### Colors
Edit CSS variables in `client/src/index.css`:
```css
:root {
  --primary: oklch(0.705 0.213 47.6);       /* #F97316 */
  --dark-bg: oklch(0.12 0.005 60);          /* #111111 */
  /* ... more variables ... */
}
```

### Fonts
Google Fonts are loaded in `client/index.html`:
- Barlow (400, 500, 600, 700, 800, 900)
- Barlow Condensed (700, 800, 900)
- Inter (400, 500, 600)

### Images
Update CDN URLs in `Home.tsx`:
```typescript
const IMG = {
  heroBg: "https://...",
  professionals: "https://...",
  // ...
};
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 640px (sm), 1024px (lg)
- Hamburger menu for mobile navigation
- Flexible grid layouts

## 🚀 Deployment

### Build for Production
```bash
pnpm build
```

This creates:
- `dist/public/` – Static frontend files
- `dist/index.js` – Production server

### Deploy to Manus
The project is configured for Manus hosting. Use the Manus UI to publish.

### Deploy to Other Platforms

**Netlify/Vercel:**
```bash
pnpm build
# Deploy dist/public folder
```

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install && pnpm build
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

## 📊 Performance

- Optimized images via CDN
- Lazy loading with Intersection Observer
- Minimal JavaScript bundle
- CSS-in-JS with Tailwind
- Fast animations with CSS transforms

## 🔒 Security

- No sensitive data in frontend code
- Environment variables for secrets
- XSS protection via React
- CSRF tokens in forms (if added)

## 📄 License

MIT

## 👥 Support

For questions or issues, contact the Shakoshy team.

---

**Built with ❤️ using React, Tailwind CSS, and Vite**
