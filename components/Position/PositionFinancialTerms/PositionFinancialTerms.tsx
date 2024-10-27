import React, { useCallback } from 'react'
import TokenInput from 'components/Input/TokenInput'
import NormalInput from 'components/Input/NormalInput'
import { usePositionCreate } from 'contexts/position'
import { PositionCreateFormState } from 'contexts/position/types'

const PositionFinancialTerms: React.FC = () => {
	const { form, errors, handleChange } = usePositionCreate()
	const { interest, limitAmount, maturity } = form

	const onChangeValue = useCallback(
		(field: keyof PositionCreateFormState, value: string) => {
			const valueBigInt = BigInt(value)
			handleChange(field, valueBigInt)
		},
		[handleChange]
	)

	return (
		<div className="bg-slate-950 rounded-xl p-4 flex flex-col gap-y-4">
			<div className="text-lg font-bold text-center mt-3">Financial Terms</div>
			<TokenInput
				error={errors['limitAmount']}
				hideMaxLabel
				label="Minting Limit"
				onChange={(value) => onChangeValue('limitAmount', value)}
				placeholder="Limit Amount"
				symbol="OFD"
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
					value={interest.toString()}
				/>
				<NormalInput
					digit={0}
					hideMaxLabel
					label="Maturity"
					onChange={(value) => onChangeValue('maturity', value)}
					placeholder="Maturity"
					symbol="months"
					value={maturity.toString()}
				/>
			</div>
		</div>
	)
}

export default PositionFinancialTerms
