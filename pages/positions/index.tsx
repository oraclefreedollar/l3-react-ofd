import Head from 'next/head'
import AppPageHeader from 'components/AppPageHeader'
import PositionTable from 'components/PositionTable'
import PositionCollateral from 'components/PositionTable/PositionCollateral'
import { envConfig } from 'app.env.config'
import Link from 'next/link'
import { ENABLE_EMERGENCY_MODE } from 'utils'

export default function Positions() {
	return (
		<>
			<Head>
				<title>{envConfig.AppName} - Positions</title>
			</Head>

			<div className="mt-8">
				<PositionCollateral />
				<AppPageHeader title="My Positions" />
				{!ENABLE_EMERGENCY_MODE && (
					<div className="flex mb-4">
						<Link className="btn btn-primary m-auto" href={'positions/create'}>
							Propose New Position Type
						</Link>
					</div>
				)}
				<PositionTable showMyPos />
				<AppPageHeader title="Other Positions" />
				<PositionTable />
			</div>
		</>
	)
}
