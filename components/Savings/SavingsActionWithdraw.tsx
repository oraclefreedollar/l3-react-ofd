import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { formatCurrency } from 'utils/format'
import { useAccount, useChainId } from 'wagmi'
import Button from 'components/Button'
import { formatUnits } from 'viem'
import { ADDRESS, ABIS } from 'contracts'
import { useWriteContractWithToast } from 'hooks'
import { toast } from 'react-toastify'
import { useTranslation } from 'next-i18next'
import { CoinTicker } from 'meta/coins'

interface Props {
	balance: bigint
	change: bigint
	disabled?: boolean
	setLoaded?: (val: boolean) => Dispatch<SetStateAction<boolean>>
}

const namespaces = ['common', 'savings']

export default function SavingsActionWithdraw({ balance, change, disabled, setLoaded }: Props) {
	const { t } = useTranslation(namespaces)

	const [isHidden, setHidden] = useState<boolean>(false)
	const account = useAccount()
	const chainId = useChainId()

	const toastContent = useMemo(
		() => [
			{
				title: t('common:toasts:savings:withdraw:title1'),
				value: `${formatCurrency(formatUnits(balance, 18))} ${CoinTicker.OFD}`,
			},
			{
				title: t('common:toasts:savings:withdraw:title2'),
				value: `${formatCurrency(formatUnits(change, 18))} ${CoinTicker.OFD}`,
			},
		],
		[balance, change, t]
	)

	const { loading: isAction, writeFunction: handleOnClick } = useWriteContractWithToast({
		contractParams: {
			address: ADDRESS[chainId].savings,
			abi: ABIS.SavingsABI,
			functionName: 'adjust',
			args: [balance],
		},
		toastPending: {
			title: t('common:toasts:savings:withdraw:pending'),
			rows: toastContent,
		},
		toastSuccess: {
			title: t('common:toasts:savings:withdraw:success'),
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
		if (setLoaded != undefined) setLoaded(false)
	}, [account.address, handleOnClick, setLoaded, t])

	return (
		<Button className="h-10" disabled={isHidden || disabled} isLoading={isAction} onClick={onClick}>
			{t('savings:interactionCard:button')}
		</Button>
	)
}
