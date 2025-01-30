const challenge = {
	buttons: {
		approve: 'Approve',
		challenge: 'Challenge',
	},
	columns: {
		auctionPrice: 'Auction Price',
		cap: 'Cap',
		state: 'State',
		progress: 'Progress',
	},
	details: {
		startingPrice: 'Starting Price',
		maxProceeds: 'Maximum Proceeds',
		collateralInPosition: 'Collateral in Position',
		minimumAmount: 'Minimum Amount',
		fixedPhase: 'Fixed Price Phase',
		decliningPhase: 'Declining Price Phase',
	},
	form: {
		title: 'Challenge Details',
		amount: {
			label: 'Amount',
			placeholder: 'Collateral Amount',
		},
		errors: {
			insufficientBalance: 'Not enough {{symbol}} in your wallet.',
			tooHighCollateral: 'Challenge collateral should be lower than position collateral',
			tooLowCollateral: 'Challenge collateral should be greater than minimum collateral',
		},
	},
	header: {
		title: 'Launch Challenge',
		backText: 'Back to position',
	},
	info: {
		title: 'How does it work?',
		description:
			'The amount of the collateral asset you provide will be publicly auctioned in a Dutch auction. The auction has two phases, a fixed price phase and a declining price phase.',
		phases: {
			fixed:
				'During the fixed price phase, anyone can buy the {{symbol}} you provided at the liquidation price. If everything gets sold before the phase ends, the challenge is averted and you have effectively sold the provided {{symbol}} to the bidders for {{price}} OFD per unit.',
			declining:
				'If the challenge is not averted, the fixed price phase is followed by a declining price phase during which the price at which the {{symbol}} tokens can be obtained declines linearly towards zero. In this case, the challenge is considered successful and you get the provided {{symbol}} tokens back. The tokens sold in this phase do not come from the challenger, but from the position owner. The total amount of tokens that can be bought from the position is limited by the amount left in the challenge at the end of the fixed price phase. As a reward for starting a successful challenge, you get 2% of the sales proceeds.',
		},
	},
	priceInfo: {
		startsFalling: 'Price starts falling in {{time}}',
		reachesZero: 'Zero is reached in {{time}}',
		reachedZero: 'Reached zero at {{time}}',
	},
	states: {
		fixedPrice: 'Fixed Price Phase',
		decliningPrice: 'Declining Price Phase',
		zeroPrice: 'Zero Price Phase',
	},
	title: 'Position Challenge',
}

export default challenge
