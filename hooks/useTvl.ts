import { useSelector } from 'react-redux'
import { PositionQuery } from 'store/slices/positions.types'
import { useMemo } from 'react'
import { useSwapStats } from 'hooks/useSwapStats'
import { RootState } from 'store/types'
import { useCoingeckoPrices } from 'store/prices'

export const useTvl = (): number => {
	const { usdtBridgeBal } = useSwapStats()

	const { openPositionsByCollateral } = useSelector((state: RootState) => state.positions)
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
