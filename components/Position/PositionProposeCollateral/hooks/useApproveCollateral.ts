import { useMemo } from 'react'
import { RefetchType, shortenAddress } from 'utils'
import { ADDRESS } from 'contracts'
import { useWriteContractCustom } from 'hooks'
import { erc20Abi, maxUint256 } from 'viem'
import { PositionCollateralTokenData } from 'meta/positions'
import { useChainId } from 'wagmi'

type Props = {
	collTokenData: PositionCollateralTokenData
	userBalanceRefetch: RefetchType
}

type Returned = {
	approve: () => Promise<void>
	approving: boolean
}

export const useApproveCollateral = (props: Props): Returned => {
	const { collTokenData, userBalanceRefetch } = props
	const chainId = useChainId()
	const toastRowsApprove = useMemo(() => {
		return [
			{
				title: 'Amount:',
				value: 'infinite ' + collTokenData.symbol,
			},
			{
				title: 'Spender: ',
				value: shortenAddress(ADDRESS[chainId].mintingHub),
			},
		]
	}, [chainId, collTokenData.symbol])

	const { loading: approving, writeFunction: approve } = useWriteContractCustom({
		contractParams: {
			address: collTokenData.address,
			abi: erc20Abi,
			functionName: 'approve',
			args: [ADDRESS[chainId].mintingHub, maxUint256],
		},
		refetchFunctions: [collTokenData.refetch, userBalanceRefetch],
		toastPending: { title: `Approving ${collTokenData.symbol}`, rows: toastRowsApprove },
		toastSuccess: { title: `Successfully Approved ${collTokenData.symbol}`, rows: toastRowsApprove },
	})

	return { approve, approving }
}
