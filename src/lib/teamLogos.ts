// Team logo mapping utility
export const getTeamLogo = (teamName: string): string => {
  const normalizedName = teamName.toLowerCase().trim();
  
  // Map team names to logo URLs (using a public API or placeholder)
  const logoMap: Record<string, string> = {
    // Premier League
    'liverpool': 'https://resources.premierleague.com/premierleague/badges/70/t14.png',
    'liverpool fc': 'https://resources.premierleague.com/premierleague/badges/70/t14.png',
    'manchester city': 'https://resources.premierleague.com/premierleague/badges/70/t43.png',
    'man city': 'https://resources.premierleague.com/premierleague/badges/70/t43.png',
    'manchester united': 'https://resources.premierleague.com/premierleague/badges/70/t1.png',
    'man united': 'https://resources.premierleague.com/premierleague/badges/70/t1.png',
    'arsenal': 'https://resources.premierleague.com/premierleague/badges/70/t3.png',
    'arsenal fc': 'https://resources.premierleague.com/premierleague/badges/70/t3.png',
    'chelsea': 'https://resources.premierleague.com/premierleague/badges/70/t8.png',
    'chelsea fc': 'https://resources.premierleague.com/premierleague/badges/70/t8.png',
    'tottenham': 'https://resources.premierleague.com/premierleague/badges/70/t6.png',
    'spurs': 'https://resources.premierleague.com/premierleague/badges/70/t6.png',
    
    // La Liga
    'barcelona': 'https://assets.laliga.com/assets/logos/laliga-v/laliga-v-100x100/t178.png',
    'fc barcelona': 'https://assets.laliga.com/assets/logos/laliga-v/laliga-v-100x100/t178.png',
    'real madrid': 'https://assets.laliga.com/assets/logos/laliga-v/laliga-v-100x100/t186.png',
    'atletico madrid': 'https://assets.laliga.com/assets/logos/laliga-v/laliga-v-100x100/t175.png',
    'atlético madrid': 'https://assets.laliga.com/assets/logos/laliga-v/laliga-v-100x100/t175.png',
    'sevilla': 'https://assets.laliga.com/assets/logos/laliga-v/laliga-v-100x100/t179.png',
    
    // Serie A
    'juventus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Juventus_Logo_2017.svg/200px-Juventus_Logo_2017.svg.png',
    'ac milan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Logo_of_AC_Milan.svg/200px-Logo_of_AC_Milan.svg.png',
    'inter milan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FC_Internazionale_Milano_2021.svg/200px-FC_Internazionale_Milano_2021.svg.png',
    'inter': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FC_Internazionale_Milano_2021.svg/200px-FC_Internazionale_Milano_2021.svg.png',
    'napoli': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/SSC_Neapel.svg/200px-SSC_Neapel.svg.png',
    'roma': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/AS_Roma_logo_%282017%29.svg/200px-AS_Roma_logo_%282017%29.svg.png',
    'as roma': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/AS_Roma_logo_%282017%29.svg/200px-AS_Roma_logo_%282017%29.svg.png',
    
    // Bundesliga
    'bayern munich': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/200px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png',
    'borussia dortmund': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Borussia_Dortmund_logo.svg/200px-Borussia_Dortmund_logo.svg.png',
  };
  
  // Try to find exact match first
  if (logoMap[normalizedName]) {
    return logoMap[normalizedName];
  }
  
  // Try partial match
  for (const [key, value] of Object.entries(logoMap)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return value;
    }
  }
  
  // Return placeholder if no match found
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(teamName)}&background=random&size=128`;
};
