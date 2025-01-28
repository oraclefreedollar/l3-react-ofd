import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { formatCurrency } from 'utils/format'
import { useAccount, useChainId } from 'wagmi'
import Button from 'components/Button'
import { formatUnits } from 'viem'
import { ADDRESS, ABIS } from 'contracts'
import { useWriteContractWithToast } from 'hooks'
import { toast } from 'react-toastify'

interface Props {
	amount: bigint
	interest: bigint
	disabled?: boolean
	setLoaded?: (val: boolean) => Dispatch<SetStateAction<boolean>>
}

export default function SavingsActionSave({ amount, interest, disabled, setLoaded }: Props) {
	const [isHidden, setHidden] = useState<boolean>(false)
	const account = useAccount()
	const chainId = useChainId()

	const toastContent = useMemo(
		() => [
			{
				title: `Saving: `,
				value: `${formatCurrency(formatUnits(amount, 18))} OFD`,
			},
			{
				title: `Accured Interest: `,
				value: `${formatCurrency(formatUnits(interest, 18))} OFD`,
			},
		],
		[amount, interest]
	)

	const { loading: isAction, writeFunction: handleOnClick } = useWriteContractWithToast({
		contractParams: {
			address: ADDRESS[chainId].savings,
			abi: ABIS.SavingsABI,
			functionName: 'adjust',
			args: [amount],
		},
		toastPending: {
			title: 'Increasing savings...',
			rows: toastContent,
		},
		toastSuccess: {
			title: 'Savings increased',
			rows: toastContent,
		},
	})

	const onClick = useCallback(async () => {
		if (!account.address) {
			toast.error('Please connect your wallet')
			return
		}

		const success = await handleOnClick()
		if (setLoaded != undefined) setLoaded(false)
		setHidden(success)
	}, [account.address, handleOnClick, setLoaded])

	return (
		<Button className="h-10" disabled={isHidden || disabled} isLoading={isAction} onClick={onClick}>
			Adjust
		</Button>
	)
}
