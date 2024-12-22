import { Address } from "viem";

export type SavingsIdSaved = `${Address}-${number}`;
export type SavingsSavedQuery = {
	id: SavingsIdSaved;
	created: number;
	blockheight: number;
	txHash: string;
	account: Address;
	amount: string;
	rate: number;
	total: string;
	balance: string;
};

export type SavingsIdInterest = `${Address}-${number}`;
export type SavingsInterestQuery = {
	id: SavingsIdInterest;
	created: number;
	blockheight: number;
	txHash: string;
	account: Address;
	amount: string;
	rate: number;
	total: string;
	balance: string;
};

export type SavingsIdWithdraw = `${Address}-${number}`;
export type SavingsWithdrawQuery = {
	id: SavingsIdWithdraw;
	created: number;
	blockheight: number;
	txHash: string;
	account: Address;
	amount: string;
	rate: number;
	total: string;
	balance: string;
};

export type ApiSavingsInfo = {
	totalSaved: number;
	totalWithdrawn: number;
	totalBalance: number;
	totalInterest: number;
	rate: number;
	ratioOfSupply: number;
};

export type ApiSavingsUserTable = {
	save: SavingsSavedQuery[];
	interest: SavingsInterestQuery[];
	withdraw: SavingsWithdrawQuery[];
};

export type LeadrateRateQuery = {
	id: string;
	created: number;
	blockheight: number;
	txHash: string;
	approvedRate: number;
};

export type LeadrateProposed = {
	id: string;
	created: number;
	blockheight: number;
	txHash: string;
	proposer: Address;
	nextRate: number;
	nextChange: number;
};

export type ApiLeadrateInfo = {
	rate: number;
	nextRate: number;
	nextchange: number;
	isProposal: boolean;
	isPending: boolean;
};

export type ApiLeadrateRate = {
	created: number;
	blockheight: number;
	rate: number;
	num: number;
	list: LeadrateRateQuery[];
};

export type ApiLeadrateProposed = {
	created: number;
	blockheight: number;
	nextRate: number;
	nextchange: number;
	num: number;
	list: LeadrateProposed[];
};

// --------------------------------------------------------------------------------
export type SavingsState = {
	error: string | null;
	loaded: boolean;

	leadrateInfo: ApiLeadrateInfo;
	leadrateProposed: ApiLeadrateProposed;
	leadrateRate: ApiLeadrateRate;

	savingsInfo: ApiSavingsInfo;

	savingsUserTable: ApiSavingsUserTable;
	savingsAllUserTable: ApiSavingsUserTable;
};

// --------------------------------------------------------------------------------
export type DispatchBoolean = {
	type: string;
	payload: Boolean;
};

export type DispatchApiLeadrateInfo = {
	type: string;
	payload: ApiLeadrateInfo;
};

export type DispatchApiLeadrateProposed = {
	type: string;
	payload: ApiLeadrateProposed;
};

export type DispatchApiLeadrateRate = {
	type: string;
	payload: ApiLeadrateRate;
};

export type DispatchApiSavingsInfo = {
	type: string;
	payload: ApiSavingsInfo;
};

export type DispatchApiSavingsUserTable = {
	type: string;
	payload: ApiSavingsUserTable;
};