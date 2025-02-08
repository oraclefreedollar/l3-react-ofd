import TableHeader from '../Table/TableHead'
import TableBody from '../Table/TableBody'
import Table from '../Table'
import TableRowEmpty from '../Table/TableRowEmpty'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/redux.store'
import SavingsSavedRow from './SavingsSavedRow'
import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'

const namespaces = ['savings']

export default function SavingsSavedTable() {
	const { t } = useTranslation(namespaces)

	const headers: string[] = useMemo(
		() => [
			t('savings:sections:deposits:table:date'),
			t('savings:sections:deposits:table:saver'),
			t('savings:sections:deposits:table:amount'),
			t('savings:sections:deposits:table:balance'),
		],
		[t]
	)

	const { save } = useSelector((state: RootState) => state.savings.savingsAllUserTable)
	if (!save) return null

	return (
		<Table>
			<TableHeader headers={headers} />
			<TableBody>
				{save.length == 0 ? (
					<TableRowEmpty>{t('savings:sections:deposits:noSavings')}</TableRowEmpty>
				) : (
					save.map((r) => <SavingsSavedRow item={r} key={r.id} />)
				)}
			</TableBody>
		</Table>
	)
}
