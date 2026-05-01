# ⚡ Fan Pulse: The Arena Match Center

**Fan Pulse** is a premium, high-engagement sports intelligence portal that transforms raw fan sentiment into actionable football insights. Built with Next.js 16 and powered by AI-orchestrated agents.

## 🚀 Key Features

- **The Arena Match Center:** Deep-dive analysis of individual matches with side-by-side player sentiment, AI-generated tactical narratives, and real-time pulse signals.
- **Paperclip AI Agents:** Autonomous "Scout" and "Analyst" agents that scrape social media, analyze multilingual sentiment (Arabic, Spanish, English, etc.), and detect emerging themes.
- **Pulse Polish UI:** High-fidelity animations including `AnimatedCounter`, `Sparkline` trend lines, and perceptual skeleton loaders for a premium, native-app feel.
- **PWA Ready:** Fully optimized for mobile installation with custom iconography and orientation locking.
- **Real-Time Data Sync:** Live momentum tracking and sentiment distillation for Champions League, Premier League, and La Liga matches.

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Prisma + SQLite
- **AI:** Google Gemini (Generative AI)
- **Styling:** Tailwind CSS + Framer Motion
- **Scraping:** Firecrawl (Mendable) + Custom Grok integrations
- **Icons:** Lucide React

## 📦 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Database Setup:**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

## 🧹 Utilities

- **Kill-Switch:** To purge zombie Node processes and clear RAM:
  ```bash
  node kill-node.js
  ```

---

*Built for the 2026 World Football Intelligence season.*
