// contexts/LanguageContext.js
import React, { Context, createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { LanguageCode, availableLanguages } from 'meta/languages'
import cookies from 'js-cookie'

type LanguageContextType = {
	language: string
	changeLanguage: (newLang: LanguageCode) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => useContext<LanguageContextType>(LanguageContext as Context<LanguageContextType>)

export const LanguageProvider: React.FC<PropsWithChildren> = (props) => {
	const { children } = props
	const { i18n } = useTranslation()
	const [language, setLanguage] = useState('en')

	const changeLanguage = useCallback(
		async (newLang: LanguageCode) => {
			setLanguage(newLang)
			cookies.set('language', newLang)
			await i18n.changeLanguage(newLang)
		},
		[i18n]
	)

	useEffect(() => {
		// Function to get the best matching language from browser
		const detectBrowserLanguage = (): string => {
			// First, check if we have a stored preference
			const storedLanguage = cookies.get('language')
			if (storedLanguage) {
				return storedLanguage
			}

			// Get browser languages
			const browserLangs = navigator.languages || [navigator.language || (navigator as any).userLanguage || 'en']

			// Find the first match in our supported languages
			for (const browserLang of browserLangs) {
				// Get the base language code (e.g., 'en' from 'en-US')
				const baseLang = browserLang.split('-')[0].toLowerCase()

				// Check if this language is supported
				const match = availableLanguages.find((lang) => lang.code === baseLang || lang.code === browserLang.toLowerCase())

				if (match) {
					return match.code
				}
			}

			// Fallback to English
			return 'en'
		}

		// Detect and set the language
		const detectedLang = detectBrowserLanguage()
		setLanguage(detectedLang)
		cookies.set('language', detectedLang)
		i18n.changeLanguage(detectedLang)
	}, [i18n])

	return <LanguageContext.Provider value={{ language, changeLanguage }}>{children}</LanguageContext.Provider>
}
