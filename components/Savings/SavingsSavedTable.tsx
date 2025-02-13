import TableHeader from '../Table/TableHead'
import TableBody from '../Table/TableBody'
import Table from '../Table'
import TableRowEmpty from '../Table/TableRowEmpty'
import SavingsSavedRow from './SavingsSavedRow'
import { useSavingsAllUserTable } from 'store/savings'

export default function SavingsSavedTable() {
	const headers: string[] = ['Date', 'Saver', 'Amount', 'Balance']

	const { save } = useSavingsAllUserTable()
	if (!save) return null

	return (
		<Table>
			<TableHeader headers={headers} />
			<TableBody>
				{save.length == 0 ? (
					<TableRowEmpty>{'There are no savings yet.'}</TableRowEmpty>
				) : (
					save.map((r) => <SavingsSavedRow item={r} key={r.id} />)
				)}
			</TableBody>
		</Table>
	)
}
