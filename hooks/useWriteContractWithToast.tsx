import { simulateContract, waitForTransactionReceipt, writeContract } from 'wagmi/actions'
import { WAGMI_CONFIG } from 'app.config'
import { toast } from 'react-toastify'
import { renderErrorToast, TxToast } from 'components/TxToast'
import { Hash, SimulateContractParameters } from 'viem'
import { useCallback, useState } from 'react'
import { RefetchType } from 'utils'
import { useTranslation } from 'next-i18next'

type WriteContractCustomProps = {
	contractParams: SimulateContractParameters
	toastPending: { title: string; rows: Array<{ title: string; value?: string | JSX.Element; hash?: Hash }> }
	toastSuccess: { title: string; rows: Array<{ title: string; value?: string | JSX.Element; hash?: Hash }> }
	refetchFunctions?: Array<RefetchType>
}

type Returned = {
	loading: boolean
	writeFunction: () => Promise<boolean>
}

export const useWriteContractWithToast = (props: WriteContractCustomProps): Returned => {
	const { contractParams, refetchFunctions, toastPending, toastSuccess } = props
	const { t } = useTranslation(['common'])
	const [loading, setLoading] = useState<boolean>(false)

	const writeFunction = useCallback(async (): Promise<boolean> => {
		try {
			setLoading(true)
			const { request } = await simulateContract(WAGMI_CONFIG, contractParams)
			const writeHash = await writeContract(WAGMI_CONFIG, request)

			const pendingRows = [
				...toastPending.rows,
				{
					title: t('common:toasts:transaction'),
					hash: writeHash,
				},
			]

			const successRows = [
				...toastSuccess.rows,
				{
					title: t('common:toasts:transaction'),
					hash: writeHash,
				},
			]

			await toast.promise(waitForTransactionReceipt(WAGMI_CONFIG, { hash: writeHash, confirmations: 1 }), {
				pending: {
					render: <TxToast rows={pendingRows} title={toastPending.title} />,
				},
				success: {
					render: <TxToast rows={successRows} title={toastSuccess.title} />,
				},
				error: {
					render(error: unknown) {
						return renderErrorToast(error, t('common:toasts:transaction:error'))
					},
				},
			})
			return true
		} catch (e) {
			console.log(e)
			toast.error(renderErrorToast(e, t('common:toasts:transaction:error')))
			return false
		} finally {
			refetchFunctions?.map(async (refetch) => await refetch())
			setLoading(false)
		}
	}, [contractParams, refetchFunctions, t, toastPending.rows, toastPending.title, toastSuccess.rows, toastSuccess.title])

	return { loading, writeFunction }
}
