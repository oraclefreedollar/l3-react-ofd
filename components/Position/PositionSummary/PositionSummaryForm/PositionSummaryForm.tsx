import React, { useCallback } from 'react'
import { usePositionFormContext } from 'contexts/position'
import { PositionCreateFormState } from 'contexts/position/types'
import SummaryRowTokenInput from 'components/Position/PositionSummary/SummaryRowTokenInput'
import SummaryRowNormalInput from 'components/Position/PositionSummary/SummaryRowNormalInput'
import { OPEN_POSITION_FEE } from 'utils'
import { SummaryRow } from 'components/Position/PositionSummary/SummaryRow/SummaryRow'

const PositionSummaryForm: React.FC = () => {
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
			<SummaryRow label="Collateral Token" value={`${collTokenData.symbol} (${collTokenData.address})`} />

			<SummaryRow
				label="Proposal Fee"
				tooltip={`Opening a new position requires 1000 OFD to be paid one time as fee. This amount is sent into the reserve for ecosystem's health`}
				value={`1000 OFD`}
			/>

			<SummaryRowTokenInput
				digit={collTokenData.decimals}
				error={errors['minCollAmount']}
				fieldName={'minCollAmount'}
				hideMaxLabel
				label="Minimum Collateral"
				onChangeValue={onChangeValue}
				placeholder="Minimum Collateral Amount"
				symbol={collTokenData.symbol}
				tooltip="The minimum amount of collateral that must be deposited. If the amount is less than this, the position will not be created."
				value={minCollAmount}
			/>

			<SummaryRowTokenInput
				digit={collTokenData.decimals}
				error={errors['initialCollAmount']}
				fieldName={'initialCollAmount'}
				label="Initial Collateral"
				max={collTokenData.balance}
				onChangeValue={onChangeValue}
				placeholder="Initial Collateral Amount"
				symbol={collTokenData.symbol}
				tooltip="The amount of collateral that you want to deposit into the position. This amount must be greater than the minimum collateral amount."
				value={initialCollAmount}
			/>

			<SummaryRowNormalInput
				digit={0}
				error={errors['initPeriod']}
				fieldName={'initPeriod'}
				hideMaxLabel
				label="Initialization Period"
				onChangeValue={onChangeValue}
				placeholder="Initialization Period"
				symbol="days"
				tooltip="A proposal (a new position) can be vetoed in the first five days. The minimum period for the community to veto is 5 days. If you want, you can extend the period during which a proposal can be vetoed"
				value={initPeriod}
			/>

			<SummaryRowTokenInput
				error={errors['limitAmount']}
				fieldName={'limitAmount'}
				hideMaxLabel
				label="Minting Limit"
				onChangeValue={onChangeValue}
				placeholder="Limit Amount"
				symbol="OFD"
				tooltip="The minting limit refers to the maximum amount of Oracle Free Dollar (OFD) that can be minted against this position and its clones. When you open a new position, this limit is set based on the collateral you provide and the parameters of the position."
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
				label="Annual Interest Rate"
				onChangeValue={onChangeValue}
				placeholder="Annual Interest Rate"
				symbol="%"
				tooltip="The annual interest is the fee charged upfront when you open a new position to mint Oracle Free Dollar (OFD). This interest is calculated based on the amount you wish to mint and is typically set by the user. The fee is paid for the entire duration of the position, which can be adjusted based on the maturity period you choose (e.g., 6 months, 12 months)."
				value={interest}
			/>

			<SummaryRowNormalInput
				digit={0}
				error={errors['maturity']}
				fieldName={'maturity'}
				hideMaxLabel
				label="Maturity Period"
				onChangeValue={onChangeValue}
				placeholder="Maturity Period"
				symbol="days"
				tooltip="The maturity refers to the duration for which the position is set when opening a new position to mint Oracle Free Dollar (OFD). It defines the time period until the position expires, which can be set between today and the limit date (one year from the date the parent position was minted).The maturity period affects the annual interest charged, as shorter maturities will result in a different final interest amount."
				value={maturity}
			/>

			<SummaryRowTokenInput
				balanceLabel="Pick"
				digit={36n - collTokenData.decimals}
				error={errors['liqPrice']}
				fieldName={'liqPrice'}
				hideMaxLabel={minCollAmount == 0n}
				label="Liquidation Price"
				max={minCollAmount == 0n ? 0n : (OPEN_POSITION_FEE + minCollAmount - 1n) / minCollAmount}
				onChangeValue={onChangeValue}
				placeholder="Price"
				symbol="OFD"
				tooltip="The liquidation price is the threshold value at which a position will be liquidated if the market price of the collateral falls below it. When opening a new position to mint Oracle Free Dollar (OFD), you can set the liquidation price freely, but it must ensure that the position can be liquidated for at least a minimum amount (e.g., 3,500 OFD).This price is crucial as it helps protect the system from losses by ensuring that the collateral can cover the minted OFD in case of a market downturn."
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
				label="Retained Reserve"
				onChangeValue={onChangeValue}
				placeholder="Percent"
				symbol="%"
				tooltip="The retained reserve is the portion of the collateral that is set aside to ensure the stability of the position and the overall system. When opening a new position to mint Oracle Free Dollar (OFD), the retained reserve acts as a safety net to cover potential losses and mitigate risks associated with market volatility.This reserve is calculated based on the reserve requirement and is important for maintaining confidence in the system, especially during challenges or liquidations. It helps ensure that there are sufficient funds available to manage any adverse situations that may arise."
				value={buffer}
			/>

			<SummaryRowNormalInput
				digit={0}
				error={errors['auctionDuration']}
				fieldName={'auctionDuration'}
				hideMaxLabel
				label="Auction Duration"
				onChangeValue={onChangeValue}
				placeholder="Auction Duration"
				symbol="hours"
				tooltip="The auction duration refers to the length of time that an auction will run when a position is challenged. It determines how long bidders have to place their bids on the collateral associated with the position."
				value={auctionDuration}
			/>
		</div>
	)
}

export default PositionSummaryForm
