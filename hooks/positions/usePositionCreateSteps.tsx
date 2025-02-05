import { useMemo } from 'react'
import PositionRequirements from 'components/Position/PositionRequirements/PositionRequirements'
import PositionProposeCollateral from 'components/Position/PositionProposeCollateral'
import PositionInitialization from 'components/Position/PositionInitialization'
import PositionFinancialTerms from 'components/Position/PositionFinancialTerms'
import PositionLiquidation from 'components/Position/PositionLiquidation'
import PositionSummary from 'components/Position/PositionSummary/PositionSummary'
import { useTranslation } from 'next-i18next'

export const usePositionCreateSteps = () => {
	const { t } = useTranslation(['positionCreate', 'common'])

	return useMemo(
		() => [
			{
				id: 'requirements',
				title: t('positionCreate:requirements:title'),
				component: PositionRequirements,
			},
			{
				id: 'collateral',
				title: t('positionCreate:collateral:title'),
				component: PositionProposeCollateral,
			},
			{
				id: 'initialization',
				title: t('positionCreate:initialization:title'),
				component: PositionInitialization,
			},
			{
				id: 'financial',
				title: t('positionCreate:financial:title'),
				component: PositionFinancialTerms,
			},
			{
				id: 'liquidation',
				title: t('positionCreate:liquidation:title'),
				component: PositionLiquidation,
			},
			{
				id: 'summary',
				title: t('positionCreate:summary:title'),
				component: PositionSummary,
			},
		],
		[t]
	)
}
