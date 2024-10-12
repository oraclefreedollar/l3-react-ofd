import AppPageHeader from 'components/AppPageHeader'
import Button from 'components/Button'
import DisplayAmount from 'components/DisplayAmount'
import GuardToAllowedChainBtn from 'components/Guards/GuardToAllowedChainBtn'
import TokenInput from 'components/Input/TokenInput'
import { TxToast, renderErrorToast } from 'components/TxToast'
import { ABIS, ADDRESS } from 'contracts'
import { usePositionStats } from 'hooks'
import { abs, formatBigInt, shortenAddress } from 'utils'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import { Address, erc20Abi, formatUnits, getAddress, maxUint256, zeroAddress } from 'viem'
import { useAccount, useChainId } from 'wagmi'
import { waitForTransactionReceipt, writeContract } from 'wagmi/actions'
import { envConfig } from 'app.env.config'
import { WAGMI_CONFIG } from 'app.config'

export default function PositionAdjust() {
	const router = useRouter()
	const { address: positionAddr } = router.query
	const { address } = useAccount()
	const chainId = useChainId()
	const position = getAddress(String(positionAddr || zeroAddress))
	const positionStats = usePositionStats(position)

	const [isApproving, setApproving] = useState(false)
	const [isAdjusting, setAdjusting] = useState(false)

	const [amount, setAmount] = useState(positionStats.minted)
	const [collateralAmount, setCollateralAmount] = useState(positionStats.collateralBal)
	const [liqPrice, setLiqPrice] = useState(positionStats.liqPrice)

	const maxRepayable = (1_000_000n * positionStats.ofdBalance) / (1_000_000n - positionStats.reserveContribution)
	const repayPosition = maxRepayable > positionStats.minted ? 0n : positionStats.minted - maxRepayable

	const paidOutAmount = () => {
		if (amount > positionStats.minted) {
			return ((amount - positionStats.minted) * (1_000_000n - positionStats.reserveContribution - positionStats.mintingFee)) / 1_000_000n
		} else {
			return amount - positionStats.minted - returnFromReserve()
		}
	}

	const returnFromReserve = () => {
		return (positionStats.reserveContribution * (amount - positionStats.minted)) / 1_000_000n
	}

	const collateralNote =
		collateralAmount < positionStats.collateralBal
			? `${formatUnits(abs(collateralAmount - positionStats.collateralBal), positionStats.collateralDecimal)} ${
					positionStats.collateralSymbol
				} sent back to your wallet`
			: collateralAmount > positionStats.collateralBal
				? `${formatUnits(abs(collateralAmount - positionStats.collateralBal), positionStats.collateralDecimal)} ${
						positionStats.collateralSymbol
					} taken from your wallet`
				: ''

	const onChangeAmount = (value: string) => {
		setAmount(BigInt(value))
	}

	const onChangeCollAmount = (value: string) => {
		setCollateralAmount(BigInt(value))
	}

	function getCollateralError() {
		if (collateralAmount - positionStats.collateralBal > positionStats.collateralUserBal) {
			return `Insufficient ${positionStats.collateralSymbol} in your wallet.`
		} else if (liqPrice * collateralAmount < amount * 10n ** 18n) {
			return 'Not enough collateral for the given price and mint amount.'
		}
	}

	/* <div
            className={`flex gap-2 items-center cursor-pointer`}
            onClick={() => setAmount(positionStats.limit)}
          >This position is limited to {formatUnits(positionStats.limit, 18)} OFD </div>)
 */
	function getAmountError() {
		if (amount > positionStats.limit) {
			return `This position is limited to ${formatUnits(positionStats.limit, 18)} OFD`
		} else if (-paidOutAmount() > positionStats.ofdBalance) {
			return 'Insufficient OFD in wallet'
		} else if (liqPrice * collateralAmount < amount * 10n ** 18n) {
			return `Can mint at most ${formatUnits((collateralAmount * liqPrice) / 10n ** 36n, 0)} OFD given price and collateral.`
		} else if (positionStats.liqPrice * collateralAmount < amount * 10n ** 18n) {
			return 'Amount can only be increased after new price has gone through cooldown.'
		} else {
			return ''
		}
	}

	const onChangeLiqAmount = (value: string) => {
		const valueBigInt = BigInt(value)
		setLiqPrice(valueBigInt)
	}

	const handleApprove = async () => {
		try {
			setApproving(true)

			const approveWriteHash = await writeContract(WAGMI_CONFIG, {
				address: positionStats.collateral as Address,
				abi: erc20Abi,
				functionName: 'approve',
				args: [position, maxUint256],
			})

			const toastContent = [
				{
					title: 'Amount:',
					value: 'infinite ' + positionStats.collateralSymbol,
				},
				{
					title: 'Spender: ',
					value: shortenAddress(position),
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

	const handleAdjust = useCallback(async () => {
		try {
			setAdjusting(true)
			const adjustWriteHash = await writeContract(WAGMI_CONFIG, {
				address: position,
				abi: ABIS.PositionABI,
				functionName: 'adjust',
				args: [amount, collateralAmount, liqPrice],
			})

			const toastContent = [
				{
					title: 'Amount:',
					value: formatBigInt(amount),
				},
				{
					title: 'Collateral Amount:',
					value: formatBigInt(collateralAmount, positionStats.collateralDecimal),
				},
				{
					title: 'Liquidation Price:',
					value: formatBigInt(liqPrice, 36 - positionStats.collateralDecimal),
				},
				{
					title: 'Transaction:',
					hash: adjustWriteHash,
				},
			]

			await toast.promise(waitForTransactionReceipt(WAGMI_CONFIG, { hash: adjustWriteHash, confirmations: 1 }), {
				pending: {
					render: <TxToast rows={toastContent} title={`Adjusting Position`} />,
				},
				success: {
					render: <TxToast rows={toastContent} title="Successfully Adjusted Position" />,
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
			setAdjusting(false)
		}
	}, [amount, collateralAmount, liqPrice, position, positionStats])

	return (
		<>
			<Head>
				<title>{envConfig.AppName} - Adjust Position</title>
			</Head>
			<div>
				<AppPageHeader backText="Back to position" backTo={`/position/${positionAddr}`} title="Adjust Position" />
				<section className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="bg-slate-950 rounded-xl p-4 flex flex-col gap-y-4">
						<div className="text-lg font-bold text-center">Variables</div>
						<TokenInput
							balanceLabel="Min:"
							error={getAmountError()}
							label="Amount"
							max={repayPosition}
							onChange={onChangeAmount}
							output={positionStats.closed ? '0' : ''}
							placeholder="Loan Amount"
							symbol="OFD"
							value={amount.toString()}
						/>
						<TokenInput
							balanceLabel="Max:"
							digit={positionStats.collateralDecimal}
							error={getCollateralError()}
							label="Collateral"
							max={positionStats.collateralUserBal + positionStats.collateralBal}
							note={collateralNote}
							onChange={onChangeCollAmount}
							placeholder="Collateral Amount"
							symbol={positionStats.collateralSymbol}
							value={collateralAmount.toString()}
						/>
						<TokenInput
							balanceLabel="Current Value"
							digit={36 - positionStats.collateralDecimal}
							label="Liquidation Price"
							max={positionStats.liqPrice}
							onChange={onChangeLiqAmount}
							placeholder="Liquidation Price"
							symbol={'OFD'}
							value={liqPrice.toString()}
						/>
						<div className="mx-auto mt-8 w-72 max-w-full flex-col">
							<GuardToAllowedChainBtn>
								{collateralAmount - positionStats.collateralBal > positionStats.collateralPosAllowance ? (
									<Button isLoading={isApproving} onClick={() => handleApprove()}>
										Approve Collateral
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
										error={positionStats.owner != address ? 'You can only adjust your own position' : ''}
										isLoading={isAdjusting}
										onClick={() => handleAdjust()}
										variant="primary"
									>
										Adjust Position
									</Button>
								)}
							</GuardToAllowedChainBtn>
						</div>
					</div>
					<div className="bg-slate-950 rounded-xl p-4 flex flex-col gap-y-4">
						<div className="text-lg font-bold text-center">Outcome</div>
						<div className="bg-slate-900 rounded-xl p-4 flex flex-col gap-2">
							<div className="flex">
								<div className="flex-1">Current minted amount</div>
								<DisplayAmount address={ADDRESS[chainId].oracleFreeDollar} amount={positionStats.minted} currency={'OFD'} />
							</div>
							<div className="flex">
								<div className="flex-1">{amount >= positionStats.minted ? 'You receive' : 'You return'}</div>
								<DisplayAmount address={ADDRESS[chainId].oracleFreeDollar} amount={paidOutAmount()} currency={'OFD'} />
							</div>
							<div className="flex">
								<div className="flex-1">{amount >= positionStats.minted ? 'Added to reserve on your behalf' : 'Returned from reserve'}</div>
								<DisplayAmount address={ADDRESS[chainId].oracleFreeDollar} amount={returnFromReserve()} currency={'OFD'} />
							</div>
							<div className="flex">
								<div className="flex-1">Minting fee (interest)</div>
								<DisplayAmount
									address={ADDRESS[chainId].oracleFreeDollar}
									amount={amount > positionStats.minted ? ((amount - positionStats.minted) * positionStats.mintingFee) / 1_000_000n : 0n}
									currency={'OFD'}
								/>
							</div>
							<hr className="border-slate-700 border-dashed" />
							<div className="flex font-bold">
								<div className="flex-1">Future minted amount</div>
								<DisplayAmount address={ADDRESS[chainId].oracleFreeDollar} amount={amount} currency={'OFD'} />
							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	)
}
