import { useMemo } from 'react'
import { formatBigInt, shortenAddress } from 'utils'
import { ABIS, ADDRESS } from 'contracts'
import { useWriteContractWithToast } from 'hooks'
import { useChainId } from 'wagmi'
import { PositionCollateralTokenData } from 'meta/positions'

type Props = {
	auctionDuration: bigint
	buffer: bigint
	collTokenData: PositionCollateralTokenData
	initPeriod: bigint
	initialCollAmount: bigint
	interest: bigint
	limitAmount: bigint
	liqPrice: bigint
	maturity: bigint
	minCollAmount: bigint
}

type Returned = {
	openPosition: () => Promise<boolean>
	openingPosition: boolean
}

export const useOpenPosition = (props: Props): Returned => {
	const {
		auctionDuration,
		buffer,
		collTokenData,
		initPeriod,
		initialCollAmount,
		interest,
		limitAmount,
		liqPrice,
		maturity,
		minCollAmount,
	} = props

	const chainId = useChainId()

	const toastRowsOpenPosition = useMemo(() => {
		return [
			{
				title: 'Collateral',
				value: shortenAddress(collTokenData.address),
			},
			{
				title: 'Collateral Amount:',
				value: formatBigInt(initialCollAmount) + collTokenData.symbol,
			},
			{
				title: 'LiqPrice: ',
				value: formatBigInt(liqPrice),
			},
		]
	}, [collTokenData.address, collTokenData.symbol, initialCollAmount, liqPrice])

	const { loading: openingPosition, writeFunction: openPositionWrite } = useWriteContractWithToast({
		contractParams: {
			address: ADDRESS[chainId].mintingHub,
			abi: ABIS.MintingHubABI,
			functionName: 'openPosition',
			args: [
				collTokenData.address,
				minCollAmount,
				initialCollAmount,
				limitAmount,
				initPeriod * 86400n,
				maturity * 86400n * 30n,
				auctionDuration * 3600n,
				Number(interest),
				liqPrice,
				Number(buffer),
			],
		},
		refetchFunctions: [collTokenData.refetch],
		toastPending: { title: `Creating a new position`, rows: toastRowsOpenPosition },
		toastSuccess: { title: `Successfully created a position`, rows: toastRowsOpenPosition },
	})

	const openPosition = async () => {
		const success = await openPositionWrite()
		if (success) {
			return success
		} else {
			throw new Error('Position opening failed')
		}
	}

	return {
		openPosition,
		openingPosition,
	}
}
