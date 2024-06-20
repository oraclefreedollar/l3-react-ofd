import { ABIS, ADDRESS } from "@contracts";
import { decodeBigIntCall } from "@utils";
import { erc20ABI, useAccount, useChainId, useContractReads } from "wagmi";

export const useSwapStats = () => {
	const chainId = useChainId();
	const { address } = useAccount();
	const account = address || "0x0";

	const { data, isError, isLoading } = useContractReads({
		contracts: [
			// USDT Calls
			{
				address: ADDRESS[chainId].usdt,
				abi: erc20ABI,
				functionName: "balanceOf",
				args: [account],
			},
			{
				address: ADDRESS[chainId].usdt,
				abi: erc20ABI,
				functionName: "symbol",
			},
			{
				address: ADDRESS[chainId].usdt,
				abi: erc20ABI,
				functionName: "allowance",
				args: [account, ADDRESS[chainId].bridge],
			},
			{
				address: ADDRESS[chainId].usdt,
				abi: erc20ABI,
				functionName: "balanceOf",
				args: [ADDRESS[chainId].bridge],
			},
			// oracleFreeDollar Calls
			{
				address: ADDRESS[chainId].oracleFreeDollar,
				abi: erc20ABI,
				functionName: "balanceOf",
				args: [account],
			},
			{
				address: ADDRESS[chainId].oracleFreeDollar,
				abi: erc20ABI,
				functionName: "symbol",
			},
			{
				address: ADDRESS[chainId].oracleFreeDollar,
				abi: erc20ABI,
				functionName: "allowance",
				args: [account, ADDRESS[chainId].bridge],
			},
			// Bridge Calls
			{
				address: ADDRESS[chainId].bridge,
				abi: ABIS.StablecoinBridgeABI,
				functionName: "limit",
			},
		],
		watch: true,
	});

	const usdtUserBal: bigint = data ? decodeBigIntCall(data[0]) : BigInt(0);
	const usdtSymbol: string = data ? String(data[1].result) : "";
	const usdtUserAllowance: bigint = data ? decodeBigIntCall(data[2]) : BigInt(0);
	const usdtBridgeBal: bigint = data ? decodeBigIntCall(data[3]) : BigInt(0);

	const ofdUserBal: bigint = data ? decodeBigIntCall(data[4]) : BigInt(0);
	const frankenSymbol: string = data ? String(data[5].result) : "";
	const ofdUserAllowance: bigint = data ? decodeBigIntCall(data[6]) : BigInt(0);

	const bridgeLimit: bigint = data ? decodeBigIntCall(data[7]) : BigInt(0);

	return {
		usdtUserBal,
		usdtSymbol,
		usdtUserAllowance,
		usdtBridgeBal,

		ofdUserBal,
		frankenSymbol,
		ofdUserAllowance,

		bridgeLimit,
	};
};
