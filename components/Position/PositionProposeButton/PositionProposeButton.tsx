import React from 'react'
import GuardToAllowedChainBtn from 'components/Guards/GuardToAllowedChainBtn'
import Button from 'components/Button'
import { usePositionFormContext } from 'contexts/position'
import { useOpenPosition } from './hooks/useOpenPosition'

const PositionProposeButton: React.FC<{ disabled: boolean, onSuccess: () => void }> = ({ disabled, onSuccess }) => {
	const { collTokenData, form} = usePositionFormContext()
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

	const handleOpenPosition = async () => {
		try {
		  const success = await openPosition()
		  if (success) {
			onSuccess()
		  }
		} catch (error) {
		  console.error('Failed to open position:', error)
		  // Error handling is already done via toast in useWriteContractWithToast
		}
	}

	return (
		<div className="mx-auto w-72 max-w-full flex-col">
			<GuardToAllowedChainBtn>
				<Button
					disabled={disabled}
					isLoading={openingPosition}
					onClick={handleOpenPosition}
					variant="primary"
				>
					Propose Position
				</Button>
			</GuardToAllowedChainBtn>
		</div>
	)
}

export default PositionProposeButton
