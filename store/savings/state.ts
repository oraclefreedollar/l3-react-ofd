import { ApiLeadrateInfo, ApiLeadrateProposed, ApiLeadrateRate, ApiSavingsInfo, ApiSavingsUserTable } from 'meta/savings'

export type SavingsState = {
	error: string | null
	loaded: boolean

	leadrateInfo: ApiLeadrateInfo
	leadrateProposed: ApiLeadrateProposed
	leadrateRate: ApiLeadrateRate

	savingsInfo: ApiSavingsInfo

	savingsUserTable: ApiSavingsUserTable
	savingsAllUserTable: ApiSavingsUserTable
}

export const initialState: SavingsState = {
	error: null,
	loaded: false,
	leadrateInfo: {
		isProposal: false,
		isPending: false,
		nextchange: 0,
		nextRate: 0,
		rate: 0,
	},
	leadrateProposed: {
		blockheight: 0,
		created: 0,
		nextchange: 0,
		nextRate: 0,
		num: 0,
		list: [],
	},
	leadrateRate: {
		blockheight: 0,
		created: 0,
		rate: 0,
		num: 0,
		list: [],
	},
	savingsInfo: {
		totalSaved: 0,
		totalWithdrawn: 0,
		totalBalance: 0,
		totalInterest: 0,
		rate: 0,
		ratioOfSupply: 0,
	},
	savingsUserTable: {
		interest: [],
		save: [],
		withdraw: [],
	},
	savingsAllUserTable: {
		interest: [],
		save: [],
		withdraw: [],
	},
}
