import React, { useEffect } from 'react'
import PositionSummaryForm from 'components/Position/PositionSummary/PositionSummaryForm'

type Props = {
	onValidationChange: (isValid: boolean) => void
}

const PositionSummary: React.FC<Props> = (props: Props) => {
	const { onValidationChange } = props

	useEffect(() => {
		onValidationChange(true)
	}, [onValidationChange])

	return (
		<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8 flex flex-col border border-purple-500/50">
			<div className="text-xl font-bold text-center mb-6">Position Summary</div>

			<PositionSummaryForm />
			{/*	TODO: add PositionSummaryOutcome section */}

			<div className="mt-6 text-sm text-gray-400 text-center">
				Please review all details carefully before proceeding with the position creation.
			</div>
		</div>
	)
}

export default PositionSummary
