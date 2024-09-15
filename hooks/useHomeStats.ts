import { ABIS, ADDRESS } from "@contracts";
import { decodeBigIntCall } from "@utils";
import { useAccount, useChainId, useReadContracts } from "wagmi";
import { erc20Abi } from "viem";

export const useHomeStats = () => {
	const chainId = useChainId();
	const { address } = useAccount();

	const ofdContract = {
		address: ADDRESS[chainId].oracleFreeDollar,
		abi: ABIS.oracleFreeDollarABI,
	} as const;

	const usdtContract = {
		address: ADDRESS[chainId].usdt,
		abi: erc20Abi,
	};

	const equityContract = {
		address: ADDRESS[chainId].equity,
		abi: ABIS.EquityABI,
	};

	const account = address || "0x0";

	// Fetch all blockchain stats in one web3 call using multicall
	const { data, isError, isLoading } = useReadContracts({
		contracts: [
			// oracleFreeDollar Calls
			{
				...ofdContract,
				functionName: "totalSupply",
			},
			{
				...ofdContract,
				functionName: "symbol",
			},
			{
				...ofdContract,
				functionName: "balanceOf",
				args: [account],
			},
			{
				...ofdContract,
				functionName: "equity",
			},
			{
				...ofdContract,
				functionName: "minterReserve",
			},
			// USDT Calls
			{
				...usdtContract,
				functionName: "balanceOf",
				args: [account],
			},
			{
				...usdtContract,
				functionName: "balanceOf",
				args: [ADDRESS[chainId].bridge],
			},
			{
				...usdtContract,
				functionName: "symbol",
			},
			// Equity Calls
			{
				...equityContract,
				functionName: "price",
			},
			{
				...equityContract,
				functionName: "totalSupply",
			},
			{
				...equityContract,
				functionName: "balanceOf",
				args: [account],
			},
			{
				...equityContract,
				functionName: "totalVotes",
			},
			{
				...equityContract,
				functionName: "votes",
				args: [account],
			},
		],
	});

	const ofdTotalSupply: bigint = data ? decodeBigIntCall(data[0]) : BigInt(0);
	const ofdSymbol: string = data ? String(data[1].result) : "";
	const ofdBalance: bigint = data ? decodeBigIntCall(data[2]) : BigInt(0);
	const ofdEquity: bigint = data ? decodeBigIntCall(data[3]) : BigInt(0);
	const ofdMinterReserve: bigint = data ? decodeBigIntCall(data[4]) : BigInt(0);

	const usdtUserBal: bigint = data ? decodeBigIntCall(data[5]) : BigInt(0);
	const usdtBridgeBal: bigint = data ? decodeBigIntCall(data[6]) : BigInt(0);
	const usdtSymbol: string = data ? String(data[7].result) : "";

	const equityPrice: bigint = data ? decodeBigIntCall(data[8]) : BigInt(0);
	const equityTotalSupply: bigint = data ? decodeBigIntCall(data[9]) : BigInt(0);
	const equityMarketCap: bigint = (equityPrice * equityTotalSupply) / BigInt(1e18);
	const equityBalance: bigint = data ? decodeBigIntCall(data[10]) : BigInt(0);
	const equityTotalVotes: bigint = data ? decodeBigIntCall(data[11]) : BigInt(0);
	const equityUserVotes: bigint = data ? decodeBigIntCall(data[12]) : BigInt(0);

	return {
		ofdTotalSupply,
		ofdSymbol,
		ofdBalance,
		ofdEquity,
		ofdMinterReserve,

		usdtUserBal,
		usdtBridgeBal,
		usdtSymbol,

		equityPrice,
		equityTotalSupply,
		equityMarketCap,
		equityBalance,
		equityTotalVotes,
		equityUserVotes,
	};
};
