import { useAppSelector } from 'store/hooks'
import { PricesSelectors } from 'store/prices/selectors'

export const useIsPricesLoaded = () => {
	return useAppSelector((state) => PricesSelectors.getPricesLoaded(state))
}
