import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import Button from 'components/Button'
import ReactConfetti from 'react-confetti'
import { useTranslation } from 'next-i18next'

const PositionSuccess: React.FC = () => {
	const { t } = useTranslation()

	const [dimensions, setDimensions] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	})
	const [showConfetti, setShowConfetti] = useState(true)

	useEffect(() => {
		const handleResize = () => {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			})
		}

		window.addEventListener('resize', handleResize)

		// Stop confetti after 5 seconds
		const timer = setTimeout(() => setShowConfetti(false), 5000)

		return () => {
			window.removeEventListener('resize', handleResize)
			clearTimeout(timer)
		}
	}, [])

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50">
			{/* Background overlay with blur */}
			<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

			{/* Confetti */}
			{showConfetti && (
				<ReactConfetti
					colors={['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']}
					gravity={0.2}
					height={dimensions.height}
					numberOfPieces={200}
					recycle={false}
					width={dimensions.width}
				/>
			)}

			{/* Success modal */}
			<div className="relative bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-700 transform transition-all duration-300 ease-out scale-100 opacity-100">
				<div className="flex flex-col items-center text-center">
					<div className="mb-4">
						<FontAwesomeIcon className="text-green-500" icon={faCircleCheck} size="lg" />
					</div>

					<h3 className="text-2xl font-bold text-white mb-3">{t('pages:position:create:success:title')}</h3>

					<p className="text-gray-300 mb-6">{t('pages:position:create:success:description')}</p>

					<p className="text-gray-300 mb-6">{t('pages:position:create:success:afterApproval')}</p>

					<div className="space-y-3 w-full">
						<Button
							className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
							onClick={() => (window.location.href = '/positions')}
							variant="primary"
						>
							{t('pages:position:create:success:button')}
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PositionSuccess
