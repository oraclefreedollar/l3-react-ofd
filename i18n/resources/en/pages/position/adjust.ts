const adjust = {
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
}

export default adjust
