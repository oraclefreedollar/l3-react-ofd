import { formatCurrency } from "@utils";
import { ERC20Info } from "../../redux/slices/positions.types";
import { PriceQueryObjectArray } from "../../redux/slices/prices.types";

export const oprs = async (fetchedERC20Infos: Array<ERC20Info>, fetchedPrices: PriceQueryObjectArray) => {
	const contract = "0x3aFc7c9a7d1aC2e78907dffB840B5a879BA17af7".toLowerCase();
	const options = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	}
	const data = await fetch("https://api.aktionariat.com/price?ticker=OPRS", options);
	const response = await data.json();
	// convert CHF to USD hardcoded
	// TODO: refactor using a proper currency conversion library
	const price = formatCurrency(String(response.price * 1.17));
	const erc = fetchedERC20Infos.find((i) => i.address?.toLowerCase() == contract);

	if (!erc) return;

	fetchedPrices[contract] = {
		...erc,
		timestamp: Date.now(),
		price: {
			usd: Number(price),
		},
	};
}
