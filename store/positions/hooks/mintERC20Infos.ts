import { useAppSelector } from 'store/hooks'
import { PositionsSelectors } from 'store/positions/selectors'

export const useMintERC20Infos = () => {
	return useAppSelector((state) => PositionsSelectors.getMintERC20Infos(state))
}
