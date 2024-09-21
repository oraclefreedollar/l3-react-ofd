import { ABIS, ADDRESS } from "@contracts";
import { decodeBigIntCall } from "@utils";
import { useAccount, useReadContracts } from "wagmi";
import { erc20Abi } from "viem";
import { WAGMI_CHAIN } from "../app.config";

export const useSwapStats = () => {
	const chainId = WAGMI_CHAIN.id as number;
	const { address } = useAccount();
	const account = address || "0x0";

	const { data, isError, isLoading, refetch } = useReadContracts({
		contracts: [
			// USDT Calls
			{
				chainId,
				address: ADDRESS[chainId].usdt,
				abi: erc20Abi,
				functionName: "balanceOf",
				args: [account],
			},
			{
				chainId,
				address: ADDRESS[chainId].usdt,
				abi: erc20Abi,
				functionName: "symbol",
			},
			{
				chainId,
				address: ADDRESS[chainId].usdt,
				abi: erc20Abi,
				functionName: "allowance",
				args: [account, ADDRESS[chainId].bridge],
			},
			{
				chainId,
				address: ADDRESS[chainId].usdt,
				abi: erc20Abi,
				functionName: "balanceOf",
				args: [ADDRESS[chainId].bridge],
			},
			// oracleFreeDollar Calls
			{
				chainId,
				address: ADDRESS[chainId].oracleFreeDollar,
				abi: ABIS.oracleFreeDollarABI,
				functionName: "balanceOf",
				args: [account],
			},
			{
				chainId,
				address: ADDRESS[chainId].oracleFreeDollar,
				abi: ABIS.oracleFreeDollarABI,
				functionName: "symbol",
			},
			{
				chainId,
				address: ADDRESS[chainId].oracleFreeDollar,
				abi: ABIS.oracleFreeDollarABI,
				functionName: "allowance",
				args: [account, ADDRESS[chainId].bridge],
			},
			// Bridge Calls
			{
				chainId,
				address: ADDRESS[chainId].bridge,
				abi: ABIS.StablecoinBridgeABI,
				functionName: "limit",
			},
		],
	});

	const usdtUserBal: bigint = data ? decodeBigIntCall(data[0]) : BigInt(0);
	const usdtSymbol: string = data ? String(data[1].result) : "";
	const usdtUserAllowance: bigint = data ? decodeBigIntCall(data[2]) : BigInt(0);
	const usdtBridgeBal: bigint = data ? decodeBigIntCall(data[3]) : BigInt(0);

	const ofdUserBal: bigint = data ? decodeBigIntCall(data[4]) : BigInt(0);
	const ofdSymbol: string = data ? String(data[5].result) : "";
	const ofdUserAllowance: bigint = data ? decodeBigIntCall(data[6]) : BigInt(0);

	const bridgeLimit: bigint = data ? decodeBigIntCall(data[7]) : BigInt(0);

	return {
		usdtUserBal,
		usdtSymbol,
		usdtUserAllowance,
		usdtBridgeBal,

		ofdUserBal,
		ofdSymbol,
		ofdUserAllowance,

		bridgeLimit,
		refetch,
	};
};
