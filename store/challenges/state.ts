import {
	ApiChallengesChallengers,
	ApiChallengesListing,
	ApiChallengesMapping,
	ApiChallengesPositions,
	ApiChallengesPrices,
} from 'meta/challenges'

export type ChallengesState = {
	error: string | null
	loaded: boolean

	list: ApiChallengesListing
	mapping: ApiChallengesMapping
	challengers: ApiChallengesChallengers
	positions: ApiChallengesPositions
	challengesPrices: ApiChallengesPrices
}

export const initialState: ChallengesState = {
	error: null,
	loaded: false,
	list: { num: 0, list: [] },
	mapping: { num: 0, challenges: [], map: {} },
	challengers: { num: 0, challengers: [], map: {} },
	positions: { num: 0, positions: [], map: {} },
	challengesPrices: { num: 0, ids: [], map: {} },
}
