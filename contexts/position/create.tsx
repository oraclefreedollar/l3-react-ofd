import React, { Context, createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useTokenData } from 'hooks'
import { initialFormState, PositionCreateFormState } from './types'
import { validationRules } from './validations'
import { PositionCollateralTokenData } from 'meta/positions'

type PositionCreateContext = {
	collTokenData: PositionCollateralTokenData
	errors: Record<string, string>
	form: PositionCreateFormState
	handleChange: (field: keyof PositionCreateFormState, value: string | bigint) => void
	hasFormError: boolean
}

const PositionContext = createContext<PositionCreateContext | null>(null)

export const usePositionCreate = () => useContext<PositionCreateContext>(PositionContext as Context<PositionCreateContext>)

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

	// Check if any form errors exist
	const hasFormError = useMemo(() => {
		return Object.values(errors).some((error) => error)
	}, [errors])

	const value: PositionCreateContext = {
		collTokenData,
		errors,
		form,
		handleChange,
		hasFormError,
	}

	return <PositionContext.Provider value={value}>{children}</PositionContext.Provider>
}
