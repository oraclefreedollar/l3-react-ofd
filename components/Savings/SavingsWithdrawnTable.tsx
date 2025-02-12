import TableHeader from '../Table/TableHead'
import TableBody from '../Table/TableBody'
import Table from '../Table'
import TableRowEmpty from '../Table/TableRowEmpty'
import { useSelector } from 'react-redux'
import SavingsWithdrawnRow from './SavingsWithdrawnRow'
import { RootState } from 'store/types'

export default function SavingsWithdrawnTable() {
	const headers: string[] = ['Date', 'Saver', 'Amount', 'Balance']

	const { withdraw } = useSelector((state: RootState) => state.savings.savingsAllUserTable)
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
