import TableHeader from '../Table/TableHead'
import TableBody from '../Table/TableBody'
import Table from '../Table'
import TableRowEmpty from '../Table/TableRowEmpty'
import SavingsWithdrawnRow from './SavingsWithdrawnRow'
import { useSavingsAllUserTable } from 'store/savings'
import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'

const namespaces = ['savings']

export default function SavingsWithdrawnTable() {
	const { t } = useTranslation(namespaces)

	const headers: string[] = useMemo(
		() => [
			t('savings:sections:withdrawals:table:date'),
			t('savings:sections:withdrawals:table:saver'),
			t('savings:sections:withdrawals:table:amount'),
			t('savings:sections:withdrawals:table:balance'),
		],
		[t]
	)

	const { withdraw } = useSavingsAllUserTable()
	if (!withdraw) return null

	return (
		<Table>
			<TableHeader headers={headers} />
			<TableBody>
				{withdraw.length == 0 ? (
					<TableRowEmpty>{t('savings:sections:withdrawals:noWithdrawals')}</TableRowEmpty>
				) : (
					withdraw.map((r) => <SavingsWithdrawnRow item={r} key={r.id} />)
				)}
			</TableBody>
		</Table>
	)
}
