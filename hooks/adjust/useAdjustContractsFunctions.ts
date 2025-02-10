import { useWriteContractWithToast } from 'hooks'
import { Address, erc20Abi } from 'viem'
import { PositionStats } from 'meta/positions'
import { useMemo } from 'react'
import { formatBigInt, shortenAddress } from 'utils'
import { ABIS } from 'contracts'

type Props = {
	amount: bigint
	collateralAmount: bigint
	liqPrice: bigint
	position: `0x${string}`
	positionStats: PositionStats
}
type Returned = {
	handleAdjust: () => void
	handleApprove: () => void
	isAdjusting: boolean
	isApproving: boolean
}

export const useAdjustContractsFunctions = (props: Props): Returned => {
	const { amount, collateralAmount, liqPrice, position, positionStats } = props

	const formattedCollateralAmount = useMemo(
		() => Number(collateralAmount / BigInt(10 ** positionStats.collateralDecimal)),
		[collateralAmount, positionStats.collateralDecimal]
	)

	const toastContentApprove = useMemo(
		() => [
			{
				title: 'Amount:',
				value: `${formattedCollateralAmount} ${positionStats.collateralSymbol}`,
			},
			{
				title: 'Spender: ',
				value: shortenAddress(position),
			},
		],
		[formattedCollateralAmount, position, positionStats.collateralSymbol]
	)

	const { loading: isApproving, writeFunction: handleApprove } = useWriteContractWithToast({
		contractParams: {
			address: positionStats.collateral as Address,
			abi: erc20Abi,
			functionName: 'approve',
			args: [position, collateralAmount],
		},
		toastSuccess: {
			title: `Successfully Approved ${positionStats.collateralSymbol}`,
			rows: toastContentApprove,
		},
		toastPending: {
			title: `Approving ${positionStats.collateralSymbol}`,
			rows: toastContentApprove,
		},
	})

	const toastContentAdjust = useMemo(
		() => [
			{
				title: 'Amount:',
				value: formatBigInt(amount),
			},
			{
				title: 'Collateral Amount:',
				value: formatBigInt(collateralAmount, positionStats.collateralDecimal),
			},
			{
				title: 'Liquidation Price:',
				value: formatBigInt(liqPrice, 36 - positionStats.collateralDecimal),
			},
		],
		[amount, collateralAmount, liqPrice, positionStats.collateralDecimal]
	)

	const { loading: isAdjusting, writeFunction: handleAdjust } = useWriteContractWithToast({
		contractParams: {
			address: position,
			abi: ABIS.PositionABI,
			functionName: 'adjust',
			args: [amount, collateralAmount, liqPrice],
		},
		toastSuccess: {
			title: `Successfully Adjusted Position`,
			rows: toastContentAdjust,
		},
		toastPending: {
			title: `Adjusting Position`,
			rows: toastContentAdjust,
		},
		refetchFunctions: [positionStats.refetch],
	})

	return { isApproving, handleApprove, handleAdjust, isAdjusting }
}
