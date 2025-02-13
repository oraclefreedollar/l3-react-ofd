import { SavingsSlice } from 'store/savings/slice'
import { getAll } from 'store/savings/actions/getAll'

export const SavingsActions = {
	...SavingsSlice.actions,
	getAll,
}
