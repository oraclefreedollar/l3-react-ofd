import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { formatCurrency } from 'utils/format'
import { useAccount, useChainId } from 'wagmi'
import Button from 'components/Button'
import { formatUnits } from 'viem'
import { ADDRESS, ABIS } from 'contracts'
import { useWriteContractWithToast } from 'hooks'
import { useTranslation } from 'next-i18next'
import { CoinTicker } from 'meta/coins'

interface Props {
	balance: bigint
	interest: bigint
	disabled?: boolean
	setLoaded?: (val: boolean) => Dispatch<SetStateAction<boolean>>
}

const namespaces = ['common', 'savings']

export default function SavingsActionInterest({ balance, interest, disabled, setLoaded }: Props) {
	const { t } = useTranslation(namespaces)

	const [isHidden, setHidden] = useState<boolean>(false)
	const account = useAccount()
	const chainId = useChainId()

	const toastContent = useMemo(
		() => [
			{
				title: t('common:toasts:savings:interest:title1'),
				value: `${formatCurrency(formatUnits(balance, 18))} ${CoinTicker.OFD}`,
			},
			{
				title: t('common:toasts:savings:interest:title2'),
				value: `${formatCurrency(formatUnits(interest, 18))} ${CoinTicker.OFD}`,
			},
		],
		[balance, interest, t]
	)

	/**
	 * @dev: checkout if you want to return back to "claim" into savings account, aka reinvest via SC function "refreshMyBalance"
	 * https://github.com/Frankencoin-ZCHF/frankencoin-dapp/blob/b1356dc0e45157b0e65b20fef019af00e5126653/components/PageSavings/SavingsActionInterest.tsx
	 */
	const { loading: isAction, writeFunction: handleOnClick } = useWriteContractWithToast({
		contractParams: {
			address: ADDRESS[chainId].savings,
			abi: ABIS.SavingsABI,
			functionName: 'adjust',
			args: [balance],
		},
		toastPending: {
			title: t('common:toasts:savings:interest:pending'),
			rows: toastContent,
		},
		toastSuccess: {
			title: t('common:toasts:savings:interest:success'),
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

		if (setLoaded != undefined) {
			setLoaded(false)
		}
	}, [account.address, handleOnClick, setLoaded, t])

	return (
		<Button className="h-10" disabled={isHidden || disabled} isLoading={isAction} onClick={onClick}>
			{t('savings:interactionCard:button')}
		</Button>
	)
}
