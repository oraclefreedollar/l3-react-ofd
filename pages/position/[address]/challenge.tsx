import AppBox from 'components/AppBox'
import AppPageHeader from 'components/AppPageHeader'
import Button from 'components/Button'
import DisplayAmount from 'components/DisplayAmount'
import DisplayLabel from 'components/DisplayLabel'
import GuardToAllowedChainBtn from 'components/Guards/GuardToAllowedChainBtn'
import TokenInput from 'components/Input/TokenInput'
import { TxToast, renderErrorToast } from 'components/TxToast'
import { ABIS, ADDRESS } from 'contracts'
import { useOfdPrice, usePositionStats } from 'hooks'
import { formatBigInt, formatDuration, shortenAddress } from 'utils'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { erc20Abi, getAddress, zeroAddress } from 'viem'
import { useAccount, useChainId } from 'wagmi'
import { waitForTransactionReceipt, writeContract } from 'wagmi/actions'
import { envConfig } from 'app.env.config'
import { WAGMI_CONFIG } from 'app.config'
import { useSelector } from 'react-redux'
import { RootState } from 'redux/redux.store'

export default function PositionChallenge() {
	const router = useRouter()
	const { address: positionAddr } = router.query

	const [amount, setAmount] = useState(0n)
	const [error, setError] = useState('')
	const [isApproving, setApproving] = useState(false)
	const [isChallenging, setChallenging] = useState(false)

	const chainId = useChainId()
	const { address } = useAccount()
	const account = address || zeroAddress
	const position = getAddress(String(positionAddr || zeroAddress))
	const positionStats = usePositionStats(position)
	const prices = useSelector((state: RootState) => state.prices.coingecko)
	const collateralPrice = prices[positionStats.collateral?.toLowerCase() ?? zeroAddress]?.price?.usd
	const ofdPrice = useOfdPrice()

	const onChangeAmount = (value: string) => {
		const valueBigInt = BigInt(value)
		setAmount(valueBigInt)
		if (valueBigInt > positionStats.collateralUserBal) {
			setError(`Not enough ${positionStats.collateralSymbol} in your wallet.`)
		} else if (valueBigInt > positionStats.collateralBal) {
			setError('Challenge collateral should be lower than position collateral')
		} else if (valueBigInt < positionStats.minimumCollateral) {
			setError('Challenge collateral should be greater than minimum collateral')
		} else {
			setError('')
		}
	}

	const handleApprove = async () => {
		try {
			setApproving(true)
			const approveWriteHash = await writeContract(WAGMI_CONFIG, {
				address: positionStats.collateral!,
				abi: erc20Abi,
				functionName: 'approve',
				args: [ADDRESS[chainId].mintingHub, amount],
			})

			const toastContent = [
				{
					title: 'Amount:',
					value: formatBigInt(amount, positionStats.collateralDecimal) + ' ' + positionStats.collateralSymbol,
				},
				{
					title: 'Spender: ',
					value: shortenAddress(ADDRESS[chainId].mintingHub),
				},
				{
					title: 'Transaction:',
					hash: approveWriteHash,
				},
			]

			await toast.promise(waitForTransactionReceipt(WAGMI_CONFIG, { hash: approveWriteHash, confirmations: 1 }), {
				pending: {
					render: <TxToast rows={toastContent} title={`Approving ${positionStats.collateralSymbol}`} />,
				},
				success: {
					render: <TxToast rows={toastContent} title={`Successfully Approved ${positionStats.collateralSymbol}`} />,
				},
				error: {
					render(error: any) {
						return renderErrorToast(error)
					},
				},
			})
		} catch (e) {
			console.log(e)
		} finally {
			setApproving(false)
		}
	}

	const handleChallenge = async () => {
		try {
			setChallenging(true)

			const challengeWriteHash = await writeContract(WAGMI_CONFIG, {
				address: ADDRESS[chainId].mintingHub,
				abi: ABIS.MintingHubABI,
				functionName: 'challenge',
				args: [position, amount, positionStats.liqPrice],
			})

			const toastContent = [
				{
					title: 'Size:',
					value: formatBigInt(amount, positionStats.collateralDecimal) + ' ' + positionStats.collateralSymbol,
				},
				{
					title: 'Price: ',
					value: formatBigInt(positionStats.liqPrice, 36 - positionStats.collateralDecimal),
				},
				{
					title: 'Transaction:',
					hash: challengeWriteHash,
				},
			]

			await toast.promise(waitForTransactionReceipt(WAGMI_CONFIG, { hash: challengeWriteHash, confirmations: 1 }), {
				pending: {
					render: <TxToast rows={toastContent} title={`Launching a challenge`} />,
				},
				success: {
					render: <TxToast rows={toastContent} title={`Successfully Launched challenge`} />,
				},
				error: {
					render(error: any) {
						return renderErrorToast(error)
					},
				},
			})
		} catch (e) {
			console.log(e)
		} finally {
			setChallenging(false)
		}
	}

	return (
		<>
			<Head>
				<title>{envConfig.AppName} - Position Challenge</title>
			</Head>
			<div>
				<AppPageHeader backText="Back to position" backTo={`/position/${position}`} title="Launch Challenge" />
				<section className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="bg-slate-950 rounded-xl p-4 flex flex-col gap-y-4">
						<div className="text-lg font-bold text-center mt-3">Challenge Details</div>
						<TokenInput
							digit={positionStats.collateralDecimal}
							error={error}
							label="Amount"
							max={positionStats.collateralUserBal}
							onChange={onChangeAmount}
							placeholder="Collateral Amount"
							symbol={positionStats.collateralSymbol}
							value={amount.toString()}
						/>
						<div className="bg-slate-900 rounded-xl p-4 grid grid-cols-6 gap-2 lg:col-span-2">
							<AppBox className="col-span-6 sm:col-span-3">
								<DisplayLabel label="Starting Price" />
								<DisplayAmount
									address={ADDRESS[chainId].oracleFreeDollar}
									amount={positionStats.liqPrice}
									currency={'OFD'}
									digits={36 - positionStats.collateralDecimal}
									usdPrice={ofdPrice}
								/>
							</AppBox>
							<AppBox className="col-span-6 sm:col-span-3">
								<DisplayLabel label="Maximum Proceeds" />
								<DisplayAmount
									address={ADDRESS[chainId].oracleFreeDollar}
									amount={positionStats.liqPrice * amount}
									currency={'OFD'}
									digits={36 - positionStats.collateralDecimal + 18}
									usdPrice={ofdPrice}
								/>
							</AppBox>
							<AppBox className="col-span-6 sm:col-span-3">
								<DisplayLabel label="Collateral in Position" />
								<DisplayAmount
									address={positionStats.collateral}
									amount={positionStats.collateralBal}
									currency={positionStats.collateralSymbol}
									digits={positionStats.collateralDecimal}
									usdPrice={collateralPrice}
								/>
							</AppBox>
							<AppBox className="col-span-6 sm:col-span-3">
								<DisplayLabel label="Minimum Amount" />
								<DisplayAmount
									address={positionStats.collateral}
									amount={positionStats.minimumCollateral}
									currency={positionStats.collateralSymbol}
									digits={positionStats.collateralDecimal}
									usdPrice={collateralPrice}
								/>
							</AppBox>
							<AppBox className="col-span-6 sm:col-span-3">
								<DisplayLabel label="Fixed Price Phase" />
								{formatDuration(positionStats.challengePeriod)}
							</AppBox>
							<AppBox className="col-span-6 sm:col-span-3">
								<DisplayLabel label="Declining Price Phase" />
								{formatDuration(positionStats.challengePeriod)}
							</AppBox>
						</div>
						<div>
							<GuardToAllowedChainBtn>
								{amount > positionStats.collateralAllowance ? (
									<Button disabled={!!error || account == positionStats.owner} isLoading={isApproving} onClick={() => handleApprove()}>
										Approve
									</Button>
								) : (
									<Button
										disabled={!!error || account == positionStats.owner}
										isLoading={isChallenging}
										onClick={() => handleChallenge()}
										variant="primary"
									>
										Challenge
									</Button>
								)}
							</GuardToAllowedChainBtn>
						</div>
					</div>
					<div className="bg-slate-950 rounded-xl p-4 flex flex-col">
						<div className="text-lg font-bold text-center mt-3">How does it work?</div>
						<AppBox className="flex-1 mt-4">
							<p>
								The amount of the collateral asset you provide will be publicly auctioned in a Dutch auction. The auction has two phases, a
								fixed price phase and a declining price phase.
							</p>
							<ol className="flex flex-col gap-y-2 pl-6 [&>li]:list-decimal">
								<li>
									During the fixed price phase, anyone can buy the {positionStats.collateralSymbol} you provided at the liquidation price.
									If everything gets sold before the phase ends, the challenge is averted and you have effectively sold the provided{' '}
									{positionStats.collateralSymbol} to the bidders for{' '}
									{formatBigInt(positionStats.liqPrice, 36 - positionStats.collateralDecimal)} OFD per unit.
								</li>
								<li>
									If the challenge is not averted, the fixed price phase is followed by a declining price phase during which the price at
									which the
									{positionStats.collateralSymbol} tokens can be obtained declines linearly towards zero. In this case, the challenge is
									considered successful and you get the provided {positionStats.collateralSymbol} tokens back. The tokens sold in this phase
									do not come from the challenger, but from the position owner. The total amount of tokens that can be bought from the
									position is limited by the amount left in the challenge at the end of the fixed price phase. As a reward for starting a
									successful challenge, you get 2% of the sales proceeds.
								</li>
							</ol>
						</AppBox>
					</div>
				</section>
			</div>
		</>
	)
}
