import AppBox from "@components/AppBox";
import AppPageHeader from "@components/AppPageHeader";
import ChallengeTable from "@components/ChallengeTable";
import DisplayAmount from "@components/DisplayAmount";
import DisplayLabel from "@components/DisplayLabel";
import { ABIS, ADDRESS } from "@contracts";
import { useChallengeListStats, useChallengeLists, useContractUrl, usePositionStats } from "@hooks";
import { formatDate, shortenAddress } from "@utils";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { getAddress, zeroAddress } from "viem";
import { useAccount, useChainId, useReadContract } from "wagmi";
import { envConfig } from "../../app.env.config";

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

	const { data: positionAssignedReserve } = useReadContract({
		address: ADDRESS[chainId].oracleFreeDollar,
		abi: ABIS.oracleFreeDollarABI,
		functionName: "calculateAssignedReserve",
		args: [positionStats.minted, Number(positionStats.reserveContribution)],
	});

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
								<DisplayAmount amount={positionStats.minted} currency="OFD" address={ADDRESS[chainId].oracleFreeDollar} />
							</AppBox>
							<AppBox className="col-span-3">
								<DisplayLabel label="Collateral" />
								<DisplayAmount
									amount={positionStats.collateralBal}
									currency={positionStats.collateralSymbol}
									digits={positionStats.collateralDecimal}
									address={positionStats.collateral}
								/>
							</AppBox>
							<AppBox className="col-span-3">
								<DisplayLabel label="Liquidation Price" />
								<DisplayAmount
									amount={positionStats.liqPrice}
									currency={"OFD"}
									digits={36 - positionStats.collateralDecimal}
									address={ADDRESS[chainId].oracleFreeDollar}
								/>
							</AppBox>
							<AppBox className="col-span-3">
								<DisplayLabel label="Retained Reserve" />
								<DisplayAmount
									amount={positionAssignedReserve || 0n}
									currency={"OFD"}
									address={ADDRESS[chainId].oracleFreeDollar}
								/>
							</AppBox>
							<AppBox className="col-span-3">
								<DisplayLabel label="Limit" />
								<DisplayAmount amount={positionStats.limit} currency={"OFD"} address={ADDRESS[chainId].oracleFreeDollar} />
							</AppBox>
							<AppBox className="col-span-1 sm:col-span-3">
								<DisplayLabel label="Owner" />
								<Link href={ownerLink} className="text-link" target="_blank">
									<b>{shortenAddress(positionStats.owner)}</b>
								</Link>
							</AppBox>
							<AppBox className="col-span-2 sm:col-span-2">
								<DisplayLabel label="Expiration Date" />
								<b>{formatDate(positionStats.expiration)}</b>
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
									<Link href={`/position/${position}/borrow`} className="btn btn-primary flex-1">
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
