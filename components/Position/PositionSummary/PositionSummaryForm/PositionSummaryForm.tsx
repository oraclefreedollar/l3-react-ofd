import React, { useCallback } from 'react'
import { usePositionFormContext } from 'contexts/position'
import { PositionCreateFormState } from 'contexts/position/types'
import SummaryRowTokenInput from 'components/Position/PositionSummary/SummaryRowTokenInput'
import SummaryRowNormalInput from 'components/Position/PositionSummary/SummaryRowNormalInput'
import { OPEN_POSITION_FEE } from 'utils'
import { SummaryRow } from 'components/Position/PositionSummary/SummaryRow/SummaryRow'
import { useTranslation } from 'next-i18next'
import { CoinTicker } from 'meta/coins'

const PositionSummaryForm: React.FC = () => {
	const { t } = useTranslation()

	const { collTokenData, form, errors, handleChange } = usePositionFormContext()
	const { auctionDuration, buffer, initialCollAmount, initPeriod, interest, limitAmount, liqPrice, maturity, minCollAmount } = form

	const onChangeValue = useCallback(
		(field: keyof PositionCreateFormState, value: string | number) => {
			const valueBigInt = BigInt(value)
			handleChange(field, valueBigInt)
		},
		[handleChange]
	)

	return (
		<div className="space-y-2">
			<SummaryRow label={t('pages:position:create:summary:form:collateral')} value={`${collTokenData.symbol} (${collTokenData.address})`} />

			<SummaryRow
				label={t('pages:position:create:summary:form:proposalFee')}
				tooltip={t('common:tooltips:position:create:proposalFee')}
				value={`1000 OFD`}
			/>

			<SummaryRowTokenInput
				digit={collTokenData.decimals}
				error={errors['minCollAmount']}
				fieldName={'minCollAmount'}
				hideMaxLabel
				label={t('pages:position:create:collateral:minCollateral')}
				onChangeValue={onChangeValue}
				placeholder={t('pages:position:create:collateral:minCollateralPlaceholder')}
				symbol={collTokenData.symbol}
				tooltip={t('common:tooltips:position:create:minCollateral')}
				value={minCollAmount}
			/>

			<SummaryRowTokenInput
				digit={collTokenData.decimals}
				error={errors['initialCollAmount']}
				fieldName={'initialCollAmount'}
				label={t('pages:position:create:collateral:initialCollateral')}
				max={collTokenData.balance}
				onChangeValue={onChangeValue}
				placeholder={t('pages:position:create:collateral:initialCollateralPlaceholder')}
				symbol={collTokenData.symbol}
				tooltip={t('common:tooltips:position:create:initialCollateral')}
				value={initialCollAmount}
			/>

			<SummaryRowNormalInput
				digit={0}
				error={errors['initPeriod']}
				fieldName={'initPeriod'}
				hideMaxLabel
				label={t('pages:position:create:initialization:section:initPeriodLabel')}
				onChangeValue={onChangeValue}
				placeholder={t('pages:position:create:initialization:section:initPeriodLabel')}
				symbol={t('common:days')}
				tooltip={t('common:tooltips:position:create:initPeriod')}
				value={initPeriod}
			/>

			<SummaryRowTokenInput
				error={errors['limitAmount']}
				fieldName={'limitAmount'}
				hideMaxLabel
				label={t('pages:position:create:financial:section:limitAmountLabel')}
				onChangeValue={onChangeValue}
				placeholder={t('pages:position:create:financial:section:limitAmountPlaceholder')}
				symbol={CoinTicker.OFD}
				tooltip={t('common:tooltips:position:create:limitAmount')}
				value={limitAmount}
			/>

			{/* TODO: consider substitute with next field */}
			{/*<PositionSummarySlider*/}
			{/*	fieldName={'interest'}*/}
			{/*	label="Annual Interest Rate"*/}
			{/*	onChangeValue={onChangeValue}*/}
			{/*	percentage={Number(interest)}*/}
			{/*/>*/}

			<SummaryRowNormalInput
				digit={4}
				error={errors['interest']}
				fieldName={'interest'}
				hideMaxLabel
				label={t('pages:position:create:financial:section:interestLabel')}
				onChangeValue={onChangeValue}
				placeholder={t('pages:position:create:financial:section:interestPlaceholder')}
				symbol="%"
				tooltip={t('common:tooltips:position:create:interest')}
				value={interest}
			/>

			<SummaryRowNormalInput
				digit={0}
				error={errors['maturity']}
				fieldName={'maturity'}
				hideMaxLabel
				label={t('pages:position:create:financial:section:maturityLabel')}
				onChangeValue={onChangeValue}
				placeholder={t('pages:position:create:financial:section:maturityLabel')}
				symbol={t('common:months')}
				tooltip={t('common:tooltips:position:create:maturity')}
				value={maturity}
			/>

			<SummaryRowTokenInput
				balanceLabel="Pick"
				digit={36n - collTokenData.decimals}
				error={errors['liqPrice']}
				fieldName={'liqPrice'}
				hideMaxLabel={minCollAmount == 0n}
				label={t('pages:position:create:liquidation:section:liqPriceLabel')}
				max={minCollAmount == 0n ? 0n : (OPEN_POSITION_FEE + minCollAmount - 1n) / minCollAmount}
				onChangeValue={onChangeValue}
				placeholder={t('pages:position:create:liquidation:section:liqPricePlaceholder')}
				symbol={CoinTicker.OFD}
				tooltip={t('common:tooltips:position:create:liqPrice')}
				value={liqPrice}
			/>

			{/* TODO: consider substitute with next field */}
			{/*<PositionSummarySlider*/}
			{/*	fieldName={'buffer'}*/}
			{/*	label="Retained Reserve"*/}
			{/*	min={100000}*/}
			{/*	onChangeValue={onChangeValue}*/}
			{/*	percentage={Number(buffer)}*/}
			{/*/>*/}

			<SummaryRowNormalInput
				digit={4}
				error={errors['buffer']}
				fieldName={'buffer'}
				hideMaxLabel
				label={t('pages:position:create:liquidation:section:bufferLabel')}
				onChangeValue={onChangeValue}
				placeholder={t('pages:position:create:liquidation:section:bufferPlaceholder')}
				symbol="%"
				tooltip={t('common:tooltips:position:create:buffer')}
				value={buffer}
			/>

			<SummaryRowNormalInput
				digit={0}
				error={errors['auctionDuration']}
				fieldName={'auctionDuration'}
				hideMaxLabel
				label={t('pages:position:create:liquidation:section:auctionDurationLabel')}
				onChangeValue={onChangeValue}
				placeholder={t('pages:position:create:liquidation:section:auctionDurationLabel')}
				symbol={t('common:hours')}
				tooltip={t('common:tooltips:position:create:auctionDuration')}
				value={auctionDuration}
			/>
		</div>
	)
}

export default PositionSummaryForm
