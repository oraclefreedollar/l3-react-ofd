import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchPositions } from 'pages/api/positions'
import { uniqueValues } from 'utils'
import { ERC20Info, PositionQuery } from 'meta/positions'

type Returned = {
	collateralAddresses: Array<`0x${string}`>
	closedPositions: Array<PositionQuery>
	collateralERC20Infos: Array<ERC20Info>
	deniedPositions: Array<PositionQuery>
	list: Array<PositionQuery>
	mintERC20Infos: Array<ERC20Info>
	openPositions: Array<PositionQuery>
	openPositionsByCollateral: Array<Array<PositionQuery>>
	openPositionsByOriginal: Array<Array<PositionQuery>>
	originalPositions: Array<PositionQuery>
}

export const getAll = createAsyncThunk<Returned, { chainId: number }>('positions/getAll', async (props) => {
	const { chainId } = props

	const list = await fetchPositions({ chainId })

	const openPositions = list.filter((position) => !position.denied && !position.closed)
	const collateralAddresses = openPositions.map((position) => position.collateral).filter(uniqueValues)
	const closedPositions = list.filter((position) => position.closed)
	const deniedPositions = list.filter((position) => position.denied)
	const originalPositions = openPositions.filter((position) => position.isOriginal)
	const openPositionsByOriginal = originalPositions.map((o) => openPositions.filter((p) => p.original == o.original))
	const openPositionsByCollateral = collateralAddresses.map((con) => openPositions.filter((position) => position.collateral == con))

	const mintERC20Infos: Array<ERC20Info> = [
		{
			address: originalPositions.at(0)!.ofd,
			name: originalPositions.at(0)!.ofdName,
			symbol: originalPositions.at(0)!.ofdSymbol,
			decimals: originalPositions.at(0)!.ofdDecimals,
		},
	]
	const collateralERC20Infos: Array<ERC20Info> = collateralAddresses.map((c): ERC20Info => {
		const pos = originalPositions.filter((p) => p.collateral == c).at(0)
		return {
			address: c,
			name: pos?.collateralName ?? '',
			symbol: pos?.collateralSymbol ?? '',
			decimals: pos?.collateralDecimals ?? 18,
		}
	})

	return {
		collateralAddresses,
		closedPositions,
		collateralERC20Infos,
		deniedPositions,
		list,
		mintERC20Infos,
		openPositions,
		openPositionsByOriginal,
		openPositionsByCollateral,
		originalPositions,
	}
})
