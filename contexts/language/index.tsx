// contexts/LanguageContext.js
import React, { Context, createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { LanguageCode } from 'meta/languages'
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
		// Get initial language from cookie if available
		const storedLanguage = (cookies.get('language') || 'en') as LanguageCode
		changeLanguage(storedLanguage)
	}, [changeLanguage])

	return <LanguageContext.Provider value={{ language, changeLanguage }}>{children}</LanguageContext.Provider>
}
