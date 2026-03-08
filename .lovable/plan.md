# Plan: Professional Upgrade for Fan Pulse

## Current State

The app has 3 tabs (Sentiments, Ratings, TOTW), an admin panel, and covers 17 clubs across 5 leagues. It uses Gemini AI for sentiment analysis but suffers from rate limiting, hardcoded mock data in several pages, and a narrow feature set that doesn't justify a subscription.

## What to Build

### 1. Onboarding & Personalization Flow

- First-launch screen where users pick their favorite clubs (1-3) and preferred leagues
- Store selections in `user_favorite_teams` table
- Filter all dashboard content to prioritize their clubs first
- This makes the app feel personal from the start

### 2. Rivalry Hub (New Tab)

- Replace the 3-tab layout with a 5-tab bottom nav: **Home | Sentiments | Ratings | Rivals | More**
- **Home** tab: personalized feed showing your clubs' latest sentiment, upcoming matches, and trending moments
- **Rivals** tab: head-to-head sentiment comparison for classic rivalries (El Clasico, NW Derby, etc.), pulling from the existing `CLUB_RIVALRIES` data
- Shows which fanbase is happier right now with a live tug-of-war visualization

### 3. Match Day Timeline

- When a match is live or recently finished, show a sentiment timeline chart (using Recharts, already installed)
- Plot home vs away fan sentiment over match minutes using `sentiment_snapshots` data
- Fans can see exactly when mood shifted (e.g., after a goal or red card)

### 4. Push Notification Triggers

- "Sentiment Alert" badges: notify when your club's fan mood drops below 30% or spikes above 90%
- Uses existing `notification_preferences` table
- Implemented as in-app toast notifications for now (no push infra needed)

### 5. Club Deep-Dive Pages

- Replace the hardcoded mock data in `ClubPage.tsx` with real sentiment data from `sentiment_snapshots` and Gemini AI
- Add a "Follow" button that adds the club to favorites
- Show historical sentiment trend (last 5 matchdays)

### 7. Multi-Language Support

- Add a language selector in settings (English, Spanish, French, German, Italian, Portuguese, Arabic)
- Use `Intl` API for date/number formatting per locale
- Keep emoji-first design so sentiment labels are universally understood
- Translate key UI strings (tab labels, headers, buttons)

### 8. Visual & UX Polish

- Add a proper splash/loading screen with the Fan Pulse brand
- Smooth page transitions with Framer Motion (already installed)
- Add haptic-style micro-animations on card taps
- Dark mode toggle in header (app already has dark theme CSS variables)
- Improve the header: add user avatar, settings gear icon, and a link to /admin for admin users

### 9. "Why Subscribe?" Value Screen

- Accessible from a "Pro" badge in the header
- Shows what free vs paid users get:
  - **Free**: 3 clubs, delayed sentiment (30 min), basic mood emoji
  - **Pro**: Unlimited clubs, real-time sentiment, detailed breakdowns, predictions, rivalry hub, alerts
- No actual paywall enforcement yet — just the UI to communicate value

## Technical Approach

- **New components**: `OnboardingFlow.tsx`, `HomeTab.tsx`, `RivalryHub.tsx`, `SentimentTimeline.tsx`, `PredictionWidget.tsx`, `ProValueScreen.tsx`, `LanguageSelector.tsx`
- **Modified**: `BottomNavigation.tsx` (5 tabs), `AppHeader.tsx` (avatar + settings), `ClubPage.tsx` (real data), `Index.tsx` (onboarding gate + home tab)
- **Database**: Uses existing tables — no new migrations needed
- **No new edge functions** — reuses existing Gemini sentiment functions
- **i18n**: Simple JSON-based translation files in `src/lib/i18n/`

## Priority Order

1. Onboarding + Home tab (personalization is the biggest value driver)
2. Rivalry Hub (unique, engaging feature)
3. Match Day Timeline (leverages existing data)
4. Visual polish + dark mode toggle
5. Predictions + gamification
6. Pro value screen
7. Multi-language support