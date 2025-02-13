import { createAsyncThunk } from '@reduxjs/toolkit'
import { clientPonder } from 'app.config'
import { gql } from '@apollo/client/core'
import {
	ApiChallengesChallengers,
	ApiChallengesListing,
	ApiChallengesMapping,
	ApiChallengesPositions,
	ApiChallengesPrices,
	ChallengesChallengersMapping,
	ChallengesPositionsMapping,
	ChallengesPricesMapping,
	ChallengesQueryItem,
	ChallengesQueryItemMapping,
	ChallengesStatus,
} from 'meta/challenges'

const fetchChallenges = async (): Promise<ChallengesQueryItem[]> => {
	const challenges = await clientPonder.query({
		fetchPolicy: 'no-cache',
		query: gql`
			query {
				challenges(orderBy: "status", orderDirection: "asc", limit: 1000) {
					items {
						id
						position
						number
						challenger
						start
						created
						duration
						size
						liqPrice
						bids
						filledSize
						acquiredCollateral
						status
						price
					}
				}
			}
		`,
	})

	if (!challenges.data?.challenges?.items?.length) {
		return []
	}

	return challenges.data.challenges.items
}

type Returned = {
	challengers: ApiChallengesChallengers
	challengesPrices: ApiChallengesPrices
	list: ApiChallengesListing
	mapping: ApiChallengesMapping
	positions: ApiChallengesPositions
}

export const getAll = createAsyncThunk<Returned | undefined, void>('challenges/getAll', async () => {
	try {
		// Fetch all challenges
		const allChallenges = await fetchChallenges()

		// Create mappings
		const challengesMapping: ChallengesQueryItemMapping = {}
		const challengersMapping: ChallengesChallengersMapping = {}
		const positionsMapping: ChallengesPositionsMapping = {}
		// Create prices mapping from challenge data
		const prices: ChallengesPricesMapping = {}

		allChallenges.map((challenge) => {
			// Challenges mapping
			challengesMapping[challenge.id] = challenge

			// Challengers mapping
			const challengerKey = challenge.challenger.toLowerCase() as `0x${string}`
			if (!challengersMapping[challengerKey]) {
				challengersMapping[challengerKey] = []
			}
			challengersMapping[challengerKey].push(challenge)

			// Positions mapping
			const positionKey = challenge.position.toLowerCase() as `0x${string}-challenge-${bigint}`
			if (!positionsMapping[positionKey]) {
				positionsMapping[positionKey] = []
			}
			positionsMapping[positionKey].push(challenge)

			if (challenge.status === ChallengesStatus.Active) {
				prices[challenge.id] = challenge.liqPrice.toString()
			}
		})

		// Dispatch all updates
		const list = {
			num: allChallenges.length,
			list: allChallenges,
		}

		const mapping = {
			num: Object.keys(challengesMapping).length,
			challenges: Object.keys(challengesMapping) as `0x${string}-challenge-${bigint}`[],
			map: challengesMapping,
		}

		const challengers = {
			num: Object.keys(challengersMapping).length,
			challengers: Object.keys(challengersMapping) as `0x${string}`[],
			map: challengersMapping,
		}

		const challengesPrices = {
			num: Object.keys(prices).length,
			ids: Object.keys(prices) as `0x${string}-challenge-${bigint}`[],
			map: prices,
		}

		// Check if only one needed
		const positions = {
			num: Object.keys(positionsMapping).length,
			positions: Object.keys(positionsMapping) as `0x${string}-challenge-${bigint}`[],
			map: positionsMapping,
		}

		return { list, mapping, challengers, positions, challengesPrices }
	} catch (error) {
		console.error('Error fetching challenges:', error)
	}
})
