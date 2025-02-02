const overview = {
	title: 'Position Overview',
	back: 'Back to positions',
	buttons: {
		adjust: 'Adjust',
		clone: 'Clone Position',
		challenge: 'Challenge',
	},
	subTitle: 'Position Overview {{address}}',
	section: {
		annualInterest: 'Annual Interest',
		collateral: 'Collateral',
		closed: 'Closed',
		expirationDate: 'Expiration Date',
		limit: 'Limit',
		liqPrice: 'Liquidation Price',
		mintedTotal: 'Minted Total',
		owner: 'Owner',
		positionDetails: 'Position Details',
		reserveRequirement: 'Reserve Requirement',
		retainedReserve: 'Retained Reserve',
	},
	cooldown: {
		title: 'Cooldown',
		description:
			'This position is subject to a cooldown period that ends on {{cooldown}} as its owner has recently increased the applicable liquidation price. The cooldown period gives other users an opportunity to challenge the position before additional oracleFreeDollars can be minted.',
	},
	challengeTable: {
		noContent: 'This position is currently not being challenged.',
		title: 'Open Challenges',
		loading: 'Loading challenges...',
	},
}

export default overview
