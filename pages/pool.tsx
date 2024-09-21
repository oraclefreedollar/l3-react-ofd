import AppBox from "@components/AppBox";
import AppPageHeader from "@components/AppPageHeader";
import Button from "@components/Button";
import DisplayAmount from "@components/DisplayAmount";
import DisplayLabel from "@components/DisplayLabel";
import GuardToAllowedChainBtn from "@components/Guards/GuardToAllowedChainBtn";
import TokenInput from "@components/Input/TokenInput";
import { TxToast, renderErrorToast } from "@components/TxToast";
import { ABIS, ADDRESS } from "@contracts";
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContractUrl, useOFDPSQuery, usePoolStats, useTradeQuery } from "@hooks";
import { formatBigInt, formatDuration, shortenAddress } from "@utils";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";
import { toast } from "react-toastify";
import { erc20Abi, formatUnits, zeroAddress } from "viem";
import { useAccount, useChainId, useReadContract } from "wagmi";
import { waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { envConfig } from "../app.env.config";
import { WAGMI_CONFIG } from "../app.config";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Pool() {
	const [amount, setAmount] = useState(0n);
	const [error, setError] = useState("");
	const [direction, setDirection] = useState(true);
	const [isApproving, setApproving] = useState(false);
	const [isInvesting, setInvesting] = useState(false);
	const [isRedeeming, setRedeeming] = useState(false);

	const { address } = useAccount();
	const chainId = useChainId();
	const poolStats = usePoolStats();
	const equityUrl = useContractUrl(ADDRESS[chainId].equity);
	const { profit, loss } = useOFDPSQuery(ADDRESS[chainId].oracleFreeDollar);
	const { trades } = useTradeQuery();
	const account = address || zeroAddress;

	const handleApprove = async () => {
		try {
			setApproving(true);
			const approveWriteHash = await writeContract(WAGMI_CONFIG, {
				address: ADDRESS[chainId].oracleFreeDollar,
				abi: erc20Abi,
				functionName: "approve",
				args: [ADDRESS[chainId].equity, amount],
			});

			const toastContent = [
				{
					title: "Amount:",
					value: formatBigInt(amount) + " OFD",
				},
				{
					title: "Spender: ",
					value: shortenAddress(ADDRESS[chainId].equity),
				},
				{
					title: "Transaction:",
					hash: approveWriteHash,
				},
			];

			await toast.promise(waitForTransactionReceipt(WAGMI_CONFIG, { hash: approveWriteHash, confirmations: 1 }), {
				pending: {
					render: <TxToast title={`Approving OFD`} rows={toastContent} />,
				},
				success: {
					render: <TxToast title="Successfully Approved OFD" rows={toastContent} />,
				},
				error: {
					render(error: any) {
						return renderErrorToast(error);
					},
				},
			});
		} finally {
			poolStats.refetch();
			setApproving(false);
		}
	};

	const handleInvest = async () => {
		try {
			setInvesting(true);

			const investWriteHash = await writeContract(WAGMI_CONFIG, {
				address: ADDRESS[chainId].equity,
				abi: ABIS.EquityABI,
				functionName: "invest",
				args: [amount, result],
			});

			const toastContent = [
				{
					title: "Amount:",
					value: formatBigInt(amount, 18) + " OFD",
				},
				{
					title: "Shares: ",
					value: formatBigInt(result) + " OFDPS",
				},
				{
					title: "Transaction: ",
					hash: investWriteHash,
				},
			];

			await toast.promise(waitForTransactionReceipt(WAGMI_CONFIG, { hash: investWriteHash, confirmations: 1 }), {
				pending: {
					render: <TxToast title={`Investing OFD`} rows={toastContent} />,
				},
				success: {
					render: <TxToast title="Successfully Invested" rows={toastContent} />,
				},
				error: {
					render(error: any) {
						return renderErrorToast(error);
					},
				},
			});
		} finally {
			poolStats.refetch();
			setInvesting(false);
		}
	};
	const handleRedeem = async () => {
		try {
			setRedeeming(true);
			const redeemWriteHash = await writeContract(WAGMI_CONFIG, {
				address: ADDRESS[chainId].equity,
				abi: ABIS.EquityABI,
				functionName: "redeem",
				args: [account, amount],
			});

			const toastContent = [
				{
					title: "Amount:",
					value: formatBigInt(amount) + " OFDPS",
				},
				{
					title: "Receive: ",
					value: formatBigInt(result) + " OFD",
				},
				{
					title: "Transaction: ",
					hash: redeemWriteHash,
				},
			];

			await toast.promise(waitForTransactionReceipt(WAGMI_CONFIG, { hash: redeemWriteHash, confirmations: 1 }), {
				pending: {
					render: <TxToast title={`Redeeming OFDPS`} rows={toastContent} />,
				},
				success: {
					render: <TxToast title="Successfully Redeemed" rows={toastContent} />,
				},
				error: {
					render(error: any) {
						return renderErrorToast(error);
					},
				},
			});
		} finally {
			poolStats.refetch();
			setRedeeming(false);
		}
	};

	const { data: ofdpsResult, isLoading: shareLoading } = useReadContract({
		address: ADDRESS[chainId].equity,
		abi: ABIS.EquityABI,
		functionName: "calculateShares",
		args: [amount],
	});

	const { data: frankenResult, isLoading: proceedLoading } = useReadContract({
		address: ADDRESS[chainId].equity,
		abi: ABIS.EquityABI,
		functionName: "calculateProceeds",
		args: [amount],
	});

	const fromBalance = direction ? poolStats.ofdBalance : poolStats.equityBalance;
	const result = (direction ? ofdpsResult : frankenResult) || 0n;
	const fromSymbol = direction ? "OFD" : "OFDPS";
	const toSymbol = !direction ? "OFD" : "OFDPS";
	const redeemLeft = 86400n * 90n - (poolStats.equityBalance ? poolStats.equityUserVotes / poolStats.equityBalance / 2n ** 20n : 0n);

	const onChangeAmount = (value: string) => {
		const valueBigInt = BigInt(value);
		setAmount(valueBigInt);
		if (valueBigInt > fromBalance) {
			setError(`Not enough ${fromSymbol} in your wallet.`);
		} else {
			setError("");
		}
	};

	const conversionNote = () => {
		if (amount != 0n && result != 0n) {
			const ratio = (result * BigInt(1e18)) / amount;
			return `1 ${fromSymbol} = ${formatUnits(ratio, 18)} ${toSymbol}`;
		} else {
			return `${toSymbol} price is calculated dynamically.\n`;
		}
	};

	return (
		<>
			<Head>
				<title>{envConfig.AppName} - Equity</title>
			</Head>
			<div>
				<AppPageHeader title={`${envConfig.AppName} Pool Shares (OFDPS)`} link={equityUrl} />
				<section className="grid grid-cols-1 md:grid-cols-2 gap-4 container mx-auto">
					<div className="bg-slate-950 rounded-xl p-4 flex flex-col">
						<div className="text-lg font-bold text-center">Pool Details</div>
						<div className="p-4 mt-5">
							<TokenInput
								max={fromBalance}
								symbol={fromSymbol}
								onChange={onChangeAmount}
								value={amount.toString()}
								error={error}
								placeholder={fromSymbol + " Amount"}
							/>
							<div className="py-4 text-center z-0">
								<button
									className={`btn btn-secondary z-0 text-slate-800 w-14 h-14 rounded-full transition ${
										direction && "rotate-180"
									}`}
									onClick={() => setDirection(!direction)}
								>
									<FontAwesomeIcon icon={faArrowRightArrowLeft} className="rotate-90 w-6 h-6" />
								</button>
							</div>
							<TokenInput symbol={toSymbol} hideMaxLabel output={formatUnits(result, 18)} label="Receive" />
							<div className={`mt-2 px-1 transition-opacity ${(shareLoading || proceedLoading) && "opacity-50"}`}>
								{conversionNote()}
								<br />
								{!direction && "Redemption requires a 90 days holding period."}
							</div>

							<div className="mx-auto mt-8 w-72 max-w-full flex-col">
								<GuardToAllowedChainBtn>
									{direction ? (
										amount > poolStats.ofdAllowance ? (
											<Button
												isLoading={isApproving}
												disabled={amount == 0n || !!error}
												onClick={() => handleApprove()}
											>
												Approve
											</Button>
										) : (
											<Button
												variant="primary"
												disabled={amount == 0n || !!error}
												isLoading={isInvesting}
												onClick={() => handleInvest()}
											>
												Invest
											</Button>
										)
									) : (
										<Button
											variant="primary"
											isLoading={isRedeeming}
											disabled={amount == 0n || !!error || !poolStats.equityCanRedeem}
											onClick={() => handleRedeem()}
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
								<DisplayAmount amount={poolStats.equityBalance} currency="OFDPS" address={ADDRESS[chainId].equity} />
							</AppBox>
							<AppBox>
								<DisplayLabel label="Value at Current Price" />
								<DisplayAmount
									amount={(poolStats.equityPrice * poolStats.equityBalance) / BigInt(1e18)}
									currency="OFD"
									address={ADDRESS[chainId].oracleFreeDollar}
								/>
							</AppBox>
							<AppBox>
								<DisplayLabel label="Holding Duration" />
								{poolStats.equityBalance > 0 ? formatDuration(poolStats.equityHoldingDuration) : "-"}
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
					<div className="bg-slate-950 rounded-xl p-4 grid grid-cols-1 gap-2">
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
								type="area"
								options={{
									theme: {
										mode: "dark",
										palette: "palette1",
									},
									chart: {
										type: "area",
										height: 300,
										dropShadow: {
											enabled: false,
										},
										toolbar: {
											show: false,
										},
										zoom: {
											enabled: false,
										},
										background: "transparent",
									},
									stroke: {
										width: 3,
									},
									dataLabels: {
										enabled: false,
									},
									grid: {
										show: false,
									},
									xaxis: {
										type: "datetime",
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
										type: "gradient",
										gradient: {
											shadeIntensity: 0,
											opacityTo: 0,
											shade: "#1C64F2",
											gradientToColors: ["#1C64F2"],
										},
									},
									tooltip: {
										x: {
											format: "dd MMM yyyy",
										},
									},
								}}
								series={[
									{
										name: "OFDPS Price",
										data: trades.map((trade) => {
											return [parseFloat(trade.time) * 1000, Math.round(Number(trade.lastPrice) / 10 ** 16) / 100];
										}),
									},
								]}
							/>
						</div>
						<div className="bg-slate-900 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
							<AppBox>
								<DisplayLabel label="Market Cap" />
								<DisplayAmount amount={(poolStats.equitySupply * poolStats.equityPrice) / BigInt(1e18)} currency="OFD" />
							</AppBox>
							<AppBox>
								<DisplayLabel label="Total Reserve" />
								<DisplayAmount
									amount={poolStats.ofdTotalReserve}
									currency="OFD"
									address={ADDRESS[chainId].oracleFreeDollar}
								/>
							</AppBox>
							<AppBox>
								<DisplayLabel label="Equity Capital" />
								<DisplayAmount amount={poolStats.ofdEquity} currency="OFD" address={ADDRESS[chainId].oracleFreeDollar} />
							</AppBox>
							<AppBox>
								<DisplayLabel label="Minter Reserve" />
								<DisplayAmount
									amount={poolStats.ofdMinterReserve}
									currency="OFD"
									address={ADDRESS[chainId].oracleFreeDollar}
								/>
							</AppBox>
							<AppBox>
								<DisplayLabel label="Total Income" />
								<DisplayAmount
									amount={profit}
									currency="OFD"
									className="text-green-300"
									address={ADDRESS[chainId].oracleFreeDollar}
								/>
							</AppBox>
							<AppBox>
								<DisplayLabel label="Total Losses" />
								<DisplayAmount
									amount={loss}
									currency="OFD"
									className="text-rose-400"
									address={ADDRESS[chainId].oracleFreeDollar}
								/>
							</AppBox>
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
