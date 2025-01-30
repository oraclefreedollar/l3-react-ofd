import { useWriteContractWithToast } from 'hooks'
import { Address, erc20Abi } from 'viem'
import { PositionStats } from 'meta/positions'
import { useMemo } from 'react'
import { formatBigInt, shortenAddress } from 'utils'
import { ABIS } from 'contracts'
import { useTranslation } from 'react-i18next'

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
	const { t } = useTranslation()

	const formattedCollateralAmount = useMemo(
		() => Number(collateralAmount / BigInt(10 ** positionStats.collateralDecimal)),
		[collateralAmount, positionStats.collateralDecimal]
	)

	const toastContentApprove = useMemo(
		() => [
			{
				title: t('common:toasts:approve:amount'),
				value: `${formattedCollateralAmount} ${positionStats.collateralSymbol}`,
			},
			{
				title: t('common:toasts:approve:spender'),
				value: shortenAddress(position),
			},
		],
		[formattedCollateralAmount, position, positionStats.collateralSymbol, t]
	)

	const { loading: isApproving, writeFunction: handleApprove } = useWriteContractWithToast({
		contractParams: {
			address: positionStats.collateral as Address,
			abi: erc20Abi,
			functionName: 'approve',
			args: [position, collateralAmount],
		},
		toastSuccess: {
			title: t('common:toasts:approve:success', { symbol: positionStats.collateralSymbol }),
			rows: toastContentApprove,
		},
		toastPending: {
			title: t('common:toasts:approve:pending', { symbol: positionStats.collateralSymbol }),
			rows: toastContentApprove,
		},
	})

	const toastContentAdjust = useMemo(
		() => [
			{
				title: t('common:toasts:approve:amount'),
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
		[amount, collateralAmount, liqPrice, positionStats.collateralDecimal, t]
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
