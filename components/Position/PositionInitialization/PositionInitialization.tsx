import React, { useCallback, useEffect } from 'react'
import TokenInput from 'components/Input/TokenInput'
import NormalInput from 'components/Input/NormalInput'
import Link from 'next/link'
import { usePositionFormContext } from 'contexts/position'
import { useTranslation } from 'react-i18next'
import { CoinTicker } from 'meta/coins'

type Props = {
	userBalanceOFD: bigint
	onValidationChange: (isValid: boolean) => void
}

const PositionInitialization: React.FC<Props> = (props: Props) => {
	const { userBalanceOFD, onValidationChange } = props

	const { t } = useTranslation()

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
			<div className="text-lg font-bold justify-center mt-3 flex">{t('pages:position:create:initialization:section:title')}</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
				<TokenInput
					digit={18}
					disabled
					error={userBalanceOFD < BigInt(1000 * 1e18) ? t('pages:position:create:initialization:section:proposalFeeError') : ''}
					hideMaxLabel
					label={t('pages:position:create:initialization:section:proposalFeeLabel')}
					onChange={onChangeInitialCollAmount}
					symbol={CoinTicker.OFD}
					tooltip="If you open a new position (collateral), you must pay at least 1000 OFD. By the way, existing positions can be created (cloned) without OFD fees."
					value={BigInt(1000 * 1e18).toString()}
				/>
				<NormalInput
					digit={0}
					error={errors['initPeriod']}
					hideMaxLabel
					label={t('pages:position:create:initialization:section:initPeriodLabel')}
					onChange={onChangeInitPeriod}
					placeholder={t('pages:position:create:initialization:section:initPeriodLabel')}
					symbol={t('common:days')}
					tooltip="A proposal (a new position) can be vetoed in the first five days. The minimum period for the community to veto is 5 days. If you want, you can extend the period during which a proposal can be vetoed"
					value={form.initPeriod.toString()}
				/>
			</div>
			<div>
				{t('pages:position:create:initialization:section:discuss:description1')}
				<Link href="https://github.com/oracleFreeDollar-OFD/oracleFreeDollar/discussions" target="_blank">
					{t('pages:position:create:initialization:section:discuss:title')}
				</Link>
				{t('pages:position:create:initialization:section:discuss:description2')}
			</div>
		</div>
	)
}

export default PositionInitialization
