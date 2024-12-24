import { Dispatch, SetStateAction, useState } from 'react'
import { waitForTransactionReceipt, writeContract } from 'wagmi/actions'
import { WAGMI_CONFIG } from '../../app.config'
import { toast } from 'react-toastify'
import { formatCurrency } from 'utils/format'
import { renderErrorToast, TxToast } from 'components/TxToast'
import { useAccount, useChainId } from 'wagmi'
import Button from 'components/Button'
import { formatUnits } from 'viem'
import { ADDRESS, ABIS } from 'contracts'

interface Props {
	amount: bigint
	interest: bigint
	disabled?: boolean
	setLoaded?: (val: boolean) => Dispatch<SetStateAction<boolean>>
}

export default function SavingsActionSave({ amount, interest, disabled, setLoaded }: Props) {
	const [isAction, setAction] = useState<boolean>(false)
	const [isHidden, setHidden] = useState<boolean>(false)
	const account = useAccount()
	const chainId = useChainId()

	const handleOnClick = async () => {
		if (!account.address) return

		try {
			setAction(true)

			const writeHash = await writeContract(WAGMI_CONFIG, {
				address: ADDRESS[chainId].savings,
				abi: ABIS.SavingsABI,
				functionName: 'adjust',
				args: [amount],
			})

			const toastContent = [
				{
					title: `Saving: `,
					value: `${formatCurrency(formatUnits(amount, 18))} OFD`,
				},
				{
					title: `Accured Interest: `,
					value: `${formatCurrency(formatUnits(interest, 18))} OFD`,
				},
				{
					title: 'Transaction: ',
					hash: writeHash,
				},
			]

			await toast.promise(waitForTransactionReceipt(WAGMI_CONFIG, { hash: writeHash, confirmations: 1 }), {
				pending: {
					render: <TxToast rows={toastContent} title={`Increasing savings...`} />,
				},
				success: {
					render: <TxToast rows={toastContent} title="Savings increased" />,
				},
			})

			setHidden(true)
		} catch (error) {
			toast.error(renderErrorToast(error))
		} finally {
			if (setLoaded != undefined) setLoaded(false)
			setAction(false)
		}
	}

	return (
		<Button className="h-10" disabled={isHidden || disabled} isLoading={isAction} onClick={handleOnClick}>
			Adjust
		</Button>
	)
}
