import { ABIS, ADDRESS } from "@contracts";
import { decodeBigIntCall } from "@utils";
import { useAccount, useChainId, useReadContracts } from "wagmi";

export const useUserBalance = () => {
	const chainId = useChainId();

	const { address } = useAccount();

	const ofdContract = {
		address: ADDRESS[chainId].oracleFreeDollar,
		abi: ABIS.oracleFreeDollarABI,
	} as const;

	// console.log("ofd:", ofdContract.address);

	const equityContract = {
		address: ADDRESS[chainId].equity,
		abi: ABIS.EquityABI,
	};

	const account = address || "0x0";

	// Fetch all blockchain stats in one web3 call using multicall
	const { data, isError, isLoading, refetch } = useReadContracts({
		contracts: [
			// oracleFreeDollar Calls
			{
				chainId,
				...ofdContract,
				functionName: "balanceOf",
				args: [account],
			},
			{
				chainId,
				...equityContract,
				functionName: "balanceOf",
				args: [account],
			},
		],
	});

	const ofdBalance: bigint = data ? decodeBigIntCall(data[0]) : BigInt(0);
	const equityBalance: bigint = data ? decodeBigIntCall(data[1]) : BigInt(0);

	return {
		equityBalance,
		ofdBalance,
		refetch,
	};
};
