import { useAppSelector } from 'store/hooks'
import { PositionsSelectors } from 'store/positions/selectors'

export const useIsPositionsLoaded = () => {
	return useAppSelector((state) => PositionsSelectors.isLoaded(state))
}
