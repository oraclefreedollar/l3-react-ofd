import { createAsyncThunk } from '@reduxjs/toolkit'
import { ThunkConfig } from 'store/types'

import { PriceQueryObjectArray } from 'meta/prices'
import { ERC20Info } from 'meta/positions'

type Props = { chainId: number; forceRefresh?: boolean }
export const update = createAsyncThunk<PriceQueryObjectArray | undefined, Props, ThunkConfig>(
	'prices/fetch',
	async (props, { getState }) => {
		const { chainId, forceRefresh } = props
		const state = getState()
		const { positions } = state
		const { mintERC20Infos, collateralERC20Infos } = positions

		const infos: ERC20Info[] = mintERC20Infos.concat(...collateralERC20Infos)
		if (infos.length === 0) return
		const response = await fetch(`/api/prices?chainId=${chainId}&forceRefresh=${forceRefresh}`)
		const prices = ((await response.json())?.prices as PriceQueryObjectArray) || []

		if (Object.keys(prices).length === 0) return

		return prices
	}
)
