'use client'

import { useUserBalance } from 'hooks'
import Head from 'next/head'
import AppPageHeader from 'components/AppPageHeader'
import { envConfig } from 'app.env.config'

import { PositionCreateProvider } from 'contexts/position'
import PositionInitialization from 'components/Position/PositionInitialization'
import PositionProposeCollateral from 'components/Position/PositionProposeCollateral'
import PositionFinancialTerms from 'components/Position/PositionFinancialTerms'
import PositionLiquidation from 'components/Position/PositionLiquidation'
import PositionProposeButton from 'components/Position/PositionProposeButton'
import React from 'react'

const PositionCreate: React.FC = ({}) => {
	const userBalance = useUserBalance()

	return (
		<PositionCreateProvider>
			<Head>
				<title>{envConfig.AppName} - Propose Position</title>
			</Head>
			<div>
				<AppPageHeader
					backText="Back to positions"
					backTo={`/positions`}
					title="Propose New Position Type"
					tooltip="Propose a completely new position with a collateral of your choice."
				/>
				<section className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<PositionInitialization userBalanceOFD={userBalance.ofdBalance} />
					<PositionProposeCollateral userBalanceRefetch={userBalance.refetch} />
					<PositionFinancialTerms />
					<PositionLiquidation />
				</section>
				<PositionProposeButton />
			</div>
		</PositionCreateProvider>
	)
}

export default PositionCreate
