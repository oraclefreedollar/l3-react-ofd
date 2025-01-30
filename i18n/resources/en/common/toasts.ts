const toasts = {
	adjust: {
		amount: 'Amount: ',
		collateralAmount: 'Collateral Amount: ',
		liquidationPrice: 'Liquidation Price: ',
		success: 'Successfully Adjusted Position',
		pending: 'Adjusting Position',
	},
	approve: {
		pending: 'Approving {{symbol}}',
		success: 'Successfully Approved {{symbol}}',
		amount: 'Amount',
		spender: 'Spender',
	},
	bid: {
		pending: 'Placing a bid',
		success: 'Successfully Placed Bid',
		bidAmount: 'Bid Amount: ',
		expectedOFD: 'Expected OFD',
	},
	borrow: {
		pending: 'Minting OFD',
		success: 'Successfully Minted OFD',
		amount: 'Amount: ',
		collateral: 'Collateral: ',
	},
	challenge: {
		pending: 'Launching a challenge',
		success: 'Successfully Launched challenge',
		size: 'Size: ',
		price: 'Price: ',
	},
	clone: {
		amount: 'Amount: ',
		collateral: 'Collateral: ',
		pending: 'Minting OFD',
		success: 'Successfully Minted OFD',
	},
	pool: {
		invest: {
			pending: 'Investing OFD',
			success: 'Successfully Invested OFD',
			amount: 'Amount: ',
			shares: 'Shares: ',
		},
		redeem: {
			pending: 'Redeeming OFDPS',
			success: 'Successfully Redeemed',
			amount: 'Amount: ',
			receive: 'Receive: ',
		},
	},
	swap: {
		pending: 'Swapping {{fromSymbol}} to {{toSymbol}}',
		success: 'Successfully Swapped {{fromSymbol}} to {{toSymbol}}',
		amount: {
			from: '{{symbol}} Amount',
			to: '{{symbol}} Amount',
		},
	},
	transaction: {
		error: 'Transaction failed!',
		title: 'Transaction: ',
	},
}

export default toasts
