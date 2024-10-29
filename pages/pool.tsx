import AppBox from 'components/AppBox'
import AppPageHeader from 'components/AppPageHeader'
import Button from 'components/Button'
import DisplayAmount from 'components/DisplayAmount'
import DisplayLabel from 'components/DisplayLabel'
import GuardToAllowedChainBtn from 'components/Guards/GuardToAllowedChainBtn'
import TokenInput from 'components/Input/TokenInput'
import { TxToast, renderErrorToast } from 'components/TxToast'
import { ABIS, ADDRESS } from 'contracts'
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContractUrl, useOFDPSQuery, usePoolStats, useTradeQuery } from 'hooks'
import { formatBigInt, formatDuration, shortenAddress } from 'utils'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { erc20Abi, formatUnits, zeroAddress } from 'viem'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import { waitForTransactionReceipt, writeContract } from 'wagmi/actions'
import { envConfig } from 'app.env.config'
import { WAGMI_CONFIG } from 'app.config'
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function Pool() {
	const [amount, setAmount] = useState(0n)
	const [error, setError] = useState('')
	const [direction, setDirection] = useState(true)
	const [isApproving, setApproving] = useState(false)
	const [isInvesting, setInvesting] = useState(false)
	const [isRedeeming, setRedeeming] = useState(false)

	const { address } = useAccount()
	const chainId = useChainId()
	const poolStats = usePoolStats()
	const equityUrl = useContractUrl(ADDRESS[chainId].equity)
	const { profit, loss } = useOFDPSQuery(ADDRESS[chainId].oracleFreeDollar)
	const { trades } = useTradeQuery()
	const account = address || zeroAddress

	const handleApprove = async () => {
		try {
			setApproving(true)
			const approveWriteHash = await writeContract(WAGMI_CONFIG, {
				address: ADDRESS[chainId].oracleFreeDollar,
				abi: erc20Abi,
				functionName: 'approve',
				args: [ADDRESS[chainId].equity, amount],
			})

			const toastContent = [
				{
					title: 'Amount:',
					value: formatBigInt(amount) + ' OFD',
				},
				{
					title: 'Spender: ',
					value: shortenAddress(ADDRESS[chainId].equity),
				},
				{
					title: 'Transaction:',
					hash: approveWriteHash,
				},
			]

			await toast.promise(waitForTransactionReceipt(WAGMI_CONFIG, { hash: approveWriteHash, confirmations: 1 }), {
				pending: {
					render: <TxToast rows={toastContent} title={`Approving OFD`} />,
				},
				success: {
					render: <TxToast rows={toastContent} title="Successfully Approved OFD" />,
				},
				error: {
					render(error: any) {
						return renderErrorToast(error)
					},
				},
			})
		} finally {
			poolStats.refetch()
			setApproving(false)
		}
	}

	const handleInvest = async () => {
		try {
			setInvesting(true)

			const investWriteHash = await writeContract(WAGMI_CONFIG, {
				address: ADDRESS[chainId].equity,
				abi: ABIS.EquityABI,
				functionName: 'invest',
				args: [amount, result],
			})

			const toastContent = [
				{
					title: 'Amount:',
					value: formatBigInt(amount, 18) + ' OFD',
				},
				{
					title: 'Shares: ',
					value: formatBigInt(result) + ' OFDPS',
				},
				{
					title: 'Transaction: ',
					hash: investWriteHash,
				},
			]

			await toast.promise(waitForTransactionReceipt(WAGMI_CONFIG, { hash: investWriteHash, confirmations: 1 }), {
				pending: {
					render: <TxToast rows={toastContent} title={`Investing OFD`} />,
				},
				success: {
					render: <TxToast rows={toastContent} title="Successfully Invested" />,
				},
				error: {
					render(error: any) {
						return renderErrorToast(error)
					},
				},
			})
		} finally {
			poolStats.refetch()
			setInvesting(false)
		}
	}
	const handleRedeem = async () => {
		try {
			setRedeeming(true)
			const redeemWriteHash = await writeContract(WAGMI_CONFIG, {
				address: ADDRESS[chainId].equity,
				abi: ABIS.EquityABI,
				functionName: 'redeem',
				args: [account, amount],
			})

			const toastContent = [
				{
					title: 'Amount:',
					value: formatBigInt(amount) + ' OFDPS',
				},
				{
					title: 'Receive: ',
					value: formatBigInt(result) + ' OFD',
				},
				{
					title: 'Transaction: ',
					hash: redeemWriteHash,
				},
			]

			await toast.promise(waitForTransactionReceipt(WAGMI_CONFIG, { hash: redeemWriteHash, confirmations: 1 }), {
				pending: {
					render: <TxToast rows={toastContent} title={`Redeeming OFDPS`} />,
				},
				success: {
					render: <TxToast rows={toastContent} title="Successfully Redeemed" />,
				},
				error: {
					render(error: any) {
						return renderErrorToast(error)
					},
				},
			})
		} finally {
			poolStats.refetch()
			setRedeeming(false)
		}
	}

	const { data: ofdpsResult, isLoading: shareLoading } = useReadContract({
		address: ADDRESS[chainId].equity,
		abi: ABIS.EquityABI,
		functionName: 'calculateShares',
		args: [amount],
	})

	const { data: frankenResult, isLoading: proceedLoading } = useReadContract({
		address: ADDRESS[chainId].equity,
		abi: ABIS.EquityABI,
		functionName: 'calculateProceeds',
		args: [amount],
	})

	const fromBalance = direction ? poolStats.ofdBalance : poolStats.equityBalance
	const result = (direction ? ofdpsResult : frankenResult) || 0n
	const fromSymbol = direction ? 'OFD' : 'OFDPS'
	const toSymbol = !direction ? 'OFD' : 'OFDPS'
	const redeemLeft = 86400n * 90n - (poolStats.equityBalance ? poolStats.equityUserVotes / poolStats.equityBalance / 2n ** 20n : 0n)

	const onChangeAmount = (value: string) => {
		const valueBigInt = BigInt(value)
		setAmount(valueBigInt)
		if (valueBigInt > fromBalance) {
			setError(`Not enough ${fromSymbol} in your wallet.`)
		} else {
			setError('')
		}
	}

	const conversionNote = () => {
		if (amount != 0n && result != 0n) {
			const ratio = (result * BigInt(1e18)) / amount
			return `1 ${fromSymbol} = ${formatUnits(ratio, 18)} ${toSymbol}`
		} else {
			return `${toSymbol} price is calculated dynamically.\n`
		}
	}

	return (
		<>
			<Head>
				<title>{envConfig.AppName} - Equity</title>
			</Head>
			<div>
				<AppPageHeader link={equityUrl} title={`${envConfig.AppName} Pool Shares (OFDPS)`} />
				<section className="grid grid-cols-1 md:grid-cols-2 gap-4 container mx-auto">
					<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-4 flex flex-col border border-purple-500/50">
						<div className="text-xl font-bold text-center text-white">Pool Details</div>
						<div className="p-4 mt-5">
							<TokenInput
								error={error}
								max={fromBalance}
								onChange={onChangeAmount}
								placeholder={fromSymbol + ' Amount'}
								symbol={fromSymbol}
								value={amount.toString()}
							/>
							<div className="py-4 text-center z-0">
								<button
									className={`btn btn-secondary z-0 text-slate-800 w-14 h-14 rounded-full transition ${direction && 'rotate-180'}`}
									onClick={() => setDirection(!direction)}
								>
									<FontAwesomeIcon className="rotate-90 w-6 h-6" icon={faArrowRightArrowLeft} />
								</button>
							</div>
							<TokenInput hideMaxLabel label="Receive" output={formatUnits(result, 18)} symbol={toSymbol} />
							<div className={`mt-2 px-1 transition-opacity ${(shareLoading || proceedLoading) && 'opacity-50'}`}>
								{conversionNote()}
								<br />
								{!direction && 'Redemption requires a 90 days holding period.'}
							</div>

							<div className="mx-auto mt-8 w-72 max-w-full flex-col">
								<GuardToAllowedChainBtn>
									{direction ? (
										amount > poolStats.ofdAllowance ? (
											<Button disabled={amount == 0n || !!error} isLoading={isApproving} onClick={() => handleApprove()}>
												Approve
											</Button>
										) : (
											<Button disabled={amount == 0n || !!error} isLoading={isInvesting} onClick={() => handleInvest()} variant="primary">
												Invest
											</Button>
										)
									) : (
										<Button
											disabled={amount == 0n || !!error || !poolStats.equityCanRedeem}
											isLoading={isRedeeming}
											onClick={() => handleRedeem()}
											variant="primary"
										>
											Redeem
										</Button>
									)}
								</GuardToAllowedChainBtn>
							</div>
						</div>
						<div className="mt-5 bg-slate-900 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
							<AppBox>
								<DisplayLabel label="Your Balance" />
								<DisplayAmount address={ADDRESS[chainId].equity} amount={poolStats.equityBalance} currency="OFDPS" />
							</AppBox>
							<AppBox>
								<DisplayLabel label="Value at Current Price" />
								<DisplayAmount
									address={ADDRESS[chainId].oracleFreeDollar}
									amount={(poolStats.equityPrice * poolStats.equityBalance) / BigInt(1e18)}
									currency="OFD"
								/>
							</AppBox>
							<AppBox>
								<DisplayLabel label="Holding Duration" />
								{poolStats.equityBalance > 0 ? formatDuration(poolStats.equityHoldingDuration) : '-'}
							</AppBox>
							<AppBox className="flex-1">
								<DisplayLabel label="Can redeem after" />
								{formatDuration(redeemLeft)}
							</AppBox>
						</div>
						{/* <div>
							Also available as{" "}
							<Link
								href={"https://etherscan.io/address/0x5052d3cc819f53116641e89b96ff4cd1ee80b182"}
								target="_blank"
								className="underline"
							>
								WOFDPS
							</Link>{" "}
							for{" "}
							<Link href={SOCIAL.Uniswap_WOFDPS_Polygon} target="_blank" className="underline">
								trading on Polygon
							</Link>
						</div> */}
					</div>
					<div
						className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8 flex flex-col border border-purple-500/50">
						<div id="chart-timeline">
							<div className="flex justify-between">
								<div>
									<DisplayLabel label="OFDPS Price" />
									<DisplayAmount amount={poolStats.equityPrice} currency="OFD" />
								</div>
								<div className="text-right">
									<DisplayLabel label="Supply" />
									<DisplayAmount amount={poolStats.equitySupply} currency="OFDPS" />
								</div>
							</div>
							<ApexChart
								options={{
									theme: {
										mode: 'dark',
										palette: 'palette1',
									},
									chart: {
										type: 'area',
										height: 300,
										dropShadow: {
											enabled: false,
											color: '#d89eef',
										},
										toolbar: {
											show: false,
										},
										zoom: {
											enabled: false,
										},
										background: 'transparent',
									},
									stroke: {
										width: 2,
										curve: 'smooth',
										colors: ['#d89eef'],
									},
									dataLabels: {
										enabled: false,
									},
									grid: {
										show: false,
									},
									xaxis: {
										type: 'datetime',
										labels: {
											show: false,
										},
										axisBorder: {
											show: false,
										},
										axisTicks: {
											show: false,
										},
									},
									yaxis: {
										show: false,
									},
									fill: {
										type: 'gradient',
										gradient: {
											shadeIntensity: 1,
											opacityFrom: 0.7,
											opacityTo: 0.1,
											stops: [0, 90, 100],
											colorStops: [
												{
													offset: 0,
													color: '#d89eef', // Start with full purple
													opacity: 0.4
												},
												{
													offset: 100,
													color: '#d89eef', // End with transparent purple
													opacity: 0.1
												}
											]
										}
									},
									tooltip: {
										theme: 'dark',
										x: {
											format: 'dd MMM yyyy',
										},
										style: {
											fontSize: '12px',
											fontFamily: undefined
										},
										fillSeriesColor: false,
										marker: {
											show: true,
											fillColors: ['#b51cf2']
										}
									},
								}}
								series={[
									{
										name: 'OFDPS Price',
										data: trades.map((trade) => {
											return [parseFloat(trade.time) * 1000, Math.round(Number(trade.lastPrice) / 10 ** 16) / 100]
										}),
									},
								]}
								type="area"
							/>
						</div>
						<div
							className="bg-black/40 backdrop-blur-sm rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-2 border border-cyan-500/30">
							<AppBox>
								<DisplayLabel label="Market Cap" />
								<DisplayAmount amount={(poolStats.equitySupply * poolStats.equityPrice) / BigInt(1e18)}
															 currency="OFD" />
							</AppBox>
							<AppBox>
								<DisplayLabel label="Total Reserve" />
								<DisplayAmount address={ADDRESS[chainId].oracleFreeDollar} amount={poolStats.ofdTotalReserve}
															 currency="OFD" />
							</AppBox>
							<AppBox>
								<DisplayLabel label="Equity Capital" />
								<DisplayAmount address={ADDRESS[chainId].oracleFreeDollar} amount={poolStats.ofdEquity}
															 currency="OFD" />
							</AppBox>
							<AppBox>
								<DisplayLabel label="Minter Reserve" />
								<DisplayAmount address={ADDRESS[chainId].oracleFreeDollar} amount={poolStats.ofdMinterReserve}
															 currency="OFD" />
							</AppBox>
							<AppBox>
								<DisplayLabel label="Total Income" />
								<DisplayAmount address={ADDRESS[chainId].oracleFreeDollar} amount={profit} className="text-green-300"
															 currency="OFD" />
							</AppBox>
							<AppBox>
								<DisplayLabel label="Total Losses" />
								<DisplayAmount address={ADDRESS[chainId].oracleFreeDollar} amount={loss} className="text-rose-400"
															 currency="OFD" />
							</AppBox>
						</div>
					</div>
				</section>
			</div>
		</>
	)
}
