import AppBox from 'components/AppBox'
import AppPageHeader from 'components/AppPageHeader'
import Button from 'components/Button'
import DisplayAmount from 'components/DisplayAmount'
import GuardToAllowedChainBtn from 'components/Guards/GuardToAllowedChainBtn'
import DateInput from 'components/Input/DateInput'
import TokenInput from 'components/Input/TokenInput'
import { ADDRESS } from 'contracts'
import { usePositionStats } from 'hooks'
import { ENABLE_EMERGENCY_MODE, formatBigInt, min, toTimestamp } from 'utils'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { formatUnits, getAddress, zeroAddress } from 'viem'
import { useChainId } from 'wagmi'
import { envConfig } from 'app.env.config'
import { EmergencyPage } from 'components/EmergencyPage'
import { useBorrowContractsFunctions } from 'hooks/borrow/useBorrowContractsFunctions'
import { useTranslation } from 'react-i18next'
import { CoinTicker } from 'meta/coins'

export default function PositionBorrow({}) {
	const { t } = useTranslation()

	const router = useRouter()
	const { address: positionAddr } = router.query

	const chainId = useChainId()
	const position = getAddress(String(positionAddr || zeroAddress))
	const positionStats = usePositionStats(position)

	const [amount, setAmount] = useState(0n)
	const [error, setError] = useState('')
	const [errorDate, setErrorDate] = useState('')
	const [expirationDate, setExpirationDate] = useState(new Date())

	const requiredColl = useMemo(
		() =>
			positionStats.liqPrice > 0 &&
			(BigInt(1e18) * amount + positionStats.liqPrice - 1n) / positionStats.liqPrice > positionStats.minimumCollateral
				? (BigInt(1e18) * amount + positionStats.liqPrice - 1n) / positionStats.liqPrice
				: positionStats.minimumCollateral,
		[amount, positionStats.liqPrice, positionStats.minimumCollateral]
	)

	const borrowersReserveContribution = useMemo(
		() => (BigInt(positionStats.reserveContribution + positionStats.mintingFee) * amount) / 1_000_000n,
		[amount, positionStats.mintingFee, positionStats.reserveContribution]
	)
	const buttonDisabled = useMemo(() => amount == 0n || !!error, [amount, error])

	useEffect(() => {
		// to set initial date during loading
		setExpirationDate(new Date(Number(positionStats.expiration) * 1000))
	}, [positionStats.expiration])

	// max(4 weeks, ((chosen expiration) - (current block))) * position.annualInterestPPM() / (365 days) / 1000000
	const feePercent =
		(BigInt(Math.max(60 * 60 * 24 * 30, Math.floor((expirationDate.getTime() - Date.now()) / 1000))) *
			BigInt(positionStats.annualInterestPPM)) /
		BigInt(60 * 60 * 24 * 365)
	const fees = (feePercent * amount) / 1_000_000n
	const paidOutToWallet = amount - borrowersReserveContribution
	const availableAmount = BigInt(positionStats.available)
	const userValue = BigInt(positionStats.collateralUserBal * positionStats.liqPrice) / BigInt(1e18)
	const borrowingLimit = min(availableAmount, userValue)

	const onChangeAmount = useCallback(
		(value: string) => {
			const valueBigInt = BigInt(value)
			setAmount(valueBigInt)
			if (valueBigInt > borrowingLimit) {
				if (availableAmount > userValue) {
					setError(t('pages:position:borrow:mintingSection:errors:notEnoughCollateral', { symbol: positionStats.collateralSymbol }))
				} else {
					setError(t('pages:position:borrow:mintingSection:errors:notEnoughOFD'))
				}
			} else {
				setError('')
			}
		},
		[availableAmount, borrowingLimit, positionStats.collateralSymbol, t, userValue]
	)

	const onChangeCollateral = useCallback(
		(value: string) => {
			const valueBigInt = (BigInt(value) * positionStats.liqPrice) / BigInt(1e18)
			if (valueBigInt > borrowingLimit) {
				setError(t('pages:position:borrow:mintingSection:errors:cannotMintMore', { limit: borrowingLimit, value: valueBigInt }))
			} else {
				setError('')
			}
			setAmount(valueBigInt)
		},
		[borrowingLimit, positionStats.liqPrice, t]
	)

	const onChangeExpiration = useCallback(
		(value: Date | null) => {
			if (!value) value = new Date()
			const newTimestamp = toTimestamp(value)
			const bottomLimit = toTimestamp(new Date())
			const uppperLimit = positionStats.expiration

			if (newTimestamp < bottomLimit || newTimestamp > uppperLimit) {
				setErrorDate(t('pages:position:borrow:mintingSection:expiration:error'))
			} else {
				setErrorDate('')
			}
			setExpirationDate(value)
		},
		[positionStats.expiration, t]
	)

	const { isApproving, handleApprove, isCloning, handleClone } = useBorrowContractsFunctions({
		amount,
		expirationDate,
		position,
		positionStats,
		requiredColl,
	})

	if (ENABLE_EMERGENCY_MODE) {
		return <EmergencyPage />
	}

	return (
		<>
			<Head>
				<title>
					{envConfig.AppName} - {t('pages:position:borrow:title')}
				</title>
			</Head>
			<div>
				<AppPageHeader
					backText={t('pages:position:borrow:back')}
					backTo={`/position/${position}`}
					title={t('pages:position:borrow:title')}
				/>
				<section className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8 flex flex-col border border-purple-500/50 gap-y-4">
						<div className="text-lg font-bold text-center mt-3">{t('pages:position:borrow:mintingSection:title')}</div>
						<div className="space-y-8">
							<TokenInput
								balanceLabel={t('pages:position:borrow:mintingSection:amount:balanceLabel')}
								error={error}
								label={t('pages:position:borrow:mintingSection:amount:label')}
								max={availableAmount}
								onChange={onChangeAmount}
								placeholder={t('pages:position:borrow:mintingSection:amount:placeholder')}
								symbol={CoinTicker.OFD}
								value={amount.toString()}
							/>
							<TokenInput
								balanceLabel={t('pages:position:borrow:mintingSection:collateral:balanceLabel')}
								digit={positionStats.collateralDecimal}
								label={t('pages:position:borrow:mintingSection:collateral:label')}
								max={positionStats.collateralUserBal}
								note={t('pages:position:borrow:mintingSection:collateral:valueNote', {
									price: formatBigInt(positionStats.liqPrice, 36 - positionStats.collateralDecimal),
									minimum: formatBigInt(positionStats.minimumCollateral, Number(positionStats.collateralDecimal)),
									symbol: positionStats.collateralSymbol,
								})}
								onChange={onChangeCollateral}
								output={formatUnits(requiredColl, positionStats.collateralDecimal)}
								symbol={positionStats.collateralSymbol}
							/>
							<DateInput
								error={errorDate}
								label={t('pages:position:borrow:mintingSection:expiration:label')}
								max={positionStats.expiration}
								onChange={onChangeExpiration}
								value={expirationDate}
							/>
						</div>
						<div className="mx-auto mt-8 w-72 max-w-full flex-col">
							<GuardToAllowedChainBtn>
								{requiredColl > positionStats.collateralAllowance ? (
									<Button disabled={buttonDisabled} isLoading={isApproving} onClick={() => handleApprove()}>
										{t('pages:position:borrow:mintingSection:buttons:approve')}
									</Button>
								) : (
									<Button
										disabled={buttonDisabled}
										error={
											requiredColl < positionStats.minimumCollateral
												? t('pages:position:borrow:mintingSection:buttons:minimumError', {
														minimum: formatBigInt(positionStats.minimumCollateral, Number(positionStats.collateralDecimal)),
														symbol: positionStats.collateralSymbol,
													})
												: ''
										}
										isLoading={isCloning}
										onClick={() => handleClone()}
										variant="primary"
									>
										{t('pages:position:borrow:mintingSection:buttons:clone')}
									</Button>
								)}
							</GuardToAllowedChainBtn>
						</div>
					</div>
					<div>
						<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8 flex flex-col border border-purple-500/50 gap-y-4">
							<div className="text-lg font-bold text-center mt-3">{t('pages:position:borrow:outcome:title')}</div>
							<div className="bg-slate-900 rounded-xl p-4 flex flex-col gap-2">
								<div className="flex">
									<div className="flex-1">{t('pages:position:borrow:outcome:sentToWallet')}</div>
									<DisplayAmount address={ADDRESS[chainId].oracleFreeDollar} amount={paidOutToWallet} currency={CoinTicker.OFD} hideLogo />
								</div>
								<div className="flex">
									<div className="flex-1">{t('pages:position:borrow:outcome:lockedInReserve')}</div>
									<DisplayAmount
										address={ADDRESS[chainId].oracleFreeDollar}
										amount={borrowersReserveContribution}
										currency={CoinTicker.OFD}
										hideLogo
									/>
								</div>
								<div className="flex">
									<div className="flex-1">{t('pages:position:borrow:outcome:fees', { percent: formatBigInt(feePercent, 4) })}</div>
									<DisplayAmount address={ADDRESS[chainId].oracleFreeDollar} amount={fees} currency={CoinTicker.OFD} hideLogo />
								</div>
								<hr className="border-slate-700 border-dashed" />
								<div className="flex font-bold">
									<div className="flex-1">{t('pages:position:borrow:outcome:total')}</div>
									<DisplayAmount address={ADDRESS[chainId].oracleFreeDollar} amount={amount} currency={CoinTicker.OFD} hideLogo />
								</div>
							</div>
						</div>
						<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8 flex flex-col border border-purple-500/50 gap-y-4 mt-4">
							<div className="text-lg font-bold text-center mt-3">{t('pages:position:borrow:notes:title')}</div>
							<AppBox className="flex-1 mt-4">
								<ol className="flex flex-col gap-y-2 pl-6 [&>li]:list-decimal">
									<li>{t('pages:position:borrow:notes:description1')}</li>
									<li>{t('pages:position:borrow:notes:description2')}</li>
									<li>{t('pages:position:borrow:notes:description3')}</li>
								</ol>
							</AppBox>
						</div>
					</div>
				</section>
			</div>
		</>
	)
}
