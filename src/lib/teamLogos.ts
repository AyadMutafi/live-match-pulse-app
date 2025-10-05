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
    'tottenham hotspur': 'https://resources.premierleague.com/premierleague/badges/70/t6.png',
    'spurs': 'https://resources.premierleague.com/premierleague/badges/70/t6.png',
    'newcastle': 'https://resources.premierleague.com/premierleague/badges/70/t4.png',
    'newcastle united': 'https://resources.premierleague.com/premierleague/badges/70/t4.png',
    'aston villa': 'https://resources.premierleague.com/premierleague/badges/70/t7.png',
    'brighton': 'https://resources.premierleague.com/premierleague/badges/70/t36.png',
    'west ham': 'https://resources.premierleague.com/premierleague/badges/70/t21.png',
    'leicester': 'https://resources.premierleague.com/premierleague/badges/70/t13.png',
    'everton': 'https://resources.premierleague.com/premierleague/badges/70/t11.png',
    'brentford': 'https://resources.premierleague.com/premierleague/badges/70/t94.png',
    'fulham': 'https://resources.premierleague.com/premierleague/badges/70/t54.png',
    'crystal palace': 'https://resources.premierleague.com/premierleague/badges/70/t31.png',
    'wolves': 'https://resources.premierleague.com/premierleague/badges/70/t39.png',
    'wolverhampton': 'https://resources.premierleague.com/premierleague/badges/70/t39.png',
    'nottingham forest': 'https://resources.premierleague.com/premierleague/badges/70/t17.png',
    'bournemouth': 'https://resources.premierleague.com/premierleague/badges/70/t91.png',
    'southampton': 'https://resources.premierleague.com/premierleague/badges/70/t20.png',
    
    // La Liga
    'barcelona': 'https://assets.laliga.com/assets/logos/laliga-v/laliga-v-100x100/t178.png',
    'fc barcelona': 'https://assets.laliga.com/assets/logos/laliga-v/laliga-v-100x100/t178.png',
    'real madrid': 'https://assets.laliga.com/assets/logos/laliga-v/laliga-v-100x100/t186.png',
    'atletico madrid': 'https://assets.laliga.com/assets/logos/laliga-v/laliga-v-100x100/t175.png',
    'atlético madrid': 'https://assets.laliga.com/assets/logos/laliga-v/laliga-v-100x100/t175.png',
    'sevilla': 'https://assets.laliga.com/assets/logos/laliga-v/laliga-v-100x100/t179.png',
    'sevilla fc': 'https://assets.laliga.com/assets/logos/laliga-v/laliga-v-100x100/t179.png',
    'real betis': 'https://assets.laliga.com/assets/logos/laliga-v/laliga-v-100x100/t185.png',
    'villarreal': 'https://assets.laliga.com/assets/logos/laliga-v/laliga-v-100x100/t449.png',
    'real sociedad': 'https://assets.laliga.com/assets/logos/laliga-v/laliga-v-100x100/t681.png',
    'athletic bilbao': 'https://assets.laliga.com/assets/logos/laliga-v/laliga-v-100x100/t177.png',
    'valencia': 'https://assets.laliga.com/assets/logos/laliga-v/laliga-v-100x100/t184.png',
    'getafe': 'https://assets.laliga.com/assets/logos/laliga-v/laliga-v-100x100/t314.png',
    
    // Serie A
    'juventus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Juventus_Logo_2017.svg/200px-Juventus_Logo_2017.svg.png',
    'ac milan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Logo_of_AC_Milan.svg/200px-Logo_of_AC_Milan.svg.png',
    'milan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Logo_of_AC_Milan.svg/200px-Logo_of_AC_Milan.svg.png',
    'inter milan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FC_Internazionale_Milano_2021.svg/200px-FC_Internazionale_Milano_2021.svg.png',
    'inter': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FC_Internazionale_Milano_2021.svg/200px-FC_Internazionale_Milano_2021.svg.png',
    'napoli': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/SSC_Neapel.svg/200px-SSC_Neapel.svg.png',
    'ssc napoli': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/SSC_Neapel.svg/200px-SSC_Neapel.svg.png',
    'roma': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/AS_Roma_logo_%282017%29.svg/200px-AS_Roma_logo_%282017%29.svg.png',
    'as roma': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/AS_Roma_logo_%282017%29.svg/200px-AS_Roma_logo_%282017%29.svg.png',
    'lazio': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/S.S._Lazio_badge.svg/200px-S.S._Lazio_badge.svg.png',
    'atalanta': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Atalanta_BC_logo.svg/200px-Atalanta_BC_logo.svg.png',
    'fiorentina': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/ACF_Fiorentina.svg/200px-ACF_Fiorentina.svg.png',
    
    // Bundesliga
    'bayern munich': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/200px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png',
    'bayern': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/200px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png',
    'borussia dortmund': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Borussia_Dortmund_logo.svg/200px-Borussia_Dortmund_logo.svg.png',
    'bvb': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Borussia_Dortmund_logo.svg/200px-Borussia_Dortmund_logo.svg.png',
    'rb leipzig': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/RB_Leipzig_2014_logo.svg/200px-RB_Leipzig_2014_logo.svg.png',
    'bayer leverkusen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Bayer_Leverkusen_logo.svg/200px-Bayer_Leverkusen_logo.svg.png',
    
    // Ligue 1
    'psg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Paris_Saint-Germain_Logo_2013.svg/200px-Paris_Saint-Germain_Logo_2013.svg.png',
    'paris saint-germain': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Paris_Saint-Germain_Logo_2013.svg/200px-Paris_Saint-Germain_Logo_2013.svg.png',
    'marseille': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Olympique_Marseille_logo.svg/200px-Olympique_Marseille_logo.svg.png',
    'lyon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Olympique_Lyonnais_logo.svg/200px-Olympique_Lyonnais_logo.svg.png',
    'monaco': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Logo_AS_Monaco.svg/200px-Logo_AS_Monaco.svg.png',
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
