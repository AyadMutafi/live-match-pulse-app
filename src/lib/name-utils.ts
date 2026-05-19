/**
 * Utility for normalizing football player names to handle accents and diacritics.
 * Use this for robust matching across different data sources (APIs, Scrapers, DB).
 */
export function normalizeName(name: string): string {
  if (!name) return '';
  
  return name
    .normalize('NFD')                    // Decompose accented characters (e.g., é -> e + ´)
    .replace(/[\u0300-\u036f]/g, '')     // Remove the decomposed diacritical marks
    .replace(/ø/gi, 'o')                 // Handle Scandinavian Ø/ø → O/o
    .replace(/æ/gi, 'ae')                // Handle Æ/æ → AE/ae
    .replace(/ð/gi, 'd')                 // Handle Icelandic/Old English Ð/ð → D/d
    .replace(/ñ/gi, 'n')                 // Handle Spanish Ñ/ñ → N/n
    .replace(/ß/gi, 'ss')                // Handle German ß → ss
    .toLowerCase()
    .trim();
}

/**
 * Robustly compare two player names by normalizing them first.
 */
export function namesMatch(name1: string, name2: string): boolean {
  return normalizeName(name1) === normalizeName(name2);
}
