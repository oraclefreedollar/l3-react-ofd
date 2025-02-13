import { Address, formatUnits, zeroAddress } from 'viem'
import TableRow from '../Table/TableRow'
import { RootState } from '../../redux/redux.store'
import { useSelector } from 'react-redux'
import { formatCurrency } from '../../utils/format'
import { useRouter as useNavigation } from 'next/navigation'

import { useContractUrl } from 'hooks/useContractUrl'
import { ChallengesQueryItem } from 'redux/slices/challenges.types'
import TokenLogo from 'components/TokenLogo'
import Button from 'components/Button'
import AppBox from 'components/AppBox'
import { PositionQuery } from 'redux/slices/positions.types'
import { useTranslation } from 'next-i18next'
import React, { useMemo } from 'react'

interface Props {
	position: PositionQuery
}

const namespaces = ['monitoring']

const MonitoringRow: React.FC<Props> = ({ position }: Props) => {
	const { t } = useTranslation(namespaces)

	const navigate = useNavigation()

	const prices = useSelector((state: RootState) => state.prices.coingecko)
	const challenges = useSelector((state: RootState) => state.challenges.positions)
	const url = useContractUrl(position.collateral || zeroAddress)
	const collTokenPrice = prices[position.collateral.toLowerCase() as Address]?.price?.usd || 1
	const ofdPrice = prices[position.ofd.toLowerCase() as Address]?.price?.usd || 1

	const maturity: number = (position.expiration * 1000 - Date.now()) / 1000 / 60 / 60 / 24

	const balance: number = Math.round((parseInt(position.collateralBalance) / 10 ** position.collateralDecimals) * 100) / 100
	const balanceOFD: number = Math.round(((balance * collTokenPrice) / ofdPrice) * 100) / 100

	const liquidationOFD: number = Math.round((parseInt(position.price) / 10 ** (36 - position.collateralDecimals)) * 100) / 100
	const liquidationPct: number = Math.round((balanceOFD / (liquidationOFD * balance)) * 10000) / 100

	const digits: number = position.collateralDecimals
	const positionChallenges = useMemo(() => challenges.map[position.position.toLowerCase() as Address] ?? [], [challenges, position])
	const positionChallengesActive = useMemo(
		() => positionChallenges.filter((ch: ChallengesQueryItem) => ch.status == t('monitoring:status:active')) ?? [],
		[positionChallenges, t]
	)
	const positionChallengesActiveCollateral =
		positionChallengesActive.reduce<number>((acc, c) => {
			return acc + parseInt(formatUnits(c.size, digits - 2)) - parseInt(formatUnits(c.filledSize, digits - 2))
		}, 0) / 100
	const collateralBalanceNumber: number = parseInt(formatUnits(BigInt(position.collateralBalance), digits - 2)) / 100
	const challengesRatioPct: number = Math.round((positionChallengesActiveCollateral / collateralBalanceNumber) * 100)

	const openExplorer = (e: any) => {
		e.preventDefault()
		window.open(url, '_blank')
	}

	return (
		<TableRow
			actionCol={
				<Button className="h-10" onClick={() => navigate.push(`/position/${position.position}/challenge`)}>
					{maturity <= 0 ? t('monitoring:forceSell') : t('monitoring:challenge')}
				</Button>
			}
			link={`/position/${position.position}`}
		>
			<div className="flex flex-col max-md:mb-5">
				<div className="max-md:hidden flex flex-row items-center -ml-12">
					<span className="mr-4 cursor-pointer" onClick={openExplorer}>
						<TokenLogo currency={position.collateralSymbol} />
					</span>
					<span className={`col-span-2 text-md`}>{`${formatCurrency(balance)} ${position.collateralSymbol}`}</span>
				</div>

				<AppBox className="md:hidden flex flex-row items-center">
					<div className="mr-4 cursor-pointer" onClick={openExplorer}>
						<TokenLogo currency={position.collateralSymbol} />
					</div>
					<div className={`col-span-2 text-md font-semibold`}>{`${formatCurrency(balance)} ${position.collateralSymbol}`}</div>
				</AppBox>
			</div>

			<div className="flex flex-col gap-2">
				<div className={`col-span-2 text-md ${liquidationPct < 110 ? 'text-text-warning font-bold' : ''}`}>
					{!isNaN(liquidationPct) ? formatCurrency(liquidationPct) : '-.--'}%
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<div className={`col-span-2 text-md ${maturity < 7 ? 'text-text-warning font-bold' : ''}`}>
					{maturity < 3
						? maturity > 0
							? t('monitoring:maturity:hours', { hours: formatCurrency(maturity * 24) })
							: t('monitoring:status:expired')
						: t('monitoring:maturity:days', { days: Math.round(maturity) })}
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<div className={`col-span-2 text-md`}>{challengesRatioPct == 0 ? '-' : `${challengesRatioPct}%`}</div>
			</div>
		</TableRow>
	)
}

export default MonitoringRow
