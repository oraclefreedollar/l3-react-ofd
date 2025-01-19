import React, { useCallback, useEffect } from 'react'
import TokenInput from 'components/Input/TokenInput'
import NormalInput from 'components/Input/NormalInput'
import { usePositionFormContext } from 'contexts/position'
import { PositionCreateFormState } from 'contexts/position/types'
import { StepComponentProps } from 'pages/positions/create'

const PositionFinancialTerms: React.FC<StepComponentProps> = ({ onValidationChange }) => {
	const { form, errors, handleChange } = usePositionFormContext()
	const { interest, limitAmount, maturity } = form

	const onChangeValue = useCallback(
		(field: keyof PositionCreateFormState, value: string) => {
			const valueBigInt = BigInt(value)
			handleChange(field, valueBigInt)
		},
		[handleChange]
	)

	useEffect(() => {
		const isValid = Boolean(interest > 0n && limitAmount > 0n && maturity > 0n)
		onValidationChange(isValid)
	}, [interest, limitAmount, maturity, onValidationChange])

	return (
		<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8 flex flex-col border border-purple-500/50 gap-y-4">
			<div className="text-lg font-bold text-center mt-3">Financial Terms</div>
			<TokenInput
				error={errors['limitAmount']}
				hideMaxLabel
				label="Minting Limit"
				onChange={(value) => onChangeValue('limitAmount', value)}
				placeholder="Limit Amount"
				symbol="OFD"
				tooltip="The minting limit refers to the maximum amount of Oracle Free Dollar (OFD) that can be minted against this position and its clones. When you open a new position, this limit is set based on the collateral you provide and the parameters of the position."
				value={limitAmount.toString()}
			/>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
				<NormalInput
					digit={4}
					error={errors['interest']}
					hideMaxLabel
					label="Annual Interest"
					onChange={(value) => onChangeValue('interest', value)}
					placeholder="Annual Interest Percent"
					symbol="%"
					tooltip="The annual interest is the fee charged upfront when you open a new position to mint Oracle Free Dollar (OFD). This interest is calculated based on the amount you wish to mint and is typically set by the user. The fee is paid for the entire duration of the position, which can be adjusted based on the maturity period you choose (e.g., 6 months, 12 months)."
					value={interest.toString()}
				/>
				<NormalInput
					digit={0}
					error={errors['maturity']}
					hideMaxLabel
					label="Maturity"
					onChange={(value) => onChangeValue('maturity', value)}
					placeholder="Maturity"
					symbol="months"
					tooltip="The maturity refers to the duration for which the position is set when opening a new position to mint Oracle Free Dollar (OFD). It defines the time period until the position expires, which can be set between today and the limit date (one year from the date the parent position was minted).The maturity period affects the annual interest charged, as shorter maturities will result in a different final interest amount."
					value={maturity.toString()}
				/>
			</div>
		</div>
	)
}

export default PositionFinancialTerms
