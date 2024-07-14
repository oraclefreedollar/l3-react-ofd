import axios from "axios";
import { useEffect } from "react";
import { zeroAddress } from "viem";
import { useChainId } from "wagmi";
import { ADDRESS } from "../contracts/address";
import { useLocalStorage } from "./useLocalStorage";

export const useTokenPrice = (address: string | undefined) => {
	const chainId = useChainId();
	if (!address) address = zeroAddress;
	let addressToFetch = address.toLowerCase();
	if (address == ADDRESS[chainId].oracleFreeDollar) {
		addressToFetch = address;
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
