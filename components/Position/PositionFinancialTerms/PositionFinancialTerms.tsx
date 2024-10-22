import React from 'react'
import TokenInput from 'components/Input/TokenInput'
import NormalInput from 'components/Input/NormalInput'

type Props = {
	interest: bigint
	interestError: string
	limitAmount: bigint
	limitAmountError: string
	maturity: bigint
	onChangeInterest: (value: string) => void
	onChangeLimitAmount: (value: string) => void
	onChangeMaturity: (value: string) => void
}

const PositionFinancialTerms: React.FC<Props> = (props) => {
	const { interest, interestError, limitAmount, limitAmountError, maturity, onChangeInterest, onChangeLimitAmount, onChangeMaturity } =
		props

	return (
		<div className="bg-slate-950 rounded-xl p-4 flex flex-col gap-y-4">
			<div className="text-lg font-bold text-center mt-3">Financial Terms</div>
			<TokenInput
				error={limitAmountError}
				hideMaxLabel
				label="Minting Limit"
				onChange={onChangeLimitAmount}
				placeholder="Limit Amount"
				symbol="OFD"
				value={limitAmount.toString()}
			/>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
				<NormalInput
					digit={4}
					error={interestError}
					hideMaxLabel
					label="Annual Interest"
					onChange={onChangeInterest}
					placeholder="Annual Interest Percent"
					symbol="%"
					value={interest.toString()}
				/>
				<NormalInput
					digit={0}
					hideMaxLabel
					label="Maturity"
					onChange={onChangeMaturity}
					placeholder="Maturity"
					symbol="months"
					value={maturity.toString()}
				/>
			</div>
		</div>
	)
}

export default PositionFinancialTerms
