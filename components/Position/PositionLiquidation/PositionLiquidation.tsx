import React, { useCallback } from 'react'
import TokenInput from 'components/Input/TokenInput'
import NormalInput from 'components/Input/NormalInput'
import { usePositionCreate } from 'contexts/position'
import { PositionCreateFormState } from 'contexts/position/types'

const PositionLiquidation: React.FC = () => {
	const { collTokenData, form, errors, handleChange } = usePositionCreate()
	const { auctionDuration, buffer, liqPrice, minCollAmount } = form

	const onChangeValue = useCallback(
		(field: keyof PositionCreateFormState, value: string) => {
			const valueBigInt = BigInt(value)
			handleChange(field, valueBigInt)
		},
		[handleChange]
	)

	return (
		<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8 flex flex-col border border-purple-500/50 gap-y-4">
			<div className="text-lg font-bold text-center mt-3">Liquidation</div>
			<TokenInput
				balanceLabel="Pick"
				digit={36n - collTokenData.decimals}
				error={errors['liqPrice']}
				hideMaxLabel={minCollAmount == 0n}
				label="Liquidation Price"
				max={minCollAmount == 0n ? 0n : (5000n * 10n ** 36n + minCollAmount - 1n) / minCollAmount}
				onChange={(value) => onChangeValue('liqPrice', value)}
				placeholder="Price"
				symbol="OFD"
				value={liqPrice.toString()}
			/>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
				<NormalInput
					digit={4}
					error={errors['buffer']}
					hideMaxLabel
					label="Retained Reserve"
					onChange={(value) => onChangeValue('buffer', value)}
					placeholder="Percent"
					symbol="%"
					value={buffer.toString()}
				/>
				<NormalInput
					digit={0}
					error={errors['auctionDuration']}
					hideMaxLabel
					label="Auction Duration"
					onChange={(value) => onChangeValue('auctionDuration', value)}
					placeholder="Auction Duration"
					symbol="hours"
					value={auctionDuration.toString()}
				/>
			</div>
		</div>
	)
}

export default PositionLiquidation
