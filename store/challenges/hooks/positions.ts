import { useAppSelector } from 'store/hooks'
import { ChallengesSelectors } from 'store/challenges/selectors'

export const useChallengePositions = () => {
	return useAppSelector((state) => ChallengesSelectors.getPositions(state))
}
