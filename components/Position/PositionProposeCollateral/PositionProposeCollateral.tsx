import React, { useCallback, useEffect, useMemo } from 'react'
import AddressInput from 'components/Input/AddressInput'
import Button from 'components/Button'
import TokenInput from 'components/Input/TokenInput'
import { RefetchType } from 'utils'
import { useApproveCollateral } from './hooks/useApproveCollateral'
import { usePositionFormContext } from 'contexts/position'
import { useTokenData } from 'hooks'
import { PositionCreateFormState } from 'contexts/position/types'

type Props = {
  userBalanceRefetch: RefetchType
  onValidationChange: (isValid: boolean) => void
}

const PositionProposeCollateral: React.FC<Props> = (props) => {
  const { userBalanceRefetch, onValidationChange } = props

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
    onValidationChange
  ])

  return (
    <div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8 flex flex-col border border-purple-500/50 gap-y-4">
      <div className="text-lg font-bold justify-center mt-3 flex">Collateral</div>

      <AddressInput
        error={errors['collateralAddress']}
        label="Which token do you want to use as collateral?"
        onChange={(value) => handleChange('collateralAddress', value)}
        placeholder="Token contract address"
        tooltip="The token contract address of the collateral is inserted here"
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
        tooltip="The minimum amount of collateral that must be deposited. If the amount is less than this, the position will not be created."
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
        tooltip="The amount of collateral that you want to deposit into the position. This amount must be greater than the minimum collateral amount."
        value={initialCollAmount.toString()}
      />
    </div>
  )
}

export default PositionProposeCollateral