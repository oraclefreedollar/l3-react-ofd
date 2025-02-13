import { ChallengesSlice } from 'store/challenges/slice'
import { getAll } from 'store/challenges/actions/getAll'

export const ChallengesActions = {
	...ChallengesSlice.actions,
	getAll,
}
