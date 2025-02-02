const borrow = {
	back: 'Back to position',
	title: 'Mint Fresh OracleFreeDollars',
	mintingSection: {
		title: 'Minting Amount and Collateral',
		amount: {
			label: 'Amount',
			balanceLabel: 'Limit:',
			placeholder: 'Total Amount to be Minted',
		},
		collateral: {
			label: 'Required Collateral',
			balanceLabel: 'Your balance:',
			valueNote: 'Valued at {{price}} OFD, minimum is {{minimum}} {{symbol}}',
		},
		expiration: {
			label: 'Expiration',
			error: 'Expiration Date should be between Now and Limit',
		},
		buttons: {
			approve: 'Approve',
			clone: 'Clone Position',
			minimumError: 'A position must have at least {{minimum}} {{symbol}}',
		},
		errors: {
			notEnoughCollateral: 'Not enough {{symbol}} in your wallet.',
			notEnoughOFD: 'Not enough OFD available for this position.',
			cannotMintMore: 'Cannot mint more than {{limit}}.{{value}}',
		},
	},
	outcome: {
		title: 'Outcome',
		sentToWallet: 'Sent to your wallet',
		lockedInReserve: 'Locked in borrowers reserve',
		fees: 'Fees ({{percent}}%)',
		total: 'Total',
	},
	notes: {
		title: 'Notes',
		description1: 'The amount borrowed can be changed later, but not increased beyond the initial amount.',
		description2:
			'The liquidation price is inherited from the parent position, but can be adjusted later. For example, the liquidation price could be doubled and then half of the collateral taken out if the new liquidation price is not challenged.',
		description3:
			'It is possible to repay partially or to repay early in order to get the collateral back, but the fee is paid upfront and never returned.',
	},
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
}

export default borrow
