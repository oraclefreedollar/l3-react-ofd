import { useUserBalance } from 'hooks'
import Head from 'next/head'
import AppPageHeader from 'components/AppPageHeader'
import { envConfig } from 'app.env.config'
import React, { useState, useCallback } from 'react'

import { PositionCreateProvider } from 'contexts/position'
import PositionInitialization from 'components/Position/PositionInitialization'
import PositionProposeCollateral from 'components/Position/PositionProposeCollateral'
import PositionFinancialTerms from 'components/Position/PositionFinancialTerms'
import PositionLiquidation from 'components/Position/PositionLiquidation'
import PositionProposeButton from 'components/Position/PositionProposeButton'
import PositionRequirements from 'components/Position/PositionRequirements/PositionRequirements'
import PositionSuccess from 'components/Position/PositionSuccess/PositionSuccess'
import PositionSummary from 'components/Position/PositionSummary/PositionSummary'

export interface StepComponentProps {
	userBalanceOFD?: bigint
	userBalanceRefetch?: () => void
	onValidationChange: (isValid: boolean) => void
}

const steps = [
	{
		id: 'requirements',
		title: 'Requirements',
		component: PositionRequirements
	},
	{
		id: 'collateral',
		title: 'Collateral',
		component: PositionProposeCollateral
	},
	{
		id: 'initialization',
		title: 'Position Details',
		component: PositionInitialization
	},
	{
		id: 'financial',
		title: 'Financial Terms',
		component: PositionFinancialTerms
	},
	{
		id: 'liquidation',
		title: 'Liquidation Settings',
		component: PositionLiquidation
	},
	{
		id: 'summary',
		title: 'Summary',
		component: PositionSummary
	}
]

const PositionCreate: React.FC = () => {
	const userBalance = useUserBalance()
	const [currentStep, setCurrentStep] = useState(0)
	const [isSuccess, setIsSuccess] = useState(false)
	const [stepValidation, setStepValidation] = useState<boolean[]>(
		new Array(steps.length).fill(false)
	)

	const handleValidationChange = useCallback((isValid: boolean) => {
		setStepValidation(prev => {
			const newValidation = [...prev]
			newValidation[currentStep] = isValid
			return newValidation
		})
	}, [currentStep])

	const handleSuccess = () => {
		setIsSuccess(true)
	}

	const handleNext = () => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1)
		}
	}

	const handlePrevious = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1)
		}
	}

	const CurrentStepComponent = steps[currentStep].component

	return (
		<PositionCreateProvider>
			<Head>
				<title>{envConfig.AppName} - Propose Position</title>
			</Head>
			<div className="space-y-6">
				<AppPageHeader
					backText="Back to positions"
					backTo="/positions"
					title="Propose New Position Type"
					tooltip="Propose a completely new position with a collateral of your choice."
				/>

				{/* Step Progress */}
				<div className="w-full">
					<div className="flex items-center justify-between px-4 mb-6">
						<span className="text-sm text-white">
							Step {currentStep + 1} of {steps.length}
						</span>
						<span className="text-sm font-medium text-white">
							{steps[currentStep].title}
						</span>
					</div>
					<div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
						<div
							className="absolute h-full bg-gradient-to-r from-blue-600 to-green-500 transition-all duration-300 ease-in-out"
							style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
						/>
					</div>
				</div>

				{/* Current Step Content */}
				<div className="rounded-lg p-6 shadow-sm">
					<CurrentStepComponent
						onValidationChange={handleValidationChange}
						userBalanceOFD={userBalance.ofdBalance}
						userBalanceRefetch={userBalance.refetch}
					/>
				</div>

				{/* Navigation Buttons */}
				<div className="flex justify-between mt-6">
					<button
						className={`
				px-4 py-2 rounded-md
				${currentStep === 0 ? 'bg-gray-200 text-gray-400' : 'bg-gray-600 text-white hover:bg-gray-700'}
				`}
						disabled={currentStep === 0}
						onClick={handlePrevious}
					>
						Back
					</button>

					{currentStep === steps.length - 1 ? (
						<PositionProposeButton disabled={!stepValidation[currentStep]} onSuccess={handleSuccess} />
					) : (
						<button
							className="btn btn-primary px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={!stepValidation[currentStep]}
							onClick={handleNext}
						>
							Next
						</button>
					)}
				</div>
			</div>
			{isSuccess && <PositionSuccess />}
		</PositionCreateProvider>
	)
}

export default PositionCreate