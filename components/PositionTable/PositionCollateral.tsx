import TokenLogo from 'components/TokenLogo'
import { useSelector } from 'react-redux'
import { Address } from 'viem'
import { RootState } from 'redux/redux.store'
import { PositionQuery } from 'redux/slices/positions.types'
import { formatCurrency } from 'utils/format'
import { Fragment } from 'react'

export type CollateralItem = {
	collateral: {
		address: Address
		name: string
		symbol: string
		decimals: number
		price: number
		valueUsd: number
	}
	mint: {
		address: Address
		name: string
		symbol: string
		decimals: number
		price: number
	}
	position: {
		originalNum: number
		cloneNum: number
		totalNum: number
	}
	ratios: {
		highestOFDPrice: number
		collateralizedPct: number
		availableForClonesPct: number
		minted: number
		collateralPriceInOFD: number
		worstStatus: string
		worstStatusColors: string
	}
}

export function PositionCollateralCalculate(): CollateralItem[] {
	const { openPositionsByCollateral } = useSelector((state: RootState) => state.positions)
	const { coingecko } = useSelector((state: RootState) => state.prices)

	const stats: CollateralItem[] = []

	for (const positions of openPositionsByCollateral) {
		const original = positions.at(0) as PositionQuery
		const collateral = coingecko[original!.collateral.toLowerCase()]
		const mint = original.ofd && coingecko[original!.ofd]

		if (!collateral || !mint) continue

		let balance = 0
		let limitForClones = 0
		let availableForClones = 0

		for (const pos of positions) {
			balance += parseInt(pos.collateralBalance)
			if (pos.isOriginal) {
				limitForClones += parseInt(pos.limitForClones) / 10 ** pos.ofdDecimals
				availableForClones += parseInt(pos.availableForClones) / 10 ** pos.ofdDecimals
			}
		}

		balance = balance / 10 ** collateral.decimals
		const valueLockedUsd = Math.round(balance * collateral.price.usd)
		const highestOFDPrice =
			Math.round(Math.max(...positions.map((p) => (parseInt(p.price) * 10000) / 10 ** (36 - p.collateralDecimals)))) / 10000

		const collateralizedPct = Math.round((collateral.price.usd / (highestOFDPrice * mint.price.usd)) * 10000) / 100
		const availableForClonesPct = Math.round((availableForClones / limitForClones) * 10000) / 100

		const minted = Math.round(limitForClones - availableForClones)
		const collateralPriceInOFD = Math.round((collateral.price.usd / mint.price.usd) * 100) / 100
		const worstStatus =
			collateralizedPct < 100
				? `Danger, blow ${collateralizedPct}% collaterized`
				: collateralizedPct < 150
					? `Warning, ${collateralizedPct}% collaterized`
					: `Safe, ${collateralizedPct}% collaterized`
		const worstStatusColors = collateralizedPct < 100 ? 'bg-red-500' : collateralizedPct < 150 ? 'bg-orange-400' : 'bg-green-500'

		stats.push({
			collateral: {
				address: original!.collateral,
				name: collateral.name,
				symbol: collateral.symbol,
				decimals: collateral.decimals,
				price: collateral.price.usd,
				valueUsd: valueLockedUsd,
			},
			mint: {
				address: original!.ofd,
				name: mint.name,
				symbol: mint.symbol,
				decimals: mint.decimals,
				price: mint.price.usd,
			},
			position: {
				totalNum: positions.length,
				originalNum: positions.filter((pos) => pos.isOriginal).length,
				cloneNum: positions.filter((pos) => pos.isClone).length,
			},
			ratios: {
				highestOFDPrice,
				collateralizedPct,
				availableForClonesPct,
				minted,
				collateralPriceInOFD,
				worstStatus,
				worstStatusColors,
			},
		})
	}

	return stats
}

export default function PositionCollateral() {
	const stats = PositionCollateralCalculate()

	if (!stats.length) return null

	return (
		<div className="flex bg-card-header rounded-2xl px-5 py-3 my-10 space-x-8 hide-scroll-bar">
			<div className="flex overflow-x-auto hide-scroll-bar no-scrollbar">
				<div className="flex flex-nowrap">
					{stats.map((c: CollateralItem, i: number) => (
						<Fragment key={c.collateral.address}>
							<PositionCollateralItem item={c} />
							{i === stats.length - 1 ? null : <PositionCollateralItemSeparator />}
						</Fragment>
					))}
				</div>
			</div>
		</div>
	)
}

export function PositionCollateralItem({ item }: { item: CollateralItem }): React.ReactElement {
	return (
		<div className="inline-block">
			<div className="w-[20rem] h-[6rem] overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
				<div className="grid grid-cols-8 gap-4">
					<div className="col-span-2 w-16 h-16 max-h-16 max-w-16 rounded-xl my-auto">
						<TokenLogo currency={item.collateral.symbol.toLowerCase()} size={16} />
					</div>
					<div className="col-span-4 mt-2">
						<div className="grid grid-cols-3">
							<div className="col-span-2 text-lg font-bold text-text-header">{item.collateral.symbol}</div>
							<div className="col-span-2 text-md font-bold text-text-subheader">{item.position.totalNum} Positions</div>
							<div className="col-span-2 text-md font-bold text-text-subheader">
								${formatCurrency(item.collateral.valueUsd.toString(), 2)}
							</div>
						</div>
					</div>
					<div className="col-span-2 -ml-10 my-4">
						<div className={`mb-3 rounded-full text-center max-h-7 max-w-[100] text-gray-900 font-bold ${item.ratios.worstStatusColors}`}>
							{item.ratios.collateralizedPct}%
						</div>
						<div className={`rounded-full text-center max-h-7 max-w-[100] text-gray-900 font-bold ${item.ratios.worstStatusColors}`}>
							{formatCurrency(item.ratios.highestOFDPrice.toString(), 2)} {item.mint.symbol}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export function PositionCollateralItemSeparator(): React.ReactElement {
	return <div className="bg-card-secondary w-[2px] h-[90%] mx-5 my-auto"></div>
}
