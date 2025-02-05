import { useMemo } from 'react'
import { formatBigInt, shortenAddress, toTimestamp } from 'utils'
import { ABIS, ADDRESS } from 'contracts'
import { useWriteContractWithToast } from 'hooks'
import { erc20Abi, formatUnits } from 'viem'
import { useChainId } from 'wagmi'
import { PositionStats } from 'meta/positions'
import { useTranslation } from 'next-i18next'

type Props = {
	amount: bigint
	expirationDate: Date
	position: `0x${string}`
	positionStats: PositionStats
	requiredColl: bigint
}

type Returned = {
	handleApprove: () => Promise<boolean>
	handleClone: () => Promise<boolean>
	isApproving: boolean
	isCloning: boolean
}

export const useBorrowContractsFunctions = (props: Props): Returned => {
	const { amount, expirationDate, position, positionStats, requiredColl } = props
	const { t } = useTranslation()

	const chainId = useChainId()
	const expirationTime = toTimestamp(expirationDate)

	const approveToastMessageRows = useMemo(
		() => [
			{
				title: t('common:toasts:approve:amount'),
				value: `${formatUnits(requiredColl, positionStats.collateralDecimal)} ${positionStats.collateralSymbol}`,
			},
			{
				title: t('common:toasts:approve:spender'),
				value: shortenAddress(ADDRESS[chainId].mintingHub),
			},
		],
		[chainId, positionStats.collateralDecimal, positionStats.collateralSymbol, requiredColl, t]
	)

	const { loading: isApproving, writeFunction: handleApprove } = useWriteContractWithToast({
		contractParams: {
			address: positionStats.collateral!,
			abi: erc20Abi,
			functionName: 'approve',
			args: [ADDRESS[chainId].mintingHub, requiredColl],
		},
		toastPending: {
			title: t('common:toasts:approve:pending', { symbol: positionStats.collateralSymbol }),
			rows: approveToastMessageRows,
		},
		toastSuccess: {
			title: t('common:toasts:approve:success', { symbol: positionStats.collateralSymbol }),
			rows: approveToastMessageRows,
		},
		refetchFunctions: [positionStats.refetch],
	})

	const cloneToastMessageRows = useMemo(
		() => [
			{
				title: t('common:toasts:clone:amount'),
				value: formatBigInt(amount) + ' OFD',
			},
			{
				title: t('common:toasts:clone:collateral'),
				value: formatBigInt(requiredColl, positionStats.collateralDecimal) + ' ' + positionStats.collateralSymbol,
			},
		],
		[amount, positionStats.collateralDecimal, positionStats.collateralSymbol, requiredColl, t]
	)

	const { loading: isCloning, writeFunction: handleClone } = useWriteContractWithToast({
		contractParams: {
			address: ADDRESS[chainId].mintingHub,
			abi: ABIS.MintingHubABI,
			functionName: 'clone',
			args: [position, requiredColl, amount, expirationTime],
		},
		toastPending: { title: t('common:toasts:clone:pending'), rows: cloneToastMessageRows },
		toastSuccess: { title: t('common:toasts:clone:success'), rows: cloneToastMessageRows },
		refetchFunctions: [positionStats.refetch],
	})

	return { handleApprove, handleClone, isApproving, isCloning }
}
