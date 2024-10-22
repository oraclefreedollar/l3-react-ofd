import React from 'react'
import TokenInput from 'components/Input/TokenInput'
import NormalInput from 'components/Input/NormalInput'

type Props = {
	auctionDuration: bigint
	auctionError: string
	buffer: bigint
	bufferError: string
	collateralDecimals: bigint
	liqPrice: bigint
	liqPriceError: string
	minCollAmount: bigint
	onChangeAuctionDuration: (value: string) => void
	onChangeBuffer: (value: string) => void
	onChangeLiqPrice: (value: string) => void
}

const PositionLiquidation: React.FC<Props> = (props) => {
	const {
		auctionDuration,
		auctionError,
		buffer,
		bufferError,
		collateralDecimals,
		liqPrice,
		liqPriceError,
		minCollAmount,
		onChangeAuctionDuration,
		onChangeBuffer,
		onChangeLiqPrice,
	} = props

	return (
		<div className="bg-slate-950 rounded-xl p-4 flex flex-col gap-y-4">
			<div className="text-lg font-bold text-center mt-3">Liquidation</div>
			<TokenInput
				balanceLabel="Pick"
				digit={36n - collateralDecimals}
				error={liqPriceError}
				hideMaxLabel={minCollAmount == 0n}
				label="Liquidation Price"
				max={minCollAmount == 0n ? 0n : (5000n * 10n ** 36n + minCollAmount - 1n) / minCollAmount}
				onChange={onChangeLiqPrice}
				placeholder="Price"
				symbol="OFD"
				value={liqPrice.toString()}
			/>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
				<NormalInput
					digit={4}
					error={bufferError}
					hideMaxLabel
					label="Retained Reserve"
					onChange={onChangeBuffer}
					placeholder="Percent"
					symbol="%"
					value={buffer.toString()}
				/>
				<NormalInput
					digit={0}
					error={auctionError}
					hideMaxLabel
					label="Auction Duration"
					onChange={onChangeAuctionDuration}
					placeholder="Auction Duration"
					symbol="hours"
					value={auctionDuration.toString()}
				/>
			</div>
		</div>
	)
}

export default PositionLiquidation
