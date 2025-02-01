const tooltips = {
	position: {
		create: {
			header: 'Propose a completely new position with a collateral of your choice.',
			auctionDuration:
				'The auction duration refers to the length of time that an auction will run when a position is challenged. It determines how long bidders have to place their bids on the collateral associated with the position.',
			buffer:
				'The retained reserve is the portion of the collateral that is set aside to ensure the stability of the position and the overall system. When opening a new position to mint Oracle Free Dollar (OFD), the retained reserve acts as a safety net to cover potential losses and mitigate risks associated with market volatility.This reserve is calculated based on the reserve requirement and is important for maintaining confidence in the system, especially during challenges or liquidations. It helps ensure that there are sufficient funds available to manage any adverse situations that may arise.',
			collateralAddress: 'The token contract address of the collateral is inserted here',
			initialCollateral:
				'The amount of collateral that you want to deposit into the position. This amount must be greater than the minimum collateral amount.',
			initPeriod:
				'A proposal (a new position) can be vetoed in the first five days. The minimum period for the community to veto is 5 days. If you want, you can extend the period during which a proposal can be vetoed',
			interest:
				'The annual interest is the fee charged upfront when you open a new position to mint Oracle Free Dollar (OFD). This interest is calculated based on the amount you wish to mint and is typically set by the user. The fee is paid for the entire duration of the position, which can be adjusted based on the maturity period you choose (e.g., 6 months, 12 months).',
			limitAmount:
				'The minting limit refers to the maximum amount of Oracle Free Dollar (OFD) that can be minted against this position and its clones. When you open a new position, this limit is set based on the collateral you provide and the parameters of the position.',
			liqPrice:
				'The liquidation price is the threshold value at which a position will be liquidated if the market price of the collateral falls below it. When opening a new position to mint Oracle Free Dollar (OFD), you can set the liquidation price freely, but it must ensure that the position can be liquidated for at least a minimum amount (e.g., 3,500 OFD).This price is crucial as it helps protect the system from losses by ensuring that the collateral can cover the minted OFD in case of a market downturn.',
			maturity:
				'The maturity refers to the duration for which the position is set when opening a new position to mint Oracle Free Dollar (OFD). It defines the time period until the position expires, which can be set between today and the limit date (one year from the date the parent position was minted).The maturity period affects the annual interest charged, as shorter maturities will result in a different final interest amount.',
			minCollateral:
				'The minimum amount of collateral that must be deposited. If the amount is less than this, the position will not be created.',
			proposalFee:
				"Opening a new position requires 1000 OFD to be paid one time as fee. This amount is sent into the reserve for ecosystem's health",
		},
	},
}

export default tooltips
