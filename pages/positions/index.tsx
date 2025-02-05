import Head from 'next/head'
import AppPageHeader from 'components/AppPageHeader'
import PositionTable from 'components/PositionTable'
import PositionCollateral from 'components/PositionTable/PositionCollateral'
import { envConfig } from 'app.env.config'
import BorrowOptions from 'components/BorrowOptions'
import { useTranslation } from 'next-i18next'

export default function Positions() {
	const { t } = useTranslation()

	return (
		<>
			<Head>
				<title>
					{envConfig.AppName} - {t('pages:position:list:title')}
				</title>
			</Head>

			<div className="mt-8">
				<BorrowOptions />
				<PositionCollateral />
				<AppPageHeader title={t('pages:position:list:myPositions')} />
				<PositionTable showMyPos />
				<AppPageHeader title={t('pages:position:list:otherPositions')} />
				<PositionTable />
			</div>
		</>
	)
}
