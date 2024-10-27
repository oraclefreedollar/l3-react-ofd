import React, { useCallback, useMemo } from 'react'
import AddressInput from 'components/Input/AddressInput'
import Button from 'components/Button'
import TokenInput from 'components/Input/TokenInput'
import { RefetchType } from 'utils'
import { useApproveCollateral } from './hooks/useApproveCollateral'
import { usePositionCreate } from 'contexts/position'
import { useTokenData } from 'hooks'
import { PositionCreateFormState } from 'contexts/position/types'

type Props = {
	userBalanceRefetch: RefetchType
}

const PositionProposeCollateral: React.FC<Props> = (props) => {
	const { userBalanceRefetch } = props

	const { form, errors, handleChange } = usePositionCreate()
	const { collateralAddress, initialCollAmount, minCollAmount } = form

	const collTokenData = useTokenData(form.collateralAddress)
	const { approve, approving } = useApproveCollateral({ collTokenData, userBalanceRefetch })

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

	return (
		<div className="bg-slate-950 rounded-xl p-4 flex flex-col gap-y-4">
			<div className="text-lg font-bold justify-center mt-3 flex">Collateral</div>

			<AddressInput
				error={errors['collateralAddress']}
				label="Collateral Token"
				onChange={(value) => handleChange('collateralAddress', value)}
				placeholder="Token contract address"
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
					Approve {collTokenData.symbol == 'NaN' ? '' : 'Handling of ' + collTokenData.symbol}
				</Button>
			)}
			<TokenInput
				digit={collTokenData.decimals}
				error={errors['minCollAmount']}
				hideMaxLabel
				label="Minimum Collateral"
				onChange={(value) => onChangeValue('minCollAmount', value)}
				placeholder="Minimum Collateral Amount"
				symbol={collTokenData.symbol}
				value={minCollAmount.toString()}
			/>
			<TokenInput
				digit={collTokenData.decimals}
				error={errors['initialCollAmount']}
				label="Initial Collateral"
				max={collTokenData.balance}
				onChange={(value) => onChangeValue('initialCollAmount', value)}
				placeholder="Initial Collateral Amount"
				symbol={collTokenData.symbol}
				value={initialCollAmount.toString()}
			/>
		</div>
	)
}

export default PositionProposeCollateral
