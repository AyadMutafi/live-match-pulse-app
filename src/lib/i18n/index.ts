import en from "./en.json";
import es from "./es.json";
import fr from "./fr.json";
import de from "./de.json";
import it from "./it.json";
import pt from "./pt.json";
import ar from "./ar.json";
import type { SupportedLanguage } from "@/components/LanguageSelector";

type TranslationKeys = typeof en;

const translations: Record<SupportedLanguage, TranslationKeys> = {
  en,
  es,
  fr,
  de,
  it,
  pt,
  ar,
};

export function getTranslation(language: SupportedLanguage): TranslationKeys {
  return translations[language] || translations.en;
}

// Helper to get nested translation value
export function t(
  language: SupportedLanguage,
  key: string
): string {
  const translation = getTranslation(language);
  const keys = key.split(".");
  let value: any = translation;
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return typeof value === "string" ? value : key;
}

export { translations };
export type { TranslationKeys };
