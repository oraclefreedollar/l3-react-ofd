import React, { useEffect } from 'react'
import PositionSummaryForm from 'components/Position/PositionSummary/PositionSummaryForm'
import { useTranslation } from 'next-i18next'

type Props = {
	onValidationChange: (isValid: boolean) => void
}

const PositionSummary: React.FC<Props> = (props: Props) => {
	const { onValidationChange } = props
	const { t } = useTranslation()

	useEffect(() => {
		onValidationChange(true)
	}, [onValidationChange])

	return (
		<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8 flex flex-col border border-purple-500/50">
			<div className="text-xl font-bold text-center mb-6">{t('pages:position:create:summary:section:title')}</div>

			<PositionSummaryForm />
			{/*	TODO: add PositionSummaryOutcome section */}

			<div className="mt-6 text-sm text-gray-400 text-center">{t('pages:position:create:summary:section:note')}</div>
		</div>
	)
}

export default PositionSummary
