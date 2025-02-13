import TableHeader from '../Table/TableHead'
import TableBody from '../Table/TableBody'
import Table from '../Table'
import TableRowEmpty from '../Table/TableRowEmpty'
import GovernanceLeadrateRow from './GovernanceLeadrateRow'
import { useLeadrateInfo, useLeadrateProposed, useLeadrateRate } from 'store/savings'

export default function GovernanceLeadrateTable() {
	const headers: string[] = ['Date', 'Proposer', 'Rate', 'State']

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
					<TableRowEmpty>{'There are no proposals yet.'}</TableRowEmpty>
				) : (
					proposals.list.map((p) => (
						<GovernanceLeadrateRow currentProposal={currentProposal?.id == p.id} info={info} key={p.id} proposal={p} />
					))
				)}
			</TableBody>
		</Table>
	)
}
