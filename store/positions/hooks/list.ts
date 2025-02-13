import { useAppSelector } from 'store/hooks'
import { PositionsSelectors } from 'store/positions/selectors'

export const usePositionList = () => {
	return useAppSelector((state) => PositionsSelectors.getList(state))
}
