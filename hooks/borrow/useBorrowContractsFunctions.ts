import { useMemo } from 'react'
import { formatBigInt, shortenAddress, toTimestamp } from 'utils'
import { ABIS, ADDRESS } from 'contracts'
import { useWriteContractWithToast } from 'hooks'
import { erc20Abi, formatUnits } from 'viem'
import { useChainId } from 'wagmi'
import { PositionStats } from 'meta/positions'

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

	const chainId = useChainId()
	const expirationTime = toTimestamp(expirationDate)

	const approveToastMessageRows = useMemo(
		() => [
			{
				title: 'Amount:',
				value: `${formatUnits(requiredColl, positionStats.collateralDecimal)} ${positionStats.collateralSymbol}`,
			},
			{
				title: 'Spender: ',
				value: shortenAddress(ADDRESS[chainId].mintingHub),
			},
		],
		[chainId, positionStats.collateralDecimal, positionStats.collateralSymbol, requiredColl]
	)

	const { loading: isApproving, writeFunction: handleApprove } = useWriteContractWithToast({
		contractParams: {
			address: positionStats.collateral!,
			abi: erc20Abi,
			functionName: 'approve',
			args: [ADDRESS[chainId].mintingHub, requiredColl],
		},
		toastPending: { title: `Approving ${positionStats.collateralSymbol}`, rows: approveToastMessageRows },
		toastSuccess: { title: `Successfully Approved ${positionStats.collateralSymbol}`, rows: approveToastMessageRows },
		refetchFunctions: [positionStats.refetch],
	})

	const cloneToastMessageRows = useMemo(
		() => [
			{
				title: `Amount: `,
				value: formatBigInt(amount) + ' OFD',
			},
			{
				title: `Collateral: `,
				value: formatBigInt(requiredColl, positionStats.collateralDecimal) + ' ' + positionStats.collateralSymbol,
			},
		],
		[amount, positionStats.collateralDecimal, positionStats.collateralSymbol, requiredColl]
	)

	const { loading: isCloning, writeFunction: handleClone } = useWriteContractWithToast({
		contractParams: {
			address: ADDRESS[chainId].mintingHub,
			abi: ABIS.MintingHubABI,
			functionName: 'clone',
			args: [position, requiredColl, amount, expirationTime],
		},
		toastPending: { title: `Minting OFD`, rows: cloneToastMessageRows },
		toastSuccess: { title: `Successfully Minted OFD`, rows: cloneToastMessageRows },
		refetchFunctions: [positionStats.refetch],
	})

	return { handleApprove, handleClone, isApproving, isCloning }
}
