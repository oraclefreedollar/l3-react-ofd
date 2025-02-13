import { useMemo } from 'react'
import { formatBigInt, shortenAddress } from 'utils'
import { ABIS, ADDRESS } from 'contracts'
import { useWriteContractWithToast } from 'hooks'
import { erc20Abi } from 'viem'
import { useChainId } from 'wagmi'
import { PositionStats } from 'meta/positions'
import { useTranslation } from 'next-i18next'

type Props = { amount: bigint; position: string; positionStats: PositionStats }
type Returned = { isApproving: boolean; isChallenging: boolean; handleApprove: () => void; handleChallenge: () => void }

export const useChallengeContractsFunctions = (props: Props): Returned => {
	const { amount, position, positionStats } = props
	const { t } = useTranslation()

	const chainId = useChainId()

	const toastContentApprove = useMemo(
		() => [
			{
				title: t('common:toasts:approve:amount'),
				value: formatBigInt(amount, positionStats.collateralDecimal) + ' ' + positionStats.collateralSymbol,
			},
			{
				title: t('common:toasts:approve:spender'),
				value: shortenAddress(ADDRESS[chainId].mintingHub),
			},
		],
		[amount, chainId, positionStats.collateralDecimal, positionStats.collateralSymbol, t]
	)

	const { loading: isApproving, writeFunction: handleApprove } = useWriteContractWithToast({
		contractParams: {
			address: positionStats.collateral!,
			abi: erc20Abi,
			functionName: 'approve',
			args: [ADDRESS[chainId].mintingHub, amount],
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

	const toastContentChallenge = useMemo(
		() => [
			{
				title: t('common:toasts:challenge:size'),
				value: formatBigInt(amount, positionStats.collateralDecimal) + ' ' + positionStats.collateralSymbol,
			},
			{
				title: t('common:toasts:challenge:price'),
				value: formatBigInt(positionStats.liqPrice, 36 - positionStats.collateralDecimal),
			},
		],
		[amount, positionStats.collateralDecimal, positionStats.collateralSymbol, positionStats.liqPrice, t]
	)

	const { loading: isChallenging, writeFunction: handleChallenge } = useWriteContractWithToast({
		contractParams: {
			address: ADDRESS[chainId].mintingHub,
			abi: ABIS.MintingHubABI,
			functionName: 'challenge',
			args: [position, amount, positionStats.liqPrice],
		},
		toastSuccess: {
			title: t('common:toasts:challenge:success'),
			rows: toastContentChallenge,
		},
		toastPending: {
			title: t('common:toasts:challenge:pending'),
			rows: toastContentChallenge,
		},
	})

	return { isApproving, isChallenging, handleApprove, handleChallenge }
}
