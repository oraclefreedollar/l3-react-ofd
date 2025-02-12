import { createSlice, Dispatch } from "@reduxjs/toolkit";
import { gql } from '@apollo/client/core';
import {
  ApiChallengesChallengers,
  ApiChallengesListing,
  ApiChallengesMapping,
  ApiChallengesPositions,
  ApiChallengesPrices,
  ChallengesState,
  DispatchApiChallengesChallengers,
  DispatchApiChallengesListing,
  DispatchApiChallengesMapping,
  DispatchApiChallengesPositions,
  DispatchApiChallengesPrices,
  DispatchBoolean,
  ChallengesQueryItem,
  ChallengesQueryItemMapping,
  ChallengesChallengersMapping,
  ChallengesPositionsMapping,
  ChallengesPricesMapping,
  ChallengesQueryStatus,
} from "./challenges.types";
import { clientPonder } from "app.config";

export const initialState: ChallengesState = {
  error: null,
  loaded: false,
  list: { num: 0, list: [] },
  mapping: { num: 0, challenges: [], map: {} },
  challengers: { num: 0, challengers: [], map: {} },
  positions: { num: 0, positions: [], map: {} },
  challengesPrices: { num: 0, ids: [], map: {} },
};

export const slice = createSlice({
  name: "challenges",
  initialState,
  reducers: {
    hasError(state, action: { payload: string }) {
      state.error = action.payload;
    },
    setLoaded: (state, action: { payload: boolean }) => {
      state.loaded = action.payload;
    },
    setList: (state, action: { payload: ApiChallengesListing }) => {
      state.list = action.payload;
    },
    setMapping: (state, action: { payload: ApiChallengesMapping }) => {
      state.mapping = action.payload;
    },
    setChallengers: (state, action: { payload: ApiChallengesChallengers }) => {
      state.challengers = action.payload;
    },
    setPositions: (state, action: { payload: ApiChallengesPositions }) => {
      state.positions = action.payload;
    },
    setPrices: (state, action: { payload: ApiChallengesPrices }) => {
      state.challengesPrices = action.payload;
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;

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
  });

  if (!challenges.data?.challenges?.items?.length) {
    return [];
  }

  return challenges.data.challenges.items;
};

// Add this type near your other Dispatch types
type DispatchError = {
    type: 'challenges/hasError'
    payload: string
}

// Update the dispatch type in fetchChallengesList
export const fetchChallengesList = () => async (
  dispatch: Dispatch<
    | DispatchBoolean
    | DispatchApiChallengesListing
    | DispatchApiChallengesMapping
    | DispatchApiChallengesChallengers
    | DispatchApiChallengesPositions
    | DispatchApiChallengesPrices
    | DispatchError
  >
) => {
  try {
    console.log("Loading [REDUX]: ChallengesList");

    // Fetch all challenges
    const allChallenges = await fetchChallenges();

    // Create mappings
    const challengesMapping: ChallengesQueryItemMapping = {};
    const challengersMapping: ChallengesChallengersMapping = {};
    const positionsMapping: ChallengesPositionsMapping = {};

    for (const challenge of allChallenges) {
      // Challenges mapping
      challengesMapping[challenge.id] = challenge;

      // Challengers mapping
      const challengerKey = challenge.challenger.toLowerCase() as `0x${string}`;
      if (!challengersMapping[challengerKey]) {
        challengersMapping[challengerKey] = [];
      }
      challengersMapping[challengerKey].push(challenge);

      // Positions mapping
      const positionKey = challenge.position.toLowerCase() as `0x${string}-challenge-${bigint}`;
      if (!positionsMapping[positionKey]) {
        positionsMapping[positionKey] = [];
      }
      positionsMapping[positionKey].push(challenge);
    }

    // Create prices mapping from challenge data
    const prices: ChallengesPricesMapping = {};
    allChallenges
      .filter(c => c.status === ChallengesQueryStatus.Active)
      .forEach(c => {
        prices[c.id] = c.liqPrice.toString();
      });

    // Dispatch all updates
    dispatch(slice.actions.setList({
      num: allChallenges.length,
      list: allChallenges
    }));

    dispatch(slice.actions.setMapping({
      num: Object.keys(challengesMapping).length,
      challenges: Object.keys(challengesMapping) as `0x${string}-challenge-${bigint}`[],
      map: challengesMapping
    }));

    dispatch(slice.actions.setChallengers({
      num: Object.keys(challengersMapping).length,
      challengers: Object.keys(challengersMapping) as `0x${string}`[],
      map: challengersMapping
    }));

    dispatch(slice.actions.setPositions({
      num: Object.keys(positionsMapping).length,
      positions: Object.keys(positionsMapping) as `0x${string}-challenge-${bigint}`[],
      map: positionsMapping
    }));

    dispatch(slice.actions.setPrices({
      num: Object.keys(prices).length,
      ids: Object.keys(prices) as `0x${string}-challenge-${bigint}`[],
      map: prices
    }));

    dispatch(slice.actions.setLoaded(true));
  } catch (error) {
    console.error('Error fetching challenges:', error);
    dispatch(slice.actions.hasError(error as string));
  }
};
