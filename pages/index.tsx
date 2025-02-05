import { TbPigMoney } from 'react-icons/tb'
import { BiCoinStack } from 'react-icons/bi'
import { FaChartLine, FaDollarSign, FaTwitter, FaGithub, FaTelegram } from 'react-icons/fa'
import { MdOutlinePool } from 'react-icons/md'
import { parseUnits } from 'viem'
import { ENABLE_EMERGENCY_MODE, formatBigInt } from 'utils'
import { SOCIAL } from 'utils'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useHomeStats, useOfdPrice, useTvl } from 'hooks'
import { LiaExchangeAltSolid } from 'react-icons/lia'
import { GrMoney } from 'react-icons/gr'
import OfficialContractBanner from 'components/OfficialContractBanner'
import { useTranslation } from 'next-i18next'
import React, { useMemo } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const fadeInUp = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
}

const Home: React.FC = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { t } = useTranslation(['home', 'common'], { useSuspense: false })

	const tvlData = useTvl()
	const homestats = useHomeStats()
	const ofdPrice = useOfdPrice()

	const stats = useMemo(
		() => [
			{
				icon: FaDollarSign,
				title: t('home:stats:price'),
				value: `$${ofdPrice ? formatBigInt(parseUnits(ofdPrice.toString(), 18), 18, 2) : '0.00'}`,
			},
			{
				icon: TbPigMoney,
				title: t('home:stats:tvl'),
				value: `$${formatBigInt(parseUnits(tvlData?.toString() || '0', 18), 18, 0)}`,
			},
			{
				icon: BiCoinStack,
				title: t('home:stats:marketCap'),
				value: `$${formatBigInt(homestats.equityMarketCap || 0n, 18, 0)}`,
			},
			{
				icon: FaChartLine,
				title: t('home:stats:totalSupply'),
				value: `${formatBigInt(homestats.ofdTotalSupply || 0n, 18, 0)} OFD`,
			},
		],
		[homestats?.equityMarketCap, homestats?.ofdTotalSupply, ofdPrice, tvlData, t]
	)

	const navigationLinks = [
		...(!ENABLE_EMERGENCY_MODE
			? [
					{
						title: t('home:navigation:swap:title'),
						description: t('home:navigation:swap:description'),
						href: '/swap',
						icon: LiaExchangeAltSolid,
					},
					{
						title: t('home:navigation:createPosition:title'),
						description: t('home:navigation:createPosition:description'),
						href: '/positions/create',
						icon: GrMoney,
					},
				]
			: []),
		{
			title: t('home:navigation:pool:title'),
			description: t('home:navigation:pool:description'),
			href: '/pool',
			icon: MdOutlinePool,
		},
	]

	return (
		<main className="min-h-screen">
			<motion.section animate="visible" className="container mx-auto px-4 pt-16 pb-8 text-center" initial="hidden" variants={fadeInUp}>
				<h1 className="text-6xl md:text-7xl font-bold text-neon-purple-subtle hover:text-neon-pink-subtle transition-all duration-300 ease-in-out mb-4">
					{t('home:hero:title')}
				</h1>
				<p className="text-slate-100 text-lg leading-relaxed max-w-3xl mx-auto">{t('home:hero:subtitle')}</p>
			</motion.section>

			<motion.div
				className="container mx-auto px-4 py-6 flex justify-center gap-8"
				initial="hidden"
				variants={fadeInUp}
				viewport={{ once: true }}
				whileInView="visible"
			>
				{[
					{ icon: FaTwitter, link: SOCIAL.Twitter },
					{ icon: FaGithub, link: SOCIAL.Github_contract },
					{ icon: FaTelegram, link: SOCIAL.Telegram },
				].map((social, index) => (
					<Link className="text-slate-100 hover:text-purple-400 transition-colors" href={social.link} key={index} target="_blank">
						<social.icon size={32} />
					</Link>
				))}
			</motion.div>

			<section className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					{stats.map((stat, index) => (
						<motion.div
							className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-4 flex flex-col border border-purple-500/50"
							initial="hidden"
							key={index}
							variants={{
								hidden: { opacity: 0, y: 20 },
								visible: {
									opacity: 1,
									y: 0,
									transition: { delay: index * 0.2 },
								},
							}}
							viewport={{ once: true }}
							whileInView="visible"
						>
							<div className="flex items-center justify-center mb-3">
								<stat.icon className="text-purple-400" size={40} />
							</div>
							<h3 className="text-lg font-medium text-slate-300 text-center mb-1">{stat.title}</h3>
							<p className="text-2xl font-bold text-white text-center">{stat.value}</p>
						</motion.div>
					))}
				</div>
			</section>

			<motion.section
				className="container mx-auto px-4 py-8"
				initial="hidden"
				variants={fadeInUp}
				viewport={{ once: true }}
				whileInView="visible"
			>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-4 flex flex-col border border-purple-500/50">
						<h2 className="text-3xl font-bold mb-4 text-white">{t('home:about:title')}</h2>
						<p className="text-slate-300 text-lg leading-relaxed">{t('home:about:description')}</p>
					</div>
					<motion.div
						className="flex justify-center"
						initial={{ opacity: 0, scale: 0.8 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
						whileInView={{ opacity: 1, scale: 1 }}
					>
						<img alt="Oracle Free Dollar Logo" className="w-3/5 max-w-md rounded-full" src="/assets/ofd-white.png" />
					</motion.div>
				</div>

				<div className={`gap-6 mt-12 ${!ENABLE_EMERGENCY_MODE ? 'grid grid-cols-1 md:grid-cols-3' : 'flex justify-center md:grid-cols-3'}`}>
					{navigationLinks.map((link, index) => (
						<motion.div
							initial="hidden"
							key={index}
							variants={{
								hidden: { opacity: 0, y: 20 },
								visible: {
									opacity: 1,
									y: 0,
									transition: { delay: index * 0.2 },
								},
							}}
							viewport={{ once: true }}
							whileInView="visible"
						>
							<Link href={link.href}>
								<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-6 flex flex-col border border-purple-500/50 hover:border-purple-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full group">
									<div className="flex items-center gap-3 mb-3">
										<link.icon className="text-purple-400 group-hover:text-purple-300 transition-colors" size={32} />
										<h3 className="text-xl font-bold text-white group-hover:text-purple-100 transition-colors">{link.title}</h3>
									</div>
									<p className="text-slate-300 group-hover:text-slate-200 transition-colors">{link.description}</p>
								</div>
							</Link>
						</motion.div>
					))}
				</div>
			</motion.section>

			<OfficialContractBanner />

			<motion.footer
				className="container mx-auto px-4"
				initial="hidden"
				variants={fadeInUp}
				viewport={{ once: true }}
				whileInView="visible"
			/>
		</main>
	)
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale ?? 'en', ['home', 'common'])),
	},
})

export default Home
