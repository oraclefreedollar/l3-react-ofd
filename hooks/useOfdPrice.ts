import { ABIS } from "@contracts";
import { useReadContract } from "wagmi";

export const useOfdPrice = () => {
	const { data } = useReadContract({
		abi: ABIS.UniswapV3PoolABI,
		address: "0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7",
		functionName: "slot0",
	});

	const sqrtPriceX96 = data ? Number(data[0]) : 0;

	const ofdPrice = ((sqrtPriceX96 * sqrtPriceX96) / 2 ** 192) * 10 ** 12;

	return parseFloat(ofdPrice.toFixed(4));
};
