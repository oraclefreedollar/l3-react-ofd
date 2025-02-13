import { zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import Table from '../Table'
import TableBody from '../Table/TableBody'
import TableHeader from '../Table/TableHead'
import TableRowEmpty from '../Table/TableRowEmpty'
import PositionRow from './PositionRow'
import { useOpenPositionsByCollateral } from 'store/positions'
import { PositionQuery } from 'meta/positions'

interface Props {
	showMyPos?: boolean
}

export default function PositionTable({ showMyPos }: Props) {
	const openPositionsByCollateral = useOpenPositionsByCollateral()
	// console.log({ openPositionsByCollateral });
	const { address } = useAccount()
	const account = address || zeroAddress
	const openPositions: PositionQuery[] = []

	// console.log("Account:", account);

	for (const collateral in openPositionsByCollateral) {
		openPositions.push(...openPositionsByCollateral[collateral])
	}
	const matchingPositions = openPositions.filter((position) =>
		showMyPos ? position.owner == account : position.owner != account && !position.denied && !position.closed
	)

	// console.log({ matchingPositions, showMyPos });

	return (
		<div id="positions-table">
			<Table>
				<TableHeader actionCol headers={['Collateral', 'Liquidation Price', 'Available Amount']} />
				<TableBody>
					{matchingPositions.length == 0 ? (
						<TableRowEmpty>{showMyPos ? "You don't have any positions." : 'There are no other positions yet.'}</TableRowEmpty>
					) : (
						matchingPositions.map((pos) => <PositionRow key={pos.position} position={pos} />)
					)}
				</TableBody>
			</Table>
		</div>
	)
}
