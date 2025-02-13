import { useAppSelector } from 'store/hooks'
import { SavingsSelectors } from 'store/savings/selectors'

export const useSavingsAllUserTable = () => {
	return useAppSelector((state) => SavingsSelectors.getSavingsAllUserTable(state))
}

export const useSavingsInfo = () => {
	return useAppSelector((state) => SavingsSelectors.getSavingsInfo(state))
}
