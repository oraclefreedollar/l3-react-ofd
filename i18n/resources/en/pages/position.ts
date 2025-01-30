const position = {
	create: {
		// Common keys
		buttons: {
			back: 'Back',
			next: 'Next',
			propose: 'Propose Position',
			submit: 'Submit',
		},
		header: {
			backText: 'Back to positions',
			title: 'Propose New Position Type',
		},
		stepCounter: 'Step {{current}} of {{total}}',
		title: 'Propose Position',

		// Step keys
		collateral: {
			title: 'Collateral',
			addressLabel: 'Which token do you want to use as collateral?',
			addressPlaceholder: 'Token contract address',
			amountLabel: 'Collateral Amount',
			approveButton: 'Approve {{symbol}}',
			minCollateral: 'Minimum Collateral',
			minCollateralPlaceholder: 'Minimum Collateral Amount',
			initialCollateral: 'Initial Collateral',
			initialCollateralPlaceholder: 'Initial Collateral Amount',
		},
		financial: {
			title: 'Financial Terms',
			section: {
				interestLabel: 'Annual Interest',
				interestPlaceholder: 'Annual Interest',
				interestTooltip:
					'The annual interest is the fee charged upfront when you open a new position to mint Oracle Free Dollar (OFD). This interest is calculated based on the amount you wish to mint and is typically set by the user. The fee is paid for the entire duration of the position, which can be adjusted based on the maturity period you choose (e.g., 6 months, 12 months).',
				limitAmountLabel: 'Minting Limit',
				limitAmountPlaceholder: 'Limit Amount',
				maturityLabel: 'Maturity',
			},
		},
		initialization: {
			title: 'Position Details',
			section: {
				title: 'Initialization',
				proposalFeeLabel: 'Proposal Fee',
				proposalFeeError: 'Not enough OFD',
				initPeriodLabel: 'Initialization Period',
				discuss: {
					title: 'Discuss',
					description1: 'It is recommended to ',
					description2:
						' new positions before initiating them to increase the probability of passing the decentralized governance process.',
				},
			},
		},
		liquidation: {
			title: 'Liquidation Settings',
			section: {
				title: 'Liquidation',
				liqPriceLabel: 'Liquidation Price',
				liqPricePlaceholder: 'Price',
				bufferLabel: 'Retained Reserve',
				bufferPlaceholder: 'Percent',
				auctionDurationLabel: 'Auction Duration',
			},
		},
		requirements: {
			title: 'Requirements',
			section: {
				title: 'Ready to open a Position?',
				walletBalance: {
					title: 'Wallet Balance:',
					description: '1000 OFD ready in your wallet – this amount is required to cover the cost of opening a position.',
					sufficientOFDBalance: 'Sufficient OFD balance',
					notEnoughOFD: 'Not enough OFD. Buy OFD with USDT',
				},
				collateral: {
					title: 'Collateral:',
					description:
						"At least 3,500 OFD worth of collateral is needed to secure your position. This collateral acts as security for the amount you'll mint, allowing you to leverage your assets safely.",
				},
			},
		},
		success: {
			title: 'Position Successfully Proposed!',
			description: 'Your position has been created and is now pending approval by governance.',
			afterApproval: 'After approval you can convert your OFD into OFDPS and actively participate in the protocol.',
			button: 'View All Positions',
		},
		summary: {
			title: 'Summary',
			section: {
				title: 'Position Summary',
				note: 'Please review all details carefully before proceeding with the position creation.',
			},
			form: {
				collateral: 'Collateral Token',
				proposalFee: 'Proposal Fee',
			},
		},
	},
	borrow: {
		title: 'Mint',
	},
}

export default position
