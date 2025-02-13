import { Address } from 'viem'

// --------------------------------------------------------------------------
// Ponder return types
export type ChallengesQueryItem = {
	version: number

	id: ChallengesId
	position: Address
	number: bigint

	challenger: Address
	start: bigint
	created: bigint
	duration: bigint
	size: bigint
	liqPrice: bigint

	bids: bigint
	filledSize: bigint
	acquiredCollateral: bigint
	status: ChallengesStatus
}

export type ApiChallengesListing = {
	num: number
	list: ChallengesQueryItem[]
}
// --------------------------------------------------------------------------
// Service Challenges
export enum ChallengesStatus {
	Active = 'Active',
	Success = 'Success',
}

export type ChallengesId = `${Address}-challenge-${bigint}`
export type ChallengesQueryItemMapping = {
	[key: ChallengesId]: ChallengesQueryItem
}
export type ChallengesChallengersMapping = { [key: Address]: ChallengesQueryItem[] }
export type ChallengesPositionsMapping = { [key: Address]: ChallengesQueryItem[] }
export type ChallengesPricesMapping = { [key: ChallengesId]: string }

export type ApiChallengesMapping = {
	num: number
	challenges: ChallengesId[]
	map: ChallengesQueryItemMapping
}

export type ApiChallengesChallengers = {
	num: number
	challengers: Address[]
	map: ChallengesChallengersMapping
}

export type ApiChallengesPositions = {
	num: number
	positions: Address[]
	map: ChallengesPositionsMapping
}

// Api ChallengePrices
export type ApiChallengesPrices = {
	num: number
	ids: ChallengesId[]
	map: ChallengesPricesMapping
}
