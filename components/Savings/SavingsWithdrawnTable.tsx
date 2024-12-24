import TableHeader from '../Table/TableHead'
import TableBody from '../Table/TableBody'
import Table from '../Table'
import TableRowEmpty from '../Table/TableRowEmpty'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/redux.store'
import { useState } from 'react'
import { SavingsWithdrawQuery } from 'redux/slices/savings.types'
import SavingsWithdrawnRow from './SavingsWithdrawnRow'

export default function SavingsWithdrawnTable() {
	const headers: string[] = ['Date', 'Saver', 'Amount', 'Balance']
	const [tab] = useState<string>(headers[0])
	const [reverse] = useState<boolean>(false)

	const { withdraw } = useSelector((state: RootState) => state.savings.savingsAllUserTable)
	if (!withdraw) return null

	const sorted: SavingsWithdrawQuery[] = sortFunction({ list: withdraw, headers, tab, reverse })

	return (
		<Table>
			<TableHeader headers={headers} />
			<TableBody>
				{sorted.length == 0 ? (
					<TableRowEmpty>{'There are no withdrawals yet.'}</TableRowEmpty>
				) : (
					sorted.map((r) => <SavingsWithdrawnRow item={r} key={r.id} />)
				)}
			</TableBody>
		</Table>
	)
}

type SortFunctionParams = {
	list: SavingsWithdrawQuery[]
	headers: string[]
	tab: string
	reverse: boolean
}

function sortFunction(params: SortFunctionParams): SavingsWithdrawQuery[] {
	const { list, headers, tab, reverse } = params
	const sortingList = [...list] // make it writeable

	if (tab === headers[0]) {
		// Date
		sortingList.sort((a, b) => b.created - a.created)
	} else if (tab === headers[1]) {
		// Saver
		sortingList.sort((a, b) => a.account.localeCompare(b.account))
	} else if (tab === headers[2]) {
		// Amount
		sortingList.sort((a, b) => parseInt(b.amount) - parseInt(a.amount))
	} else if (tab === headers[3]) {
		// Balance
		sortingList.sort((a, b) => parseInt(b.balance) - parseInt(a.balance))
	}

	return reverse ? sortingList.reverse() : sortingList
}
