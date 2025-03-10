import TableHeader from '../Table/TableHead'
import TableBody from '../Table/TableBody'
import Table from '../Table'
import TableRowEmpty from '../Table/TableRowEmpty'
import { Address, formatUnits } from 'viem'
import MonitoringRow from './MonitoringRow'
import React, { useMemo } from 'react'
import { useCoingeckoPrices } from 'store/prices'
import { useTranslation } from 'next-i18next'
import { ChallengesQueryItem } from 'meta/challenges'
import { useOpenPositions } from 'store/positions'
import { useChallengePositions } from 'store/challenges'
import { PositionQuery } from 'meta/positions'

const namespaces = ['monitoring']

const MonitoringTable: React.FC = () => {
	const { t } = useTranslation(namespaces)

	const headers: string[] = useMemo(
		() => [
			t('monitoring:table:collateral'),
			t('monitoring:table:collateralization'),
			t('monitoring:table:expiration'),
			t('monitoring:table:challenged'),
		],
		[t]
	)

	const openPositions = useOpenPositions()
	const challenges = useChallengePositions()
	const coingecko = useCoingeckoPrices()

	// Combine position data with challenges data
	const enrichedPositions = useMemo(() => {
		return openPositions.map((position: PositionQuery) => {
			// Get active challenges for this position
			const positionChallenges: ChallengesQueryItem[] =
				challenges.map[position.position.toLowerCase() as Address]?.filter((c) => c.status === t('monitoring:status:active')) || []

			// Calculate total challenge size
			const totalChallengeSize = positionChallenges.reduce((total, challenge) => {
				const size = parseFloat(formatUnits(BigInt(challenge.size.toString()), position.collateralDecimals))
				const filled = parseFloat(formatUnits(BigInt(challenge.filledSize.toString()), position.collateralDecimals))
				return total + (size - filled)
			}, 0)

			// Calculate collateral value
			const collateralSize = parseFloat(formatUnits(BigInt(position.collateralBalance), position.collateralDecimals))
			const collateralPrice = coingecko[position.collateral.toLowerCase() as Address]?.price?.usd || 1
			const collateralValue = collateralSize * collateralPrice

			return {
				...position,
				activeChallenges: positionChallenges,
				totalChallengeSize,
				challengeRatio: totalChallengeSize / collateralSize,
				collateralValue,
			}
		})
	}, [openPositions, challenges.map, coingecko, t])

	return (
		<Table>
			<TableHeader actionCol={true} headers={headers} />
			<TableBody>
				{enrichedPositions.length === 0 ? (
					<TableRowEmpty>{t('monitoring:noActivePositions')}</TableRowEmpty>
				) : (
					enrichedPositions.map((pos) => <MonitoringRow key={pos.position} position={pos as PositionQuery} />)
				)}
			</TableBody>
		</Table>
	)
}

export default MonitoringTable
