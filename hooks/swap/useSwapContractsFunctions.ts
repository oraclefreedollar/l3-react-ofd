import { useMemo } from 'react'
import { formatBigInt, shortenAddress } from 'utils'
import { ABIS, ADDRESS } from 'contracts'
import { useWriteContractWithToast } from 'hooks'
import { erc20Abi } from 'viem'
import { useChainId } from 'wagmi'
import { SwapStats } from 'meta/swap'
import { CoinTicker } from 'meta/coins'

type Props = { amount: bigint; fromSymbol: CoinTicker; swapStats: SwapStats; toSymbol: CoinTicker }

type Returned = {
	handleApprove: () => Promise<boolean>
	handleBurn: () => Promise<boolean>
	handleMint: () => Promise<boolean>
	isApproving: boolean
	isBurning: boolean
	isMinting: boolean
}

export const useSwapContractsFunctions = (props: Props): Returned => {
	const { amount, fromSymbol, swapStats, toSymbol } = props

	const chainId = useChainId()
	const formattedAmount = useMemo(() => Number(amount / BigInt(10 ** 18)), [amount])

	const approveToastContent = useMemo(
		() => [
			{
				title: 'Amount:',
				value: `${formattedAmount}`,
			},
			{
				title: 'Spender: ',
				value: shortenAddress(ADDRESS[chainId].bridge),
			},
		],
		[chainId, formattedAmount]
	)

	const { loading: isApproving, writeFunction: handleApprove } = useWriteContractWithToast({
		contractParams: {
			abi: erc20Abi,
			address: ADDRESS[chainId].usdt!,
			args: [ADDRESS[chainId].bridge, amount],
			functionName: 'approve',
		},
		toastPending: {
			title: 'Approving USDT',
			rows: approveToastContent,
		},
		toastSuccess: {
			title: 'Successfully Approved USDT',
			rows: approveToastContent,
		},
		refetchFunctions: [swapStats.refetch],
	})

	const mintBurnToastContent = useMemo(
		() => [
			{
				title: `${fromSymbol} Amount: `,
				value: formatBigInt(amount) + ' ' + fromSymbol,
			},
			{
				title: `${toSymbol} Amount: `,
				value: formatBigInt(amount) + ' ' + toSymbol,
			},
		],
		[amount, fromSymbol, toSymbol]
	)

	const { loading: isMinting, writeFunction: handleMint } = useWriteContractWithToast({
		contractParams: {
			abi: ABIS.StablecoinBridgeABI,
			address: ADDRESS[chainId].bridge,
			args: [amount],
			functionName: 'mint',
		},
		toastPending: {
			title: `Swapping ${fromSymbol} to ${toSymbol}`,
			rows: mintBurnToastContent,
		},
		toastSuccess: {
			title: `Successfully Swapped ${fromSymbol} to ${toSymbol}`,
			rows: mintBurnToastContent,
		},
		refetchFunctions: [swapStats.refetch],
	})

	const { loading: isBurning, writeFunction: handleBurn } = useWriteContractWithToast({
		contractParams: {
			abi: ABIS.StablecoinBridgeABI,
			address: ADDRESS[chainId].bridge,
			args: [amount],
			functionName: 'burn',
		},
		toastPending: {
			title: `Swapping ${fromSymbol} to ${toSymbol}`,
			rows: mintBurnToastContent,
		},
		toastSuccess: {
			title: `Successfully Swapped ${fromSymbol} to ${toSymbol}`,
			rows: mintBurnToastContent,
		},
		refetchFunctions: [swapStats.refetch],
	})

	return { handleApprove, handleBurn, handleMint, isApproving, isBurning, isMinting }
}
