import { Challenge, useWriteContractWithToast } from 'hooks'
import { ABIS, ADDRESS } from 'contracts'
import { erc20Abi } from 'viem'
import { useChainId } from 'wagmi'
import { formatBigInt, shortenAddress } from 'utils'
import { useMemo } from 'react'
import { PositionStats } from 'meta/positions'

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

	const toastContentApprove = useMemo(
		() => [
			{
				title: 'Amount:',
				value: formatBigInt(expectedOFD()) + ' OFD',
			},
			{
				title: 'Spender: ',
				value: shortenAddress(ADDRESS[chainId].mintingHub),
			},
		],
		[chainId, expectedOFD]
	)

	const { loading: isApproving, writeFunction: handleApprove } = useWriteContractWithToast({
		contractParams: {
			address: ADDRESS[chainId].usdt,
			abi: erc20Abi,
			functionName: 'approve',
			args: [ADDRESS[chainId].mintingHub, expectedOFD()],
		},
		toastPending: {
			title: 'Approving OFD',
			rows: toastContentApprove,
		},
		toastSuccess: {
			title: 'Successfully Approved OFD',
			rows: toastContentApprove,
		},
	})

	const toastContentBid = useMemo(
		() => [
			{
				title: `Bid Amount: `,
				value: formatBigInt(amount, positionStats.collateralDecimal) + ' ' + positionStats.collateralSymbol,
			},
			{
				title: `Expected OFD: `,
				value: formatBigInt(expectedOFD()) + ' OFD',
			},
		],
		[amount, expectedOFD, positionStats.collateralDecimal, positionStats.collateralSymbol]
	)

	const { loading: isBidding, writeFunction: handleBid } = useWriteContractWithToast({
		contractParams: {
			address: ADDRESS[chainId].mintingHub,
			abi: ABIS.MintingHubABI,
			functionName: 'bid',
			args: [Number(challenge?.index || 0n), amount, true],
		},
		toastPending: {
			title: 'Placing a bid',
			rows: toastContentBid,
		},
		toastSuccess: {
			title: 'Successfully Placed Bid',
			rows: toastContentBid,
		},
	})

	return { isApproving, isBidding, handleApprove, handleBid }
}
