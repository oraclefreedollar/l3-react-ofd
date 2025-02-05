import { useSelector } from 'react-redux'
import { zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { RootState } from 'redux/redux.store'
import { PositionQuery } from 'redux/slices/positions.types'
import Table from '../Table'
import TableBody from '../Table/TableBody'
import TableHeader from '../Table/TableHead'
import TableRowEmpty from '../Table/TableRowEmpty'
import PositionRow from './PositionRow'
import { useTranslation } from 'next-i18next'

interface Props {
	showMyPos?: boolean
}

export default function PositionTable({ showMyPos }: Props) {
	const { t } = useTranslation()

	const { openPositionsByCollateral } = useSelector((state: RootState) => state.positions)
	const { address } = useAccount()
	const account = address || zeroAddress
	const openPositions: PositionQuery[] = []

	for (const collateral in openPositionsByCollateral) {
		openPositions.push(...openPositionsByCollateral[collateral])
	}
	const matchingPositions = openPositions.filter((position) =>
		showMyPos ? position.owner == account : position.owner != account && !position.denied && !position.closed
	)

	return (
		<div id="positions-table">
			<Table>
				<TableHeader
					actionCol
					headers={[
						t('pages:position:list:table:header:collateral'),
						t('pages:position:list:table:header:liqPrice'),
						t('pages:position:list:table:header:availableAmount'),
					]}
				/>
				<TableBody>
					{matchingPositions.length == 0 ? (
						<TableRowEmpty>
							{showMyPos ? t('pages:position:list:table:noPositionsAccount') : t('pages:position:list:table:noPositions')}
						</TableRowEmpty>
					) : (
						matchingPositions.map((pos) => <PositionRow key={pos.position} position={pos} />)
					)}
				</TableBody>
			</Table>
		</div>
	)
}
