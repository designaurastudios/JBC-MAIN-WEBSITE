# 🏗️ Jai Bhavani Constructions (JBC) - Official Website & Admin Portal

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.3-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.16-38B2AC.svg)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFA611.svg)](https://firebase.google.com/)
[![Security](https://img.shields.io/badge/Security-Hardened%20%26%20Audited-green.svg)](#security-architecture)

> Premium, high-performance website and administrative content management portal for **Jai Bhavani Constructions** — Mumbai's trusted plumbing, sanitary, and construction contractors.

---

## 🌟 Key Features

### 🌐 Public Client Experience
- **Fluid Visuals & 3D Interactive Mockup:** Custom 3D building showcase with smooth micro-animations.
- **Ultra-Fast Performance:** Instant page transitions with idle-time chunk pre-fetching and lazy loading.
- **Comprehensive Service Showcase:** Specialized landing experiences for plumbing, sanitary drainage, bathroom renovations, rainwater harvesting, and fire protection.
- **Dynamic Interactive Quote Estimator:** Calculates instant ballpark estimates with one-click direct WhatsApp dispatch.
- **Direct WhatsApp & Phone Integration:** One-tap contact triggers customized with customer inquiries.
- **SEO & Social Optimization:** Dynamic Meta tags, OpenGraph, JSON-LD Schema markup, structured `sitemap.xml`, and hardened `robots.txt`.

### 🛡️ Secure Admin Portal (`/admin`)
- **Email & Password Authentication:** Backed by Firebase Authentication SDK.
- **RFC 7519 Signed JWT Session Vault:** Client fingerprint binding (`IP/User-Agent/Screen entropy`) ensuring zero session hijacking.
- **Brute-Force Rate Limiting:** Progressive exponential lockout (up to 15 minutes) after multiple consecutive invalid login attempts.
- **Session Watchdog:** Automatic silent expiration verification and 30-minute idle inactivity auto-logout.
- **Resilient Fallback Mode:** Gracefully handles Firebase permission configurations with local-storage fallback so content editing never stalls.
- **Live Content Management:** Projects portfolio manager, company contact information editor, and testimonials.

---

## 🔒 Security Architecture

1. **Zero Secret Exposure:** Strict `.gitignore` protecting `.env`, credentials, local caches, and build outputs.
2. **HTTP Hardening Headers:** Deployed with `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection`, `Referrer-Policy: strict-origin-when-cross-origin`, and restrictive `Permissions-Policy`.
3. **No-Referrer External Links:** All external links enforce `rel="noopener noreferrer"`.
4. **Admin Route Obfuscation:** Blocked from search engine crawlers via `robots.txt` (`Disallow: /admin/`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation
```bash
# 1. Clone repository
git clone https://github.com/your-username/jai-bhavani-constructions.git
cd "jai-bhavani-constructions"

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and enter your Firebase project credentials

# 4. Start local development server
npm run dev
```

### Available Scripts
| Command | Description |
|---|---|
| `npm run dev` | Starts local Vite development server with HMR |
| `npm run build` | Builds optimized production assets to `dist/` |
| `npm run preview` | Previews production build locally |

---

## 🌐 Deployment (Vercel)

This project is pre-configured for **Vercel** with full SPA rewrite routing and security headers in `vercel.json`:
1. Push this repository to GitHub.
2. Import the project into your [Vercel Dashboard](https://vercel.com).
3. Set your **Environment Variables** in Vercel matching your `.env` keys (`VITE_FIREBASE_API_KEY`, etc.).
4. Click **Deploy**.

---

## 📄 License
Private & Proprietary — © Jai Bhavani Constructions. All rights reserved.
