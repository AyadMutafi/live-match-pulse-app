"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'EN' | 'AR'

type LanguageContextType = {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  EN: {
    'app.title': 'FANPULSE',
    'nav.home': 'HOME',
    'nav.calendar': 'CALENDAR',
    'nav.sentiments': 'SENTIMENTS',
    'nav.rate': 'RATE',
    'nav.goals': 'GOALS',
    'nav.totw': 'TOTW',
    'header.pro': 'PRO',
    'header.upgrade': 'Upgrade to PRO',
    'home.your_pulse': 'Your Pulse',
    'home.mood_desc': "How your clubs' fans are feeling right now",
    'home.fan_mood': 'Fan Mood',
    'sentiments.title': 'Match Sentiments',
    'sentiments.powered': 'Powered by Gemini AI + X data',
    'sentiments.full_analysis': 'Deep Sentiment Pulse',
    'goals.title': 'Goals',
    'goals.desc': 'Official highlights from verified league & club accounts',
    'ratings.title': 'Fan Player Ratings',
    'ratings.desc': 'Rate players based on your emotions and feelings',
    'totw.title': 'Weekly Ratings',
    'totw.potw': 'POTW',
    'totw.power_ranks': 'Power Ranks',
  },
  AR: {
    'app.title': 'فان بولس',
    'nav.home': 'الرئيسية',
    'nav.calendar': 'التقويم',
    'nav.sentiments': 'المشاعر',
    'nav.rate': 'التقييم',
    'nav.goals': 'أهداف',
    'nav.totw': 'فريق الأسبوع',
    'header.pro': 'برو',
    'header.upgrade': 'ترقية إلى برو',
    'home.your_pulse': 'نبضك',
    'home.mood_desc': 'كيف يشعر مشجعو أنديتك الآن',
    'home.fan_mood': 'مزاج المشجعين',
    'sentiments.title': 'مشاعر المباريات',
    'sentiments.powered': 'مدعوم بـ Gemini AI و بيانات X',
    'sentiments.full_analysis': 'نبض المشاعر العميق',
    'goals.title': 'الأهداف',
    'goals.desc': 'أبرز الأهداف من حسابات الأندية والدوريات الرسمية',
    'ratings.title': 'تقييمات اللاعبين من المشجعين',
    'ratings.desc': 'قيم اللاعبين بناءً على مشاعرك وأحاسيسك',
    'totw.title': 'التقييمات الأسبوعية',
    'totw.potw': 'لاعب الأسبوع',
    'totw.power_ranks': 'تصنيفات القوة',
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('EN')

  // Effect to handle RTL
  useEffect(() => {
    document.documentElement.dir = lang === 'AR' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang === 'AR' ? 'ar' : 'en'
  }, [lang])

  const t = (key: string) => {
    return translations[lang][key as keyof typeof translations['EN']] || key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
