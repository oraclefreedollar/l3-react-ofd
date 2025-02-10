import { useMemo } from 'react'
import { formatBigInt, shortenAddress } from 'utils'
import { ABIS, ADDRESS } from 'contracts'
import { useWriteContractWithToast } from 'hooks'
import { erc20Abi } from 'viem'
import { useChainId } from 'wagmi'
import { PositionStats } from 'meta/positions'

type Props = { amount: bigint; position: string; positionStats: PositionStats }
type Returned = { isApproving: boolean; isChallenging: boolean; handleApprove: () => void; handleChallenge: () => void }

export const useChallengeContractsFunctions = (props: Props): Returned => {
	const { amount, position, positionStats } = props
	const chainId = useChainId()

	const toastContentApprove = useMemo(
		() => [
			{
				title: 'Amount:',
				value: formatBigInt(amount, positionStats.collateralDecimal) + ' ' + positionStats.collateralSymbol,
			},
			{
				title: 'Spender: ',
				value: shortenAddress(ADDRESS[chainId].mintingHub),
			},
		],
		[amount, chainId, positionStats.collateralDecimal, positionStats.collateralSymbol]
	)

	const { loading: isApproving, writeFunction: handleApprove } = useWriteContractWithToast({
		contractParams: {
			address: positionStats.collateral!,
			abi: erc20Abi,
			functionName: 'approve',
			args: [ADDRESS[chainId].mintingHub, amount],
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

	const toastContentChallenge = useMemo(
		() => [
			{
				title: 'Size:',
				value: formatBigInt(amount, positionStats.collateralDecimal) + ' ' + positionStats.collateralSymbol,
			},
			{
				title: 'Price: ',
				value: formatBigInt(positionStats.liqPrice, 36 - positionStats.collateralDecimal),
			},
		],
		[amount, positionStats.collateralDecimal, positionStats.collateralSymbol, positionStats.liqPrice]
	)

	const { loading: isChallenging, writeFunction: handleChallenge } = useWriteContractWithToast({
		contractParams: {
			address: ADDRESS[chainId].mintingHub,
			abi: ABIS.MintingHubABI,
			functionName: 'challenge',
			args: [position, amount, positionStats.liqPrice],
		},
		toastSuccess: {
			title: `Successfully Launched challenge`,
			rows: toastContentChallenge,
		},
		toastPending: {
			title: `Launching a challenge`,
			rows: toastContentChallenge,
		},
	})

	return { isApproving, isChallenging, handleApprove, handleChallenge }
}
