import { useAppSelector } from 'store/hooks'
import { PositionsSelectors } from 'store/positions/selectors'

export const useOpenPositions = () => {
	return useAppSelector((state) => PositionsSelectors.getOpenPositions(state))
}
