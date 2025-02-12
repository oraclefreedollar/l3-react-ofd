import TableHeader from '../Table/TableHead'
import TableBody from '../Table/TableBody'
import Table from '../Table'
import TableRowEmpty from '../Table/TableRowEmpty'
import { useSelector } from 'react-redux'
import SavingsInterestRow from './SavingsInterestRow'
import { RootState } from 'store/types'

export default function SavingsInterestTable() {
	const headers: string[] = ['Date', 'Saver', 'Interest', 'Balance']

	const { interest } = useSelector((state: RootState) => state.savings.savingsAllUserTable)
	if (!interest) return null

	return (
		<Table>
			<TableHeader headers={headers} />
			<TableBody>
				{interest.length == 0 ? (
					<TableRowEmpty>{'There are no interest claims yet.'}</TableRowEmpty>
				) : (
					interest.map((r) => <SavingsInterestRow item={r} key={r.id} />)
				)}
			</TableBody>
		</Table>
	)
}
