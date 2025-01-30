import { Challenge, useWriteContractWithToast } from 'hooks'
import { ABIS, ADDRESS } from 'contracts'
import { erc20Abi } from 'viem'
import { useChainId } from 'wagmi'
import { formatBigInt, shortenAddress } from 'utils'
import { useMemo } from 'react'
import { PositionStats } from 'meta/positions'
import { useTranslation } from 'react-i18next'
import { CoinTicker } from 'meta/coins'

type Props = {
	amount: bigint
	challenge?: Challenge
	expectedOFD: (bidAmount?: bigint) => bigint
	positionStats: PositionStats
}

type Returned = {
	isApproving: boolean
	isBidding: boolean
	handleApprove: () => void
	handleBid: () => void
}

export const useWriteContractsBid = (props: Props): Returned => {
	const { amount, challenge, expectedOFD, positionStats } = props
	const chainId = useChainId()
	const { t } = useTranslation()

	const toastContentApprove = useMemo(
		() => [
			{
				title: t('common:toasts:approve:amount'),
				value: formatBigInt(expectedOFD()) + ` ${CoinTicker.OFD}`,
			},
			{
				title: t('common:toasts:approve:spender'),
				value: shortenAddress(ADDRESS[chainId].mintingHub),
			},
		],
		[chainId, expectedOFD, t]
	)

	const { loading: isApproving, writeFunction: handleApprove } = useWriteContractWithToast({
		contractParams: {
			address: ADDRESS[chainId].usdt,
			abi: erc20Abi,
			functionName: 'approve',
			args: [ADDRESS[chainId].mintingHub, expectedOFD()],
		},
		toastPending: {
			title: t('common:toasts:approve:pending', { symbol: CoinTicker.OFD }),
			rows: toastContentApprove,
		},
		toastSuccess: {
			title: t('common:toasts:approve:success', { symbol: CoinTicker.OFD }),
			rows: toastContentApprove,
		},
	})

	const toastContentBid = useMemo(
		() => [
			{
				title: t('common:toasts:bid:bidAmount'),
				value: formatBigInt(amount, positionStats.collateralDecimal) + ' ' + positionStats.collateralSymbol,
			},
			{
				title: t('common:toasts:bid:expectedOFD'),
				value: formatBigInt(expectedOFD()) + ` ${CoinTicker.OFD}`,
			},
		],
		[amount, expectedOFD, positionStats.collateralDecimal, positionStats.collateralSymbol, t]
	)

	const { loading: isBidding, writeFunction: handleBid } = useWriteContractWithToast({
		contractParams: {
			address: ADDRESS[chainId].mintingHub,
			abi: ABIS.MintingHubABI,
			functionName: 'bid',
			args: [Number(challenge?.index || 0n), amount, true],
		},
		toastPending: {
			title: t('common:toasts:bid:pending'),
			rows: toastContentBid,
		},
		toastSuccess: {
			title: t('common:toasts:bid:success'),
			rows: toastContentBid,
		},
	})

	return { isApproving, isBidding, handleApprove, handleBid }
}
