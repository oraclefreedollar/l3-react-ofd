import React, { useCallback, useEffect } from 'react'
import TokenInput from 'components/Input/TokenInput'
import NormalInput from 'components/Input/NormalInput'
import { usePositionFormContext } from 'contexts/position'
import { PositionCreateFormState } from 'contexts/position/types'
import { OPEN_POSITION_FEE } from 'utils'
import { StepComponentProps } from 'pages/positions/create'
import { useTranslation } from 'next-i18next'
import { CoinTicker } from 'meta/coins'

const PositionLiquidation: React.FC<StepComponentProps> = ({ onValidationChange }) => {
	const { t } = useTranslation()

	const { collTokenData, form, errors, handleChange } = usePositionFormContext()
	const { auctionDuration, buffer, liqPrice, minCollAmount } = form

	const onChangeValue = useCallback(
		(field: keyof PositionCreateFormState, value: string) => {
			const valueBigInt = BigInt(value)
			handleChange(field, valueBigInt)
		},
		[handleChange]
	)

	useEffect(() => {
		const isValid = Boolean(auctionDuration > 0n && buffer > 0n && liqPrice > 0n && form.minCollAmount * liqPrice >= OPEN_POSITION_FEE)
		onValidationChange(isValid)
	}, [auctionDuration, buffer, liqPrice, form.minCollAmount, onValidationChange])

	return (
		<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8 flex flex-col border border-purple-500/50 gap-y-4">
			<div className="text-lg font-bold text-center mt-3">{t('pages:position:create:liquidation:section:title')}</div>
			<TokenInput
				balanceLabel="Pick"
				digit={36n - collTokenData.decimals}
				error={errors['liqPrice']}
				hideMaxLabel={minCollAmount == 0n}
				label={t('pages:position:create:liquidation:section:liqPriceLabel')}
				max={minCollAmount == 0n ? 0n : (OPEN_POSITION_FEE + minCollAmount - 1n) / minCollAmount}
				onChange={(value) => onChangeValue('liqPrice', value)}
				placeholder={t('pages:position:create:liquidation:section:liqPricePlaceholder')}
				symbol={CoinTicker.OFD}
				tooltip={t('common:tooltips:position:create:liqPrice')}
				value={liqPrice.toString()}
			/>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
				<NormalInput
					digit={4}
					error={errors['buffer']}
					hideMaxLabel
					label={t('pages:position:create:liquidation:section:bufferLabel')}
					onChange={(value) => onChangeValue('buffer', value)}
					placeholder={t('pages:position:create:liquidation:section:bufferPlaceholder')}
					symbol="%"
					tooltip={t('common:tooltips:position:create:buffer')}
					value={buffer.toString()}
				/>
				<NormalInput
					digit={0}
					error={errors['auctionDuration']}
					hideMaxLabel
					label={t('pages:position:create:liquidation:section:auctionDurationLabel')}
					onChange={(value) => onChangeValue('auctionDuration', value)}
					placeholder={t('pages:position:create:liquidation:section:auctionDurationLabel')}
					symbol={t('common:hours')}
					tooltip={t('common:tooltips:position:create:auctionDuration')}
					value={auctionDuration.toString()}
				/>
			</div>
		</div>
	)
}

export default PositionLiquidation
