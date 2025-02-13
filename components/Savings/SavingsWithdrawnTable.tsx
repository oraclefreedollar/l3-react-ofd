import TableHeader from '../Table/TableHead'
import TableBody from '../Table/TableBody'
import Table from '../Table'
import TableRowEmpty from '../Table/TableRowEmpty'
import SavingsWithdrawnRow from './SavingsWithdrawnRow'
import { useSavingsAllUserTable } from 'store/savings'

export default function SavingsWithdrawnTable() {
	const headers: string[] = ['Date', 'Saver', 'Amount', 'Balance']

	const { withdraw } = useSavingsAllUserTable()
	if (!withdraw) return null

	return (
		<Table>
			<TableHeader headers={headers} />
			<TableBody>
				{withdraw.length == 0 ? (
					<TableRowEmpty>{'There are no withdrawals yet.'}</TableRowEmpty>
				) : (
					withdraw.map((r) => <SavingsWithdrawnRow item={r} key={r.id} />)
				)}
			</TableBody>
		</Table>
	)
}
