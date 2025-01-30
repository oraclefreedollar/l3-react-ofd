import React, { useCallback, useEffect } from 'react'
import TokenInput from 'components/Input/TokenInput'
import NormalInput from 'components/Input/NormalInput'
import { usePositionFormContext } from 'contexts/position'
import { PositionCreateFormState } from 'contexts/position/types'
import { OPEN_POSITION_FEE } from 'utils'
import { StepComponentProps } from 'pages/positions/create'
import { useTranslation } from 'react-i18next'
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
				tooltip="The liquidation price is the threshold value at which a position will be liquidated if the market price of the collateral falls below it. When opening a new position to mint Oracle Free Dollar (OFD), you can set the liquidation price freely, but it must ensure that the position can be liquidated for at least a minimum amount (e.g., 3,500 OFD).This price is crucial as it helps protect the system from losses by ensuring that the collateral can cover the minted OFD in case of a market downturn."
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
					tooltip="The retained reserve is the portion of the collateral that is set aside to ensure the stability of the position and the overall system. When opening a new position to mint Oracle Free Dollar (OFD), the retained reserve acts as a safety net to cover potential losses and mitigate risks associated with market volatility.This reserve is calculated based on the reserve requirement and is important for maintaining confidence in the system, especially during challenges or liquidations. It helps ensure that there are sufficient funds available to manage any adverse situations that may arise."
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
					tooltip="The auction duration refers to the length of time that an auction will run when a position is challenged. It determines how long bidders have to place their bids on the collateral associated with the position."
					value={auctionDuration.toString()}
				/>
			</div>
		</div>
	)
}

export default PositionLiquidation
