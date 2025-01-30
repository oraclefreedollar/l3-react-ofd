import { usePositionStats } from 'hooks'
import { formatBigInt, formatDate, formatDuration, isDateExpired } from 'utils'
import Link from 'next/link'
import { Address } from 'viem'
import { useTranslation } from 'react-i18next'
import { CoinTicker } from 'meta/coins'
import { useMemo } from 'react'

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
	const { t } = useTranslation()
	const positionStats = usePositionStats(position)
	const isFixedEnd = isDateExpired(fixedEnd)
	const isAuctionExpired = isDateExpired(auctionEnd)

	const filledRate = useMemo(() => (challengeSize ? (filledSize * 10000n) / challengeSize : 0n), [challengeSize, filledSize])

	const stateText = useMemo(
		() =>
			!isFixedEnd
				? t('pages:challenge:states:fixedPrice')
				: !isAuctionExpired
					? t('pages:challenge:states:decliningPrice')
					: t('pages:challenge:states:zeroPrice'),
		[isFixedEnd, isAuctionExpired, t]
	)

	const priceText = useMemo(
		() =>
			!isFixedEnd
				? t('pages:challenge:priceInfo:startsFalling', {
						time: formatDuration(fixedEnd - BigInt(Math.floor(Date.now() / 1000))),
					})
				: !isAuctionExpired
					? t('pages:challenge:priceInfo:reachesZero', {
							time: formatDuration(auctionEnd - BigInt(Math.floor(Date.now() / 1000))),
						})
					: t('pages:challenge:priceInfo:reachedZero', {
							time: formatDate(auctionEnd),
						}),
		[auctionEnd, fixedEnd, isAuctionExpired, isFixedEnd, t]
	)

	return (
		<Link
			className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-4 flex flex-col border border-purple-500/50 gap-y-4 duration-300"
			href={`/position/${position}/bid/${index}`}
		>
			<div className="grid grid-cols-3">
				<div>
					<div className="text-sm">{t('pages:challenge:columns:auctionPrice')}</div>
					<div className="text-white font-bold">
						{formatBigInt(price)} {CoinTicker.OFD}
					</div>
				</div>
				<div className="text-center">
					<div className="text-sm">{t('pages:challenge:columns:cap')}</div>
					<div className="text-white font-bold">
						{formatBigInt(challengeSize, positionStats.collateralDecimal)} {positionStats.collateralSymbol}
					</div>
				</div>
				<div className="text-right">
					<div className="text-sm">{t('pages:challenge:columns:state')}</div>
					<div className={`font-bold ${isAuctionExpired ? 'text-gray-300' : 'text-green-300'}`}>{stateText}</div>
				</div>
			</div>
			<div className="text-sm text-gray text-right">{priceText}</div>
			<div className="flex">
				<span>{t('pages:challenge:columns:progress')}</span>
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
