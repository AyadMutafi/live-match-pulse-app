# Plan: Fix Outdated Data and Enhance App for Diverse Audience

## Problem Summary

The app has two core issues:

1. **Outdated/stale data** - Multiple components use hardcoded mock data from Oct-Dec 2025, and the live match API calls are failing
2. **Limited audience appeal** - The app currently targets a narrow set of clubs and lacks features that would attract fans from different nationalities and age groups

---

## Part 1: Fix Outdated Data

### Issue 1: Failing Supabase Connections

All network requests to Supabase are returning "Failed to fetch." The `fetch-matches` edge function needs to be redeployed and tested to restore data flow.

**Action:** Redeploy the `fetch-matches` edge function and verify the `FOOTBALL_DATA_API_KEY` secret is still valid.

### Issue 2: Hardcoded Mock Data in Components

Several components display static data instead of fetching from the database or APIs:


| Component               | Problem                                                           |
| ----------------------- | ----------------------------------------------------------------- |
| `ClubSentimentOverview` | Hardcoded mock data with "Oct 26" dates                           |
| `RivalryWatch`          | Hardcoded mock data with "Oct 26, 2025" to "Jan 5, 2026" dates    |
| `LiveSocialFeed`        | Static sample posts, never fetches real data                      |
| `LeagueStandings`       | Entirely generated with `Math.random()` -- no real standings data |
| `WeeklyRatings`         | Uses fallback mock player data                                    |


**Actions:**

- Replace `ClubSentimentOverview` mock data with dynamic data sourced from the `matches` and `social_posts` tables, calculating sentiment from recent match results and social post scores
- Replace `RivalryWatch` mock data with dynamic data from the `matches` table, pulling actual upcoming fixtures between rival clubs
- Update `LiveSocialFeed` to query the `social_posts` table for real posts, keeping the mock data only as a fallback when no data exists
- Update `LeagueStandings` to fetch real standings from the football-data.org API via a new edge function (`fetch-standings`)
- Add a visible "Last Updated" timestamp and a manual refresh button to the main dashboard so users can see when data was last fetched and force a refresh

### Issue 3: Smart Refresh Not Triggering Properly

The `useMatches` hook fires `fetch-matches` on mount and every 5 minutes, but when the function fails, there is no user-visible error or retry mechanism.

**Action:** Add error handling with a user-visible banner showing connection issues and a manual "Retry" button when data fails to load.

---

## Part 2: Enhance App for Diverse Audience

### Enhancement 1: Expand League Coverage

Currently the app only monitors 7 clubs across 2 leagues. To attract fans from more nationalities:

- Add support for **Serie A** (Italy), **Bundesliga** (Germany), **Ligue 1** (France), and **Primeira Liga** (Portugal) in the target clubs configuration
- Allow users to **choose their favorite leagues and clubs** from a settings page (stored in `user_favorite_teams` table which already exists)
- Make the dashboard sections filter based on the user's selected clubs

### Enhancement 2: Multi-Language Sentiment Labels

Replace English-only sentiment labels with universal emoji-based indicators that work across languages. The app already uses emojis for sentiment -- this will be extended to ensure all labels are emoji-first with minimal text.

---

## Technical Details

### New Edge Function: `fetch-standings`

- Calls `football-data.org/v4/competitions/{id}/standings` for each monitored league
- Stores results in a new `league_standings` table
- Refreshes every 6 hours (standings don't change frequently)

### Database Changes

- New table: `league_standings` with columns for `league_id`, `team_name`, `position`, `played`, `won`, `drawn`, `lost`, `goals_for`, `goals_against`, `points`, `form`, `updated_at`
- New table: `user_display_preferences` with columns for `user_id`, `font_size`, `simplified_view`, `favorite_leagues`

### Files to Modify

1. `src/components/ClubSentimentOverview.tsx` -- Replace mock data with dynamic queries
2. `src/components/RivalryWatch.tsx` -- Replace mock data with dynamic queries
3. `src/components/LiveSocialFeed.tsx` -- Add real data fetching
4. `src/components/LeagueStandings.tsx` -- Replace random generation with API data
5. `src/pages/Index.tsx` -- Add error banner and manual refresh button
6. `src/hooks/useMatches.tsx` -- Add better error handling and retry logic
7. `src/lib/constants.ts` -- Expand target clubs (optional, based on user preference)
8. New: `supabase/functions/fetch-standings/index.ts`
9. New: `src/components/ConnectionErrorBanner.tsx`
10. New: `src/components/WhyThisMatters.tsx` -- Cultural context cards