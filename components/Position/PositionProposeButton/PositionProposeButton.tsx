import React from 'react'
import GuardToAllowedChainBtn from 'components/Guards/GuardToAllowedChainBtn'
import Button from 'components/Button'
import { usePositionFormContext } from 'contexts/position'
import { useOpenPosition } from './hooks/useOpenPosition'
import { useTranslation } from 'next-i18next'

const PositionProposeButton: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
	const { t } = useTranslation()

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
		<div className="max-w-full flex-col">
			<GuardToAllowedChainBtn>
				<Button disabled={hasFormError} isLoading={openingPosition} onClick={handleOpenPosition} variant="primary">
					{t('pages:position:create:buttons:propose')}
				</Button>
			</GuardToAllowedChainBtn>
		</div>
	)
}

export default PositionProposeButton
