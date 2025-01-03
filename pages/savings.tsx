import SavingsGlobalCard from 'components/Savings/SavingsGlobalCard'
import SavingsInteractionCard from 'components/Savings/SavingsInteractionCard'
import SavingsInterestTable from 'components/Savings/SavingsInterestTable'
import SavingsSavedTable from 'components/Savings/SavingsSavedTable'
import SavingsWithdrawnTable from 'components/Savings/SavingsWithdrawnTable'
import Head from 'next/head'
import { useEffect } from 'react'
import { store } from '../redux/redux.store'
import { useAccount, useChainId } from 'wagmi'
import { fetchSavings } from 'redux/slices/savings.slice'
import AppTitle from 'components/AppTitle'
import AppPageHeader from 'components/AppPageHeader'
import { envConfig } from 'app.env.config'
import { useTokenData } from 'hooks/useTokenData'
import { ADDRESS } from 'contracts/address'

export default function SavingsPage() {
	const { address } = useAccount()
	const chainId = useChainId()
	const { totalSupply } = useTokenData(ADDRESS[chainId].oracleFreeDollar)

	useEffect(() => {
		store.dispatch(fetchSavings(address, totalSupply))
	}, [address, totalSupply])

	return (
		<>
			<Head>
				<title>OFD - Savings</title>
			</Head>

			<AppPageHeader title={`${envConfig.AppName} Savings`} />
			<SavingsGlobalCard />

			<SavingsInteractionCard />

			<AppTitle title="Recent Deposits" />

			<SavingsSavedTable />

			<AppTitle title="Recent Interest Claims" />

			<SavingsInterestTable />

			<AppTitle title="Recent Withdrawals" />

			<SavingsWithdrawnTable />
		</>
	)
}
