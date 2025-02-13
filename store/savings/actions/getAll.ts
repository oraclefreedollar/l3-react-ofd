import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchSavingsRates, fetchSavingsUserData } from 'pages/api/savings'
import { Address } from 'viem'
import { ApiLeadrateInfo, ApiLeadrateProposed, ApiLeadrateRate, ApiSavingsInfo, SavingsUserData } from 'meta/savings'

type Props = { account?: Address; totalOFDSupply?: bigint }
type Returned = {
	allUsersData: SavingsUserData
	leadrateInfo: ApiLeadrateInfo
	leadrateProposed: ApiLeadrateProposed
	leadrateRate: ApiLeadrateRate
	savingsInfo: ApiSavingsInfo
	userData: SavingsUserData
}

export const getAll = createAsyncThunk<Returned | undefined, Props>('savings/getAll', async (props) => {
	const { account, totalOFDSupply } = props
	try {
		const { rates, proposals } = await fetchSavingsRates()
		const allUsersData = await fetchSavingsUserData()
		const userData = await fetchSavingsUserData(account)

		// Set specific user data if account is provided
		// if (account) {
		// 	dispatch(slice.actions.setSavingsUserTable(allUsersData))
		// } else {
		// 	dispatch(slice.actions.setSavingsUserTable(initialState.savingsUserTable))
		// }

		// Transform rates data
		const currentRate = rates[0] || { approvedRate: 0 }
		const latestProposal = proposals[0]

		// Set leadrate info
		const leadrateInfo: ApiLeadrateInfo = {
			rate: currentRate.approvedRate,
			nextRate: latestProposal?.nextRate || 0,
			nextchange: latestProposal?.nextChange || 0,
			isProposal: !!latestProposal,
			isPending: !!latestProposal && latestProposal.nextChange > Math.floor(Date.now() / 1000),
		}

		// Set leadrate proposed
		const leadrateProposed: ApiLeadrateProposed = {
			created: latestProposal?.created || 0,
			blockheight: latestProposal?.blockheight || 0,
			nextRate: latestProposal?.nextRate || 0,
			nextchange: latestProposal?.nextChange || 0,
			num: proposals.length,
			list: proposals,
		}

		// Set leadrate rate
		const leadrateRate: ApiLeadrateRate = {
			created: currentRate?.created || 0,
			blockheight: currentRate?.blockheight || 0,
			rate: currentRate?.approvedRate || 0,
			num: rates.length,
			list: rates,
		}

		// Calculate savings info
		const totalSaved = allUsersData.save.reduce((sum, item) => sum + Number(item.amount), 0)
		const totalWithdrawn = allUsersData.withdraw.reduce((sum, item) => sum + Number(item.amount), 0)
		const totalInterest = allUsersData.interest.reduce((sum, item) => sum + Number(item.amount), 0)
		const totalBalance = totalSaved - totalWithdrawn
		const savingsInfo: ApiSavingsInfo = {
			totalSaved,
			totalWithdrawn,
			totalBalance,
			totalInterest,
			rate: leadrateInfo.rate,
			ratioOfSupply: Number(totalOFDSupply) / totalBalance,
		}

		return { allUsersData, leadrateInfo, leadrateRate, leadrateProposed, savingsInfo, userData }
	} catch (error) {
		console.log('Error fetching savings:', error)
	}
})
