import { formatBigInt, shortenAddress } from 'utils'
import { ABIS, ADDRESS } from 'contracts'
import { useWriteContractWithToast } from 'hooks'
import { erc20Abi, zeroAddress } from 'viem'
import { useAccount, useChainId } from 'wagmi'
import { EquityPoolStats } from 'meta/equity'

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

	const { address } = useAccount()
	const account = address || zeroAddress
	const chainId = useChainId()

	const approveToastContent = [
		{
			title: 'Amount:',
			value: formatBigInt(amount) + ' OFD',
		},
		{
			title: 'Spender: ',
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
		toastPending: { title: 'Approving OFD', rows: approveToastContent },
		toastSuccess: { title: 'Successfully Approved OFD', rows: approveToastContent },
		refetchFunctions: [poolStats.refetch],
	})

	const investToastContent = [
		{
			title: 'Amount:',
			value: formatBigInt(amount, 18) + ' OFD',
		},
		{
			title: 'Shares: ',
			value: formatBigInt(result) + ' OFDPS',
		},
	]

	const { loading: isInvesting, writeFunction: handleInvest } = useWriteContractWithToast({
		contractParams: {
			abi: ABIS.EquityABI,
			address: ADDRESS[chainId].equity,
			args: [amount, result],
			functionName: 'invest',
		},
		toastPending: { title: 'Investing OFD', rows: investToastContent },
		toastSuccess: { title: 'Successfully Invested OFD', rows: investToastContent },
		refetchFunctions: [poolStats.refetch, refetchTrades],
	})

	const redeemToastContent = [
		{
			title: 'Amount:',
			value: formatBigInt(amount) + ' OFDPS',
		},
		{
			title: 'Receive: ',
			value: formatBigInt(result) + ' OFD',
		},
	]

	const { loading: isRedeeming, writeFunction: handleRedeem } = useWriteContractWithToast({
		contractParams: {
			abi: ABIS.EquityABI,
			address: ADDRESS[chainId].equity,
			args: [account, amount],
			functionName: 'redeem',
		},
		toastPending: { title: 'Redeeming OFDPS', rows: redeemToastContent },
		toastSuccess: { title: 'Successfully Redeemed', rows: redeemToastContent },
		refetchFunctions: [poolStats.refetch, refetchTrades],
	})

	return { handleApprove, handleInvest, handleRedeem, isApproving, isInvesting, isRedeeming }
}
