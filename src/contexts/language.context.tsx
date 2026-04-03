import { createContext, useContext, useEffect, useState } from 'react'

type Language = 'en' | 'vi'

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
}

const LANGUAGE_STORAGE_KEY = 'app_language'

const defaultLanguage: Language =
  (typeof window !== 'undefined' && (localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language)) || 'en'

const LanguageContext = createContext<LanguageContextValue>({
  language: defaultLanguage,
  setLanguage: () => undefined,
  toggleLanguage: () => undefined
})

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(defaultLanguage)

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
    }
  }

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'vi' : 'en')
  }

  // Sync from localStorage on mount (in case SSR or key changed)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null
    if (stored && stored !== language) {
      setLanguageState(stored)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)


