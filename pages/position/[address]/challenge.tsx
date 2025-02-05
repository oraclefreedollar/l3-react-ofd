import AppBox from 'components/AppBox'
import AppPageHeader from 'components/AppPageHeader'
import Button from 'components/Button'
import DisplayAmount from 'components/DisplayAmount'
import DisplayLabel from 'components/DisplayLabel'
import GuardToAllowedChainBtn from 'components/Guards/GuardToAllowedChainBtn'
import TokenInput from 'components/Input/TokenInput'
import { ADDRESS } from 'contracts'
import { useOfdPrice, usePositionStats } from 'hooks'
import { formatBigInt, formatDuration } from 'utils'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { getAddress, zeroAddress } from 'viem'
import { useAccount, useChainId } from 'wagmi'
import { envConfig } from 'app.env.config'
import { useSelector } from 'react-redux'
import { RootState } from 'redux/redux.store'
import { useChallengeContractsFunctions } from 'hooks/challenge/useChallengeContractsFunctions'
import { useTranslation } from 'next-i18next'

export default function PositionChallenge() {
	const router = useRouter()
	const { address: positionAddr } = router.query
	const { t } = useTranslation()

	const [amount, setAmount] = useState(0n)
	const [error, setError] = useState('')

	const chainId = useChainId()
	const { address } = useAccount()
	const account = address || zeroAddress
	const position = getAddress(String(positionAddr || zeroAddress))
	const positionStats = usePositionStats(position)
	const prices = useSelector((state: RootState) => state.prices.coingecko)
	const collateralPrice = prices[positionStats.collateral?.toLowerCase() ?? zeroAddress]?.price?.usd
	const ofdPrice = useOfdPrice()

	const { isApproving, handleApprove, isChallenging, handleChallenge } = useChallengeContractsFunctions({ amount, position, positionStats })

	const onChangeAmount = useCallback(
		(value: string) => {
			const valueBigInt = BigInt(value)
			setAmount(valueBigInt)
			if (valueBigInt > positionStats.collateralUserBal) {
				setError(t('pages:challenge:form:errors:insufficientBalance', { symbol: positionStats.collateralSymbol }))
			} else if (valueBigInt > positionStats.collateralBal) {
				setError(t('pages:challenge:form:errors:tooHighCollateral'))
			} else if (valueBigInt < positionStats.minimumCollateral) {
				setError(t('pages:challenge:form:errors:tooLowCollateral'))
			} else {
				setError('')
			}
		},
		[positionStats.collateralBal, positionStats.collateralSymbol, positionStats.collateralUserBal, positionStats.minimumCollateral, t]
	)

	return (
		<>
			<Head>
				<title>
					{envConfig.AppName} - {t('pages:challenge:title')}
				</title>
			</Head>
			<div>
				<AppPageHeader
					backText={t('pages:challenge:header:backText')}
					backTo={`/position/${position}`}
					title={t('pages:challenge:header:title')}
				/>
				<section className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8 flex flex-col border border-purple-500/50 gap-y-4">
						<div className="text-lg font-bold text-center mt-3">{t('pages:challenge:form:title')}</div>
						<TokenInput
							digit={positionStats.collateralDecimal}
							error={error}
							label={t('pages:challenge:form:amount:label')}
							max={positionStats.collateralUserBal}
							onChange={onChangeAmount}
							placeholder={t('pages:challenge:form:amount:placeholder')}
							symbol={positionStats.collateralSymbol}
							value={amount.toString()}
						/>
						<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-4 flex flex-col border border-purple-500/50 gap-2 lg:col-span-2">
							<AppBox className="col-span-6 sm:col-span-3">
								<DisplayLabel label={t('pages:challenge:details:startingPrice')} />
								<DisplayAmount
									address={ADDRESS[chainId].oracleFreeDollar}
									amount={positionStats.liqPrice}
									currency={'OFD'}
									digits={36 - positionStats.collateralDecimal}
									usdPrice={ofdPrice}
								/>
							</AppBox>
							<AppBox className="col-span-6 sm:col-span-3">
								<DisplayLabel label={t('pages:challenge:details:maximumProceeds')} />
								<DisplayAmount
									address={ADDRESS[chainId].oracleFreeDollar}
									amount={positionStats.liqPrice * amount}
									currency={'OFD'}
									digits={36 - positionStats.collateralDecimal + 18}
									usdPrice={ofdPrice}
								/>
							</AppBox>
							<AppBox className="col-span-6 sm:col-span-3">
								<DisplayLabel label={t('pages:challenge:details:collateralInPosition')} />
								<DisplayAmount
									address={positionStats.collateral}
									amount={positionStats.collateralBal}
									currency={positionStats.collateralSymbol}
									digits={positionStats.collateralDecimal}
									usdPrice={collateralPrice}
								/>
							</AppBox>
							<AppBox className="col-span-6 sm:col-span-3">
								<DisplayLabel label={t('pages:challenge:details:minimumAmount')} />
								<DisplayAmount
									address={positionStats.collateral}
									amount={positionStats.minimumCollateral}
									currency={positionStats.collateralSymbol}
									digits={positionStats.collateralDecimal}
									usdPrice={collateralPrice}
								/>
							</AppBox>
							<AppBox className="col-span-6 sm:col-span-3">
								<DisplayLabel label={t('pages:challenge:details:fixedPhase')} />
								{formatDuration(positionStats.challengePeriod)}
							</AppBox>
							<AppBox className="col-span-6 sm:col-span-3">
								<DisplayLabel label={t('pages:challenge:details:decliningPhase')} />
								{formatDuration(positionStats.challengePeriod)}
							</AppBox>
						</div>
						<div>
							<GuardToAllowedChainBtn>
								{amount > positionStats.collateralAllowance ? (
									<Button disabled={!!error || account == positionStats.owner} isLoading={isApproving} onClick={() => handleApprove()}>
										{t('pages:challenge:buttons:approve')}
									</Button>
								) : (
									<Button
										disabled={!!error || account == positionStats.owner}
										isLoading={isChallenging}
										onClick={() => handleChallenge()}
										variant="primary"
									>
										{t('pages:challenge:buttons:challenge')}
									</Button>
								)}
							</GuardToAllowedChainBtn>
						</div>
					</div>
					<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8 flex flex-col border border-purple-500/50 gap-y-4">
						<div className="text-lg font-bold text-center mt-3">{t('pages:challenge:info:title')}</div>
						<AppBox className="flex-1 mt-4">
							<p>{t('pages:challenge:info:description')}</p>
							<ol className="flex flex-col gap-y-2 pl-6 [&>li]:list-decimal">
								<li>
									{t('pages:challenge:info:phases:fixed', {
										symbol: positionStats.collateralSymbol,
										price: formatBigInt(positionStats.liqPrice, 36 - positionStats.collateralDecimal),
									})}
								</li>
								<li>
									{t('pages:challenge:info:phases:declining', {
										symbol: positionStats.collateralSymbol,
									})}
								</li>
							</ol>
						</AppBox>
					</div>
				</section>
			</div>
		</>
	)
}
