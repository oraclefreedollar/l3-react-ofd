import { PositionCollateralTokenData } from 'meta/positions'
import { isAddress } from 'viem'
import { PositionCreateFormState } from 'contexts/position/types'

export type ValidationProps = {
	form: PositionCreateFormState
	collTokenData?: PositionCollateralTokenData
	value?: bigint | string
}

export const validationRules: { [key in keyof PositionCreateFormState]?: (props: ValidationProps) => string } = {
	auctionDuration: ({ form }) => {
		if (form.auctionDuration < 1n) return 'Auction duration must be greater than 1 month.'
		return ''
	},
	collateralAddress: ({ collTokenData, form }) => {
		if (!isAddress(form.collateralAddress)) return 'Invalid address'
		if (collTokenData?.name === 'NaN') return 'Could not obtain token data'
		if (collTokenData && collTokenData.decimals > 24n) return 'Token decimals should be less than 24.'
		return ''
	},
	buffer: ({ form }) => {
		if (form.buffer > 1000_000n) return 'Buffer cannot exceed 100%.'
		if (form.buffer < 100_000) return 'Buffer must be at least 10%.'
		return ''
	},
	initialCollAmount: ({ collTokenData, form }) => {
		if (form.initialCollAmount <= 0n) return 'Initial collateral must be greater than 0'
		if (form.initialCollAmount < form.minCollAmount) return 'Initial collateral must be at least the minimum amount.'
		if (collTokenData && collTokenData.balance < form.initialCollAmount) return `Not enough ${collTokenData.symbol} in your wallet.`
		return ''
	},
	initPeriod: ({ form }) => {
		if (form.initPeriod < 3n) return 'Initialization period must be greater than 3.'
		return ''
	},
	interest: ({ form }) => {
		if (form.interest > 100_0000n) return 'Annual Interest Rate should be less than 100%.'
		if (form.interest <= 0) return 'Annual Interest Rate should be greater than 0%.'
		return ''
	},
	liqPrice: ({ form }) => {
		if (form.minCollAmount * form.liqPrice < 5000n * 10n ** 36n) {
			return 'Liquidation value of the collateral must be at least 5000 OFD.'
		}
		return ''
	},
	maturity: ({ form }) => {
		if (form.maturity <= 0) return 'Maturity must be greater than 0.'
		return ''
	},
	minCollAmount: ({ form }) => {
		if (form.minCollAmount * form.liqPrice < 5000n * 10n ** 36n) {
			return 'The collateral must be worth at least 5000 OFD.\n Check either the current value and the liquidation price.'
		}
		return ''
	},
}
