# VibeCheck 🎵✨

**VibeCheck** is a mood-based music and journaling web application built with **React**, **TypeScript**, and **Tailwind CSS**.  
It helps users **select their daily mood**, receive **personalized music & quote suggestions**, **write journal entries**, and **track their mood history** over time — all in a **beautiful, responsive, and animated interface**.

---

## 🚀 Features

- 🎭 **Daily Mood Selection** — Pick your vibe for the day from different mood categories.
- 🎶 **Personalized Recommendations** — Get **AI-driven** song and quote suggestions that match your mood.
- 📝 **Journaling** — write a journal entry to reflect on your day.
- 📊 **Mood History Tracking** — Visualize your emotional journey over time with charts and analytics.
- 🤖 **AI Suggestions** — Weekly insights and reflections based on your recorded moods.
- 🎨 **Smooth Animations** — Clean transitions and micro-interactions powered by **Framer Motion**.
- 🔐 **Authentication & User Data** — Secure login/signup with **Supabase Auth**.
- ☁️ **Cloud Storage** — User mood entries, journals, and preferences are stored in **Supabase Database**.
- 📱 **Responsive Design** — Works seamlessly on desktop, tablet, and mobile devices.

---

## 🛠️ Tech Stack

VibeCheck is built with a **modern web development stack** that balances **performance**, **scalability**, and **developer experience**.

- **Frontend Framework**: [React](https://react.dev/)

  - Core of the app.
  - Provides a **component-based architecture** for building reusable UI blocks.
  - Enables **single-page application (SPA)** navigation for smooth user experience.

- **Language**: [TypeScript](https://www.typescriptlang.org/)

  - Adds **static typing** on top of JavaScript.
  - Improves developer productivity with **intellisense**, **error catching at compile time**, and better code maintainability.

- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

  - Utility-first CSS framework.
  - Provides **responsive design out of the box** (mobile-first).
  - Speeds up development with **pre-built utility classes** while keeping styles consistent.
  - Extended with **custom theme config** for branding.

- **Routing**: [React Router](https://reactrouter.com/)

  - Handles **client-side navigation** between pages (Landing, Dashboard, History, Auth).
  - Supports **protected routes** for authenticated users.
  - Configured with `vercel.json` for SPA support during deployment.

- **Animations**: [Framer Motion](https://www.framer.com/motion/)

  - Adds **smooth transitions** and **micro-interactions**.
  - Used for mood selector animations, page transitions, and card effects.
  - Improves **user engagement** and makes the app feel modern.

- **Backend as a Service**: [Supabase](https://supabase.com/)

  - Provides authentication, database, and APIs without managing a custom backend.
  - **Authentication**: Email/password login with secure session handling.
  - **Database**: PostgreSQL with **Row Level Security (RLS)** for user-specific data.
  - **API**: Auto-generated REST APIs for interacting with stored moods & journals.

- **Data Visualization**: [Recharts](https://recharts.org/en-US/)

  - Used to display **mood history trends** (line graphs, bar charts).
  - Allows users to track patterns in emotions across days/weeks.
  - Integrated with AI to provide **weekly mood insights**.

- **Deployment**: [Vercel](https://vercel.com/)
  - Zero-config deployment for React apps.
  - Integrated with `vercel.json` to support React Router SPA routing.
  - Provides **fast CDN** for global users.

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

git clone https://github.com/OmegaM97/VibeCheck.git
cd vibecheck

### 2️⃣ Install dependencies

npm install

### 3️⃣ Environment variables

Create a .env.local file in the root folder and add your Supabase credentials:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

you can find these in your Supabase Project → Settings → API.

in supabase create the necessary database tables

### 4️⃣ Run locally

npm run dev
app will be running at http://localhost:5173/

## 🛡️ Future Improvements

Multi-language support (Amharic & English toggle)
Spotify/YouTube API integration for real-time playlists
Mood-based meditation & breathing exercises
Native mobile app with React Native

## Author

Omega Melese

2nd-year Information Science student @ Addis Ababa University
ALX Software Engineering student
Passionate about front-end development, AI integration, and building useful tools

## ⭐ Contributing

Contributions are welcome! Please fork the repo and submit a pull request.
