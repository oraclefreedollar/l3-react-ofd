import React, { useCallback, useEffect } from 'react'
import TokenInput from 'components/Input/TokenInput'
import NormalInput from 'components/Input/NormalInput'
import { usePositionFormContext } from 'contexts/position'
import { PositionCreateFormState } from 'contexts/position/types'
import { StepComponentProps } from 'pages/positions/create'
import { useTranslation } from 'react-i18next'
import { CoinTicker } from 'meta/coins'

const PositionFinancialTerms: React.FC<StepComponentProps> = ({ onValidationChange }) => {
	const { t } = useTranslation()

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
			<div className="text-lg font-bold text-center mt-3">{t('pages:position:create:financial:title')}</div>
			<TokenInput
				error={errors['limitAmount']}
				hideMaxLabel
				label={t('pages:position:create:financial:section:limitAmountLabel')}
				onChange={(value) => onChangeValue('limitAmount', value)}
				placeholder={t('pages:position:create:financial:section:limitAmountPlaceholder')}
				symbol={CoinTicker.OFD}
				tooltip={t('common:tooltips:position:create:limitAmount')}
				value={limitAmount.toString()}
			/>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
				<NormalInput
					digit={4}
					error={errors['interest']}
					hideMaxLabel
					label={t('pages:position:create:financial:section:interestLabel')}
					onChange={(value) => onChangeValue('interest', value)}
					placeholder={t('pages:position:create:financial:section:interestPlaceholder')}
					symbol="%"
					tooltip={t('common:tooltips:position:create:interest')}
					value={interest.toString()}
				/>
				<NormalInput
					digit={0}
					error={errors['maturity']}
					hideMaxLabel
					label={t('pages:position:create:financial:section:maturityLabel')}
					onChange={(value) => onChangeValue('maturity', value)}
					placeholder={t('pages:position:create:financial:section:maturityLabel')}
					symbol={t('common:months')}
					tooltip={t('common:tooltips:position:create:maturity')}
					value={maturity.toString()}
				/>
			</div>
		</div>
	)
}

export default PositionFinancialTerms
