/** @type {import('next-i18next').UserConfig} */
const nextI18nextConfig = {
	i18n: {
		defaultLocale: 'en',
		locales: ['en'],
	},
	supportedLngs: ['en'],
	reloadOnPrerender: true,
	localeDetection: true,
	fallbackLng: 'en',
}

module.exports = nextI18nextConfig
