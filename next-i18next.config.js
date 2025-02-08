const HttpBackend = require('i18next-http-backend/cjs')
const ChainedBackend = require('i18next-chained-backend').default
const LocalStorageBackend = require('i18next-localstorage-backend').default

const isBrowser = typeof window !== 'undefined'
const isDev = process.env.NEXT_PUBLIC_ENV === 'dev'

/** @type {import('next-i18next').UserConfig} */
module.exports = {
	// It should config backend, use, partialBundledLanguages in case you want to translate for auto static page
	backend: {
		backendOptions: [{ expirationTime: isDev ? 60 * 1000 : 60 * 60 * 1000 }, {}], // 1 hour
		backends: isBrowser ? [LocalStorageBackend, HttpBackend] : [],
	},
	// https://www.i18next.com/overview/configuration-options#logging
	debug: isDev,
	i18n: {
		defaultLocale: 'en',
		locales: ['en'],
	},
	initAsync: false,
	/** To avoid issues when deploying to some paas (vercel...) */
	localePath: typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/locales',
	ns: [
		'auctions',
		'challenge',
		'collateral',
		'common',
		'equity',
		'governance',
		'home',
		'monitoring',
		'myPositions',
		'positionAdjust',
		'positionBid',
		'positionBorrow',
		'positionCollaterals',
		'positionCreate',
		'positionOverview',
		'savings',
		'swap',
	],
	partialBundledLanguages: isBrowser,
	reloadOnPrerender: isDev,
	use: isBrowser ? [ChainedBackend] : [],
	react: { useSuspense: false },
}
