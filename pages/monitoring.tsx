import Head from 'next/head'
import { useEffect } from 'react'
import { store } from 'store'
import { fetchPositionsList } from 'store/slices/positions.slice'
import { fetchChallengesList } from 'store/slices/challenges.slice'
import MonitoringTable from 'components/Monitoring/MonitoringTable'
import AppPageHeader from 'components/AppPageHeader'
export default function Positions() {
	useEffect(() => {
		store.dispatch(fetchPositionsList())
		store.dispatch(fetchChallengesList())
	}, [])

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
