import { createSlice, Dispatch } from "@reduxjs/toolkit";
import { Address } from "viem";
import { fetchSavingsRates, fetchSavingsUserData } from "pages/api/savings";
import {
    ApiLeadrateInfo,
    ApiLeadrateProposed,
    ApiLeadrateRate,
    ApiSavingsInfo,
    ApiSavingsUserTable,
    DispatchApiLeadrateInfo,
    DispatchApiLeadrateProposed,
    DispatchApiLeadrateRate,
    DispatchApiSavingsInfo,
    DispatchApiSavingsUserTable,
    DispatchBoolean,
    SavingsState,
} from "./savings.types";

// Initial state
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
};

// Slice definition
export const slice = createSlice({
    name: "savings",
    initialState,
    reducers: {
        hasError(state, action: { payload: string }) {
            state.error = action.payload;
        },
        setLoaded: (state, action: { payload: boolean }) => {
            state.loaded = action.payload;
        },
        setLeadrateInfo: (state, action: { payload: ApiLeadrateInfo }) => {
            state.leadrateInfo = action.payload;
        },
        setLeadrateProposed: (state, action: { payload: ApiLeadrateProposed }) => {
            state.leadrateProposed = action.payload;
        },
        setLeadrateRate: (state, action: { payload: ApiLeadrateRate }) => {
            state.leadrateRate = action.payload;
        },
        setSavingsInfo: (state, action: { payload: ApiSavingsInfo }) => {
            state.savingsInfo = action.payload;
        },
        setSavingsUserTable: (state, action: { payload: ApiSavingsUserTable }) => {
            state.savingsUserTable = action.payload;
        },
        setSavingsAllUserTable: (state, action: { payload: ApiSavingsUserTable }) => {
            state.savingsAllUserTable = action.payload;
        },
    },
});

export const reducer = slice.reducer;
export const actions = slice.actions;

// Thunk action
export const fetchSavings =
    (account: Address | undefined) =>
    async (
        dispatch: Dispatch<
            | DispatchBoolean
            | DispatchApiLeadrateInfo
            | DispatchApiLeadrateProposed
            | DispatchApiLeadrateRate
            | DispatchApiSavingsInfo
            | DispatchApiSavingsUserTable
        >
    ) => {
        try {
            console.log("Loading [REDUX]: Savings");

            // Fetch rates and proposals
            const { rates, proposals } = await fetchSavingsRates();
            
            // Transform rates data
            const currentRate = rates[0] || { approvedRate: 0 };
            const latestProposal = proposals[0];
            
            // Set leadrate info
            const leadrateInfo: ApiLeadrateInfo = {
                rate: currentRate.approvedRate,
                nextRate: latestProposal?.nextRate || 0,
                nextchange: latestProposal?.nextChange || 0,
                isProposal: !!latestProposal,
                isPending: !!latestProposal && latestProposal.nextChange > Math.floor(Date.now() / 1000),
            };
            dispatch(slice.actions.setLeadrateInfo(leadrateInfo));

            // Set leadrate proposed
            const leadrateProposed: ApiLeadrateProposed = {
                created: latestProposal?.created || 0,
                blockheight: latestProposal?.blockheight || 0,
                nextRate: latestProposal?.nextRate || 0,
                nextchange: latestProposal?.nextChange || 0,
                num: proposals.length,
                list: proposals,
            };
            dispatch(slice.actions.setLeadrateProposed(leadrateProposed));

            // Set leadrate rate
            const leadrateRate: ApiLeadrateRate = {
                created: currentRate?.created || 0,
                blockheight: currentRate?.blockheight || 0,
                rate: currentRate?.approvedRate || 0,
                num: rates.length,
                list: rates,
            };
            dispatch(slice.actions.setLeadrateRate(leadrateRate));

            // Fetch all users data
            const allUsersData = await fetchSavingsUserData();
            console.log(allUsersData);
            dispatch(slice.actions.setSavingsAllUserTable(allUsersData));

            // Calculate savings info
            const totalSaved = allUsersData.save.reduce((sum, item) => sum + Number(item.amount), 0);
            const totalWithdrawn = allUsersData.withdraw.reduce((sum, item) => sum + Number(item.amount), 0);
            const totalInterest = allUsersData.interest.reduce((sum, item) => sum + Number(item.amount), 0);
            
            const savingsInfo: ApiSavingsInfo = {
                totalSaved,
                totalWithdrawn,
                totalBalance: allUsersData.save[0]?.balance ? Number(allUsersData.save[0].balance) : 0,
                totalInterest,
                rate: leadrateInfo.rate,
                ratioOfSupply: 0, // This needs additional calculation based on total supply
            };
            dispatch(slice.actions.setSavingsInfo(savingsInfo));

            console.log(savingsInfo);

            // Fetch specific user data if account is provided
            if (account) {
                const userData = await fetchSavingsUserData(account);
                dispatch(slice.actions.setSavingsUserTable(userData));
            } else {
                dispatch(slice.actions.setSavingsUserTable(initialState.savingsUserTable));
            }

            dispatch(slice.actions.setLoaded(true));
        } catch (error) {
            dispatch(slice.actions.hasError(error instanceof Error ? error.message : 'An error occurred'));
            dispatch(slice.actions.setLoaded(true));
        }
    };