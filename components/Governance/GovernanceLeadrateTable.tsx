import TableHeader from '../Table/TableHead'
import TableBody from '../Table/TableBody'
import Table from '../Table'
import TableRowEmpty from '../Table/TableRowEmpty'
import GovernanceLeadrateRow from './GovernanceLeadrateRow'
import { useLeadrateInfo, useLeadrateProposed, useLeadrateRate } from 'store/savings'
import { useTranslation } from 'next-i18next'
import React, { useMemo } from 'react'

const namespaces = ['common', 'governance']

const GovernanceLeadrateTable: React.FC = () => {
	const { t } = useTranslation(namespaces)

	const headers: string[] = useMemo(
		() => [
			t('governance:leadrate:table:header:date'),
			t('governance:leadrate:table:header:proposer'),
			t('governance:leadrate:table:header:rate'),
			t('governance:leadrate:table:header:state'),
		],
		[t]
	)

	const info = useLeadrateInfo()
	const proposals = useLeadrateProposed()
	const rates = useLeadrateRate()
	if (!info || !proposals || !rates) return null

	const currentProposal = proposals.list.length > 0 ? proposals.list[0] : undefined

	return (
		<Table>
			<TableHeader actionCol headers={headers} />
			<TableBody>
				{proposals.list.length == 0 ? (
					<TableRowEmpty>{t('governance:leadrate:table:empty')}</TableRowEmpty>
				) : (
					proposals.list.map((p) => (
						<GovernanceLeadrateRow currentProposal={currentProposal?.id == p.id} info={info} key={p.id} proposal={p} />
					))
				)}
			</TableBody>
		</Table>
	)
}

export default GovernanceLeadrateTable
