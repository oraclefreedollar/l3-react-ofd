import { gql } from '@apollo/client'
import { getAddress } from 'viem'
import { clientPonder } from 'app.config'
import {
	LeadrateProposed,
	LeadrateRateQuery,
	SavingsInterestQuery,
	SavingsRates,
	SavingsSavedQuery,
	SavingsUserData,
	SavingsWithdrawQuery,
} from 'meta/savings'

// Query for savings rates and proposals
const SAVINGS_RATES_QUERY = gql`
	query GetSavingsRates {
		savingsRateChangeds(orderBy: "created", orderDirection: "desc") {
			items {
				id
				created
				blockheight
				txHash
				approvedRate
			}
		}
		savingsRateProposeds(orderBy: "created", orderDirection: "desc") {
			items {
				id
				created
				blockheight
				txHash
				proposer
				nextRate
				nextChange
			}
		}
	}
`

const SAVINGS_USER_QUERY_ALL = gql`
	query GetSavingsUser {
		savingsSaveds(orderBy: "created", orderDirection: "desc") {
			items {
				id
				created
				blockheight
				txHash
				account
				amount
				rate
				total
				balance
			}
		}
		savingsInterests(orderBy: "created", orderDirection: "desc") {
			items {
				id
				created
				blockheight
				txHash
				account
				amount
				rate
				total
				balance
			}
		}
		savingsWithdrawns(orderBy: "created", orderDirection: "desc") {
			items {
				id
				created
				blockheight
				txHash
				account
				amount
				rate
				total
				balance
			}
		}
	}
`

// Query for user savings data
const SAVINGS_USER_QUERY = gql`
	query GetSavingsUser($account: String!) {
		savingsSaveds(where: { account: $account }, orderBy: "created", orderDirection: "desc") {
			items {
				id
				created
				blockheight
				txHash
				account
				amount
				rate
				total
				balance
			}
		}
		savingsInterests(where: { account: $account }, orderBy: "created", orderDirection: "desc") {
			items {
				id
				created
				blockheight
				txHash
				account
				amount
				rate
				total
				balance
			}
		}
		savingsWithdrawns(where: { account: $account }, orderBy: "created", orderDirection: "desc") {
			items {
				id
				created
				blockheight
				txHash
				account
				amount
				rate
				total
				balance
			}
		}
	}
`

export async function fetchSavingsRates(): Promise<SavingsRates> {
	const { data } = await clientPonder.query({
		query: SAVINGS_RATES_QUERY,
	})

	if (!data) {
		return {
			rates: [],
			proposals: [],
		}
	}

	const rates: LeadrateRateQuery[] = data.savingsRateChangeds.items.map((rate: any) => ({
		id: rate.id,
		created: Number(rate.created),
		blockheight: Number(rate.blockheight),
		txHash: rate.txHash,
		approvedRate: Number(rate.approvedRate),
	}))

	const proposals: LeadrateProposed[] = data.savingsRateProposeds.items.map((proposal: any) => ({
		id: proposal.id,
		created: Number(proposal.created),
		blockheight: Number(proposal.blockheight),
		txHash: proposal.txHash,
		proposer: getAddress(proposal.proposer),
		nextRate: Number(proposal.nextRate),
		nextChange: Number(proposal.nextChange),
	}))

	return {
		rates,
		proposals,
	}
}

export async function fetchSavingsUserData(account?: string): Promise<SavingsUserData> {
	const { data } = await clientPonder.query({
		query: account ? SAVINGS_USER_QUERY : SAVINGS_USER_QUERY_ALL,
		variables: {
			...(account && { account: account.toLowerCase() }),
		},
	})
	console.log(data)
	if (!data) {
		return {
			save: [],
			interest: [],
			withdraw: [],
		}
	}

	const saved: Array<SavingsSavedQuery> = data.savingsSaveds.items.map((save: any) => ({
		id: save.id,
		created: Number(save.created),
		blockheight: Number(save.blockheight),
		txHash: save.txHash,
		account: getAddress(save.account),
		amount: save.amount,
		rate: Number(save.rate),
		total: save.total,
		balance: save.balance,
	}))

	const interest: Array<SavingsInterestQuery> = data.savingsInterests.items.map((int: any) => ({
		id: int.id,
		created: Number(int.created),
		blockheight: Number(int.blockheight),
		txHash: int.txHash,
		account: getAddress(int.account),
		amount: int.amount,
		rate: Number(int.rate),
		total: int.total,
		balance: int.balance,
	}))

	const withdrawn: Array<SavingsWithdrawQuery> = data.savingsWithdrawns.items.map((withdraw: any) => ({
		id: withdraw.id,
		created: Number(withdraw.created),
		blockheight: Number(withdraw.blockheight),
		txHash: withdraw.txHash,
		account: getAddress(withdraw.account),
		amount: withdraw.amount,
		rate: Number(withdraw.rate),
		total: withdraw.total,
		balance: withdraw.balance,
	}))

	return {
		save: saved,
		interest,
		withdraw: withdrawn,
	}
}
