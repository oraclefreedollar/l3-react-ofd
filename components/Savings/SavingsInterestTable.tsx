import TableHeader from '../Table/TableHead'
import TableBody from '../Table/TableBody'
import Table from '../Table'
import TableRowEmpty from '../Table/TableRowEmpty'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/redux.store'
import { useState } from 'react'
import { SavingsInterestQuery } from 'redux/slices/savings.types'
import SavingsInterestRow from './SavingsInterestRow'

export default function SavingsInterestTable() {
	const headers: string[] = ['Date', 'Saver', 'Interest', 'Balance']
	const [tab] = useState<string>(headers[0])
	const [reverse] = useState<boolean>(false)

	const { interest } = useSelector((state: RootState) => state.savings.savingsAllUserTable)
	if (!interest) return null

	const sorted: SavingsInterestQuery[] = sortFunction({ list: interest, headers, tab, reverse })

	return (
		<Table>
			<TableHeader headers={headers} />
			<TableBody>
				{sorted.length == 0 ? (
					<TableRowEmpty>{'There are no interest claims yet.'}</TableRowEmpty>
				) : (
					sorted.map((r) => <SavingsInterestRow headers={headers} item={r} key={r.id} tab={tab} />)
				)}
			</TableBody>
		</Table>
	)
}

type SortFunctionParams = {
	list: SavingsInterestQuery[]
	headers: string[]
	tab: string
	reverse: boolean
}

function sortFunction(params: SortFunctionParams): SavingsInterestQuery[] {
	const { list, headers, tab, reverse } = params
	const sortingList = [...list] // make it writeable

	if (tab === headers[0]) {
		// Date
		sortingList.sort((a, b) => b.created - a.created)
	} else if (tab === headers[1]) {
		// Saver
		sortingList.sort((a, b) => a.account.localeCompare(b.account))
	} else if (tab === headers[2]) {
		// Interest / Amount
		sortingList.sort((a, b) => parseInt(b.amount) - parseInt(a.amount))
	} else if (tab === headers[3]) {
		// Balance
		sortingList.sort((a, b) => parseInt(b.balance) - parseInt(a.balance))
	}

	return reverse ? sortingList.reverse() : sortingList
}
