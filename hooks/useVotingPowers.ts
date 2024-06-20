import { ABIS, ADDRESS } from "@contracts";
import { mainnet, useContractReads } from "wagmi";
import { decodeBigIntCall } from "../utils/format";
import { OFDPSHolder } from "./useOFDPSHolders";

export const useVotingPowers = (holders: OFDPSHolder[]) => {
	let contractCalls: any[] = [];
	holders.forEach((holder) => {
		contractCalls.push({
			address: ADDRESS[mainnet.id].equity,
			abi: ABIS.EquityABI,
			functionName: "votes",
			args: [holder.address],
		});
	});
	contractCalls.push({
		address: ADDRESS[mainnet.id].equity,
		abi: ABIS.EquityABI,
		functionName: "totalVotes",
	});

	const { data } = useContractReads({
		contracts: contractCalls,
		watch: true,
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
