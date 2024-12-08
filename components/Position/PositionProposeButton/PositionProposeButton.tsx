import React from 'react'
import GuardToAllowedChainBtn from 'components/Guards/GuardToAllowedChainBtn'
import Button from 'components/Button'
import { usePositionFormContext } from 'contexts/position'
import { useOpenPosition } from './hooks/useOpenPosition'

const PositionProposeButton: React.FC = () => {
	const { collTokenData, form, hasFormError } = usePositionFormContext()
	const { auctionDuration, buffer, initialCollAmount, interest, limitAmount, liqPrice, initPeriod, maturity, minCollAmount } = form

	const { openPosition, openingPosition } = useOpenPosition({
		auctionDuration,
		buffer,
		collTokenData,
		initPeriod,
		initialCollAmount,
		interest,
		limitAmount,
		liqPrice,
		maturity,
		minCollAmount,
	})

	return (
		<div className="mx-auto mt-8 w-72 max-w-full flex-col">
			<GuardToAllowedChainBtn>
				<Button
					disabled={minCollAmount == 0n || collTokenData.allowance < initialCollAmount || initialCollAmount == 0n || hasFormError}
					isLoading={openingPosition}
					onClick={openPosition}
					variant="primary"
				>
					Propose Position
				</Button>
			</GuardToAllowedChainBtn>
		</div>
	)
}

export default PositionProposeButton
