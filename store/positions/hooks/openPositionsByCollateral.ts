import { useAppSelector } from 'store/hooks'
import { PositionsSelectors } from 'store/positions/selectors'

export const useOpenPositionsByCollateral = () => {
	return useAppSelector((state) => PositionsSelectors.getOpenPositionsByCollateral(state))
}
