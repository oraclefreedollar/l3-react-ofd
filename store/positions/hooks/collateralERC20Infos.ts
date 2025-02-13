import { useAppSelector } from 'store/hooks'
import { PositionsSelectors } from 'store/positions/selectors'

export const useCollateralERC20Infos = () => {
	return useAppSelector((state) => PositionsSelectors.getCollateralERC20Infos(state))
}
