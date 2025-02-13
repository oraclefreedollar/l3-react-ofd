import Head from 'next/head'
import { useEffect } from 'react'
import { store, useAppDispatch } from 'store'
import { fetchPositionsList } from 'store/slices/positions.slice'
import MonitoringTable from 'components/Monitoring/MonitoringTable'
import AppPageHeader from 'components/AppPageHeader'
import { ChallengesActions } from 'store/challenges'
export default function Positions() {
	const dispatch = useAppDispatch()

	useEffect(() => {
		store.dispatch(fetchPositionsList())
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
