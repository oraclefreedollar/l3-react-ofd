import { useMemo } from 'react'
import { useSwapStats } from 'hooks/useSwapStats'
import { useCoingeckoPrices } from 'store/prices'
import { useOpenPositionsByCollateral } from 'store/positions'
import { PositionQuery } from 'meta/positions'

export const useTvl = (): number => {
	const { usdtBridgeBal } = useSwapStats()

	const openPositionsByCollateral = useOpenPositionsByCollateral()
	const prices = useCoingeckoPrices()

	const openPositions = useMemo<Array<PositionQuery>>(() => {
		return openPositionsByCollateral.reduce((acc, positions) => {
			return [...acc, ...positions]
		})
	}, [openPositionsByCollateral])

	return useMemo<number>(
		() =>
			openPositions.reduce(
				(sum, position) => {
					const collateralUSDPrice = prices[position.collateral.toLowerCase()]?.price?.usd
					const collateralBalance = parseInt(position.collateralBalance) / 10 ** position.collateralDecimals
					return sum + (Math.round(collateralBalance) * collateralUSDPrice || 0)
				},
				Number(BigInt(usdtBridgeBal) / BigInt(10 ** 18))
			),
		[openPositions, prices, usdtBridgeBal]
	)
}
