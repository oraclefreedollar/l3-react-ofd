import { Hash } from "viem";
import { bsc } from "viem/chains";
import { useAccount } from "wagmi";

export const useContractUrl = (address: string, chain: any = bsc) => {
	const explorerLink = chain.blockExplorers.default.url || "https://bscscan.io";
	return explorerLink + "/address/" + address;
};

export const useTxUrl = (hash: Hash) => {
	const { chain } = useAccount();
	const explorerLink = chain?.blockExplorers?.default.url || "https://bscscan.io";
	return explorerLink + "/tx/" + hash;
};
