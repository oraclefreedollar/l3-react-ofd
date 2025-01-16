import { useMemo } from 'react'
import { RefetchType, shortenAddress } from 'utils'
import { ADDRESS } from 'contracts'
import { useWriteContractWithToast } from 'hooks'
import { erc20Abi, maxUint256 } from 'viem'
import { PositionCollateralTokenData } from 'meta/positions'
import { useChainId } from 'wagmi'

type Props = { collTokenData: PositionCollateralTokenData; initialCollAmount: bigint; userBalanceRefetch: RefetchType }
type Returned = { approve: () => Promise<boolean>; approving: boolean }

export const useApproveCollateral = (props: Props): Returned => {
	const { collTokenData, initialCollAmount, userBalanceRefetch } = props
	const chainId = useChainId()

	const approveAmount = useMemo(() => (initialCollAmount !== 0n ? initialCollAmount : maxUint256), [initialCollAmount])
	const infoAmountApproved = useMemo(
		() => (approveAmount === maxUint256 ? 'infinite ' : String(Number(approveAmount) / 10 ** Number(collTokenData.decimals))),
		[approveAmount, collTokenData.decimals]
	)

	const toastRowsApprove = useMemo(() => {
		return [
			{
				title: 'Amount:',
				value: `${infoAmountApproved} ${collTokenData.symbol}`,
			},
			{
				title: 'Spender: ',
				value: shortenAddress(ADDRESS[chainId].mintingHub),
			},
		]
	}, [chainId, collTokenData.symbol, infoAmountApproved])

	const { loading: approving, writeFunction: approve } = useWriteContractWithToast({
		contractParams: {
			address: collTokenData.address,
			abi: erc20Abi,
			functionName: 'approve',
			args: [ADDRESS[chainId].mintingHub, approveAmount],
		},
		refetchFunctions: [collTokenData.refetch, userBalanceRefetch],
		toastPending: { title: `Approving ${collTokenData.symbol}`, rows: toastRowsApprove },
		toastSuccess: { title: `Successfully Approved ${collTokenData.symbol}`, rows: toastRowsApprove },
	})

	return { approve, approving }
}
