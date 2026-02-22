# Nexofi

AI-powered virtual office and team management platform built with Next.js, Supabase, and OpenAI.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ECF8E?logo=supabase)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?logo=openai)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

**Live Demo:** [nexofi.vercel.app](https://nexofi.vercel.app)

---

## Overview

Nexofi is a real-time virtual office platform that lets distributed teams visualize who's working, on break, or in meetings — all on an interactive SVG office floor. Managers get AI-powered insights and project blueprints, while employees manage tasks, update their status, and accept AI-suggested work.

### Key Features

- **Interactive Virtual Office** — SVG-based office floor with animated minifigure characters that move between zones (Development Area, Break Room, Meeting Room, Offline) in real time
- **Real-Time Status Updates** — Powered by Supabase Realtime; status changes propagate instantly across all connected devices
- **AI Execution Plans** — GPT-4o generates comprehensive project blueprints with phased timelines, risk analysis, effort breakdowns, and tech stack suggestions
- **AI Team Insights** — Actionable intelligence about team productivity and workload distribution
- **Employee Portal** — Check in/out, update status, manage tasks, accept AI-suggested tasks, track work/break timers
- **Manager Dashboard** — Bird's-eye view of the office, active projects, efficiency metrics, and AI insights
- **Project Management** — Create projects with AI-generated blueprints, manage tasks, track progress
- **Role-Based Authentication** — Simple login system with manager and employee roles

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Database | Supabase (PostgreSQL + Realtime) |
| AI | OpenAI GPT-4o |
| Styling | CSS with Glass Morphism + Tailwind CSS |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- An [OpenAI](https://platform.openai.com) API key

### 1. Clone & Install

```bash
git clone https://github.com/MadOrange4/Nexofi.git
cd Nexofi
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-openai-api-key
```

### 3. Set Up the Database

Run the following SQL files in your Supabase SQL Editor, in order:

1. **`supabase/migration.sql`** — Creates `employees`, `projects`, `tasks`, and `desks` tables with RLS policies and Realtime enabled
2. **`supabase/seed.sql`** — Seeds demo data (8 employees, 3 projects, 16 tasks, 9 desks)
3. **`supabase/migration_users.sql`** — Creates the `users` table with pgcrypto for password hashing
4. **`supabase/seed_users.sql`** — Seeds 9 user accounts

### 4. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Demo Accounts

| Username | Password | Role |
|----------|----------|------|
| manager | manager123 | Manager |
| sarah | sarah123 | Employee |
| raj | raj123 | Employee |
| emma | emma123 | Employee |
| alex | alex123 | Employee |
| maria | maria123 | Employee |
| james | james123 | Employee |
| priya | priya123 | Employee |
| tom | tom123 | Employee |

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   ├── blueprint/route.ts   # GPT-4o project blueprint generation
│   │   │   └── insights/route.ts    # GPT-4o team insights
│   │   └── auth/
│   │       └── login/route.ts       # Authentication endpoint
│   ├── dashboard/page.tsx           # Manager dashboard + virtual office
│   ├── employee/page.tsx            # Employee portal
│   ├── login/page.tsx               # Login page
│   ├── projects/page.tsx            # Project management
│   ├── layout.tsx                   # Root layout with auth wrapper
│   └── page.tsx                     # Landing page
├── components/
│   ├── VirtualOfficeFloor.tsx       # SVG office with animated minifigures
│   ├── AppHeader.tsx                # Navigation with role-based routing
│   ├── PageTransition.tsx           # Animated page transitions
│   └── landing/                     # Landing page sections
├── lib/
│   ├── supabase.ts                  # Supabase client singleton
│   ├── useSupabase.ts               # React hooks + mutations + realtime
│   ├── auth-context.tsx             # Auth provider with localStorage
│   ├── database.types.ts            # Supabase typed schema
│   └── types.ts                     # Shared TypeScript types
supabase/
├── migration.sql                    # Database schema
├── migration_users.sql              # Users table
├── seed.sql                         # Demo data
└── seed_users.sql                   # Demo user accounts
```

---

## Deployment

### Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

Add environment variables in Vercel project settings or via CLI:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add OPENAI_API_KEY production
```

---

## License

MIT
