import { ABIS, ADDRESS } from "@contracts";
import { useChainId, useReadContracts } from "wagmi";
import { decodeBigIntCall } from "../utils/format";
import { OFDPSHolder } from "./useOFDPSHolders";

export const useVotingPowers = (holders: OFDPSHolder[]) => {
	const chainId = useChainId();
	let contractCalls: any[] = [];
	holders.forEach((holder) => {
		contractCalls.push({
			address: ADDRESS[chainId].equity,
			abi: ABIS.EquityABI,
			functionName: "votes",
			args: [holder.address],
		});
	});
	contractCalls.push({
		address: ADDRESS[chainId].equity,
		abi: ABIS.EquityABI,
		functionName: "totalVotes",
	});

	const { data } = useReadContracts({
		contracts: contractCalls,
	});

	const votesData: any[] = [];
	if (data) {
		holders.forEach((holder, i) => {
			votesData.push({
				holder: holder.address,
				ofdps: holder.votingPower,
				votingPower: data[i].result,
			});
		});
	}

	const totalVotes = data ? decodeBigIntCall(data[holders.length]) : 0n;

	votesData.sort((a, b) => (a.votingPower > b.votingPower ? -1 : 1));

	return { votesData, totalVotes };
};
