// Allowed teams for the app (except Team of the Week section)
export const ALLOWED_TEAMS = [
  // Spain
  "FC Barcelona",
  "Barcelona",
  "Real Madrid",
  "Atletico Madrid",
  "Atlético Madrid",
  
  // England
  "Liverpool",
  "Liverpool FC",
  "Manchester City",
  "Man City",
  "Manchester United",
  "Man United",
  "Arsenal",
  "Arsenal FC",
  
  // Italy
  "Juventus",
  "AC Milan",
  "Inter Milan",
  "Inter",
] as const;

export const isAllowedTeam = (teamName: string): boolean => {
  return ALLOWED_TEAMS.some(
    allowed => teamName.toLowerCase().includes(allowed.toLowerCase()) || 
               allowed.toLowerCase().includes(teamName.toLowerCase())
  );
};
