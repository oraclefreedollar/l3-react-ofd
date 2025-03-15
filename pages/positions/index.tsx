import Head from 'next/head'
import AppPageHeader from 'components/AppPageHeader'
import PositionTable from 'components/PositionTable'
import PositionCollateral from 'components/PositionTable/PositionCollateral'
import { envConfig } from 'app.env.config'
import BorrowOptions from 'components/BorrowOptions'
import { useTranslation } from 'next-i18next'
import { withServerSideTranslations } from 'utils/withServerSideTranslations'
import React from 'react'
import { InferGetServerSidePropsType } from 'next'

const nameSpaces = ['myPositions', 'positionCollaterals']

const Positions: React.FC = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { t } = useTranslation(nameSpaces)

	return (
		<>
			<Head>
				<title>
					{envConfig.AppName} - {t('myPositions:title')}
				</title>
			</Head>

			<div className="mt-8">
				<BorrowOptions />
				<PositionCollateral />
				<AppPageHeader title={t('myPositions:myPositions')} />
				<PositionTable showMyPos />
				<AppPageHeader title={t('myPositions:otherPositions')} />
				<PositionTable />
			</div>
		</>
	)
}

export const getServerSideProps = withServerSideTranslations(nameSpaces)

export default Positions
