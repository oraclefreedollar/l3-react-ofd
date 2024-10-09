import { Badge } from "flowbite-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Address, zeroAddress } from "viem";
import { useAccount, useChainId } from "wagmi";
import { ADDRESS } from "../../contracts/address";
import { RootState } from "../../redux/redux.store";
import { PositionQuery } from "../../redux/slices/positions.types";
import DisplayAmount from "../DisplayAmount";
import TableRow from "../Table/TableRow";

interface Props {
	position: PositionQuery;
}

export default function PositionRow({ position }: Props) {
	const { address } = useAccount();
	const chainId = useChainId();
	const prices = useSelector((state: RootState) => state.prices.coingecko);
	// this price is actually the price of the OracleFreeDollar

	const collTokenPrice = prices[position.collateral.toLowerCase()]?.price?.usd;
	const ofdPrice = position.ofd && prices[position.ofd]?.price?.usd;

	if (!collTokenPrice || !ofdPrice) return null;

	const account = address || zeroAddress;
	const isMine = position.owner == account;

	const mintedPct = Math.floor((parseInt(position.minted) / parseInt(position.limitForPosition)) * 1000) / 10;
	const mintedConesPct = Math.floor((1 - parseInt(position.availableForClones) / parseInt(position.limitForClones)) * 1000) / 10;
	// const cooldownWait: number = Math.round((position.cooldown - Date.now()) / 1000 / 60);

	// TODO: For testing purposes only
	// const cooldownWait: number = Math.round((-10000000 + 40000000 * Math.random()) / 1000 / 60);

	return (
		<TableRow
			link={`/position/${position.position}`}
			actionCol={
				isMine ? (
					<Link href={`/position/${position.position}/adjust`} className="btn btn-primary w-full">
						Adjust
					</Link>
				) : BigInt(position.availableForClones) > 0n && !position.closed ? (
					<Link href={`/position/${position.position}/borrow`} className="btn btn-primary w-full">
						Clone & Mint
					</Link>
				) : (
					<></>
				)
			}
		>
			<div>
				<DisplayAmount
					amount={BigInt(position.collateralBalance)}
					currency={position.collateralSymbol}
					digits={position.collateralDecimals}
					address={position.collateral}
					usdPrice={collTokenPrice}
				/>
			</div>
			<div>
				<DisplayAmount
					amount={BigInt(position.price)}
					currency={"OFD"}
					hideLogo
					// bold={positionStats.cooldown * 1000n > Date.now()}
					digits={36 - position.collateralDecimals}
					address={ADDRESS[chainId].oracleFreeDollar}
					usdPrice={ofdPrice}
				/>
			</div>

			{/* <Badge className="w-20 text-center flex-col" color={`${cooldownWait > 0 ? "red" : "green"}`}>
				Mintable {cooldownWait > 0 ? `(${cooldownWait}min)` : ""}
			</Badge> */}

			<div className="flex items-center">
				{position.denied ? (
					<Badge color="dark">Denied</Badge>
				) : BigInt(position.collateralBalance) == 0n ? (
					<Badge color="dark">Closed</Badge>
				) : (
					<DisplayAmount
						amount={BigInt(position.availableForClones)}
						currency={"OFD"}
						hideLogo
						address={ADDRESS[chainId].oracleFreeDollar}
						usdPrice={ofdPrice}
					/>
				)}
			</div>
		</TableRow>
	);
}
