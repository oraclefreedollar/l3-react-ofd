import { useMemo } from 'react'
import { formatBigInt, shortenAddress } from 'utils'
import { ABIS, ADDRESS } from 'contracts'
import { useWriteContractWithToast } from 'hooks'
import { erc20Abi } from 'viem'
import { useChainId } from 'wagmi'
import { SwapStats } from 'meta/swap'
import { CoinTicker } from 'meta/coins'
import { useTranslation } from 'react-i18next'

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
	const { t } = useTranslation()

	const chainId = useChainId()
	const formattedAmount = useMemo(() => Number(amount / BigInt(10 ** 18)), [amount])

	const approveToastContent = useMemo(
		() => [
			{
				title: t('common:toasts:approve:amount'),
				value: `${formattedAmount}`,
			},
			{
				title: t('common:toasts:approve:spender'),
				value: shortenAddress(ADDRESS[chainId].bridge),
			},
		],
		[chainId, formattedAmount, t]
	)

	const { loading: isApproving, writeFunction: handleApprove } = useWriteContractWithToast({
		contractParams: {
			abi: erc20Abi,
			address: ADDRESS[chainId].usdt!,
			args: [ADDRESS[chainId].bridge, amount],
			functionName: 'approve',
		},
		toastPending: {
			title: t('common:toasts:approve:pending', { symbol: CoinTicker.USDT }),
			rows: approveToastContent,
		},
		toastSuccess: {
			title: t('common:toasts:approve:success', { symbol: CoinTicker.USDT }),
			rows: approveToastContent,
		},
		refetchFunctions: [swapStats.refetch],
	})

	const mintBurnToastContent = useMemo(
		() => [
			{
				title: t('common:toasts:swap:amount:from', { symbol: fromSymbol }),
				value: formatBigInt(amount) + ' ' + fromSymbol,
			},
			{
				title: t('common:toasts:swap:amount:to', { symbol: toSymbol }),
				value: formatBigInt(amount) + ' ' + toSymbol,
			},
		],
		[amount, fromSymbol, toSymbol, t]
	)

	const { loading: isMinting, writeFunction: handleMint } = useWriteContractWithToast({
		contractParams: {
			abi: ABIS.StablecoinBridgeABI,
			address: ADDRESS[chainId].bridge,
			args: [amount],
			functionName: 'mint',
		},
		toastPending: {
			title: t('common:toasts:swap:pending', { fromSymbol, toSymbol }),
			rows: mintBurnToastContent,
		},
		toastSuccess: {
			title: t('common:toasts:swap:success', { fromSymbol, toSymbol }),
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
			title: t('common:toasts:swap:pending', { fromSymbol, toSymbol }),
			rows: mintBurnToastContent,
		},
		toastSuccess: {
			title: t('common:toasts:swap:success', { fromSymbol, toSymbol }),
			rows: mintBurnToastContent,
		},
		refetchFunctions: [swapStats.refetch],
	})

	return { handleApprove, handleBurn, handleMint, isApproving, isBurning, isMinting }
}
