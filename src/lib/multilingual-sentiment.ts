// Define sentiment dictionaries
export const DICTIONARIES: Record<string, { positive: string[], negative: string[] }> = {
  English: {
    positive: ['amazing', 'brilliant', 'world class', 'goat', 'legend', 'fire', 'incredible', 'fantastic', 'outstanding', 'masterclass', 'unreal', 'special', 'class', 'superb', 'phenomenal'],
    negative: ['terrible', 'awful', 'worst', 'rubbish', 'trash', 'poor', 'disappointed', 'frustrating', 'embarrassing', 'useless', 'bad', 'dreadful', 'horrible', 'shocking', 'disgrace']
  },
  Spanish: {
    positive: ['increíble', 'impresionante', 'genial', 'maravilloso', 'fantástico', 'crack', 'máquina', 'fuera de serie', 'bestia', 'figura', 'ídolo', 'dios', 'potrillo', 'joya', 'fenómeno'],
    negative: ['terrible', 'pésimo', 'horrible', 'malísimo', 'desastre', 'vergüenza', 'decepción', 'patético', 'lento', 'malo', 'basura', 'inútil', 'fracaso']
  },
  Arabic: {
    positive: ['رائع', 'مذهل', 'أسطورة', 'ملك', 'فخر', 'بطل', 'عبقري', 'ماستر', 'نجم', 'خارق', '🔥', '😍', '👑'],
    negative: ['سيء', 'مخيف', 'مخجل', 'خيبة أمل', 'ضعيف', 'كارثة', 'فاشل', 'مقرف']
  },
  Portuguese: {
    positive: ['incrível', 'sensacional', 'fenômeno', 'craque', 'gênio', 'lenda', 'monstro', 'jogador', 'espetacular', 'brilhante', 'maravilhoso', 'camisa 10', 'revelação'],
    negative: ['horrível', 'péssimo', 'vergonha', 'desastre', 'decepção', 'ruim', 'lixo', 'fracasso', 'patético']
  },
  French: {
    positive: ['incroyable', 'phénoménal', 'génie', 'légende', 'extraordinaire', 'magnifique', 'sensationnel', 'prouesse', 'chef-d\'œuvre', 'exceptionnel'],
    negative: ['terrible', 'horrible', 'décevant', 'honteux', 'pathétique', 'désastre', 'catastrophe', 'nul']
  },
  German: {
    positive: ['unglaublich', 'phantastisch', 'Weltklasse', 'Legendär', 'genial', 'traumhaft', 'sensationell', 'meisterlich', 'phantastisch', 'Gott'],
    negative: ['schrecklich', 'furchtbar', 'enttäuschend', 'peinlich', 'katastrophal', 'miserabel', 'beschissen']
  },
  Italian: {
    positive: ['incredibile', 'fantastico', 'fenomeno', 'campione', 'leggendario', 'magico', 'sensazionale', 'extraordinario', 'capolavoro', 'fuoriclasse'],
    negative: ['terribile', 'orribile', 'pessimo', 'deludente', 'vergognoso', 'disastro', 'patetico']
  },
  Turkish: {
    positive: ['muhteşem', 'harika', 'efsane', 'dahı', 'yıldız', 'krall', 'mükemmel', 'süper', 'harika'],
    negative: ['berbat', 'kötü', 'rezalet', 'hayal kırıklığı', 'felaket']
  },
  Dutch: {
    positive: ['ongelofelijk', 'wereldklasse', 'fantastisch', 'legendarisch', 'briljant', 'sensationeel', 'meesterlijk'],
    negative: ['verschrikkelijk', 'vreselijk', 'teleurstellend', 'rampzalig', 'pathetisch']
  },
  Indonesian: {
    positive: ['luar biasa', 'hebat', 'legenda', 'idola', 'bintang', 'sensasional', 'keren', 'mantap', 'juara'],
    negative: ['buruk', 'jelek', 'mengecewakan', 'memalukan', 'gagal']
  },
  Hindi: {
    positive: ['शानदार', 'अद्भुत', 'महान', 'दिग्गज', 'सितारा', 'सर्वश्रेष्ठ', 'लेजेंड'],
    negative: ['बुरा', 'खराब', 'निराशाजनक', 'शर्मनाक']
  }
};

/**
 * Detects the dominant language based on keyword matches from the dictionaries.
 */
export function detectLanguage(text: string): string {
  const content = text.toLowerCase();
  let maxMatches = 0;
  let detectedLanguage = 'English'; // Default fallback

  for (const [lang, words] of Object.entries(DICTIONARIES)) {
    let matchCount = 0;
    const allWords = [...words.positive, ...words.negative];
    
    for (const word of allWords) {
      if (content.includes(word.toLowerCase())) {
        matchCount++;
      }
    }

    if (matchCount > maxMatches) {
      maxMatches = matchCount;
      detectedLanguage = lang;
    }
  }

  return detectedLanguage;
}

/**
 * Analyzes the text and calculates a sentiment score based on the detected language's dictionary.
 */
export function analyzeMultilingualSentiment(text: string): { score: number, language: string, confidence: number } {
  const language = detectLanguage(text);
  const dict = DICTIONARIES[language];
  const content = text.toLowerCase();
  
  let positiveScore = 0;
  let negativeScore = 0;

  for (const word of dict.positive) {
    if (content.includes(word.toLowerCase())) {
      positiveScore++;
    }
  }

  for (const word of dict.negative) {
    if (content.includes(word.toLowerCase())) {
      negativeScore++;
    }
  }

  const totalMatches = positiveScore + negativeScore;
  const confidence = totalMatches > 0 ? Math.min(1.0, totalMatches / 5) : 0; // Confidence scales up to 5 matches

  let score = 50; // Neutral baseline
  if (totalMatches > 0) {
    const ratio = positiveScore / totalMatches;
    score = Math.round(ratio * 100);
  }

  return {
    score,
    language,
    confidence
  };
}

/**
 * Returns a corresponding emoji label based on the sentiment score (0-100).
 */
export function getSentimentLabel(score: number): string {
  if (score >= 90) return '🔥'; // Elite/On Fire
  if (score >= 75) return '😍'; // Great
  if (score >= 60) return '🙂'; // Good
  if (score >= 40) return '😐'; // Neutral
  if (score >= 20) return '😤'; // Frustrating/Under Pressure
  return '💩'; // Critical/Terrible
}
