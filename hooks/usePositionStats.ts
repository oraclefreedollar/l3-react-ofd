import { ABIS, ADDRESS } from 'contracts'
import { decodeBigIntCall } from 'utils'
import { getAddress, maxUint256, zeroAddress } from 'viem'
import { useAccount, useChainId, useReadContract, useReadContracts } from 'wagmi'
import { Address, erc20Abi } from 'viem'

export const usePositionStats: (
	position: Address,
	collateral?: Address
) => {
	limitForClones: bigint
	liqPrice: bigint
	available: bigint
	annualInterestPPM: bigint
	refetch: any
	collateralUserBal: bigint
	collateralBal: bigint
	ofdAllowance: bigint
	reserveContribution: bigint
	collateralSymbol: string
	limit: bigint
	cooldown: bigint
	challengePeriod: bigint
	isSuccess: boolean
	owner: `0x${string}`
	collateralPosAllowance: bigint
	collateralDecimal: number
	collateralAllowance: bigint
	mintingFee: bigint
	closed: boolean
	expiration: bigint
	minted: bigint
	minimumCollateral: bigint
	collateral: `0x${string}` | undefined
	denied: boolean
	ofdBalance: bigint
} = (position: Address, collateral?: Address) => {
	const { address } = useAccount()
	const chainId = useChainId()

	const account = address || zeroAddress

	const { data: collateralData } = useReadContract({
		address: position,
		abi: ABIS.PositionABI,
		functionName: 'collateral',
	})

	if (!collateral && collateralData) {
		collateral = collateralData
	}

	const { data, isSuccess, refetch } = useReadContracts({
		contracts: [
			// Collateral Calls
			{
				address: collateral,
				abi: erc20Abi,
				functionName: 'balanceOf',
				args: [position],
			},
			{
				address: collateral,
				abi: erc20Abi,
				functionName: 'decimals',
			},
			{
				address: collateral,
				abi: erc20Abi,
				functionName: 'symbol',
			},
			{
				address: collateral,
				abi: erc20Abi,
				functionName: 'balanceOf',
				args: [account],
			},
			{
				address: collateral,
				abi: erc20Abi,
				functionName: 'allowance',
				args: [account, ADDRESS[chainId].mintingHub],
			},
			{
				address: collateral,
				abi: erc20Abi,
				functionName: 'allowance',
				args: [account, position],
			},
			// Position Calls
			{
				address: position,
				abi: ABIS.PositionABI,
				functionName: 'price',
			},
			{
				address: position,
				abi: ABIS.PositionABI,
				functionName: 'expiration',
			},
			{
				address: position,
				abi: ABIS.PositionABI,
				functionName: 'limit',
			},
			{
				address: position,
				abi: ABIS.PositionABI,
				functionName: 'minted',
			},
			{
				address: position,
				abi: ABIS.PositionABI,
				functionName: 'reserveContribution',
			},
			{
				address: position,
				abi: ABIS.PositionABI,
				functionName: 'owner',
			},
			{
				address: position,
				abi: ABIS.PositionABI,
				functionName: 'calculateCurrentFee',
			},
			{
				address: position,
				abi: ABIS.PositionABI,
				functionName: 'annualInterestPPM',
			},
			{
				address: position,
				abi: ABIS.PositionABI,
				functionName: 'challengePeriod',
			},
			{
				address: position,
				abi: ABIS.PositionABI,
				functionName: 'minimumCollateral',
			},
			{
				address: position,
				abi: ABIS.PositionABI,
				functionName: 'limitForClones',
			},
			{
				address: position,
				abi: ABIS.PositionABI,
				functionName: 'cooldown',
			},
			// oracleFreeDollar Calls
			{
				address: ADDRESS[chainId].oracleFreeDollar,
				abi: erc20Abi,
				functionName: 'allowance',
				args: [account, ADDRESS[chainId].mintingHub],
			},
			{
				address: ADDRESS[chainId].oracleFreeDollar,
				abi: erc20Abi,
				functionName: 'balanceOf',
				args: [account],
			},
		],
	})

	const collateralBal = data ? decodeBigIntCall(data[0]) : BigInt(0)
	const collateralDecimal = data ? Number(data[1].result || 0) : 0
	const collateralSymbol = data ? String(data[2].result) : ''
	const collateralUserBal = data ? decodeBigIntCall(data[3]) : BigInt(0)
	const collateralAllowance = data ? decodeBigIntCall(data[4]) : BigInt(0)
	const collateralPosAllowance = data ? decodeBigIntCall(data[5]) : BigInt(0)

	const liqPrice = data ? decodeBigIntCall(data[6]) : BigInt(0)
	const expiration = data ? decodeBigIntCall(data[7]) : BigInt(0)
	const limit = data ? decodeBigIntCall(data[8]) : BigInt(0)
	const minted = data ? decodeBigIntCall(data[9]) : BigInt(0)
	const available = limit - minted
	const reserveContribution = data ? decodeBigIntCall(data[10]) : BigInt(0)
	const owner = getAddress(data ? String(data[11].result || zeroAddress) : zeroAddress)
	const mintingFee = data ? decodeBigIntCall(data[12]) : BigInt(0)
	const annualInterestPPM = data ? decodeBigIntCall(data[13]) : BigInt(0)
	const challengePeriod = data ? decodeBigIntCall(data[14]) : BigInt(0)
	const minimumCollateral = data ? decodeBigIntCall(data[15]) : BigInt(0)
	const limitForClones = data ? decodeBigIntCall(data[16]) : BigInt(0)
	const cooldown = data ? decodeBigIntCall(data[17]) : BigInt(0)

	const ofdAllowance = data ? decodeBigIntCall(data[18]) : BigInt(0)
	const ofdBalance = data ? decodeBigIntCall(data[19]) : BigInt(0)
	const closed = collateralBal == BigInt(0)
	const denied = cooldown == maxUint256

	return {
		annualInterestPPM,
		available,
		challengePeriod,
		closed,
		collateral,
		collateralAllowance,
		collateralBal,
		collateralDecimal,
		collateralPosAllowance,
		collateralSymbol,
		collateralUserBal,
		cooldown,
		denied,
		expiration,
		isSuccess,
		limit,
		limitForClones,
		liqPrice,
		minimumCollateral,
		minted,
		mintingFee,
		ofdAllowance,
		ofdBalance,
		owner,
		refetch,
		reserveContribution,
	}
}
