# MediVantage — Frontend

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />
</p>

> A modern, AI-driven healthcare platform built with Next.js 16. Patients book appointments and download prescriptions. Doctors manage their queue and issue digital prescriptions. Admins oversee the entire platform.

**Live App:** [https://medivantage.vercel.app](https://medivantage.vercel.app)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Demo Accounts](#demo-accounts)
- [Pages & Routes](#pages--routes)
- [Architecture Notes](#architecture-notes)
- [Deployment](#deployment)

---

## Features

- **AI Symptom Checker** — Patients describe symptoms and get AI-powered preliminary diagnoses before booking
- **Doctor Discovery** — Browse and filter verified doctors by specialization (public, no login required)
- **Appointment Booking** — 4-step guided booking flow: select doctor → pick date/time → describe symptoms → confirm
- **Digital Prescriptions** — Doctors issue prescriptions with PDF download support; patients access from their dashboard
- **Role-Based Dashboards** — Separate views for patients, doctors, and admins with RBAC enforced at the middleware level
- **Real-time Notifications** — Socket.io-powered live alerts for appointment and prescription events
- **Medicine Directory** — Searchable, paginated catalog of 50+ medicines (public)
- **Dark Mode** — System-aware dark/light theme toggle
- **Admin Panel** — Doctor verification, user management, and platform health metrics

---

## Tech Stack

| Category      | Technology                                          |
| ------------- | --------------------------------------------------- |
| Framework     | Next.js 16.2 (App Router, Turbopack)                |
| Language      | TypeScript 5                                        |
| UI            | React 19, Tailwind CSS 4, Framer Motion             |
| Components    | shadcn/ui, Radix UI, Lucide Icons                   |
| State         | Zustand (auth store with localStorage persistence)  |
| Data Fetching | TanStack Query v5                                   |
| Forms         | React Hook Form + Zod                               |
| HTTP          | Axios (with JWT interceptor + silent token refresh) |
| Real-time     | Socket.io Client 4                                  |
| Testing       | Vitest + Testing Library                            |
| Deployment    | Vercel                                              |

---

## Project Structure

```
medivantage-frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/          # Login page with demo account buttons
│   │   │   └── register/       # Registration with role selection
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx      # Shared sidebar + top bar layout
│   │   │   ├── patient/        # Patient dashboard and sub-pages
│   │   │   │   ├── page.tsx    # Overview with stats
│   │   │   │   ├── bookings/   # Appointment management
│   │   │   │   ├── prescriptions/ # PDF prescription downloads
│   │   │   │   ├── medicines/  # Personal medicine tracker
│   │   │   │   └── symptoms/   # AI symptom checker
│   │   │   ├── doctor/         # Doctor dashboard and sub-pages
│   │   │   │   ├── page.tsx    # Appointment queue
│   │   │   │   └── appointments/[id]/prescribe/ # Prescription issuer
│   │   │   └── admin/          # Admin panel
│   │   │       ├── page.tsx    # Platform overview
│   │   │       ├── medicines/  # Medicine CRUD
│   │   │       ├── doctors/    # Doctor directory
│   │   │       └── users/      # User management
│   │   ├── doctors/            # Public doctor directory
│   │   ├── medicines/          # Public medicine catalog
│   │   │   └── [id]/           # Individual medicine detail
│   │   ├── layout.tsx          # Root layout with providers
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── dashboard/          # AppointmentCard, MedicineTrackerItem
│   │   ├── forms/              # BookingForm, PrescriptionForm
│   │   ├── providers/          # QueryClient, ThemeProvider
│   │   ├── shared/             # Navbar, NotificationBell, DownloadPrescription
│   │   ├── skeletons/          # Loading skeleton components
│   │   └── symptom-checker/    # AI symptom checker modal
│   ├── hooks/
│   │   ├── useSocket.ts        # Socket.io connection hook
│   │   └── useNotifications.ts # Notification state management
│   ├── lib/
│   │   ├── axios.ts            # Axios instance with interceptors
│   │   └── queryClient.ts      # TanStack Query configuration
│   ├── store/
│   │   └── authStore.ts        # Zustand auth store
│   ├── types/
│   │   └── index.ts            # Shared TypeScript interfaces
│   ├── validations/
│   │   └── schemas.ts          # Zod validation schemas
│   └── proxy.ts                # Next.js middleware (RBAC route guard)
├── public/
├── next.config.ts
├── vercel.json
├── tailwind.config.ts
└── .env.local.example
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- The [MediVantage backend](../medivantage-backend) running locally or deployed

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/medivantage-frontend.git
cd medivantage-frontend

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.local.example .env.local
# Edit .env.local with your values

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Points to the Express backend (local dev)
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# App metadata
NEXT_PUBLIC_APP_NAME="MediVantage AI"

# Environment
NEXT_PUBLIC_ENV=development
```

**For Vercel deployment**, set `NEXT_PUBLIC_API_URL=https://medivantage-backend.vercel.app/api/v1` in the Vercel dashboard under **Settings → Environment Variables**.

---

## Demo Accounts

The login page includes one-click demo buttons that pre-fill credentials:

| Role    | Email                           | Password      |
| ------- | ------------------------------- | ------------- |
| Admin   | `admin@gmail.com`               | `Admin123`    |
| Doctor  | `sarah.jenkins@medivantage.com` | `Doctor@1234` |
| Patient | `patient@gmail.com`             | `Patient123`  |

---

## Pages & Routes

### Public (no login required)

| Route            | Description                                           |
| ---------------- | ----------------------------------------------------- |
| `/`              | Landing page                                          |
| `/login`         | Sign in with demo buttons + `?from=` redirect support |
| `/register`      | Account creation for patients and doctors             |
| `/doctors`       | Browse verified doctors by specialization             |
| `/medicines`     | Searchable medicine directory                         |
| `/medicines/:id` | Individual medicine detail                            |

### Patient Dashboard (`/patient/*`)

| Route                    | Description                                             |
| ------------------------ | ------------------------------------------------------- |
| `/patient`               | Overview with stats: upcoming, completed, prescriptions |
| `/patient/bookings`      | All appointments with booking modal and cancel action   |
| `/patient/prescriptions` | Issued prescriptions with PDF download                  |
| `/patient/medicines`     | Medications from prescriptions                          |
| `/patient/symptoms`      | AI-powered symptom checker                              |

### Doctor Dashboard (`/doctor/*`)

| Route                                | Description                                    |
| ------------------------------------ | ---------------------------------------------- |
| `/doctor`                            | Appointment queue with approve/decline actions |
| `/doctor/appointments/:id/prescribe` | Issue a digital prescription                   |

### Admin Dashboard (`/admin/*`)

| Route              | Description                                           |
| ------------------ | ----------------------------------------------------- |
| `/admin`           | Platform overview: stats, pending doctors, user table |
| `/admin/medicines` | Full medicine CRUD                                    |
| `/admin/doctors`   | Doctor directory with verification controls           |
| `/admin/users`     | User management with active/inactive toggle           |

---

## Architecture Notes

### Authentication Flow

1. Login returns an `accessToken` (15 min) stored in Zustand + `localStorage`
2. A `refreshToken` HttpOnly cookie is set by the backend (`SameSite=None; Secure` in production)
3. Axios request interceptor attaches `Bearer <accessToken>` to every request
4. On 401, the response interceptor silently calls `/auth/refresh` and retries the original request once
5. On refresh failure, auth state is cleared and the user is redirected to `/login`

### RBAC Middleware (`proxy.ts`)

Next.js middleware runs at the edge on every request matching `/patient/*`, `/doctor/*`, `/admin/*`. It reads the `medivantage-role` cookie (set on login) and redirects unauthenticated users to `/login?from=<original-path>`. After login, users are redirected back to their intended destination.

### Token Refresh on Reload

The auth store persists to `localStorage` so the access token survives page refreshes. If the token has expired, the first API call returns a 401 which triggers the silent refresh flow automatically.

---

## Deployment

### Vercel (Recommended)

The project is pre-configured via `vercel.json`. Push to your connected GitHub repo and Vercel deploys automatically, or deploy manually:

```bash
npm i -g vercel
vercel --prod
```

**Required Vercel environment variable:**

```
NEXT_PUBLIC_API_URL=https://medivantage-backend.vercel.app/api/v1
```

---

## Scripts

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run Vitest test suite (single run)
npm run test:watch   # Run Vitest in watch mode
npm run test:coverage # Generate coverage report
```

---

## License

MIT
