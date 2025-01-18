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
				value={maturity}
			/>

			<SummaryRowTokenInput
				balanceLabel="Pick"
				digit={36n - collTokenData.decimals}
				error={errors['liqPrice']}
				fieldName={'limitAmount'}
				hideMaxLabel={minCollAmount == 0n}
				label="Liquidation Price"
				max={minCollAmount == 0n ? 0n : (OPEN_POSITION_FEE + minCollAmount - 1n) / minCollAmount}
				onChangeValue={onChangeValue}
				placeholder="Price"
				symbol="OFD"
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
				value={auctionDuration}
			/>
		</div>
	)
}

export default PositionSummaryForm
