export interface PlayerNameVariant {
  canonical: string;
  team: string;
  variants: Record<string, string[]>;
  keywords: string[];
}

export const PLAYER_NAME_VARIANTS: Record<string, PlayerNameVariant> = {
  // Mohamed Salah
  'salah': {
    canonical: 'Mohamed Salah',
    team: 'Liverpool',
    variants: {
      english: ['Salah', 'Mo Salah', 'Mohamed Salah', 'Egyptian King'],
      arabic: ['محمد صلاح', 'صلاح', 'محمود صلاح'],
      spanish: ['Salah', 'Mohamed Salah'],
      french: ['Salah', 'Mohamed Salah'],
      portuguese: ['Salah'],
      german: ['Salah'],
      italian: ['Salah'],
    },
    keywords: ['lion', 'king', 'egyptian', 'liverpool', 'mo']
  },
  
  // Lamine Yamal
  'yamal': {
    canonical: 'Lamine Yamal',
    team: 'Barcelona',
    variants: {
      english: ['Lamine Yamal', 'Yamal', 'Lamine'],
      spanish: ['Lamine Yamal', 'Yamal', 'Lamine', 'Yamalito'],
      arabic: ['يامال', 'لامين يامال'],
      catalan: ['Lamine Yamal', 'Yamal'],
      french: ['Lamine Yamal'],
      portuguese: ['Yamal'],
    },
    keywords: ['wonderkid', 'talent', 'barca', 'masia', 'jewel']
  },
  
  // Erling Haaland
  'haaland': {
    canonical: 'Erling Haaland',
    team: 'Manchester City',
    variants: {
      english: ['Haaland', 'Erling Haaland', 'Erling'],
      norwegian: ['Håland', 'Erling Håland', 'Haaland'],
      german: ['Haaland', 'Erling'],
      spanish: ['Haaland', 'Erling'],
      french: ['Haaland'],
      portuguese: ['Haaland'],
      arabic: ['هالاند', 'إيرلينغ هالاند'],
    },
    keywords: ['robot', 'machine', 'goals', 'city', 'striker']
  },
  
  // Kylian Mbappé
  'mbappe': {
    canonical: 'Kylian Mbappé',
    team: 'Real Madrid',
    variants: {
      english: ['Mbappe', 'Mbappé', 'Kylian', 'Kylian Mbappe'],
      french: ['Mbappé', 'Kylian Mbappé', 'KM'],
      spanish: ['Mbappé', 'Mbappe', 'Kylian'],
      arabic: ['مبابي', 'كيليان مبابي'],
      portuguese: ['Mbappé'],
      german: ['Mbappé'],
    },
    keywords: ['speed', 'prince', 'france', 'psg', 'madrid']
  },
  
  // Vinicius Jr
  'vinicius': {
    canonical: 'Vinicius Jr',
    team: 'Real Madrid',
    variants: {
      english: ['Vinicius', 'Vini', 'Vinicius Jr', 'Vini Jr'],
      portuguese: ['Vinicius', 'Vini', 'Vini Jr', 'Vinicius Júnior'],
      spanish: ['Vinicius', 'Vini', 'Vini Jr'],
      arabic: ['فينيسيوس', 'فيني'],
    },
    keywords: ['dribble', 'samba', 'brazil', 'madrid', 'skills']
  },
  
  // Jude Bellingham
  'bellingham': {
    canonical: 'Jude Bellingham',
    team: 'Real Madrid',
    variants: {
      english: ['Bellingham', 'Jude', 'Jude Bellingham'],
      spanish: ['Bellingham', 'Jude', 'Belli'],
      german: ['Bellingham'],
      french: ['Bellingham'],
      arabic: ['بيلينغهام', 'جود بيلينغهام'],
    },
    keywords: ['midfield', 'england', 'madrid', 'complete']
  },
  
  // Cole Palmer
  'palmer': {
    canonical: 'Cole Palmer',
    team: 'Chelsea',
    variants: {
      english: ['Palmer', 'Cole Palmer', 'Cole', 'CP10'],
      spanish: ['Palmer', 'Cole Palmer'],
      portuguese: ['Palmer'],
      french: ['Palmer'],
    },
    keywords: ['ice', 'cool', 'chelsea', 'playmaker']
  },
  
  // Bukayo Saka
  'saka': {
    canonical: 'Bukayo Saka',
    team: 'Arsenal',
    variants: {
      english: ['Saka', 'Bukayo Saka', 'Bukayo'],
      spanish: ['Saka'],
      french: ['Saka'],
      portuguese: ['Saka'],
      arabic: ['ساكا', 'بوكايو ساكا'],
    },
    keywords: ['starboy', 'arsenal', 'winger', 'england']
  },

  // Lionel Messi
  'messi': {
    canonical: 'Lionel Messi',
    team: 'Inter Miami',
    variants: {
      english: ['Messi', 'Lionel Messi', 'Leo', 'Leo Messi'],
      spanish: ['Messi', 'Lionel Messi', 'Leo', 'La Pulga'],
      arabic: ['ميسي', 'ليونيل ميسي', 'ليو'],
    },
    keywords: ['goat', 'magic', 'argentina', 'miami', 'alien']
  },

  // Cristiano Ronaldo
  'ronaldo': {
    canonical: 'Cristiano Ronaldo',
    team: 'Al Nassr',
    variants: {
      english: ['Ronaldo', 'Cristiano', 'Cristiano Ronaldo', 'CR7'],
      portuguese: ['Ronaldo', 'Cristiano', 'Cristiano Ronaldo', 'Robozão'],
      arabic: ['رونالدو', 'كريستيانو', 'كريستيانو رونالدو', 'الدون'],
    },
    keywords: ['goat', 'siuu', 'portugal', 'alnassr', 'machine']
  },

  // Harry Kane
  'kane': {
    canonical: 'Harry Kane',
    team: 'Bayern Munich',
    variants: {
      english: ['Kane', 'Harry Kane', 'Harry'],
      german: ['Kane', 'Harry Kane'],
      arabic: ['كين', 'هاري كين'],
    },
    keywords: ['striker', 'goals', 'bayern', 'england', 'finisher']
  },

  // Son Heung-min
  'son': {
    canonical: 'Son Heung-min',
    team: 'Tottenham Hotspur',
    variants: {
      english: ['Son', 'Sonny', 'Son Heung-min', 'Heung-min Son'],
      korean: ['손흥민', '쏘니'],
      arabic: ['سون', 'هيونغ مين سون'],
    },
    keywords: ['spurs', 'korea', 'puskas', 'smiles', 'captain']
  },

  // Phil Foden
  'foden': {
    canonical: 'Phil Foden',
    team: 'Manchester City',
    variants: {
      english: ['Foden', 'Phil Foden', 'Phil'],
      spanish: ['Foden'],
      arabic: ['فودين', 'فيل فودين'],
    },
    keywords: ['sniper', 'city', 'england', 'stockport']
  },

  // Rodri
  'rodri': {
    canonical: 'Rodri',
    team: 'Manchester City',
    variants: {
      english: ['Rodri', 'Rodrigo'],
      spanish: ['Rodri', 'Rodrigo Hernández', 'Rodrigo'],
      arabic: ['رودري', 'رودريجو'],
    },
    keywords: ['midfield', 'city', 'spain', 'anchor', 'clutch']
  },

  // Declan Rice
  'rice': {
    canonical: 'Declan Rice',
    team: 'Arsenal',
    variants: {
      english: ['Rice', 'Declan Rice', 'Declan'],
      arabic: ['رايس', 'ديكلان رايس'],
    },
    keywords: ['midfield', 'arsenal', 'england', 'engine']
  }
};

// Function to find player mentions in any language
export function findPlayerMentions(text: string): string[] {
  const mentions: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const playerObj of Object.values(PLAYER_NAME_VARIANTS)) {
    let matched = false;
    for (const variants of Object.values(playerObj.variants)) {
      if (matched) break;
      for (const variant of variants) {
        // Use word boundary check to avoid partial word matching if it's alphanumeric
        // For non-latin scripts (like Arabic, Korean) we can just use Includes
        const isLatin = /^[a-zA-Z\s]+$/.test(variant);
        let match = false;

        if (isLatin) {
          try {
            const regex = new RegExp(`\\b${variant.toLowerCase()}\\b`, 'i');
            match = regex.test(lowerText);
          } catch(e) {
            match = lowerText.includes(variant.toLowerCase());
          }
        } else {
          match = lowerText.includes(variant.toLowerCase());
        }

        if (match) {
          if (!mentions.includes(playerObj.canonical)) {
            mentions.push(playerObj.canonical);
          }
          matched = true;
          break;
        }
      }
    }
  }
  
  return mentions;
}
