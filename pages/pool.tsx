import AppBox from 'components/AppBox'
import AppPageHeader from 'components/AppPageHeader'
import Button from 'components/Button'
import DisplayAmount from 'components/DisplayAmount'
import DisplayLabel from 'components/DisplayLabel'
import GuardToAllowedChainBtn from 'components/Guards/GuardToAllowedChainBtn'
import TokenInput from 'components/Input/TokenInput'
import { ABIS, ADDRESS } from 'contracts'
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContractUrl, useOFDPSQuery, usePoolStats, useTradeQuery, useTradeQueryOld } from 'hooks'
import { formatDuration } from 'utils'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useState } from 'react'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { envConfig } from 'app.env.config'
import { useEquityContractsFunctions } from 'hooks/pool/useEquityContractsFunctions'
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function Pool() {
	const [amount, setAmount] = useState(0n)
	const [error, setError] = useState('')
	const [direction, setDirection] = useState(true)

	const chainId = useChainId()
	const poolStats = usePoolStats()
	const equityUrl = useContractUrl(ADDRESS[chainId].equity)
	const { profit, loss } = useOFDPSQuery(ADDRESS[chainId].oracleFreeDollar)
	const { trades, refetch: refetchTrades } = useTradeQuery()
	const { oldTrades } = useTradeQueryOld()

	const start = 1731747568
	const end = 1735635568

	const filteredTrades = trades.filter((trade: any) => Number(trade.time) < start || Number(trade.time) > end)

	const filteredOldTrades = oldTrades.filter((trade: any) => Number(trade.time) < start || Number(trade.time) > end)

	const factoredTrades = filteredOldTrades.map((trade) => {
		return {
			...trade,
			lastPrice: Number(trade.lastPrice) / 1.35,
		}
	})

	const combinedTrades = [...factoredTrades, ...filteredTrades].sort((a: any, b: any) => Number(a.time) - Number(b.time))

	const { data: ofdpsResult, isLoading: shareLoading } = useReadContract({
		address: ADDRESS[chainId].equity,
		abi: ABIS.EquityABI,
		functionName: 'calculateShares',
		args: [amount],
	})

	const { data: ofdResult, isLoading: proceedLoading } = useReadContract({
		address: ADDRESS[chainId].equity,
		abi: ABIS.EquityABI,
		functionName: 'calculateProceeds',
		args: [amount],
	})

	const fromBalance = direction ? poolStats.ofdBalance : poolStats.equityBalance
	const result = (direction ? ofdpsResult : ofdResult) || 0n
	const fromSymbol = direction ? 'OFD' : 'OFDPS'
	const toSymbol = !direction ? 'OFD' : 'OFDPS'
	const redeemLeft = 86400n * 90n - (poolStats.equityBalance ? poolStats.equityUserVotes / poolStats.equityBalance / 2n ** 20n : 0n)

	const { handleApprove, handleInvest, handleRedeem, isApproving, isInvesting, isRedeeming } = useEquityContractsFunctions({
		amount,
		poolStats,
		refetchTrades,
		result,
	})

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
					<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8 flex flex-col border border-purple-500/50">
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
										curve: 'straight',
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
													opacity: 0.4,
												},
												{
													offset: 100,
													color: '#d89eef', // End with transparent purple
													opacity: 0.1,
												},
											],
										},
									},
									tooltip: {
										theme: 'dark',
										x: {
											format: 'dd MMM yyyy',
										},
										style: {
											fontSize: '12px',
											fontFamily: undefined,
										},
										fillSeriesColor: false,
										marker: {
											show: true,
											fillColors: ['#b51cf2'],
										},
									},
								}}
								series={[
									{
										name: 'OFDPS Price',
										data: combinedTrades.map((trade) => {
											return [parseFloat(trade.time) * 1000, Math.round(Number(trade.lastPrice) / 10 ** 16) / 100]
										}),
									},
								]}
								type="area"
							/>
							<p className="text-xs text-gray-400 mb-2 italic opacity-75">Chart includes v1 factorized trades</p>
						</div>
						<div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-2 border border-cyan-500/30">
							<AppBox>
								<DisplayLabel label="Market Cap" />
								<DisplayAmount amount={(poolStats.equitySupply * poolStats.equityPrice) / BigInt(1e18)} currency="OFD" />
							</AppBox>
							<AppBox>
								<DisplayLabel label="Total Reserve" />
								<DisplayAmount address={ADDRESS[chainId].oracleFreeDollar} amount={poolStats.ofdTotalReserve} currency="OFD" />
							</AppBox>
							<AppBox>
								<DisplayLabel label="Equity Capital" />
								<DisplayAmount address={ADDRESS[chainId].oracleFreeDollar} amount={poolStats.ofdEquity} currency="OFD" />
							</AppBox>
							<AppBox>
								<DisplayLabel label="Minter Reserve" />
								<DisplayAmount address={ADDRESS[chainId].oracleFreeDollar} amount={poolStats.ofdMinterReserve} currency="OFD" />
							</AppBox>
							<AppBox>
								<DisplayLabel label="Total Income" />
								<DisplayAmount address={ADDRESS[chainId].oracleFreeDollar} amount={profit} className="text-green-300" currency="OFD" />
							</AppBox>
							<AppBox>
								<DisplayLabel label="Total Losses" />
								<DisplayAmount address={ADDRESS[chainId].oracleFreeDollar} amount={loss} className="text-rose-400" currency="OFD" />
							</AppBox>
						</div>
					</div>
				</section>
			</div>
		</>
	)
}
