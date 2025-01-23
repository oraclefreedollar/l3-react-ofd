import { initReactI18next } from 'react-i18next'

import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { LanguageCode } from 'meta/languages'

import resources from './resources/resources'

i18n
	// load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
	// learn more: https://github.com/i18next/i18next-http-backend
	// want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
	.use(Backend)
	// detect user language
	// learn more: https://github.com/i18next/i18next-browser-languageDetector
	.use(new LanguageDetector(undefined, { lookupLocalStorage: 'i18nLang' }))
	// pass the i18n instance to react-i18next.
	.use(initReactI18next)
	.init({
		resources,
		detection: {
			order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator'],
		},
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
		},
		load: 'languageOnly',
		parseMissingKeyHandler: () => '',
		nonExplicitSupportedLngs: true,
		supportedLngs: Object.keys(LanguageCode),
		react: {
			bindI18nStore: 'added',
			useSuspense: false,
		},
	})

export default i18n
