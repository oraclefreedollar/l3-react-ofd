import { useAppSelector } from 'store/hooks'
import { SavingsSelectors } from 'store/savings/selectors'

export const useLeadrateInfo = () => {
	return useAppSelector((state) => SavingsSelectors.getLeadrateInfo(state))
}

export const useLeadrateProposed = () => {
	return useAppSelector((state) => SavingsSelectors.getLeadrateProposed(state))
}

export const useLeadrateRate = () => {
	return useAppSelector((state) => SavingsSelectors.getLeadrateRate(state))
}
