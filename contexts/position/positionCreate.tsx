import React, { Context, createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useOnUpdate, useTokenData } from 'hooks'
import { initialFormState, PositionCreateFormState } from './types'
import { validationRules } from './validations'
import { PositionCollateralTokenData } from 'meta/positions'

type PositionFormContextType = {
	collTokenData: PositionCollateralTokenData
	errors: Record<string, string>
	form: PositionCreateFormState
	handleChange: (field: keyof PositionCreateFormState, value: string | bigint) => void
	hasFormError: boolean
}

const PositionFormContext = createContext<PositionFormContextType | null>(null)

export const usePositionFormContext = () => useContext<PositionFormContextType>(PositionFormContext as Context<PositionFormContextType>)

export const PositionCreateProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [form, setForm] = useState<PositionCreateFormState>(initialFormState)

	const [errors, setErrors] = useState({})
	const collTokenData = useTokenData(form.collateralAddress)

	const handleChange = useCallback((field: keyof PositionCreateFormState, value: string | bigint) => {
		setForm((prev) => ({
			...prev,
			[field]: value || BigInt(value),
		}))
	}, [])

	// Validate the specific field
	useEffect(() => {
		Object.keys(form).forEach((field) => {
			const fieldKey = field as keyof PositionCreateFormState
			if (form[fieldKey] === initialFormState[fieldKey]) return

			const error = validationRules[fieldKey]?.({ form, collTokenData })
			setErrors((prevErrors) => ({
				...prevErrors,
				[field]: error,
			}))
		})
	}, [collTokenData, form])

	useOnUpdate(() => {
		if (form.collateralAddress) {
			collTokenData.refetch()
		}
	}, [form.collateralAddress])

	// Check if any form errors exist
	const hasFormError = useMemo(() => {
		return Object.values(errors).some((error) => error)
	}, [errors])

	const value: PositionFormContextType = {
		collTokenData,
		errors,
		form,
		handleChange,
		hasFormError,
	}

	return <PositionFormContext.Provider value={value}>{children}</PositionFormContext.Provider>
}
