import { formatBigInt, shortenAddress } from 'utils'
import { ABIS, ADDRESS } from 'contracts'
import { useWriteContractWithToast } from 'hooks'
import { erc20Abi, zeroAddress } from 'viem'
import { useAccount, useChainId } from 'wagmi'
import { EquityPoolStats } from 'meta/equity'
import { useTranslation } from 'react-i18next'
import { CoinTicker } from 'meta/coins'

type Props = { amount: bigint; poolStats: EquityPoolStats; refetchTrades: any; result: bigint }

type Returned = {
	handleApprove: () => Promise<boolean>
	handleInvest: () => Promise<boolean>
	handleRedeem: () => Promise<boolean>
	isApproving: boolean
	isInvesting: boolean
	isRedeeming: boolean
}

export const useEquityContractsFunctions = (props: Props): Returned => {
	const { amount, poolStats, refetchTrades, result } = props
	const { t } = useTranslation()

	const { address } = useAccount()
	const account = address || zeroAddress
	const chainId = useChainId()

	const approveToastContent = [
		{
			title: t('common:toasts:approve:amount'),
			value: formatBigInt(amount) + ' OFD',
		},
		{
			title: t('common:toasts:approve:spender'),
			value: shortenAddress(ADDRESS[chainId].equity),
		},
	]

	const { loading: isApproving, writeFunction: handleApprove } = useWriteContractWithToast({
		contractParams: {
			abi: erc20Abi,
			address: ADDRESS[chainId].oracleFreeDollar,
			args: [ADDRESS[chainId].equity, amount],
			functionName: 'approve',
		},
		toastPending: {
			title: t('common:toasts:approve:pending', { symbol: CoinTicker.OFD }),
			rows: approveToastContent,
		},
		toastSuccess: {
			title: t('common:toasts:approve:success', { symbol: CoinTicker.OFD }),
			rows: approveToastContent,
		},
		refetchFunctions: [poolStats.refetch],
	})

	const investToastContent = [
		{
			title: t('common:toasts:pool:invest:amount'),
			value: `${formatBigInt(amount, 18)} ${CoinTicker.OFD}`,
		},
		{
			title: t('common:toasts:pool:invest:shares'),
			value: `${formatBigInt(result)} ${CoinTicker.OFDPS}`,
		},
	]

	const { loading: isInvesting, writeFunction: handleInvest } = useWriteContractWithToast({
		contractParams: {
			abi: ABIS.EquityABI,
			address: ADDRESS[chainId].equity,
			args: [amount, result],
			functionName: 'invest',
		},
		toastPending: { title: t('common:toasts:pool:invest:pending'), rows: investToastContent },
		toastSuccess: { title: t('common:toasts:pool:invest:success'), rows: investToastContent },
		refetchFunctions: [poolStats.refetch, refetchTrades],
	})

	const redeemToastContent = [
		{
			title: t('common:toasts:pool:redeem:amount'),
			value: `${formatBigInt(amount)} ${CoinTicker.OFDPS}`,
		},
		{
			title: t('common:toasts:pool:redeem:receive'),
			value: `${formatBigInt(result)} ${CoinTicker.OFD}`,
		},
	]

	const { loading: isRedeeming, writeFunction: handleRedeem } = useWriteContractWithToast({
		contractParams: {
			abi: ABIS.EquityABI,
			address: ADDRESS[chainId].equity,
			args: [account, amount],
			functionName: 'redeem',
		},
		toastPending: { title: t('common:toasts:pool:redeem:pending'), rows: redeemToastContent },
		toastSuccess: { title: t('common:toasts:pool:redeem:success'), rows: redeemToastContent },
		refetchFunctions: [poolStats.refetch, refetchTrades],
	})

	return { handleApprove, handleInvest, handleRedeem, isApproving, isInvesting, isRedeeming }
}
