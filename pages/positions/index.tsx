import Head from 'next/head'
import AppPageHeader from 'components/AppPageHeader'
import PositionTable from 'components/PositionTable'
import Link from 'next/link'
import PositionCollateral from 'components/PositionTable/PositionCollateral'
import { envConfig } from 'app.env.config'

export default function Positions() {
	return (
		<>
			<Head>
				<title>{envConfig.AppName} - Positions</title>
			</Head>

			<div className="mt-8">
				<PositionCollateral />
				<AppPageHeader title="My Positions" />
				<PositionTable showMyPos />
				<AppPageHeader title="Other Positions" />
				<PositionTable />
			</div>
			<div className="flex">
				<Link className="btn btn-primary m-auto" href={'positions/create'}>
					Propose New Position Type
				</Link>
			</div>
		</>
	)
}
