import Head from 'next/head'
import AppPageHeader from 'components/AppPageHeader'
import PositionTable from 'components/PositionTable'
import PositionCollateral from 'components/PositionTable/PositionCollateral'
import { envConfig } from 'app.env.config'
import BorrowOptions from 'components/BorrowOptions'

export default function Positions() {
	return (
		<>
			<Head>
				<title>{envConfig.AppName} - Positions</title>
			</Head>

			<div className="mt-8">
				<BorrowOptions />
				<PositionCollateral />
				<AppPageHeader title="My Positions" />
				<PositionTable showMyPos />
				<AppPageHeader title="Other Positions" />
				<PositionTable />
			</div>
		</>
	)
}
