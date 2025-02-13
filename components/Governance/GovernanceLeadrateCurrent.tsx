import { formatCurrency } from 'utils/format'
import GuardToAllowedChainBtn from 'components/Guards/GuardToAllowedChainBtn'
import Button from 'components/Button'
import NormalInput from 'components/Input/NormalInput'
import AppCard from 'components/AppCard'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { ADDRESS, ABIS } from 'contracts'
import { useWriteContractWithToast } from 'hooks'
import { toast } from 'react-toastify'
import { useLeadrateInfo } from 'store/savings'

interface Props {}

export default function GovernanceLeadrateCurrent({}: Props) {
	const account = useAccount()
	const chainId = useChainId()
	const info = useLeadrateInfo()

	const [newRate, setNewRate] = useState<number>(info.rate || 0)
	const [isHidden, setHidden] = useState<boolean>(false)
	const [isDisabled, setDisabled] = useState<boolean>(true)

	const toastContent = useMemo(
		() => [
			{
				title: `From: `,
				value: `${formatCurrency(info.rate / 10000)}%`,
			},
			{
				title: `Proposing to: `,
				value: `${formatCurrency(newRate / 10000)}%`,
			},
		],
		[info.rate, newRate]
	)

	const { loading: isHandling, writeFunction: handleOnClick } = useWriteContractWithToast({
		contractParams: {
			abi: ABIS.SavingsABI,
			address: ADDRESS[chainId].savings,
			args: [newRate, []],
			functionName: 'proposeChange',
		},
		toastPending: {
			title: 'Proposing rate change...',
			rows: toastContent,
		},
		toastSuccess: {
			title: 'Successfully proposed',
			rows: toastContent,
		},
	})

	const onClick = useCallback(async () => {
		if (!account.address) {
			toast.error('Please connect your wallet')
			return
		}

		const success = await handleOnClick()
		setHidden(success)
	}, [account.address, handleOnClick])

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
						label="Current value"
						onChange={(v) => changeNewRate(v)}
						placeholder={`Current Leadrate: %`}
						symbol="%"
						value={newRate === 0 ? '' : newRate.toString()}
					/>
				</div>

				<div className="md:mt-8 md:px-16">
					<GuardToAllowedChainBtn>
						<Button className="max-md:h-10 md:h-12" disabled={isDisabled || isHidden} isLoading={isHandling} onClick={onClick}>
							Propose Change
						</Button>
					</GuardToAllowedChainBtn>
				</div>
			</div>
		</AppCard>
	)
}
