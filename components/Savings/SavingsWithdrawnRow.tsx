import { AddressLabelSimple, TxLabelSimple } from "components/AddressLabel";
import TableRow from "components/Table/TableRow";
import { SavingsWithdrawQuery } from "redux/slices/savings.types";
import { formatCurrency } from "utils/format";
import { formatUnits, Hash } from "viem";

interface Props {
	headers: string[];
	tab: string;
	item: SavingsWithdrawQuery;
}

export default function SavingsWithdrawnRow({ headers, tab, item }: Props) {
	const dateArr: string[] = new Date(item.created * 1000).toDateString().split(" ");
	const dateStr: string = `${dateArr[2]} ${dateArr[1]} ${dateArr[3]}`;

	return (
		<>
			<TableRow headers={headers} tab={tab}>
				<div className="flex flex-col md:text-left max-md:text-right">
					<TxLabelSimple label={dateStr} tx={item.txHash as Hash} showLink />
				</div>

				<div className="flex flex-col">
					<AddressLabelSimple address={item.account} showLink />
				</div>

				<div className="flex flex-col">{formatCurrency(formatUnits(BigInt(item.amount), 18))} OFD</div>

				{/* <div className={`flex flex-col`}>{formatCurrency(item.rate / 10_000)} %</div> */}

				<div className="flex flex-col">{formatCurrency(formatUnits(BigInt(item.balance), 18))} OFD</div>

				{/* <div className="flex flex-col">{formatCurrency(formatUnits(BigInt(item.total), 18))} ZCHF</div> */}
			</TableRow>
		</>
	);
}