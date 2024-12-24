import { AddressLabelSimple, TxLabelSimple } from 'components/AddressLabel'
import TableRow from 'components/Table/TableRow'
import { SavingsInterestQuery } from 'redux/slices/savings.types'
import { formatCurrency } from 'utils/format'
import { formatUnits, Hash } from 'viem'

interface Props {
	item: SavingsInterestQuery
}

export default function SavingsInterestRow({ item }: Props) {
	const dateArr: string[] = new Date(item.created * 1000).toDateString().split(' ')
	const dateStr: string = `${dateArr[2]} ${dateArr[1]} ${dateArr[3]}`

	return (
		<>
			<TableRow>
				<div className="flex flex-col md:text-left max-md:text-right">
					<TxLabelSimple label={dateStr} showLink tx={item.txHash as Hash} />
				</div>

				<div className="flex flex-col">
					<AddressLabelSimple address={item.account} showLink />
				</div>

				<div className="flex flex-col">{formatCurrency(formatUnits(BigInt(item.amount), 18))} OFD</div>

				<div className="flex flex-col">{formatCurrency(formatUnits(BigInt(item.balance), 18))} OFD</div>
			</TableRow>
		</>
	)
}
