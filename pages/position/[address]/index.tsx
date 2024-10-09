import AppBox from "@components/AppBox";
import AppPageHeader from "@components/AppPageHeader";
import ChallengeTable from "@components/ChallengeTable";
import DisplayAmount from "@components/DisplayAmount";
import DisplayLabel from "@components/DisplayLabel";
import { ABIS, ADDRESS } from "@contracts";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useChallengeListStats, useChallengeLists, useContractUrl, useOfdPrice, usePositionStats } from "@hooks";
import { formatDate, shortenAddress } from "@utils";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Address, getAddress, zeroAddress } from "viem";
import { useAccount, useChainId, useReadContract } from "wagmi";
import { envConfig } from "../../../app.env.config";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/redux.store";

export default function PositionDetail() {
	const router = useRouter();
	const { address } = router.query;
	const explorerUrl = useContractUrl(String(address));
	const position = getAddress(String(address || zeroAddress));

	const chainId = useChainId();
	const { address: account } = useAccount();
	const positionStats = usePositionStats(position);
	const ownerLink = useContractUrl(positionStats.owner);
	const { challenges, loading: queryLoading } = useChallengeLists({ position });
	const { challengsData, loading } = useChallengeListStats(challenges);

	const prices = useSelector((state: RootState) => state.prices.coingecko);
	const collateralPrice = prices[positionStats.collateral?.toLowerCase() || zeroAddress]?.price?.usd;

	const ofdPrice = useOfdPrice();

	const { data: positionAssignedReserve } = useReadContract({
		address: ADDRESS[chainId].oracleFreeDollar,
		abi: ABIS.oracleFreeDollarABI,
		functionName: "calculateAssignedReserve",
		args: [positionStats.minted, Number(positionStats.reserveContribution)],
	});

	const isSubjectToCooldown = useCallback(() => {
		const now = BigInt(Math.floor(Date.now() / 1000));
		return now < positionStats.cooldown && positionStats.cooldown < 32508005122n;
	}, [positionStats.cooldown]);

	return (
		<>
			<Head>
				<title>{envConfig.AppName} - Position Overview</title>
			</Head>
			<div>
				<AppPageHeader
					title={`Position Overview ${address && shortenAddress(position)}`}
					link={explorerUrl}
					backTo="/positions"
					backText="Back to positions"
				/>
				<section className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="bg-slate-950 rounded-xl p-4 flex flex-col gap-y-4">
						<div className="text-lg font-bold text-center">Position Details</div>
						<div className="bg-slate-900 rounded-xl p-4 grid gap-2 grid-cols-2 lg:grid-cols-6">
							<AppBox className="col-span-3">
								<DisplayLabel label="Minted Total" />
								<DisplayAmount
									amount={positionStats.minted}
									currency="OFD"
									address={ADDRESS[chainId].oracleFreeDollar}
									usdPrice={ofdPrice}
								/>
							</AppBox>
							<AppBox className="col-span-3">
								<DisplayLabel label="Collateral" />
								<DisplayAmount
									amount={positionStats.collateralBal}
									currency={positionStats.collateralSymbol}
									digits={positionStats.collateralDecimal}
									address={positionStats.collateral}
									usdPrice={collateralPrice}
								/>
							</AppBox>
							<AppBox className="col-span-3">
								<DisplayLabel label="Liquidation Price" />
								<DisplayAmount
									amount={positionStats.liqPrice}
									currency={"OFD"}
									digits={36 - positionStats.collateralDecimal}
									address={ADDRESS[chainId].oracleFreeDollar}
									usdPrice={ofdPrice}
								/>
							</AppBox>
							<AppBox className="col-span-3">
								<DisplayLabel label="Retained Reserve" />
								<DisplayAmount
									amount={positionAssignedReserve || 0n}
									currency={"OFD"}
									address={ADDRESS[chainId].oracleFreeDollar}
									usdPrice={ofdPrice}
								/>
							</AppBox>
							<AppBox className="col-span-3">
								<DisplayLabel label="Limit" />
								<DisplayAmount
									amount={positionStats.limit}
									currency={"OFD"}
									address={ADDRESS[chainId].oracleFreeDollar}
									usdPrice={ofdPrice}
								/>
							</AppBox>
							<AppBox className="col-span-1 sm:col-span-3">
								<DisplayLabel label="Owner" />
								<Link href={ownerLink} className="flex items-center" target="_blank">
									{shortenAddress(positionStats.owner)}
									<FontAwesomeIcon icon={faArrowUpRightFromSquare} className="w-3 ml-2" />
								</Link>
							</AppBox>
							<AppBox className="col-span-2 sm:col-span-2">
								<DisplayLabel label="Expiration Date" />
								<b>{positionStats.closed ? "Closed" : formatDate(positionStats.expiration)}</b>
							</AppBox>
							<AppBox className="col-span-1 sm:col-span-2">
								<DisplayLabel label="Reserve Requirement" />
								<DisplayAmount amount={positionStats.reserveContribution / 100n} digits={2} currency={"%"} hideLogo />
							</AppBox>
							<AppBox className="col-span-2 sm:col-span-2">
								<DisplayLabel label="Annual Interest" />
								<DisplayAmount amount={positionStats.annualInterestPPM / 100n} digits={2} currency={"%"} hideLogo />
							</AppBox>
						</div>
						<div className="mt-4 w-full flex">
							{positionStats.owner == account ? (
								<Link href={`/position/${position}/adjust`} className="btn btn-primary w-72 m-auto">
									Adjust
								</Link>
							) : (
								<>
									<Link
										href={`/position/${position}/borrow`}
										className={`btn btn-primary flex-1 ${isSubjectToCooldown() && "btn-disabled"}`}
									>
										Clone & Mint
									</Link>
									<Link href={`/position/${position}/challenge`} className="btn btn-primary flex-1 ml-4">
										Challenge
									</Link>
								</>
							)}
						</div>
					</div>
					<div>
						{isSubjectToCooldown() && (
							<div className="bg-slate-950 rounded-xl p-4 flex flex-col mb-4">
								<div className="text-lg font-bold text-center">Cooldown</div>
								<AppBox className="flex-1 mt-4">
									<p>
										This position is subject to a cooldown period that ends on {formatDate(positionStats.cooldown)} as
										its owner has recently increased the applicable liquidation price. The cooldown period gives other
										users an opportunity to challenge the position before additional oracleFreeDollars can be minted.
									</p>
								</AppBox>
							</div>
						)}
						<ChallengeTable
							challenges={challengsData}
							noContentText="This position is currently not being challenged."
							loading={loading || queryLoading}
						/>
					</div>
				</section>
			</div>
		</>
	);
}
