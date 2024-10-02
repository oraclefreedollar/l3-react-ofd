import { ABIS } from "@contracts";
import { useReadContract } from "wagmi";
import { Address, formatUnits, zeroAddress } from "viem";

const addressPriceFeeds: Record<Address, Address> = {
	'0x55d398326f99059fF775485246999027B3197955': '0xB97Ad0E74fa7d920791E90258A6E2085088b4320', // USDT
	'0x2170Ed0880ac9A755fd29B2688956BD959F933F8': '0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e', // ETH
	'0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c': '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE', // WBNB
	'0x0555E30da8f98308EdB960aa94C0Db47230d2B9c': '0x264990fbd0A4796A3E3d8E37C4d5F87a3aCa5Ebf', // WBTC
}

type Returned = number | undefined;

export const useTokenPriceNew = (tokenAddress: Address | undefined): Returned => {
	const { data, isError, error, isLoading } = useReadContract({
		address: addressPriceFeeds[tokenAddress || zeroAddress],
		abi: ABIS.ChainLinkABI,
		functionName: 'latestRoundData'
	});

	// TODO: refactor using API
	// if(tokenAddress == '0x3aFc7c9a7d1aC2e78907dffB840B5a879BA17af7') {
	// 	tokenListed.current = false;
	// 	(async () => {
	// 		const response = await fetch('https://api.aktionariat.com/price?ticker=OPRS')
	// 		const data = await response.json()
	// 		returnedValue.current = data.price
	// 	})()
	// }

	// hardcoded price for Operal
	if(tokenAddress === "0x3aFc7c9a7d1aC2e78907dffB840B5a879BA17af7") {
		return 16.75
	}

	if(isLoading || !data) return
	if(isError) {
		console.error('Error fetching token price:', error)
		return;
	}

	return Number(formatUnits(data[1], 8))
}
