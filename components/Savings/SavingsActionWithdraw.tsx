import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { formatCurrency } from 'utils/format'
import { useAccount, useChainId } from 'wagmi'
import Button from 'components/Button'
import { formatUnits } from 'viem'
import { ADDRESS, ABIS } from 'contracts'
import { useWriteContractWithToast } from 'hooks'
import { toast } from 'react-toastify'

interface Props {
	balance: bigint
	change: bigint
	disabled?: boolean
	setLoaded?: (val: boolean) => Dispatch<SetStateAction<boolean>>
}

export default function SavingsActionWithdraw({ balance, change, disabled, setLoaded }: Props) {
	const [isHidden, setHidden] = useState<boolean>(false)
	const account = useAccount()
	const chainId = useChainId()

	const toastContent = useMemo(
		() => [
			{
				title: `Saved amount: `,
				value: `${formatCurrency(formatUnits(balance, 18))} OFD`,
			},
			{
				title: `Withdraw: `,
				value: `${formatCurrency(formatUnits(change, 18))} OFD`,
			},
		],
		[balance, change]
	)

	const { loading: isAction, writeFunction: handleOnClick } = useWriteContractWithToast({
		contractParams: {
			address: ADDRESS[chainId].savings,
			abi: ABIS.SavingsABI,
			functionName: 'adjust',
			args: [balance],
		},
		toastPending: {
			title: 'Withdrawing from savings...',
			rows: toastContent,
		},
		toastSuccess: {
			title: 'Successfully withdrawn',
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
		if (setLoaded != undefined) setLoaded(false)
	}, [account.address, handleOnClick, setLoaded])

	return (
		<Button className="h-10" disabled={isHidden || disabled} isLoading={isAction} onClick={onClick}>
			Adjust
		</Button>
	)
}
