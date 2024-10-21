import { useSelector } from 'react-redux'
import { RootState } from 'redux/redux.store'
import { PositionQuery } from 'redux/slices/positions.types'
import { useMemo } from 'react'

export const useTvl = (): number => {
	const { openPositionsByCollateral } = useSelector((state: RootState) => state.positions)
	const prices = useSelector((state: RootState) => state.prices.coingecko)

	const openPositions = useMemo<Array<PositionQuery>>(() => {
		return openPositionsByCollateral.reduce((acc, positions) => {
			return [...acc, ...positions]
		})
	}, [openPositionsByCollateral])

	return useMemo<number>(
		() =>
			openPositions.reduce((sum, position) => {
				const collateralUSDPrice = prices[position.collateral.toLowerCase()]?.price?.usd
				const collateralBalance = parseInt(position.collateralBalance) / 10 ** position.collateralDecimals
				return sum + (Math.round(collateralBalance) * collateralUSDPrice || 0)
			}, 0),
		[openPositions, prices]
	)
}
