import AppPageHeader from 'components/AppPageHeader'
import Button from 'components/Button'
import GuardToAllowedChainBtn from 'components/Guards/GuardToAllowedChainBtn'
import TokenInput from 'components/Input/TokenInput'
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSwapStats } from 'hooks'
import { ENABLE_EMERGENCY_MODE } from 'utils'
import Head from 'next/head'
import { useCallback, useMemo, useState } from 'react'
import { formatUnits } from 'viem'
import { envConfig } from 'app.env.config'
import { EmergencyPage } from 'components/EmergencyPage'
import { useSwapContractsFunctions } from 'hooks/swap/useSwapContractsFunctions'
import { CoinTicker } from 'meta/coins'
import { useTranslation } from 'next-i18next'

export default function Swap() {
	const [amount, setAmount] = useState(0n)
	const [error, setError] = useState('')
	const [direction, setDirection] = useState(true)
	const { t } = useTranslation()

	const swapStats = useSwapStats()

	const fromBalance = useMemo(() => (direction ? swapStats.usdtUserBal : swapStats.ofdUserBal), [direction, swapStats])
	const toBalance = useMemo(() => (!direction ? swapStats.usdtUserBal : swapStats.ofdUserBal), [direction, swapStats])
	const fromSymbol = useMemo(() => (direction ? CoinTicker.USDT : CoinTicker.OFD), [direction])
	const toSymbol = useMemo(() => (!direction ? CoinTicker.USDT : CoinTicker.OFD), [direction])
	const swapLimit = useMemo(
		() => (direction ? swapStats.bridgeLimit - swapStats.usdtBridgeBal : swapStats.usdtBridgeBal),
		[direction, swapStats]
	)

	const { handleApprove, handleBurn, handleMint, isApproving, isBurning, isMinting } = useSwapContractsFunctions({
		amount,
		fromSymbol,
		swapStats,
		toSymbol,
	})

	const onChangeDirection = useCallback(() => {
		setDirection(!direction)
	}, [direction])

	const onChangeAmount = useCallback(
		(value: string) => {
			const valueBigInt = BigInt(value)
			setAmount(valueBigInt)

			if (valueBigInt > fromBalance) {
				setError(t('pages:swap:errors:insufficientBalance', { symbol: fromSymbol }))
			} else if (valueBigInt > swapLimit) {
				setError(t('pages:swap:errors:insufficientSwapLimit', { symbol: toSymbol }))
			} else {
				setError('')
			}
		},
		[fromBalance, fromSymbol, swapLimit, toSymbol, t]
	)

	if (ENABLE_EMERGENCY_MODE) {
		return <EmergencyPage />
	}

	return (
		<>
			<Head>
				<title>
					{envConfig.AppName} - {t('pages:swap:title')}
				</title>
			</Head>
			<div>
				<AppPageHeader title={t('pages:swap:header')} />
				<section className="mx-auto flex max-w-2xl flex-col gap-y-4 px-4 sm:px-8">
					<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8 flex flex-col border border-purple-500/50">
						<TokenInput
							error={error}
							limit={swapLimit}
							limitLabel={t('pages:swap:swapLimit')}
							max={fromBalance}
							onChange={onChangeAmount}
							placeholder={t('pages:swap:swapAmount')}
							symbol={fromSymbol}
							value={amount.toString()}
						/>

						<div className="py-4 text-center">
							<button
								aria-label={t('pages:swap:buttons:switchDirection')}
								className={`btn btn-secondary text-slate-800 w-14 h-14 rounded-full transition ${direction && 'rotate-180'}`}
								onClick={onChangeDirection}
							>
								<FontAwesomeIcon className="rotate-90 w-6 h-6" icon={faArrowRightArrowLeft} />
							</button>
						</div>

						<TokenInput
							label={t('pages:swap:receive')}
							max={toBalance}
							note={t('pages:swap:exchangeRate', { fromSymbol, toSymbol })}
							output={formatUnits(amount, 18)}
							symbol={toSymbol}
						/>

						<div className="mx-auto mt-8 w-72 max-w-full flex-col">
							<GuardToAllowedChainBtn>
								{direction ? (
									amount > swapStats.usdtUserAllowance ? (
										<Button isLoading={isApproving} onClick={() => handleApprove()}>
											{t('pages:swap:buttons:approve')}
										</Button>
									) : (
										<Button disabled={amount == 0n || !!error} isLoading={isMinting} onClick={() => handleMint()}>
											{t('pages:swap:buttons:swap')}
										</Button>
									)
								) : (
									<Button disabled={amount == 0n || !!error} isLoading={isBurning} onClick={() => handleBurn()}>
										{t('pages:swap:buttons:swap')}
									</Button>
								)}
							</GuardToAllowedChainBtn>
						</div>
					</div>
				</section>
			</div>
		</>
	)
}
