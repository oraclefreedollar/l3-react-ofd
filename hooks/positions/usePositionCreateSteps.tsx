import { useMemo } from 'react'
import PositionRequirements from 'components/Position/PositionRequirements/PositionRequirements'
import PositionProposeCollateral from 'components/Position/PositionProposeCollateral'
import PositionInitialization from 'components/Position/PositionInitialization'
import PositionFinancialTerms from 'components/Position/PositionFinancialTerms'
import PositionLiquidation from 'components/Position/PositionLiquidation'
import PositionSummary from 'components/Position/PositionSummary/PositionSummary'
import { useTranslation } from 'next-i18next'

export const usePositionCreateSteps = () => {
	const { t } = useTranslation()

	return useMemo(
		() => [
			{
				id: 'requirements',
				title: t('pages:position:create:requirements:title'),
				component: PositionRequirements,
			},
			{
				id: 'collateral',
				title: t('pages:position:create:collateral:title'),
				component: PositionProposeCollateral,
			},
			{
				id: 'initialization',
				title: t('pages:position:create:initialization:title'),
				component: PositionInitialization,
			},
			{
				id: 'financial',
				title: t('pages:position:create:financial:title'),
				component: PositionFinancialTerms,
			},
			{
				id: 'liquidation',
				title: t('pages:position:create:liquidation:title'),
				component: PositionLiquidation,
			},
			{
				id: 'summary',
				title: t('pages:position:create:summary:title'),
				component: PositionSummary,
			},
		],
		[t]
	)
}
