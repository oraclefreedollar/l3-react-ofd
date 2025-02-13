import { PricesSlice } from 'store/prices/slice'
import { update } from './update'

export const PricesActions = {
	...PricesSlice.actions,
	update,
}
