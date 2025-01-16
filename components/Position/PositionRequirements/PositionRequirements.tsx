import React, { useEffect } from 'react'
import { useUserBalance } from 'hooks'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { StepComponentProps } from 'pages/positions/create'

const PositionRequirements: React.FC<StepComponentProps> = ({ onValidationChange }) => {
	const { ofdBalance } = useUserBalance()
	const hasEnoughOFD = ofdBalance >= 1000n

	useEffect(() => {
		onValidationChange(hasEnoughOFD)
	}, [hasEnoughOFD, onValidationChange])

	return (
		<div className="space-y-8">
			<h1 className="text-2xl font-semibold text-center mb-8">Ready to open a Position?</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Wallet Balance Card */}
				<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-lg p-6 h-64 flex flex-col">
					<div className="flex-1">
						<h2 className="text-xl font-medium mb-4">Wallet Balance:</h2>
						<p className="text-gray-300">
							1000 OFD ready in your wallet – this amount is required to cover the cost of opening a position.
						</p>
					</div>
					<div className="flex items-center justify-between border-t border-gray-700 pt-4">
						{hasEnoughOFD ? (
							<div className="flex items-center text-green-500 gap-2">
								<FontAwesomeIcon icon={faCircleCheck} size="lg" />
								<span>Sufficient OFD balance</span>
							</div>
						) : (
							<Link className="text-red-600 hover:text-red-700 underline flex items-center gap-2" href="/swap">
								<FontAwesomeIcon icon={faCircleXmark} size="lg" />
								Not enough OFD. Buy OFD with USDT
							</Link>
						)}
					</div>
				</div>

				{/* Collateral Card */}
				<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-lg p-6 h-64">
					<h2 className="text-xl font-medium mb-4">Collateral:</h2>
					<p className="text-gray-300">
						At least 3,500 OFD worth of collateral is needed to secure your position. This collateral acts as security for the amount
						you&apos;ll mint, allowing you to leverage your assets safely.
					</p>
				</div>
			</div>
		</div>
	)
}

export default PositionRequirements
