import SavingsGlobalCard from 'components/Savings/SavingsGlobalCard'
import SavingsInteractionCard from 'components/Savings/SavingsInteractionCard'
import SavingsInterestTable from 'components/Savings/SavingsInterestTable'
import SavingsSavedTable from 'components/Savings/SavingsSavedTable'
import SavingsWithdrawnTable from 'components/Savings/SavingsWithdrawnTable'
import Head from 'next/head'
import React, { useEffect } from 'react'
import { useAppDispatch } from 'store'
import { useAccount, useChainId } from 'wagmi'
import AppTitle from 'components/AppTitle'
import AppPageHeader from 'components/AppPageHeader'
import { envConfig } from 'app.env.config'
import { useTokenData } from 'hooks/useTokenData'
import { ADDRESS } from 'contracts/address'
import { CoinTicker } from 'meta/coins'
import { useTranslation } from 'next-i18next'
import { InferGetServerSidePropsType } from 'next'
import { withServerSideTranslations } from 'utils/withServerSideTranslations'
import { SavingsActions } from 'store/savings'

const namespaces = ['savings']

const SavingsPage: React.FC = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const dispatch = useAppDispatch()
	const { t } = useTranslation(namespaces)

	const { address } = useAccount()
	const chainId = useChainId()
	const { totalSupply } = useTokenData(ADDRESS[chainId].oracleFreeDollar)

	useEffect(() => {
		dispatch(SavingsActions.getAll({ account: address, totalOFDSupply: totalSupply }))
	}, [address, dispatch, totalSupply])

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

			<AppTitle title={t('savings:sections:deposits:title')} />

			<SavingsSavedTable />

			<AppTitle title={t('savings:sections:interest:title')} />

			<SavingsInterestTable />

			<AppTitle title={t('savings:sections:withdrawals:title')} />

			<SavingsWithdrawnTable />
		</>
	)
}

const getServerSideProps = withServerSideTranslations(namespaces)

export default SavingsPage
