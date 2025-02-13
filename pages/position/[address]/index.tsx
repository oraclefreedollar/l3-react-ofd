import AppBox from 'components/AppBox'
import AppPageHeader from 'components/AppPageHeader'
import ChallengeTable from 'components/ChallengeTable'
import DisplayAmount from 'components/DisplayAmount'
import DisplayLabel from 'components/DisplayLabel'
import { ABIS, ADDRESS } from 'contracts'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useChallengeListStats, useChallengeLists, useContractUrl, useOfdPrice, usePositionStats } from 'hooks'
import { formatDate, shortenAddress } from 'utils'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getAddress, zeroAddress } from 'viem'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import { envConfig } from 'app.env.config'
import React, { useCallback } from 'react'

import { useCoingeckoPrices } from 'store/prices'
import { useTranslation } from 'next-i18next'
import { CoinTicker } from 'meta/coins'
import { withServerSideTranslations } from 'utils/withServerSideTranslations'
import { InferGetServerSidePropsType } from 'next'

const namespaces = ['positionOverview', 'challenge']

const PositionDetail: React.FC = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { t } = useTranslation(namespaces)

	const router = useRouter()
	const { address } = router.query
	const explorerUrl = useContractUrl(String(address))
	const position = getAddress(String(address || zeroAddress))

	const chainId = useChainId()
	const { address: account } = useAccount()
	const positionStats = usePositionStats(position)
	const ownerLink = useContractUrl(positionStats.owner)
	const { challenges, loading: queryLoading } = useChallengeLists({ position })
	const { challengsData, loading } = useChallengeListStats(challenges)

	const prices = useCoingeckoPrices()
	const collateralPrice = prices[positionStats.collateral?.toLowerCase() || zeroAddress]?.price?.usd

	const ofdPrice = useOfdPrice()

	const { data: positionAssignedReserve } = useReadContract({
		address: ADDRESS[chainId].oracleFreeDollar,
		abi: ABIS.OracleFreeDollarABI,
		functionName: 'calculateAssignedReserve',
		args: [positionStats.minted, Number(positionStats.reserveContribution)],
	})

	const isSubjectToCooldown = useCallback(() => {
		const now = BigInt(Math.floor(Date.now() / 1000))
		return now < positionStats.cooldown && positionStats.cooldown < 32508005122n
	}, [positionStats.cooldown])

	return (
		<>
			<Head>
				<title>
					{envConfig.AppName} - {t('positionOverview:title')}
				</title>
			</Head>
			<div>
				<AppPageHeader
					backText={t('positionOverview:back')}
					backTo="/positions"
					link={explorerUrl}
					title={t('positionOverview:subTitle', { address: address && shortenAddress(position) })}
				/>
				<section className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8 flex border border-purple-500/50 flex-col gap-y-4">
						<div className="text-lg font-bold text-center">{t('positionOverview:section:positionDetails')}</div>
						<div className="bg-slate-900 rounded-xl p-4 grid gap-2 grid-cols-2 lg:grid-cols-6">
							<AppBox className="col-span-3">
								<DisplayLabel label={t('positionOverview:section:mintedTotal')} />
								<DisplayAmount
									address={ADDRESS[chainId].oracleFreeDollar}
									amount={positionStats.minted}
									currency={CoinTicker.OFD}
									usdPrice={ofdPrice}
								/>
							</AppBox>
							<AppBox className="col-span-3">
								<DisplayLabel label={t('positionOverview:section:collateral')} />
								<DisplayAmount
									address={positionStats.collateral}
									amount={positionStats.collateralBal}
									currency={positionStats.collateralSymbol}
									digits={positionStats.collateralDecimal}
									usdPrice={collateralPrice}
								/>
							</AppBox>
							<AppBox className="col-span-3">
								<DisplayLabel label={t('positionOverview:section:liqPrice')} />
								<DisplayAmount
									address={ADDRESS[chainId].oracleFreeDollar}
									amount={positionStats.liqPrice}
									currency={CoinTicker.OFD}
									digits={36 - positionStats.collateralDecimal}
									usdPrice={ofdPrice}
								/>
							</AppBox>
							<AppBox className="col-span-3">
								<DisplayLabel label={t('positionOverview:section:retainedReserve')} />
								<DisplayAmount
									address={ADDRESS[chainId].oracleFreeDollar}
									amount={positionAssignedReserve || 0n}
									currency={CoinTicker.OFD}
									usdPrice={ofdPrice}
								/>
							</AppBox>
							<AppBox className="col-span-3">
								<DisplayLabel label={t('positionOverview:section:limit')} />
								<DisplayAmount
									address={ADDRESS[chainId].oracleFreeDollar}
									amount={positionStats.limit}
									currency={CoinTicker.OFD}
									usdPrice={ofdPrice}
								/>
							</AppBox>
							<AppBox className="col-span-1 sm:col-span-3">
								<DisplayLabel label={t('positionOverview:section:owner')} />
								<Link className="flex items-center" href={ownerLink} target="_blank">
									{shortenAddress(positionStats.owner)}
									<FontAwesomeIcon className="w-3 ml-2" icon={faArrowUpRightFromSquare} />
								</Link>
							</AppBox>
							<AppBox className="col-span-2 sm:col-span-2">
								<DisplayLabel label={t('positionOverview:section:expirationDate')} />
								<b>{positionStats.closed ? t('positionOverview:section:closed') : formatDate(positionStats.expiration)}</b>
							</AppBox>
							<AppBox className="col-span-1 sm:col-span-2">
								<DisplayLabel label={t('positionOverview:section:reserveRequirement')} />
								<DisplayAmount amount={positionStats.reserveContribution / 100n} currency={'%'} digits={2} hideLogo />
							</AppBox>
							<AppBox className="col-span-2 sm:col-span-2">
								<DisplayLabel label={t('positionOverview:section:annualInterest')} />
								<DisplayAmount amount={positionStats.annualInterestPPM / 100n} currency={'%'} digits={2} hideLogo />
							</AppBox>
						</div>
						<div className="mt-4 w-full flex">
							{positionStats.owner == account ? (
								<Link className="btn btn-primary w-72 m-auto" href={`/position/${position}/adjust`}>
									{t('positionOverview:buttons:adjust')}
								</Link>
							) : (
								<>
									<Link
										className={`btn btn-primary flex-1 ${isSubjectToCooldown() && 'btn-disabled'}`}
										href={`/position/${position}/borrow`}
									>
										{t('positionOverview:buttons:clone')}
									</Link>
									<Link className="btn btn-primary flex-1 ml-4" href={`/position/${position}/challenge`}>
										{t('positionOverview:buttons:challenge')}
									</Link>
								</>
							)}
						</div>
					</div>
					<div>
						{isSubjectToCooldown() && (
							<div className="bg-slate-950 rounded-xl p-4 flex flex-col mb-4">
								<div className="text-lg font-bold text-center">{t('positionOverview:cooldown:title')}</div>
								<AppBox className="flex-1 mt-4">
									<p>{t('positionOverview:cooldown:description', { cooldown: formatDate(positionStats.cooldown) })}</p>
								</AppBox>
							</div>
						)}
						<ChallengeTable
							challenges={challengsData}
							loading={loading || queryLoading}
							noContentText={t('positionOverview:challengeTable:noContent')}
						/>
					</div>
				</section>
			</div>
		</>
	)
}

export const getServerSideProps = withServerSideTranslations(namespaces)

export default PositionDetail
