import axios from "axios";
import { useEffect } from "react";
import { zeroAddress } from "viem";
import { bsc } from "viem/chains";
import { ADDRESS } from "../contracts/address";
import { useLocalStorage } from "./useLocalStorage";

export const useTokenPrice = (address: string | undefined) => {
	if (!address) address = zeroAddress;
	let addressToFetch = address.toLowerCase();
	if (address == ADDRESS[bsc.id].oracleFreeDollar) {
		addressToFetch = "0x55d398326f99059fF775485246999027B3197955";
	}
	const [price, setPrice] = useLocalStorage(addressToFetch.toLowerCase());

	useEffect(() => {
		if (address == zeroAddress) return;
		if (price && Date.now() - (price as any).timestamp < 60 * 60 * 1000) return;
		const fetchPrice = async () => {
			try {
				console.log("Loading coingecko price");
				const price = await axios.get(
					`https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${addressToFetch.toLowerCase()}&vs_currencies=usd`
				);
				setPrice({
					value: price.data[addressToFetch.toLowerCase()].usd,
					timestamp: Date.now(),
				});
			} catch {}
		};
		void fetchPrice();
	});

	return (price as any)?.value || 0;
};
