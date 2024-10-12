import { Address, getAddress, isAddress, zeroAddress } from 'viem'
import { useAccount, useChainId, useReadContracts } from 'wagmi'
import { ADDRESS } from 'contracts/address'
import { decodeBigIntCall } from 'utils/format'
import { erc20Abi } from 'viem'

export const useTokenData: (addr: string) => {
	address: Address
	allowance: bigint
	balance: bigint
	decimals: bigint
	name: string
	refetch: any
	symbol: string
} = (addr: string) => {
	if (!isAddress(addr)) addr = zeroAddress
	const tokenAddress = getAddress(addr)
	const { address } = useAccount()

	const account = address || zeroAddress
	const chainId = useChainId()
	// console.log("Got chain?", { chainId });
	const mintingHub = ADDRESS[chainId].mintingHub
	const { data, refetch } = useReadContracts({
		contracts: [
			{
				chainId,
				address: tokenAddress,
				abi: erc20Abi,
				functionName: 'name',
			},
			{
				chainId,
				address: tokenAddress,
				abi: erc20Abi,
				functionName: 'symbol',
			},
			{
				chainId,
				address: tokenAddress,
				abi: erc20Abi,
				functionName: 'decimals',
			},
			{
				chainId,
				address: tokenAddress,
				abi: erc20Abi,
				functionName: 'balanceOf',
				args: [account],
			},
			{
				chainId,
				address: tokenAddress,
				abi: erc20Abi,
				functionName: 'allowance',
				args: [account, mintingHub],
			},
		],
	})

	const name = data && !data[0].error ? String(data[0].result) : 'NaN'
	const symbol = data && !data[1].error ? String(data[1].result) : 'NaN'
	const decimals = data ? decodeBigIntCall(data[2]) : BigInt(0)
	const balance = data ? decodeBigIntCall(data[3]) : BigInt(0)
	const allowance = data ? decodeBigIntCall(data[4]) : BigInt(0)

	return {
		address: tokenAddress,
		allowance,
		balance,
		decimals,
		name,
		refetch,
		symbol,
	}
}
