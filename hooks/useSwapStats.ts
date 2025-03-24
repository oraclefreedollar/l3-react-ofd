import { ABIS, ADDRESS } from 'contracts'
import { decodeBigIntCall } from 'utils'
import { useAccount, useChainId, useReadContracts } from 'wagmi'
import { erc20Abi } from 'viem'
import { SwapStats } from 'meta/swap'

export const useSwapStats = (): SwapStats => {
	const chainId = useChainId()
	const { address } = useAccount()
	const account = address || '0x0'

	const { data, refetch } = useReadContracts({
		contracts: [
			// USDT Calls
			{
				chainId,
				address: ADDRESS[chainId].usdt,
				abi: erc20Abi,
				functionName: 'balanceOf',
				args: [account],
			},
			{
				chainId,
				address: ADDRESS[chainId].usdt,
				abi: erc20Abi,
				functionName: 'symbol',
			},
			{
				chainId,
				address: ADDRESS[chainId].usdt,
				abi: erc20Abi,
				functionName: 'allowance',
				args: [account, ADDRESS[chainId].bridge],
			},
			{
				chainId,
				address: ADDRESS[chainId].usdt,
				abi: erc20Abi,
				functionName: 'balanceOf',
				args: [ADDRESS[chainId].bridge],
			},
			{
				chainId,
				address: ADDRESS[chainId].usdt,
				abi: erc20Abi,
				functionName: 'decimals',
			},
			// oracleFreeDollar Calls
			{
				chainId,
				address: ADDRESS[chainId].oracleFreeDollar,
				abi: ABIS.OracleFreeDollarABI,
				functionName: 'balanceOf',
				args: [account],
			},
			{
				chainId,
				address: ADDRESS[chainId].oracleFreeDollar,
				abi: ABIS.OracleFreeDollarABI,
				functionName: 'symbol',
			},
			{
				chainId,
				address: ADDRESS[chainId].oracleFreeDollar,
				abi: ABIS.OracleFreeDollarABI,
				functionName: 'allowance',
				args: [account, ADDRESS[chainId].bridge],
			},
			{
				chainId,
				address: ADDRESS[chainId].oracleFreeDollar,
				abi: ABIS.OracleFreeDollarABI,
				functionName: 'decimals',
			},
			// Bridge Calls
			{
				chainId,
				address: ADDRESS[chainId].bridge,
				abi: ABIS.StablecoinBridgeABI,
				functionName: 'limit',
			},
		],
	})

	const usdtUserBal: bigint = data ? decodeBigIntCall(data[0]) : BigInt(0)
	const usdtSymbol: string = data ? String(data[1].result) : ''
	const usdtUserAllowance: bigint = data ? decodeBigIntCall(data[2]) : BigInt(0)
	const usdtBridgeBal: bigint = data ? decodeBigIntCall(data[3]) : BigInt(0)
	const usdtDecimals: number = data ? Number(data[4].result ?? 18) : 0

	const ofdUserBal: bigint = data ? decodeBigIntCall(data[5]) : BigInt(0)
	const ofdSymbol: string = data ? String(data[6].result) : ''
	const ofdUserAllowance: bigint = data ? decodeBigIntCall(data[7]) : BigInt(0)
	const ofdDecimals: number = data ? Number(data[8].result ?? 18) : 0

	const bridgeLimit: bigint = data ? decodeBigIntCall(data[9]) : BigInt(0)

	return {
		bridgeLimit,
		ofdDecimals,
		ofdSymbol,
		ofdUserAllowance,
		ofdUserBal,
		refetch,
		usdtBridgeBal,
		usdtDecimals,
		usdtSymbol,
		usdtUserAllowance,
		usdtUserBal,
	}
}
