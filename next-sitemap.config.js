// next-sitemap.config.js

module.exports = {
	siteUrl: 'https://app.oraclefreedollar.org',
	generateRobotsTxt: true,
	sitemapSize: 5000,
	generateIndexSitemap: true,
	changefreq: 'daily',
	priority: 0.7,
	exclude: ['/faucet'],
	robotsTxtOptions: {
		policies: [
			{ userAgent: '*', allow: '/', disallow: '/faucet' },  // Allow all bots to crawl all pages
		],
		additionalSitemaps: [
			'https://app.oraclefreedollar.org/sitemap-0.xml',
		],
	},
	autoLastmod: true,
}
