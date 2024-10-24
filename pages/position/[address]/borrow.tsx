import AppBox from 'components/AppBox'
import AppPageHeader from 'components/AppPageHeader'
import Button from 'components/Button'
import DisplayAmount from 'components/DisplayAmount'
import GuardToAllowedChainBtn from 'components/Guards/GuardToAllowedChainBtn'
import DateInput from 'components/Input/DateInput'
import TokenInput from 'components/Input/TokenInput'
import { TxToast, renderErrorToast } from 'components/TxToast'
import { ABIS, ADDRESS } from 'contracts'
import { usePositionStats } from 'hooks'
import { formatBigInt, min, shortenAddress, toTimestamp } from 'utils'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { erc20Abi, formatUnits, getAddress, maxUint256, zeroAddress } from 'viem'
import { useChainId } from 'wagmi'
import { waitForTransactionReceipt, writeContract } from 'wagmi/actions'
import { envConfig } from 'app.env.config'
import { WAGMI_CONFIG } from 'app.config'

export default function PositionBorrow({}) {
	const router = useRouter()
	const { address: positionAddr } = router.query

	const [amount, setAmount] = useState(0n)
	const [error, setError] = useState('')
	const [errorDate, setErrorDate] = useState('')
	const [isApproving, setApproving] = useState(false)
	const [isCloning, setCloning] = useState(false)

	const chainId = useChainId()
	const position = getAddress(String(positionAddr || zeroAddress))
	const positionStats = usePositionStats(position)
	const [expirationDate, setExpirationDate] = useState(new Date())
	const requiredColl =
		positionStats.liqPrice > 0 &&
		(BigInt(1e18) * amount + positionStats.liqPrice - 1n) / positionStats.liqPrice > positionStats.minimumCollateral
			? (BigInt(1e18) * amount + positionStats.liqPrice - 1n) / positionStats.liqPrice
			: positionStats.minimumCollateral

	useEffect(() => {
		// to set initial date during loading
		setExpirationDate(toDate(positionStats.expiration))
	}, [positionStats.expiration])

	const borrowersReserveContribution = (positionStats.reserveContribution * amount) / 1_000_000n

	function toDate(blocktime: bigint) {
		return new Date(Number(blocktime) * 1000)
	}

	// max(4 weeks, ((chosen expiration) - (current block))) * position.annualInterestPPM() / (365 days) / 1000000
	const feePercent =
		(BigInt(Math.max(60 * 60 * 24 * 30, Math.floor((expirationDate.getTime() - Date.now()) / 1000))) * positionStats.annualInterestPPM) /
		BigInt(60 * 60 * 24 * 365)
	const fees = (feePercent * amount) / 1_000_000n
	const paidOutToWallet = amount - borrowersReserveContribution - fees
	const availableAmount = BigInt(positionStats.available)
	const userValue = BigInt(positionStats.collateralUserBal * positionStats.liqPrice) / BigInt(1e18)
	const borrowingLimit = min(availableAmount, userValue)

	const onChangeAmount = (value: string) => {
		const valueBigInt = BigInt(value)
		setAmount(valueBigInt)
		if (valueBigInt > borrowingLimit) {
			if (availableAmount > userValue) {
				setError(`Not enough ${positionStats.collateralSymbol} in your wallet.`)
			} else {
				setError('Not enough OFD available for this position.')
			}
		} else {
			setError('')
		}
	}

	const onChangeCollateral = (value: string) => {
		const valueBigInt = (BigInt(value) * positionStats.liqPrice) / BigInt(1e18)
		if (valueBigInt > borrowingLimit) {
			setError('Cannot mint more than ' + borrowingLimit + '.' + valueBigInt)
		} else {
			setError('')
		}
		setAmount(valueBigInt)
	}

	const onChangeExpiration = (value: Date | null) => {
		if (!value) value = new Date()
		const newTimestamp = toTimestamp(value)
		const bottomLimit = toTimestamp(new Date())
		const uppperLimit = positionStats.expiration

		if (newTimestamp < bottomLimit || newTimestamp > uppperLimit) {
			setErrorDate('Expiration Date should be between Now and Limit')
		} else {
			setErrorDate('')
		}
		setExpirationDate(value)
	}

	// TODO: check if this is needed
	// const onMaxExpiration = () => {
	// 	setExpirationDate(toDate(positionStats.expiration))
	// }

	const handleApprove = async () => {
		try {
			setApproving(true)
			const approveWriteHash = await writeContract(WAGMI_CONFIG, {
				address: positionStats.collateral!,
				abi: erc20Abi,
				functionName: 'approve',
				args: [ADDRESS[chainId].mintingHub, maxUint256],
			})

			const toastContent = [
				{
					title: 'Amount:',
					value: 'infinite ' + positionStats.collateralSymbol,
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
					render(error: unknown) {
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

	const handleClone = useCallback(async () => {
		try {
			setCloning(true)
			const expirationTime = toTimestamp(expirationDate)

			const cloneWriteHash = await writeContract(WAGMI_CONFIG, {
				address: ADDRESS[chainId].mintingHub,
				abi: ABIS.MintingHubABI,
				functionName: 'clone',
				args: [position, requiredColl, amount, BigInt(expirationTime)],
			})

			const toastContent = [
				{
					title: `Amount: `,
					value: formatBigInt(amount) + ' OFD',
				},
				{
					title: `Collateral: `,
					value: formatBigInt(requiredColl, positionStats.collateralDecimal) + ' ' + positionStats.collateralSymbol,
				},
				{
					title: 'Transaction:',
					hash: cloneWriteHash,
				},
			]

			await toast.promise(waitForTransactionReceipt(WAGMI_CONFIG, { hash: cloneWriteHash, confirmations: 1 }), {
				pending: {
					render: <TxToast rows={toastContent} title={`Minting OFD`} />,
				},
				success: {
					render: <TxToast rows={toastContent} title="Successfully Minted OFD" />,
				},
				error: {
					render(error: unknown) {
						return renderErrorToast(error)
					},
				},
			})
		} catch (e) {
			console.log(e)
		} finally {
			positionStats.refetch()
			setCloning(false)
		}
	}, [amount, chainId, expirationDate, position, positionStats, requiredColl])

	return (
		<>
			<Head>
				<title>{envConfig.AppName} - Mint</title>
			</Head>
			<div>
				<AppPageHeader backText="Back to position" backTo={`/position/${position}`} title="Mint OracleFreeDollars for Yourself" />
				<section className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8 flex flex-col border border-purple-500/50 gap-y-4">
						<div className="text-lg font-bold text-center mt-3">Minting Amount and Collateral</div>
						<div className="space-y-8">
							<TokenInput
								balanceLabel="Limit:"
								error={error}
								label="Amount"
								max={availableAmount}
								onChange={onChangeAmount}
								placeholder="Total Amount to be Minted"
								symbol="OFD"
								value={amount.toString()}
							/>
							<TokenInput
								balanceLabel="Your balance:"
								digit={positionStats.collateralDecimal}
								label="Required Collateral"
								max={positionStats.collateralUserBal}
								note={
									`Valued at ${formatBigInt(positionStats.liqPrice, 36 - positionStats.collateralDecimal)} OFD, minimum is ` +
									formatBigInt(positionStats.minimumCollateral, Number(positionStats.collateralDecimal)) +
									' ' +
									positionStats.collateralSymbol
								}
								onChange={onChangeCollateral}
								output={formatUnits(requiredColl, positionStats.collateralDecimal)}
								symbol={positionStats.collateralSymbol}
							/>
							<DateInput
								error={errorDate}
								label="Expiration"
								max={positionStats.expiration}
								onChange={onChangeExpiration}
								value={expirationDate}
							/>
						</div>
						<div className="mx-auto mt-8 w-72 max-w-full flex-col">
							<GuardToAllowedChainBtn>
								{requiredColl > positionStats.collateralAllowance ? (
									<Button disabled={amount == 0n || !!error} isLoading={isApproving} onClick={() => handleApprove()}>
										Approve
									</Button>
								) : (
									<Button
										disabled={amount == 0n || !!error}
										error={
											requiredColl < positionStats.minimumCollateral
												? 'A position must have at least ' +
													formatBigInt(positionStats.minimumCollateral, Number(positionStats.collateralDecimal)) +
													' ' +
													positionStats.collateralSymbol
												: ''
										}
										isLoading={isCloning}
										onClick={() => handleClone()}
										variant="primary"
									>
										Clone Position
									</Button>
								)}
							</GuardToAllowedChainBtn>
						</div>
					</div>
					<div>
						<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8 flex flex-col border border-purple-500/50 gap-y-4">
							<div className="text-lg font-bold text-center mt-3">Outcome</div>
							<div className="bg-slate-900 rounded-xl p-4 flex flex-col gap-2">
								<div className="flex">
									<div className="flex-1">Sent to your wallet</div>
									<DisplayAmount address={ADDRESS[chainId].oracleFreeDollar} amount={paidOutToWallet} currency="OFD" hideLogo />
								</div>
								<div className="flex">
									<div className="flex-1">Locked in borrowers reserve</div>
									<DisplayAmount
										address={ADDRESS[chainId].oracleFreeDollar}
										amount={borrowersReserveContribution}
										currency="OFD"
										hideLogo
									/>
								</div>
								<div className="flex">
									<div className="flex-1">Fees ({formatBigInt(feePercent, 4)}%)</div>
									<DisplayAmount address={ADDRESS[chainId].oracleFreeDollar} amount={fees} currency="OFD" hideLogo />
								</div>
								<hr className="border-slate-700 border-dashed" />
								<div className="flex font-bold">
									<div className="flex-1">Total</div>
									<DisplayAmount address={ADDRESS[chainId].oracleFreeDollar} amount={amount} currency="OFD" hideLogo />
								</div>
							</div>
						</div>
						<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8 flex flex-col border border-purple-500/50 gap-y-4 mt-4">
							<div className="text-lg font-bold text-center mt-3">Notes</div>
							<AppBox className="flex-1 mt-4">
								<ol className="flex flex-col gap-y-2 pl-6 [&>li]:list-decimal">
									<li>The amount borrowed can be changed later, but not increased beyond the initial amount.</li>
									<li>
										The liquidation price is inherited from the parent position, but can be adjusted later. For example, the liquidation
										price could be doubled and then half of the collateral taken out if the new liquidation price is not challenged.
									</li>
									<li>
										It is possible to repay partially or to repay early in order to get the collateral back, but the fee is paid upfront and
										never returned.
									</li>
								</ol>
							</AppBox>
						</div>
					</div>
				</section>
			</div>
		</>
	)
}
