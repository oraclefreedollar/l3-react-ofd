import SavingsGlobalCard from 'components/Savings/SavingsGlobalCard'
import SavingsInteractionCard from 'components/Savings/SavingsInteractionCard'
import SavingsInterestTable from 'components/Savings/SavingsInterestTable'
import SavingsSavedTable from 'components/Savings/SavingsSavedTable'
import SavingsWithdrawnTable from 'components/Savings/SavingsWithdrawnTable'
import Head from 'next/head'
import React, { useEffect } from 'react'
import { store } from '../redux/redux.store'
import { useAccount, useChainId } from 'wagmi'
import { fetchSavings } from 'redux/slices/savings.slice'
import AppTitle from 'components/AppTitle'
import AppPageHeader from 'components/AppPageHeader'
import { envConfig } from 'app.env.config'
import { useTokenData } from 'hooks/useTokenData'
import { ADDRESS } from 'contracts/address'
import { CoinTicker } from 'meta/coins'
import { useTranslation } from 'next-i18next'
import { InferGetServerSidePropsType } from 'next'
import { withServerSideTranslations } from 'utils/withServerSideTranslations'

const namespaces = ['savings']

const SavingsPage: React.FC = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { t } = useTranslation(namespaces)

	const { address } = useAccount()
	const chainId = useChainId()
	const { totalSupply } = useTokenData(ADDRESS[chainId].oracleFreeDollar)

	useEffect(() => {
		store.dispatch(fetchSavings(address, totalSupply))
	}, [address, totalSupply])

	return (
		<>
			<Head>
				<title>
					{CoinTicker.OFD} - {t('savings:title')}
				</title>
			</Head>

			<AppPageHeader title={`${envConfig.AppName} ${t('savings:title')}`} />
			<SavingsGlobalCard />

			<SavingsInteractionCard />

			<AppTitle title={t('savings:sections:title:deposits')} />

			<SavingsSavedTable />

			<AppTitle title={t('savings:sections:title:interest')} />

			<SavingsInterestTable />

			<AppTitle title={t('savings:sections:title:withdrawals')} />

			<SavingsWithdrawnTable />
		</>
	)
}

const getServerSideProps = withServerSideTranslations(namespaces)

export default SavingsPage
