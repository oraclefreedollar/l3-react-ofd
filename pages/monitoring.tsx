import Head from 'next/head'
import { useEffect } from 'react'
import { useAppDispatch } from 'store'
import MonitoringTable from 'components/Monitoring/MonitoringTable'
import AppPageHeader from 'components/AppPageHeader'
import { ChallengesActions } from 'store/challenges'
import { PositionsActions } from 'store/positions'
export default function Positions() {
	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(PositionsActions.getAll())
		dispatch(ChallengesActions.getAll())
	}, [dispatch])

	return (
		<>
			<Head>
				<title>OracleFreeDollar - Monitoring</title>
			</Head>

			<AppPageHeader title="Monitoring" />
			<div className="md:mt-8">
				<MonitoringTable />
			</div>
		</>
	)
}
