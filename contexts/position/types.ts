export type PositionCreateFormState = {
	auctionDuration: bigint
	buffer: bigint
	collateralAddress: string
	initPeriod: bigint
	initialCollAmount: bigint
	interest: bigint
	limitAmount: bigint
	liqPrice: bigint
	maturity: bigint
	minCollAmount: bigint
}

export const initialFormState = {
	auctionDuration: 24n,
	buffer: 200000n,
	collateralAddress: '',
	initPeriod: 3n,
	initialCollAmount: 0n,
	interest: 30000n,
	limitAmount: 1_000_000n * BigInt(1e18),
	liqPrice: 0n,
	maturity: 12n,
	minCollAmount: 0n,
}
