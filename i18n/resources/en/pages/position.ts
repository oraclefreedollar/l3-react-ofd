const position = {
	adjust: {
		back: 'Back to position',
		outcome: {
			futureMintedAmount: 'Future minted amount',
			minted: 'Current minted amount',
			mintingFee: 'Minting fee (interest)',
			receive: 'You receive',
			reserve: 'Added to reserve on your behalf',
			return: 'You return',
			returnFromReserve: 'Returned from reserve',
			title: 'Outcome',
		},
		title: 'Adjust Position',
		variables: {
			amount: 'Amount',
			amountBalanceLabel: 'Min:',
			amountPlaceholder: 'Loan Amount',
			buttons: {
				adjust: 'Adjust Position',
				adjustError: 'You can only adjust your own position',
				approve: 'Approve Collateral',
			},
			collateral: 'Collateral',
			collateralBalanceLabel: 'Max:',
			collateralPlaceholder: 'Collateral Amount',
			collateralSent: '{{amount}} sent back to your wallet',
			collateralTaken: '{{amount}} taken from your wallet',
			errors: {
				insufficientBalance: 'Insufficient OFD in wallet',
				limitExceeded: 'This position is limited to {{limit}} OFD',
				maxMint: 'Can mint at most {{maxMint}} OFD with the given price and collateral',
				increaseAfterCooldown: 'Amount can only be increased after new price has gone through cooldown.',
			},
			insufficientCollateral: 'Insufficient {{collateralSymbol}} in your wallet',
			liqPrice: 'Liquidation Price',
			liqPriceBalanceLabel: 'Current Value',
			noEnoughCollateral: 'Not enough collateral for the given price and mint amount',
			title: 'Variables',
		},
	},
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
	collaterals: {
		status: {
			danger: 'Danger, blow {{percentage}}% collateralized',
			safe: 'Safe, blow {{percentage}}% collateralized',
			warning: 'Warning, blow {{percentage}}% collateralized',
		},
	},
	borrow: {
		title: 'Mint',
		options: {
			title: 'How do you plan to Borrow?',
			openNewPosition: {
				title: 'Open New Position (Collateral)',
				description: 'Start fresh with a new borrowing position. This option allows you to set up your collateral and terms from scratch.',
			},
			cloneExistingPosition: {
				title: 'Clone Existing Position (Collateral)',
				description: 'Copy the parameters of an existing position to quickly set up a new one with similar terms and conditions.',
			},
		},
	},
	list: {
		title: 'Positions',
		myPositions: 'My Positions',
		otherPositions: 'Other Positions',
		table: {
			adjust: 'Adjust',
			clone: 'Clone & Mint',
			closed: 'Closed',
			denied: 'Denied',
			header: {
				collateral: 'Collateral',
				liqPrice: 'Liquidation Price',
				availableAmount: 'Available Amount',
			},
			noPositions: 'There are no other positions yet.',
			noPositionsAccount: 'You don’t have any positions.',
		},
	},
}

export default position
