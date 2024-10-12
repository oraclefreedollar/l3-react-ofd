import AppPageHeader from 'components/AppPageHeader'
import Button from 'components/Button'
import GuardToAllowedChainBtn from 'components/Guards/GuardToAllowedChainBtn'
import TokenInput from 'components/Input/TokenInput'
import { TxToast, renderErrorToast } from 'components/TxToast'
import { ABIS, ADDRESS } from 'contracts'
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSwapStats } from 'hooks'
import { formatBigInt, shortenAddress } from 'utils'
import Head from 'next/head'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { erc20Abi, formatUnits, maxUint256 } from 'viem'
import { useChainId } from 'wagmi'
import { waitForTransactionReceipt, writeContract } from 'wagmi/actions'
import { envConfig } from 'app.env.config'
import { WAGMI_CONFIG } from 'app.config'

export default function Swap() {
	const [amount, setAmount] = useState(0n)
	const [error, setError] = useState('')
	const [direction, setDirection] = useState(true)
	const [isApproving, setApproving] = useState(false)
	const [isMinting, setMinting] = useState(false)
	const [isBurning, setBurning] = useState(false)

	const chainId = useChainId()
	const swapStats = useSwapStats()

	const fromBalance = useMemo(() => (direction ? swapStats.usdtUserBal : swapStats.ofdUserBal), [direction, swapStats])
	const toBalance = useMemo(() => (!direction ? swapStats.usdtUserBal : swapStats.ofdUserBal), [direction, swapStats])
	const fromSymbol = useMemo(() => (direction ? 'USDT' : 'OFD'), [direction])
	const toSymbol = useMemo(() => (!direction ? 'USDT' : 'OFD'), [direction])
	const swapLimit = useMemo(
		() => (direction ? swapStats.bridgeLimit - swapStats.usdtBridgeBal : swapStats.usdtBridgeBal),
		[direction, swapStats]
	)

	const handleApprove = useCallback(async () => {
		try {
			setApproving(true)
			const approveWriteHash = await writeContract(WAGMI_CONFIG, {
				address: ADDRESS[chainId].usdt!,
				abi: erc20Abi,
				functionName: 'approve',
				args: [ADDRESS[chainId].bridge, maxUint256],
			})

			const toastContent = [
				{
					title: 'Amount:',
					value: 'infinite',
				},
				{
					title: 'Spender: ',
					value: shortenAddress(ADDRESS[chainId].bridge),
				},
				{
					title: 'Transaction:',
					hash: approveWriteHash,
				},
			]

			await toast.promise(waitForTransactionReceipt(WAGMI_CONFIG, { hash: approveWriteHash, confirmations: 1 }), {
				pending: {
					render: <TxToast rows={toastContent} title="Approving USDT" />,
				},
				success: {
					render: <TxToast rows={toastContent} title="Successfully Approved USDT" />,
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
			swapStats.refetch()
			setApproving(false)
		}
	}, [chainId, swapStats])

	const handleMint = useCallback(async () => {
		try {
			setMinting(true)

			const mintWriteHash = await writeContract(WAGMI_CONFIG, {
				address: ADDRESS[chainId].bridge,
				abi: ABIS.StablecoinBridgeABI,
				functionName: 'mint',
				args: [amount],
			})

			const toastContent = [
				{
					title: `${fromSymbol} Amount: `,
					value: formatBigInt(amount) + ' ' + fromSymbol,
				},
				{
					title: `${toSymbol} Amount: `,
					value: formatBigInt(amount) + ' ' + toSymbol,
				},
				{
					title: 'Transaction:',
					hash: mintWriteHash,
				},
			]

			await toast.promise(waitForTransactionReceipt(WAGMI_CONFIG, { hash: mintWriteHash, confirmations: 1 }), {
				pending: {
					render: <TxToast rows={toastContent} title={`Swapping ${fromSymbol} to ${toSymbol}`} />,
				},
				success: {
					render: <TxToast rows={toastContent} title={`Successfully Swapped ${fromSymbol} to ${toSymbol}`} />,
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
			swapStats.refetch()
			setMinting(false)
		}
	}, [amount, chainId, fromSymbol, swapStats, toSymbol])

	const handleBurn = useCallback(async () => {
		try {
			setBurning(true)
			const burnWriteHash = await writeContract(WAGMI_CONFIG, {
				address: ADDRESS[chainId].bridge,
				abi: ABIS.StablecoinBridgeABI,
				functionName: 'burn',
				args: [amount],
			})

			const toastContent = [
				{
					title: `${fromSymbol} Amount: `,
					value: formatBigInt(amount) + ' ' + fromSymbol,
				},
				{
					title: `${toSymbol} Amount: `,
					value: formatBigInt(amount) + ' ' + toSymbol,
				},
				{
					title: 'Transaction:',
					hash: burnWriteHash,
				},
			]

			await toast.promise(waitForTransactionReceipt(WAGMI_CONFIG, { hash: burnWriteHash, confirmations: 1 }), {
				pending: {
					render: <TxToast rows={toastContent} title={`Swapping ${fromSymbol} to ${toSymbol}`} />,
				},
				success: {
					render: <TxToast rows={toastContent} title={`Successfully Swapped ${fromSymbol} to ${toSymbol}`} />,
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
			swapStats.refetch()
			setBurning(false)
		}
	}, [amount, chainId, fromSymbol, swapStats, toSymbol])

	const onChangeDirection = useCallback(() => {
		setDirection(!direction)
	}, [direction])

	const onChangeAmount = useCallback(
		(value: string) => {
			const valueBigInt = BigInt(value)
			setAmount(valueBigInt)

			if (valueBigInt > fromBalance) {
				setError(`Not enough ${fromSymbol} in your wallet.`)
			} else if (valueBigInt > swapLimit) {
				setError(`Not enough ${toSymbol} available to swap.`)
			} else {
				setError('')
			}
		},
		[fromBalance, fromSymbol, swapLimit, toSymbol]
	)

	return (
		<>
			<Head>
				<title>{envConfig.AppName} - Swap</title>
			</Head>
			<div>
				<AppPageHeader title="Swap USDT and OFD" />
				<section className="mx-auto flex max-w-2xl flex-col gap-y-4 px-4 sm:px-8">
					<div className="bg-slate-950 rounded-xl p-8">
						<TokenInput
							error={error}
							limit={swapLimit}
							limitLabel="Swap limit"
							max={fromBalance}
							onChange={onChangeAmount}
							placeholder={'Swap Amount'}
							symbol={fromSymbol}
							value={amount.toString()}
						/>

						<div className="py-4 text-center">
							<button
								className={`btn btn-secondary text-slate-800 w-14 h-14 rounded-full transition ${direction && 'rotate-180'}`}
								onClick={onChangeDirection}
							>
								<FontAwesomeIcon className="rotate-90 w-6 h-6" icon={faArrowRightArrowLeft} />
							</button>
						</div>

						<TokenInput
							label="Receive"
							max={toBalance}
							note={`1 ${fromSymbol} = 1 ${toSymbol}`}
							output={formatUnits(amount, 18)}
							symbol={toSymbol}
						/>

						<div className="mx-auto mt-8 w-72 max-w-full flex-col">
							<GuardToAllowedChainBtn>
								{direction ? (
									amount > swapStats.usdtUserAllowance ? (
										<Button isLoading={isApproving} onClick={() => handleApprove()}>
											Approve
										</Button>
									) : (
										<Button disabled={amount == 0n || !!error} isLoading={isMinting} onClick={() => handleMint()}>
											Swap
										</Button>
									)
								) : (
									<Button disabled={amount == 0n || !!error} isLoading={isBurning} onClick={() => handleBurn()}>
										Swap
									</Button>
								)}
							</GuardToAllowedChainBtn>
						</div>

						{/* <div className="mx-auto mt-8">
							<a
								href={SOCIAL.Uniswap_Mainnet}
								target="_blank"
								rel="noreferrer"
								className="flex items-center justify-center underline"
							>
								Also available on
								<picture>
									<img src="/assets/uniswap.svg" alt="logo" className="w-6 mb-2 mx-1" />
								</picture>
								Uniswap.
							</a>
						</div> */}
					</div>
				</section>
			</div>
		</>
	)
}
