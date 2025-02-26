import React, { useCallback, useEffect, useMemo } from 'react'
import AddressInput from 'components/Input/AddressInput'
import Button from 'components/Button'
import TokenInput from 'components/Input/TokenInput'
import { RefetchType } from 'utils'
import { useApproveCollateral } from './hooks/useApproveCollateral'
import { usePositionFormContext } from 'contexts/position'
import { useTokenData } from 'hooks'
import { PositionCreateFormState } from 'contexts/position/types'
import { useTranslation } from 'next-i18next'

type Props = {
	userBalanceRefetch: RefetchType
	onValidationChange: (isValid: boolean) => void
}

const PositionProposeCollateral: React.FC<Props> = (props) => {
	const { userBalanceRefetch, onValidationChange } = props

	const { t } = useTranslation(['positionCreate', 'common'])

	const { form, errors, handleChange } = usePositionFormContext()
	const { collateralAddress, initialCollAmount, minCollAmount } = form

	const collTokenData = useTokenData(form.collateralAddress)
	const { approve, approving } = useApproveCollateral({ collTokenData, initialCollAmount, userBalanceRefetch })

	const showApproveButton = useMemo(
		() =>
			collTokenData.symbol != 'NaN' &&
			(collTokenData.allowance == 0n || collTokenData.allowance < minCollAmount || collTokenData.allowance < initialCollAmount),
		[collTokenData.allowance, collTokenData.symbol, initialCollAmount, minCollAmount]
	)

	const onChangeValue = useCallback(
		(field: keyof PositionCreateFormState, value: string) => {
			const valueBigInt = BigInt(value)
			handleChange(field, valueBigInt)
		},
		[handleChange]
	)

	// Validation checks
	useEffect(() => {
		const isValid = Boolean(
			collateralAddress &&
				collTokenData.symbol !== 'NaN' &&
				minCollAmount > 0n &&
				initialCollAmount > 0n &&
				initialCollAmount >= minCollAmount &&
				initialCollAmount <= collTokenData.balance &&
				collTokenData.allowance >= initialCollAmount &&
				!errors['collateralAddress'] &&
				!errors['minCollAmount'] &&
				!errors['initialCollAmount']
		)

		onValidationChange(isValid)
	}, [
		collateralAddress,
		collTokenData.symbol,
		collTokenData.balance,
		collTokenData.allowance,
		minCollAmount,
		initialCollAmount,
		errors,
		onValidationChange,
	])

	return (
		<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8 flex flex-col border border-purple-500/50 gap-y-4">
			<div className="text-lg font-bold justify-center mt-3 flex">{t('positionCreate:collateral:title')}</div>

			<AddressInput
				error={errors['collateralAddress']}
				label={t('positionCreate:collateral:addressLabel')}
				onChange={(value) => handleChange('collateralAddress', value)}
				placeholder={t('positionCreate:collateral:addressPlaceholder')}
				tooltip={t('common:tooltips:position:create:collateralAddress')}
				value={collateralAddress}
			/>
			{showApproveButton && (
				<Button
					disabled={
						collTokenData.symbol == 'NaN' || (collTokenData.allowance > minCollAmount && collTokenData.allowance > initialCollAmount)
					}
					isLoading={approving}
					onClick={approve}
				>
					{t('positionCreate:collateral:approveButton', {
						symbol: collTokenData.symbol == 'NaN' ? '' : 'Handling of ' + collTokenData.symbol,
					})}
				</Button>
			)}
			<TokenInput
				digit={collTokenData.decimals}
				error={errors['minCollAmount']}
				hideMaxLabel
				label={t('positionCreate:collateral:minCollateral')}
				onChange={(value) => onChangeValue('minCollAmount', value)}
				placeholder={t('positionCreate:collateral:minCollateralPlaceholder')}
				symbol={collTokenData.symbol}
				tooltip={t('common:tooltips:position:create:minCollateral')}
				value={minCollAmount.toString()}
			/>
			<TokenInput
				digit={collTokenData.decimals}
				error={errors['initialCollAmount']}
				label={t('positionCreate:collateral:initialCollateral')}
				max={collTokenData.balance}
				onChange={(value) => onChangeValue('initialCollAmount', value)}
				placeholder={t('positionCreate:collateral:initialCollateralPlaceholder')}
				symbol={collTokenData.symbol}
				tooltip={t('common:tooltips:position:create:initialCollateral')}
				value={initialCollAmount.toString()}
			/>
		</div>
	)
}

export default PositionProposeCollateral
