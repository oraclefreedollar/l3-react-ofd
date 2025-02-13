import AppPageHeader from 'components/AppPageHeader'
import Button from 'components/Button'
import DisplayAmount from 'components/DisplayAmount'
import GuardToAllowedChainBtn from 'components/Guards/GuardToAllowedChainBtn'
import TokenInput from 'components/Input/TokenInput'
import { ADDRESS } from 'contracts'
import { usePositionStats } from 'hooks'
import { abs } from 'utils'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo, useState } from 'react'
import { formatUnits, getAddress, zeroAddress } from 'viem'
import { useAccount, useChainId } from 'wagmi'
import { envConfig } from 'app.env.config'
import { useAdjustContractsFunctions } from 'hooks/adjust/useAdjustContractsFunctions'
import { CoinTicker } from 'meta/coins'
import { useTranslation } from 'next-i18next'
import { withServerSideTranslations } from 'utils/withServerSideTranslations'
import { InferGetServerSidePropsType } from 'next'

const PositionAdjust: React.FC = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { t } = useTranslation('positionAdjust')

	const router = useRouter()
	const { address: positionAddr } = router.query
	const { address } = useAccount()
	const chainId = useChainId()
	const position = getAddress(String(positionAddr || zeroAddress))
	const positionStats = usePositionStats(position)

	const [amount, setAmount] = useState<bigint>(positionStats.minted)
	const [collateralAmount, setCollateralAmount] = useState<bigint>(positionStats.collateralBal)
	const [liqPrice, setLiqPrice] = useState(positionStats.liqPrice)

	const maxRepayable = useMemo(
		() => (1_000_000n * positionStats.ofdBalance) / (1_000_000n - positionStats.reserveContribution),
		[positionStats.ofdBalance, positionStats.reserveContribution]
	)
	const repayPosition = useMemo(
		() => (maxRepayable > positionStats.minted ? 0n : positionStats.minted - maxRepayable),
		[maxRepayable, positionStats.minted]
	)

	const { isApproving, handleApprove, isAdjusting, handleAdjust } = useAdjustContractsFunctions({
		amount,
		collateralAmount,
		liqPrice,
		position,
		positionStats,
	})

	const returnFromReserve = useCallback(() => {
		return (positionStats.reserveContribution * (amount - positionStats.minted)) / 1_000_000n
	}, [amount, positionStats.minted, positionStats.reserveContribution])

	const paidOutAmount = useCallback(() => {
		if (amount > positionStats.minted) {
			return ((amount - positionStats.minted) * (1_000_000n - positionStats.reserveContribution - positionStats.mintingFee)) / 1_000_000n
		} else {
			return amount - positionStats.minted - returnFromReserve()
		}
	}, [amount, positionStats.minted, positionStats.mintingFee, positionStats.reserveContribution, returnFromReserve])

	const collateralNote = useMemo(() => {
		const amountToSend = `${formatUnits(abs(collateralAmount - positionStats.collateralBal), positionStats.collateralDecimal)} ${
			positionStats.collateralSymbol
		}`

		return collateralAmount < positionStats.collateralBal
			? t('positionAdjust:variables:collateralSent', { amount: amountToSend })
			: collateralAmount > positionStats.collateralBal
				? t('positionAdjust:variables:collateralTaken', { amount: amountToSend })
				: ''
	}, [collateralAmount, positionStats.collateralBal, positionStats.collateralDecimal, positionStats.collateralSymbol, t])

	const onChangeAmount = (value: string) => {
		setAmount(BigInt(value))
	}

	const onChangeCollAmount = (value: string) => {
		setCollateralAmount(BigInt(value))
	}

	const getCollateralError = useCallback(() => {
		if (collateralAmount - positionStats.collateralBal > positionStats.collateralUserBal) {
			return t('positionAdjust:variables:insufficientCollateral', { collateralSymbol: positionStats.collateralSymbol })
		} else if (liqPrice * collateralAmount < amount * 10n ** 18n) {
			return t('positionAdjust:variables:noEnoughCollateral')
		}
	}, [amount, collateralAmount, liqPrice, positionStats.collateralBal, positionStats.collateralSymbol, positionStats.collateralUserBal, t])

	/* <div
            className={`flex gap-2 items-center cursor-pointer`}
            onClick={() => setAmount(positionStats.limit)}
          >This position is limited to {formatUnits(positionStats.limit, 18)} OFD </div>)
 */
	const getAmountError = useCallback(() => {
		if (amount > positionStats.limit) {
			return t('positionAdjust:variables:errors:limitExceeded', { limit: formatUnits(positionStats.limit, 18) })
		} else if (-paidOutAmount() > positionStats.ofdBalance) {
			return t('positionAdjust:variables:errors:insufficientBalance')
		} else if (liqPrice * collateralAmount < amount * 10n ** 18n) {
			return t('positionAdjust:variables:errors:maxMint', { maxMint: formatUnits((collateralAmount * liqPrice) / 10n ** 36n, 0) })
		} else if (positionStats.liqPrice * collateralAmount < amount * 10n ** 18n) {
			return t('positionAdjust:variables:errors:increaseAfterCooldown')
		} else {
			return ''
		}
	}, [amount, collateralAmount, liqPrice, paidOutAmount, positionStats.limit, positionStats.liqPrice, positionStats.ofdBalance, t])

	const onChangeLiqAmount = (value: string) => {
		const valueBigInt = BigInt(value)
		setLiqPrice(valueBigInt)
	}

	return (
		<>
			<Head>
				<title>
					{envConfig.AppName} - {t('positionAdjust:title')}
				</title>
			</Head>
			<div>
				<AppPageHeader backText={t('positionAdjust:back')} backTo={`/position/${positionAddr}`} title={t('positionAdjust:title')} />
				<section className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-4 flex flex-col border border-purple-500/50 gap-2">
						<div className="text-lg font-bold text-center">{t('positionAdjust:variables:title')}</div>
						<TokenInput
							balanceLabel={t('positionAdjust:variables:amountBalanceLabel')}
							error={getAmountError()}
							label={t('positionAdjust:variables:amount')}
							max={repayPosition}
							onChange={onChangeAmount}
							output={positionStats.closed ? '0' : ''}
							placeholder={t('positionAdjust:variables:amountPlaceholder')}
							symbol={CoinTicker.OFD}
							value={amount.toString()}
						/>
						<TokenInput
							balanceLabel={t('positionAdjust:variables:collateralBalanceLabel')}
							digit={positionStats.collateralDecimal}
							error={getCollateralError()}
							label={t('positionAdjust:variables:collateral')}
							max={positionStats.collateralUserBal + positionStats.collateralBal}
							note={collateralNote}
							onChange={onChangeCollAmount}
							placeholder={t('positionAdjust:variables:collateralPlaceholder')}
							symbol={positionStats.collateralSymbol}
							value={collateralAmount.toString()}
						/>
						<TokenInput
							balanceLabel={t('positionAdjust:variables:liqPriceBalanceLabel')}
							digit={36 - positionStats.collateralDecimal}
							label={t('positionAdjust:variables:liqPrice')}
							max={positionStats.liqPrice}
							onChange={onChangeLiqAmount}
							placeholder={t('positionAdjust:variables:liqPrice')}
							symbol={CoinTicker.OFD}
							value={liqPrice.toString()}
						/>
						<div className="mx-auto mt-8 w-72 max-w-full flex-col">
							<GuardToAllowedChainBtn>
								{collateralAmount - positionStats.collateralBal > positionStats.collateralPosAllowance ? (
									<Button isLoading={isApproving} onClick={() => handleApprove()}>
										{t('positionAdjust:variables:buttons:approve')}
									</Button>
								) : (
									<Button
										disabled={
											(amount == positionStats.minted &&
												collateralAmount == positionStats.collateralBal &&
												liqPrice == positionStats.liqPrice) ||
											!!getAmountError() ||
											!!getCollateralError()
										}
										error={positionStats.owner != address ? t('positionAdjust:variables:buttons:adjustError') : ''}
										isLoading={isAdjusting}
										onClick={() => handleAdjust()}
										variant="primary"
									>
										{t('positionAdjust:variables:buttons:adjust')}
									</Button>
								)}
							</GuardToAllowedChainBtn>
						</div>
					</div>
					<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-4 flex flex-col border border-purple-500/50 gap-2">
						<div className="text-lg font-bold text-center">{t('positionAdjust:outcome:title')}</div>
						<div className="bg-slate-900 rounded-xl p-4 flex flex-col gap-2">
							<div className="flex">
								<div className="flex-1">{t('positionAdjust:outcome:minted')}</div>
								<DisplayAmount address={ADDRESS[chainId].oracleFreeDollar} amount={positionStats.minted} currency={CoinTicker.OFD} />
							</div>
							<div className="flex">
								<div className="flex-1">
									{amount >= positionStats.minted ? t('positionAdjust:outcome:receive') : t('positionAdjust:outcome:return')}
								</div>
								<DisplayAmount address={ADDRESS[chainId].oracleFreeDollar} amount={paidOutAmount()} currency={CoinTicker.OFD} />
							</div>
							<div className="flex">
								<div className="flex-1">
									{amount >= positionStats.minted ? t('positionAdjust:outcome:reserve') : t('positionAdjust:outcome:returnFromReserve')}
								</div>
								<DisplayAmount address={ADDRESS[chainId].oracleFreeDollar} amount={returnFromReserve()} currency={CoinTicker.OFD} />
							</div>
							<div className="flex">
								<div className="flex-1">{t('positionAdjust:outcome:mintingFee')}</div>
								<DisplayAmount
									address={ADDRESS[chainId].oracleFreeDollar}
									amount={amount > positionStats.minted ? ((amount - positionStats.minted) * positionStats.mintingFee) / 1_000_000n : 0n}
									currency={CoinTicker.OFD}
								/>
							</div>
							<hr className="border-slate-700 border-dashed" />
							<div className="flex font-bold">
								<div className="flex-1">{t('positionAdjust:outcome:futureMintedAmount')}</div>
								<DisplayAmount address={ADDRESS[chainId].oracleFreeDollar} amount={amount} currency={CoinTicker.OFD} />
							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	)
}

const getServerSideProps = withServerSideTranslations(['positionAdjust'])

export default PositionAdjust
