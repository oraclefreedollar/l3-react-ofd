import { Hash } from 'viem'
import TableRow from '../Table/TableRow'
import { AddressLabelSimple, TxLabelSimple } from 'components/AddressLabel'
import { useCallback, useMemo, useState } from 'react'
import Button from 'components/Button'
import GuardToAllowedChainBtn from 'components/Guards/GuardToAllowedChainBtn'

import { useWriteContractsGovernanceLeadrateRow } from './hooks/useWriteContractsGovernanceLeadrateRow'
import { ApiLeadrateInfo, LeadrateProposed } from 'meta/savings'
import { useTranslation } from 'next-i18next'

interface Props {
	info: ApiLeadrateInfo
	proposal: LeadrateProposed
	currentProposal: boolean
}

const namespaces = ['common', 'governance']
export default function GovernanceLeadrateRow({ info, proposal, currentProposal }: Props) {
	const { t } = useTranslation(namespaces)

	const [isHidden, setHidden] = useState<boolean>(false)

	const vetoUntil = proposal.nextChange * 1000
	const hoursUntil: number = (vetoUntil - Date.now()) / 1000 / 60 / 60

	const stateStr: string = useMemo(() => t('governance:leadrate:remainingHours', { hours: Math.round(hoursUntil) }), [hoursUntil, t])

	const dateArr: string[] = new Date(proposal.created * 1000).toDateString().split(' ')
	const dateStr: string = `${dateArr[2]} ${dateArr[1]} ${dateArr[3]}`

	const { isApplying, handleOnApply, isDenying, handleOnDeny } = useWriteContractsGovernanceLeadrateRow({ info, proposal })

	const onApply = useCallback(async () => {
		const success = await handleOnApply()
		setHidden(success)
	}, [handleOnApply])

	const onDeny = useCallback(async () => {
		const success = await handleOnDeny()
		setHidden(success)
	}, [handleOnDeny])

	return (
		<>
			<TableRow
				actionCol={
					currentProposal ? (
						info.isPending && info.isProposal ? (
							<GuardToAllowedChainBtn>
								<Button className="h-10" disabled={!info.isPending || !info.isProposal || isHidden} isLoading={isDenying} onClick={onDeny}>
									{t('governance:leadrate:deny')}
								</Button>
							</GuardToAllowedChainBtn>
						) : (
							<GuardToAllowedChainBtn>
								<Button className="h-10" disabled={!info.isProposal || isHidden} isLoading={isApplying} onClick={onApply}>
									{t('governance:leadrate:apply')}
								</Button>
							</GuardToAllowedChainBtn>
						)
					) : (
						<></>
					)
				}
			>
				<div className="flex flex-col md:text-left max-md:text-right">
					<TxLabelSimple label={dateStr} showLink tx={proposal.txHash as Hash} />
				</div>

				<div className="flex flex-col">
					<AddressLabelSimple address={proposal.proposer} showLink />
				</div>

				<div className={`flex flex-col ${currentProposal && info.isProposal ? 'font-semibold' : ''}`}>{proposal.nextRate / 10_000} %</div>

				<div className="flex flex-col">
					{currentProposal
						? hoursUntil > 0
							? stateStr
							: info.rate != proposal.nextRate
								? t('governance:minterProposal:status:ready')
								: t('governance:minterProposal:status:passed')
						: t('governance:minterProposal:status:expired')}
				</div>
			</TableRow>
		</>
	)
}
