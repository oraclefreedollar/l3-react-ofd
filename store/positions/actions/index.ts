import { PositionsSlice } from 'store/positions/slice'
import { getAll } from 'store/positions/actions/getAll'

export const PositionsActions = {
	...PositionsSlice.actions,
	getAll,
}
