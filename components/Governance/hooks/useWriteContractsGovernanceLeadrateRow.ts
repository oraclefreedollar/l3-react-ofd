import { useWriteContractWithToast } from 'hooks'
import { ABIS, ADDRESS } from 'contracts'
import { useChainId } from 'wagmi'
import { useMemo } from 'react'
import { formatCurrency } from 'utils'
import { ApiLeadrateInfo, LeadrateProposed } from 'redux/slices/savings.types'
import { useTranslation } from 'next-i18next'

type Props = { info: ApiLeadrateInfo; proposal: LeadrateProposed }
type Returned = {
	handleOnApply: () => Promise<boolean>
	handleOnDeny: () => Promise<boolean>
	isApplying: boolean
	isDenying: boolean
}

const namespaces = ['common']
export const useWriteContractsGovernanceLeadrateRow = (props: Props): Returned => {
	const { info, proposal } = props

	const { t } = useTranslation(namespaces)
	const chainId = useChainId()

	const currentRateFormatted = useMemo(() => formatCurrency(info.rate / 10000), [info.rate])
	const proposedRateFormatted = useMemo(() => formatCurrency(proposal.nextRate / 10000), [proposal.nextRate])

	const toastContentApply = useMemo(
		() => [
			{
				title: t('common:toasts:governance:leadrate:apply:title1'),
				value: `${currentRateFormatted}%`,
			},
			{
				title: t('common:toasts:governance:leadrate:apply:title2'),
				value: `${proposedRateFormatted}%`,
			},
		],
		[currentRateFormatted, proposedRateFormatted, t]
	)

	const { loading: isApplying, writeFunction: handleOnApply } = useWriteContractWithToast({
		contractParams: {
			address: ADDRESS[chainId].savings,
			abi: ABIS.SavingsABI,
			functionName: 'applyChange',
			args: [],
		},
		toastPending: {
			title: t('common:toasts:governance:leadrate:apply:pending'),
			rows: toastContentApply,
		},
		toastSuccess: {
			title: t('common:toasts:governance:leadrate:apply:success'),
			rows: toastContentApply,
		},
	})

	const toastContentDeny = useMemo(
		() => [
			{
				title: t('common:toasts:governance:leadrate:deny:title1'),
				value: `${currentRateFormatted}%`,
			},
			{
				title: t('common:toasts:governance:leadrate:deny:title2'),
				value: `${proposedRateFormatted}%`,
			},
		],
		[currentRateFormatted, proposedRateFormatted, t]
	)

	const { loading: isDenying, writeFunction: handleOnDeny } = useWriteContractWithToast({
		contractParams: {
			address: ADDRESS[chainId].savings,
			abi: ABIS.SavingsABI,
			functionName: 'proposeChange',
			args: [info.rate, []],
		},
		toastPending: {
			title: t('common:toasts:governance:leadrate:deny:pending'),
			rows: toastContentDeny,
		},
		toastSuccess: {
			title: t('common:toasts:governance:leadrate:deny:success'),
			rows: toastContentDeny,
		},
	})

	return { isApplying, handleOnApply, isDenying, handleOnDeny }
}
