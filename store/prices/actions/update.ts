import { createAsyncThunk } from '@reduxjs/toolkit'
import { ThunkConfig } from 'store/types'
import { URI_APP_SELECTED } from 'app.config'

import { PriceQueryObjectArray } from 'meta/prices'
import { ERC20Info } from 'meta/positions'

export const update = createAsyncThunk<PriceQueryObjectArray | undefined, void, ThunkConfig>('prices/fetch', async (_, { getState }) => {
	const state = getState()
	const { positions } = state
	const { mintERC20Infos, collateralERC20Infos } = positions

	const infos: ERC20Info[] = mintERC20Infos.concat(...collateralERC20Infos)

	if (infos.length == 0) return

	const response = await fetch(`${URI_APP_SELECTED}/api/prices`)
	const prices = ((await response.json())?.prices as PriceQueryObjectArray) || []

	if (Object.keys(prices).length === 0) return

	return prices
})
