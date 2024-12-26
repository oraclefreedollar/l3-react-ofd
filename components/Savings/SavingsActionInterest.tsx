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
	balance: bigint
	interest: bigint
	disabled?: boolean
	setLoaded?: (val: boolean) => Dispatch<SetStateAction<boolean>>
}

export default function SavingsActionInterest({ balance, interest, disabled, setLoaded }: Props) {
	const [isAction, setAction] = useState<boolean>(false)
	const [isHidden, setHidden] = useState<boolean>(false)
	const account = useAccount()
	const chainId = useChainId()

	const handleOnClick = async () => {
		if (!account.address) return

		try {
			setAction(true)
			/**
			 * @dev: checkout if you want to return back to "claim" into savings account, aka reinvest via SC function "refreshMyBalance"
			 * https://github.com/Frankencoin-ZCHF/frankencoin-dapp/blob/b1356dc0e45157b0e65b20fef019af00e5126653/components/PageSavings/SavingsActionInterest.tsx
			 */
			const writeHash = await writeContract(WAGMI_CONFIG, {
				address: ADDRESS[chainId].savings,
				abi: ABIS.SavingsABI,
				functionName: 'adjust',
				args: [balance],
			})

			const toastContent = [
				{
					title: `Saved amount: `,
					value: `${formatCurrency(formatUnits(balance, 18))} OFD`,
				},
				{
					title: `Claim Interest: `,
					value: `${formatCurrency(formatUnits(interest, 18))} OFD`,
				},
				{
					title: 'Transaction: ',
					hash: writeHash,
				},
			]

			await toast.promise(waitForTransactionReceipt(WAGMI_CONFIG, { hash: writeHash, confirmations: 1 }), {
				pending: {
					render: <TxToast rows={toastContent} title={`Claiming Interest...`} />,
				},
				success: {
					render: <TxToast rows={toastContent} title="Successfully claimed" />,
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