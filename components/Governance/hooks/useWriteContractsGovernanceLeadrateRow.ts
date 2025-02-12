import { useWriteContractWithToast } from 'hooks'
import { ABIS, ADDRESS } from 'contracts'
import { useChainId } from 'wagmi'
import { useMemo } from 'react'
import { formatCurrency } from 'utils'
import { ApiLeadrateInfo, LeadrateProposed } from 'store/slices/savings.types'

type Props = { info: ApiLeadrateInfo; proposal: LeadrateProposed }
type Returned = {
	handleOnApply: () => Promise<boolean>
	handleOnDeny: () => Promise<boolean>
	isApplying: boolean
	isDenying: boolean
}

export const useWriteContractsGovernanceLeadrateRow = (props: Props): Returned => {
	const { info, proposal } = props

	const chainId = useChainId()

	const currentRateFormatted = useMemo(() => formatCurrency(info.rate / 10000), [info.rate])
	const proposedRateFormatted = useMemo(() => formatCurrency(proposal.nextRate / 10000), [proposal.nextRate])

	const toastContentApply = useMemo(
		() => [
			{
				title: `From: `,
				value: `${currentRateFormatted}%`,
			},
			{
				title: `Applying to: `,
				value: `${proposedRateFormatted}%`,
			},
		],
		[currentRateFormatted, proposedRateFormatted]
	)

	const { loading: isApplying, writeFunction: handleOnApply } = useWriteContractWithToast({
		contractParams: {
			address: ADDRESS[chainId].savings,
			abi: ABIS.SavingsABI,
			functionName: 'applyChange',
			args: [],
		},
		toastPending: {
			title: `Applying new rate...`,
			rows: toastContentApply,
		},
		toastSuccess: {
			title: 'Successfully applied new rate',
			rows: toastContentApply,
		},
	})

	const toastContentDeny = useMemo(
		() => [
			{
				title: `Current: `,
				value: `${currentRateFormatted}%`,
			},
			{
				title: `Denying: `,
				value: `${proposedRateFormatted}%`,
			},
		],
		[currentRateFormatted, proposedRateFormatted]
	)

	const { loading: isDenying, writeFunction: handleOnDeny } = useWriteContractWithToast({
		contractParams: {
			address: ADDRESS[chainId].savings,
			abi: ABIS.SavingsABI,
			functionName: 'proposeChange',
			args: [info.rate, []],
		},
		toastPending: {
			title: `Denying new rate...`,
			rows: toastContentDeny,
		},
		toastSuccess: {
			title: 'Successfully denied new rate',
			rows: toastContentDeny,
		},
	})

	return { isApplying, handleOnApply, isDenying, handleOnDeny }
}
