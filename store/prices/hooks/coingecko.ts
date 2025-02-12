import { useAppSelector } from 'store/hooks'
import { PricesSelectors } from 'store/prices/selectors'

export const useCoingeckoPrices = () => {
	return useAppSelector((state) => PricesSelectors.getCoingeckoPrices(state))
}
