import { useUserBalance } from 'hooks'
import Head from 'next/head'
import AppPageHeader from 'components/AppPageHeader'
import { envConfig } from 'app.env.config'
import React, { useCallback, useState } from 'react'

import { PositionCreateProvider } from 'contexts/position'
import PositionProposeButton from 'components/Position/PositionProposeButton'
import PositionSuccess from 'components/Position/PositionSuccess/PositionSuccess'
import { usePositionCreateSteps } from 'hooks/positions/usePositionCreateSteps'
import { useTranslation } from 'react-i18next'

export interface StepComponentProps {
	userBalanceOFD?: bigint
	userBalanceRefetch?: () => void
	onValidationChange: (isValid: boolean) => void
}

const PositionCreate: React.FC = () => {
	const { t } = useTranslation()
	const userBalance = useUserBalance()

	const [currentStep, setCurrentStep] = useState(0)
	const [isSuccess, setIsSuccess] = useState(false)

	const steps = usePositionCreateSteps()
	const [stepValidation, setStepValidation] = useState<boolean[]>(new Array(steps.length).fill(false))

	const handleValidationChange = useCallback(
		(isValid: boolean) => {
			setStepValidation((prev) => {
				const newValidation = [...prev]
				newValidation[currentStep] = isValid
				return newValidation
			})
		},
		[currentStep]
	)

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
				<title>
					{envConfig.AppName} - {t('pages:position:create:title')}
				</title>
			</Head>
			<div className="space-y-6">
				<AppPageHeader
					backText={t('pages:position:create:header:backText')}
					backTo="/positions"
					title={t('pages:position:create:header:title')}
					tooltip="Propose a completely new position with a collateral of your choice."
				/>

				{/* Step Progress */}
				<div className="w-full">
					<div className="flex items-center justify-between px-4 mb-6">
						<span className="text-sm text-white">
							{t('pages:position:create:stepCounter', { current: currentStep + 1, total: steps.length })}
						</span>
						<span className="text-sm font-medium text-white">{steps[currentStep].title}</span>
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
				<div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-6 ml-6 mr-6">
					<div className="flex flex-col">
						<button
							className={`
				px-4 py-2 rounded-md flex-1 
				${currentStep === 0 ? 'bg-gray-200 text-gray-400' : 'bg-gray-600 text-white hover:bg-gray-700'}
				`}
							disabled={currentStep === 0}
							onClick={handlePrevious}
						>
							{t('pages:position:create:buttons:back')}
						</button>
					</div>

					{currentStep === steps.length - 1 ? (
						<PositionProposeButton onSuccess={handleSuccess} />
					) : (
						<div className="flex justify-center flex-col">
							<button
								className="btn btn-primary px-4 py-2 flex-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
								disabled={!stepValidation[currentStep]}
								onClick={handleNext}
							>
								{t('pages:position:create:buttons:next')}
							</button>
						</div>
					)}
				</div>
			</div>
			{isSuccess && <PositionSuccess />}
		</PositionCreateProvider>
	)
}

export default PositionCreate
