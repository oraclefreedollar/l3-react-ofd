import axios from 'axios'
import { useEffect } from 'react'
import { zeroAddress } from 'viem'
import { useLocalStorage } from './useLocalStorage'

// TODO: remove this hook
export const useTokenPrice = (address: string | undefined) => {
	if (!address) address = zeroAddress
	const addressToFetch = address.toLowerCase()
	// if (address == ADDRESS[chainId].oracleFreeDollar) {
	// 	addressToFetch = address;
	// }
	const [price, setPrice] = useLocalStorage(addressToFetch)

	useEffect(() => {
		if (address == zeroAddress) return
		if (price && Date.now() - (price as any).timestamp < 60 * 60 * 1000) return
		const fetchPrice = async () => {
			try {
				const price = await axios.get(
					`https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${addressToFetch}&vs_currencies=usd`
				)
				setPrice({
					value: price.data[addressToFetch].usd,
					timestamp: Date.now(),
				})
			} catch {}
		}
		void fetchPrice()
	})

	return (price as any)?.value || 0
}
