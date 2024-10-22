import React from 'react'
import AddressInput from 'components/Input/AddressInput'
import Button from 'components/Button'
import TokenInput from 'components/Input/TokenInput'
import { PositionCollateralTokenData } from 'meta/positions'
import { RefetchType } from 'utils'
import { useApproveCollateral } from './hooks/useApproveCollateral'

type Props = {
	collTokenAddrError: string
	collateralAddress: string
	collTokenData: PositionCollateralTokenData
	initialCollAmount: bigint
	initialCollAmountError: string
	onChangeInitialCollAmount: (value: string) => void
	minCollAmount: bigint
	minCollAmountError: string
	onChangeCollateralAddress: (addr: string) => void
	onChangeMinCollAmount: (value: string) => void
	showApproveButton: boolean
	userBalanceRefetch: RefetchType
}

const PositionProposeCollateral: React.FC<Props> = (props) => {
	const {
		collTokenAddrError,
		collateralAddress,
		collTokenData,
		initialCollAmount,
		initialCollAmountError,
		onChangeInitialCollAmount,
		minCollAmount,
		minCollAmountError,
		onChangeCollateralAddress,
		onChangeMinCollAmount,
		showApproveButton,
		userBalanceRefetch,
	} = props

	const { approve, approving } = useApproveCollateral({ collTokenData, userBalanceRefetch })

	return (
		<div className="bg-slate-950 rounded-xl p-4 flex flex-col gap-y-4">
			<div className="text-lg font-bold justify-center mt-3 flex">Collateral</div>

			<AddressInput
				error={collTokenAddrError}
				label="Collateral Token"
				onChange={onChangeCollateralAddress}
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
				error={minCollAmountError}
				hideMaxLabel
				label="Minimum Collateral"
				onChange={onChangeMinCollAmount}
				placeholder="Minimum Collateral Amount"
				symbol={collTokenData.symbol}
				value={minCollAmount.toString()}
			/>
			<TokenInput
				digit={collTokenData.decimals}
				error={initialCollAmountError}
				label="Initial Collateral"
				max={collTokenData.balance}
				onChange={onChangeInitialCollAmount}
				placeholder="Initial Collateral Amount"
				symbol={collTokenData.symbol}
				value={initialCollAmount.toString()}
			/>
		</div>
	)
}

export default PositionProposeCollateral
