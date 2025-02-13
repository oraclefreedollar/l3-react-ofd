import { PositionCollateralTokenData } from 'meta/positions'
import { isAddress } from 'viem'
import { PositionCreateFormState } from 'contexts/position/types'
import { OPEN_POSITION_FEE } from 'utils'
import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'

export type ValidationProps = {
	form: PositionCreateFormState
	collTokenData?: PositionCollateralTokenData
	value?: bigint | string
}

const namespaces = ['common', 'forms']

type Returned = { [key in keyof PositionCreateFormState]?: (props: ValidationProps) => string }

export const useValidationRules = (): Returned => {
	const { t } = useTranslation(namespaces)

	const validationRules: Returned = useMemo(
		() => ({
			auctionDuration: ({ form }) => {
				if (form.auctionDuration < 1n) return t('forms:positionCreate:auctionDuration')
				return ''
			},
			collateralAddress: ({ collTokenData, form }) => {
				if (!isAddress(form.collateralAddress)) return t('forms:positionCreate:collateralAddress:invalid')
				if (collTokenData?.name === 'NaN') return t('forms:positionCreate:collateralAddress:noData')
				if (collTokenData && collTokenData.decimals > 24n) return t('forms:positionCreate:collateralAddress:notSupported')
				return ''
			},
			buffer: ({ form }) => {
				if (form.buffer > 1000_000n) return t('forms:positionCreate:buffer:max')
				if (form.buffer < 100_000) return t('forms:positionCreate:buffer:min')
				return ''
			},
			initialCollAmount: ({ collTokenData, form }) => {
				if (form.initialCollAmount <= 0n) return t('forms:positionCreate:initialCollateral:greaterThanZero')
				if (form.initialCollAmount < form.minCollAmount) return t('forms:positionCreate:initialCollateral:greaterThanMinimum')
				if (collTokenData && collTokenData.balance < form.initialCollAmount)
					return t('common:insufficientBalance', { symbol: collTokenData.symbol })
				return ''
			},
			initPeriod: ({ form }) => {
				if (form.initPeriod < 5n) return t('forms:positionCreate:initPeriod:min')
				return ''
			},
			interest: ({ form }) => {
				if (form.interest > 100_0000n) return t('forms:positionCreate:interest:max')
				if (form.interest <= 0) return t('forms:positionCreate:interest:min')
				return ''
			},
			liqPrice: ({ form }) => {
				if (form.minCollAmount * form.liqPrice < OPEN_POSITION_FEE) {
					return t('forms:positionCreate:liqPrice:min')
				}
				return ''
			},
			maturity: ({ form }) => {
				if (form.maturity <= 0) return t('forms:positionCreate:maturity:min')
				return ''
			},
			minCollAmount: ({}) => {
				/*if (form.minCollAmount * form.liqPrice < OPEN_POSITION_FEE) {
				return 'The collateral must be worth at least 3500 OFD.\n Check either the current value and the liquidation price.'
			}*/
				return ''
			},
		}),
		[t]
	)

	return validationRules
}
