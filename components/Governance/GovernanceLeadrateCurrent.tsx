import { formatCurrency } from 'utils/format'
import GuardToAllowedChainBtn from 'components/Guards/GuardToAllowedChainBtn'
import Button from 'components/Button'
import NormalInput from 'components/Input/NormalInput'
import AppCard from 'components/AppCard'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { ADDRESS, ABIS } from 'contracts'
import { useWriteContractWithToast } from 'hooks'
import { toast } from 'react-toastify'
import { useTranslation } from 'next-i18next'
import { useLeadrateInfo } from 'store/savings'

const namespaces = ['common', 'governance']

const GovernanceLeadrateCurrent: React.FC = () => {
	const { t } = useTranslation(namespaces)

	const account = useAccount()
	const chainId = useChainId()
	const info = useLeadrateInfo()

	const [newRate, setNewRate] = useState<number>(info.rate || 0)
	const [isHidden, setHidden] = useState<boolean>(false)
	const [isDisabled, setDisabled] = useState<boolean>(true)

	const toastContent = useMemo(
		() => [
			{
				title: t('common:toasts:governance:leadrate:title1'),
				value: `${formatCurrency(info.rate / 10000)}%`,
			},
			{
				title: t('common:toasts:governance:leadrate:title2'),
				value: `${formatCurrency(newRate / 10000)}%`,
			},
		],
		[info.rate, newRate, t]
	)

	const { loading: isHandling, writeFunction: handleOnClick } = useWriteContractWithToast({
		contractParams: {
			abi: ABIS.SavingsABI,
			address: ADDRESS[chainId].savings,
			args: [newRate, []],
			functionName: 'proposeChange',
		},
		toastPending: {
			title: t('common:toasts:governance:leadrate:pending'),
			rows: toastContent,
		},
		toastSuccess: {
			title: t('common:toasts:governance:leadrate:success'),
			rows: toastContent,
		},
	})

	const onClick = useCallback(async () => {
		if (!account.address) {
			toast.error(t('common:connectWallet'))
			return
		}

		const success = await handleOnClick()
		setHidden(success)
	}, [account.address, handleOnClick, t])

	const changeNewRate = useCallback((value: string) => {
		// Handle empty or invalid input
		if (!value || value === '') {
			setNewRate(0)
			return
		}

		// Parse the value and handle invalid numbers
		const n = parseFloat(value)
		if (isNaN(n)) {
			setNewRate(0)
		} else {
			setNewRate(n)
		}
	}, [])

	useEffect(() => {
		if (newRate != info.rate) setDisabled(false)
		else setDisabled(true)
	}, [newRate, info.rate])

	if (!info) return null

	return (
		<AppCard>
			<div className="grid gap-8 md:grid-cols-2 md:px-12 md:py-4 max-md:grid-cols-1 max-md:p-4">
				<div className="flex flex-col gap-4">
					<NormalInput
						digit={4}
						label={t('governance:leadrate:form:label')}
						onChange={(v) => changeNewRate(v)}
						placeholder={t('governance:leadrate:form:placeholder')}
						symbol="%"
						value={newRate === 0 ? '' : newRate.toString()}
					/>
				</div>

				<div className="md:mt-8 md:px-16">
					<GuardToAllowedChainBtn>
						<Button className="max-md:h-10 md:h-12" disabled={isDisabled || isHidden} isLoading={isHandling} onClick={onClick}>
							{t('governance:leadrate:button')}
						</Button>
					</GuardToAllowedChainBtn>
				</div>
			</div>
		</AppCard>
	)
}

export default GovernanceLeadrateCurrent
