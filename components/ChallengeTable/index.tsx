import ChallengeRow from './ChallengeRow'
import { Challenge } from 'hooks'
import TableRowEmpty from '../Table/TableRowEmpty'
import LoadingSpin from '../LoadingSpin'
import { useTranslation } from 'next-i18next'

interface Props {
	challenges: Challenge[]
	noContentText: string
	loading?: boolean
}

export default function ChallengeTable({ challenges, noContentText, loading }: Props) {
	const { t } = useTranslation('positionOverview')

	return (
		<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-4 flex flex-col border border-purple-500/50 gap-y-4">
			<div className="text-lg font-bold text-center mb-4">{t('positionOverview:challengeTable:title')}</div>
			<div className="bg-slate-900 rounded-xl p-2 flex flex-col gap-2">
				{loading ? (
					<TableRowEmpty>
						<div className="flex items-center">
							<LoadingSpin classes="mr-3" />
							{t('positionOverview:challengeTable:loading')}
						</div>
					</TableRowEmpty>
				) : challenges.length == 0 ? (
					<TableRowEmpty>{noContentText}</TableRowEmpty>
				) : (
					challenges.map((challenge) => (
						<ChallengeRow
							auctionEnd={challenge.auctionEnd}
							// challenger={challenge.challenger}
							challengeSize={challenge.size}
							// duration={challenge.duration}
							filledSize={challenge.filledSize}
							fixedEnd={challenge.fixedEnd}
							index={challenge.index}
							key={Number(challenge.index)}
							position={challenge.position}
							price={challenge.price}
						/>
					))
				)}
			</div>
		</div>
	)
}
