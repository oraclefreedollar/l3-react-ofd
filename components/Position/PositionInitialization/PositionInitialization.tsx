import React, { useCallback, useEffect } from 'react'
import TokenInput from 'components/Input/TokenInput'
import NormalInput from 'components/Input/NormalInput'
import Link from 'next/link'
import { usePositionFormContext } from 'contexts/position'
import { useTranslation } from 'next-i18next'
import { CoinTicker } from 'meta/coins'

type Props = {
	userBalanceOFD: bigint
	onValidationChange: (isValid: boolean) => void
}

const PositionInitialization: React.FC<Props> = (props: Props) => {
	const { userBalanceOFD, onValidationChange } = props

	const { t } = useTranslation(['positionCreate', 'common'])

	const { form, errors, handleChange } = usePositionFormContext()

	const onChangeInitialCollAmount = useCallback(
		(value: string) => {
			const valueBigInt = BigInt(value)
			handleChange('initialCollAmount', valueBigInt)
		},
		[handleChange]
	)

	const onChangeInitPeriod = useCallback(
		(value: string) => {
			const valueBigInt = BigInt(value)
			handleChange('initPeriod', valueBigInt)
		},
		[handleChange]
	)

	useEffect(() => {
		const isValid = Boolean(
			form.initialCollAmount > 0n && form.initPeriod > 0n && form.initPeriod >= 5n && userBalanceOFD >= BigInt(1000 * 1e18)
		)
		onValidationChange(isValid)
	}, [form.initialCollAmount, form.initPeriod, onValidationChange, userBalanceOFD])

	return (
		<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8 flex flex-col border border-purple-500/50 gap-y-4">
			<div className="text-lg font-bold justify-center mt-3 flex">{t('positionCreate:initialization:section:title')}</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
				<TokenInput
					digit={18}
					disabled
					error={userBalanceOFD < BigInt(1000 * 1e18) ? t('positionCreate:initialization:section:proposalFeeError') : ''}
					hideMaxLabel
					label={t('positionCreate:initialization:section:proposalFeeLabel')}
					onChange={onChangeInitialCollAmount}
					symbol={CoinTicker.OFD}
					tooltip={t('common:tooltips:position:create:proposalFee')}
					value={BigInt(1000 * 1e18).toString()}
				/>
				<NormalInput
					digit={0}
					error={errors['initPeriod']}
					hideMaxLabel
					label={t('positionCreate:initialization:section:initPeriodLabel')}
					onChange={onChangeInitPeriod}
					placeholder={t('positionCreate:initialization:section:initPeriodLabel')}
					symbol={t('common:days')}
					tooltip={t('common:tooltips:position:create:initPeriod')}
					value={form.initPeriod.toString()}
				/>
			</div>
			<div>
				{t('positionCreate:initialization:section:discuss:description1')}
				<Link href="https://github.com/oracleFreeDollar-OFD/oracleFreeDollar/discussions" target="_blank">
					{t('positionCreate:initialization:section:discuss:title')}
				</Link>
				{t('positionCreate:initialization:section:discuss:description2')}
			</div>
		</div>
	)
}

export default PositionInitialization
