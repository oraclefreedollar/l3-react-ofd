import { Badge } from 'flowbite-react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { zeroAddress } from 'viem'
import { useAccount, useChainId } from 'wagmi'
import { ADDRESS } from 'contracts/address'
import { RootState } from 'redux/redux.store'
import { PositionQuery } from 'redux/slices/positions.types'
import DisplayAmount from '../DisplayAmount'
import TableRow from '../Table/TableRow'

interface Props {
	position: PositionQuery
}

export default function PositionRow({ position }: Props) {
	const { address } = useAccount()
	const chainId = useChainId()
	const prices = useSelector((state: RootState) => state.prices.coingecko)
	// this price is actually the price of the OracleFreeDollar

	const collTokenPrice = prices[position.collateral.toLowerCase()]?.price?.usd
	const ofdPrice = position.ofd && prices[position.ofd]?.price?.usd

	if (!collTokenPrice || !ofdPrice) return null

	const account = address || zeroAddress
	const isMine = position.owner == account

	// const mintedPct = Math.floor((parseInt(position.minted) / parseInt(position.limitForPosition)) * 1000) / 10
	// const mintedConesPct = Math.floor((1 - parseInt(position.availableForClones) / parseInt(position.limitForClones)) * 1000) / 10
	// const cooldownWait: number = Math.round((position.cooldown - Date.now()) / 1000 / 60);

	// TODO: For testing purposes only
	// const cooldownWait: number = Math.round((-10000000 + 40000000 * Math.random()) / 1000 / 60);

	return (
		<TableRow
			actionCol={
				isMine ? (
					<Link className="btn btn-primary w-full" href={`/position/${position.position}/adjust`}>
						Adjust
					</Link>
				) : BigInt(position.availableForClones) > 0n && !position.closed ? (
					<Link className="btn btn-primary w-full" href={`/position/${position.position}/borrow`}>
						Clone & Mint
					</Link>
				) : (
					<></>
				)
			}
			link={`/position/${position.position}`}
		>
			<div>
				<DisplayAmount
					address={position.collateral}
					amount={BigInt(position.collateralBalance)}
					currency={position.collateralSymbol}
					digits={position.collateralDecimals}
					usdPrice={collTokenPrice}
				/>
			</div>
			<div>
				<DisplayAmount
					// bold={positionStats.cooldown * 1000n > Date.now()}
					address={ADDRESS[chainId].oracleFreeDollar}
					amount={BigInt(position.price)}
					currency={'OFD'}
					digits={36 - position.collateralDecimals}
					hideLogo
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
						address={ADDRESS[chainId].oracleFreeDollar}
						amount={BigInt(position.availableForClones)}
						currency={'OFD'}
						hideLogo
						usdPrice={ofdPrice}
					/>
				)}
			</div>
		</TableRow>
	)
}
