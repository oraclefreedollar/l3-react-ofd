import { zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import Table from '../Table'
import TableBody from '../Table/TableBody'
import TableHeader from '../Table/TableHead'
import TableRowEmpty from '../Table/TableRowEmpty'
import PositionRow from './PositionRow'
import { useOpenPositionsByCollateral } from 'store/positions'
import { PositionQuery } from 'meta/positions'
import { useTranslation } from 'next-i18next'

interface Props {
	showMyPos?: boolean
}

export default function PositionTable({ showMyPos }: Props) {
	const { t } = useTranslation('myPositions')

	const openPositionsByCollateral = useOpenPositionsByCollateral()
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
						t('myPositions:table:header:collateral'),
						t('myPositions:table:header:liqPrice'),
						t('myPositions:table:header:availableAmount'),
					]}
				/>
				<TableBody>
					{matchingPositions.length == 0 ? (
						<TableRowEmpty>{showMyPos ? t('myPositions:table:noPositionsAccount') : t('myPositions:table:noPositions')}</TableRowEmpty>
					) : (
						matchingPositions.map((pos) => <PositionRow key={pos.position} position={pos} />)
					)}
				</TableBody>
			</Table>
		</div>
	)
}
