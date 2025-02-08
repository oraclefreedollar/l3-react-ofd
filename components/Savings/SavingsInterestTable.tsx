import TableHeader from '../Table/TableHead'
import TableBody from '../Table/TableBody'
import Table from '../Table'
import TableRowEmpty from '../Table/TableRowEmpty'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/redux.store'
import SavingsInterestRow from './SavingsInterestRow'
import { useMemo } from 'react'
import { useTranslation } from 'next-i18next'
const namespaces = ['savings']

export default function SavingsInterestTable() {
	const { t } = useTranslation(namespaces)

	const headers: string[] = useMemo(
		() => [
			t('savings:sections:interest:table:date'),
			t('savings:sections:interest:table:saver'),
			t('savings:sections:interest:table:interest'),
			t('savings:sections:interest:table:balance'),
		],
		[t]
	)

	const { interest } = useSelector((state: RootState) => state.savings.savingsAllUserTable)
	if (!interest) return null

	return (
		<Table>
			<TableHeader headers={headers} />
			<TableBody>
				{interest.length == 0 ? (
					<TableRowEmpty>{t('savings:sections:interest:noInterest')}</TableRowEmpty>
				) : (
					interest.map((r) => <SavingsInterestRow item={r} key={r.id} />)
				)}
			</TableBody>
		</Table>
	)
}
