import { usePositionStats } from 'hooks'
import { formatBigInt, formatDate, formatDuration, isDateExpired } from 'utils'
import Link from 'next/link'
import { Address } from 'viem'

interface Props {
	// challenger: Address
	// duration: bigint
	auctionEnd: bigint
	challengeSize: bigint
	filledSize: bigint
	fixedEnd: bigint
	index: bigint
	position: Address
	price: bigint
}

export default function ChallengeRow({ auctionEnd, challengeSize, filledSize, fixedEnd, index, position, price }: Props) {
	const positionStats = usePositionStats(position)
	const isFixedEnd = isDateExpired(fixedEnd)
	const isAuctionExpired = isDateExpired(auctionEnd)

	const filledRate = challengeSize ? (filledSize * 10000n) / challengeSize : 0n

	const stateText = !isFixedEnd ? 'Fixed Price Phase' : !isAuctionExpired ? 'Declining Price Phase' : 'Zero Price Phase'
	const priceText = !isFixedEnd
		? 'Price starts falling in ' + formatDuration(fixedEnd - BigInt(Math.floor(Date.now() / 1000)))
		: !isAuctionExpired
			? 'Zero is reached in ' + formatDuration(auctionEnd - BigInt(Math.floor(Date.now() / 1000)))
			: 'Reached zero at ' + formatDate(auctionEnd)

	return (
		<Link
			className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-4 flex flex-col border border-purple-500/50 gap-y-4 duration-300 "
			href={`/position/${position}/bid/${index}`}
		>
			<div className="grid grid-cols-3">
				<div>
					<div className="text-sm">Auction Price</div>
					<div className="text-white font-bold">{formatBigInt(price)} OFD</div>
				</div>
				<div className="text-center">
					<div className="text-sm">Cap</div>
					<div className="text-white font-bold">
						{formatBigInt(challengeSize, positionStats.collateralDecimal)} {positionStats.collateralSymbol}
					</div>
				</div>
				<div className="text-right">
					<div className="text-sm">State</div>
					<div className={`font-bold ${isAuctionExpired ? 'text-gray-300' : 'text-green-300'}`}>{stateText}</div>
				</div>
			</div>
			<div className="text-sm text-gray text-right">{priceText}</div>
			<div className="flex">
				<span>Progress</span>
			</div>
			<div className="flex bg-gray-500 h-2 rounded-lg">
				<div className="bg-rose-400 rounded-lg" style={{ width: `${Number(filledRate / 100n)}%` }} />
			</div>
			<div className="flex">
				<span>{formatBigInt(filledRate, 2)} %</span>
				<span className="ml-auto">
					{formatBigInt(filledSize, positionStats.collateralDecimal)} / {formatBigInt(challengeSize, positionStats.collateralDecimal)}
				</span>
			</div>
		</Link>
	)
}
