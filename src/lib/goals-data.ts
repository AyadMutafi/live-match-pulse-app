/**
 * Goals Data (LEGACY)
 * All fictional data has been removed. 
 * Real-time goal data is now served via /api/goals.
 */

export const GOALS_FEED: any[] = [];
export const OFFICIAL_SOURCES: any = { leagues: [], broadcasters: [], clubs: [] };
export const GOAL_TYPE_EMOJI: any = {};
export const GOAL_TYPE_LABEL: any = {};

export function getGoalMatchdays(): string[] { return []; }
export function getGoalsByMatchday(matchday: string): any[] { return []; }

export type GoalHighlight = any;
export type GoalSource = any;
