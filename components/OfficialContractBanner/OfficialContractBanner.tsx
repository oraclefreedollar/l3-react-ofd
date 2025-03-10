import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import { useChainId } from 'wagmi'
import { ADDRESS } from 'contracts'

const fadeInUp = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
}

const OfficialContractBanner: React.FC = () => {
	const { t } = useTranslation('home', { useSuspense: false })
	const chainId = useChainId()

	return (
		<motion.div
			className="container mx-auto px-4 py-6 flex justify-center gap-8"
			initial="hidden"
			variants={fadeInUp}
			viewport={{ once: true }}
			whileInView="visible"
		>
			<div className="w-full bg-gradient-to-r from-purple-900/90 via-slate-900/95 to-purple-900/90 border-b border-purple-500/50 rounded-lg">
				<div className="container mx-auto px-4 py-4">
					<div className="flex flex-col items-center justify-center gap-4">
						<span className="font-semibold text-slate-200">{t('home:officialContracts:title')}</span>
						<div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
							<div className="flex-1 bg-slate-900/50 p-4 border border-purple-500/30 hover:border-purple-500/50 transition-all rounded-lg">
								<div className="flex flex-col md:flex-row items-center justify-between gap-4">
									<div className="flex flex-col gap-1">
										<span className="text-purple-400 font-semibold">{t('home:officialContracts:ofd:title')}</span>
										<code className="text-xs sm:text-sm text-slate-300">{ADDRESS[chainId].oracleFreeDollar}</code>
									</div>
									<button
										className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
										onClick={() => {
											window.ethereum?.request({
												method: 'wallet_watchAsset',
												params: {
													type: 'ERC20',
													options: {
														address: ADDRESS[chainId].oracleFreeDollar,
														symbol: 'OFD',
														decimals: 18,
													},
												},
											})
										}}
									>
										<div className="w-5 h-5">
											<Image alt="MetaMask Icon" height={24} src="/icons/metamask.svg" width={24} />
										</div>
									</button>
								</div>
							</div>
							<div className="flex-1 bg-slate-900/50 p-4 border border-purple-500/30 hover:border-purple-500/50 transition-all rounded-lg">
								<div className="flex flex-col md:flex-row items-center justify-between gap-4">
									<div className="flex flex-col gap-1">
										<span className="text-purple-400 font-semibold">{t('home:officialContracts:ofdps:title')}</span>
										<code className="text-xs sm:text-sm text-slate-300">{ADDRESS[chainId].equity}</code>
									</div>
									<button
										className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
										onClick={() => {
											window.ethereum?.request({
												method: 'wallet_watchAsset',
												params: {
													type: 'ERC20',
													options: {
														address: ADDRESS[chainId].equity,
														symbol: 'OFDPS',
														decimals: 18,
													},
												},
											})
										}}
									>
										<div className="w-5 h-5">
											<Image alt="MetaMask Icon" height={24} src="/icons/metamask.svg" width={24} />
										</div>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	)
}

export default OfficialContractBanner
