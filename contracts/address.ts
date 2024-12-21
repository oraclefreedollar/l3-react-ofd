import { Address } from 'viem'
import { bsc, bscTestnet } from 'wagmi/chains'

export interface ProtocolAddress {
	bridge: Address
	equity: Address
	mintingHub: Address
	mockVol?: Address
	mockXofd?: Address
	oracleFreeDollar: Address
	positionFactory?: Address
	positionRoller: Address
	savings: Address
	usdt: Address
	// ofdPS: Address;
}

export const ADDRESS: Record<number, ProtocolAddress> = {
	[bscTestnet.id]: {
		oracleFreeDollar: '0xc97c78dbf7D51d50a8e3a423774ad6F921E9b599',
		bridge: '0x2AC1B767378fFDeC4a9f71429a6b5aabEe559e84',
		usdt: '0x0c89580f26951c06e392435364Cb5389194b031c', //BSC-USD/Collateral/XOFD same
		equity: '0x49ea9f8a532f62e0972587704f59ee7364173419',
		mintingHub: '0x3578dc0e62612d6c6cafec526ff6517c51128aed',
		savings: '0x9c8A9A2eB148703aF8e737De8A492b3C3A6540E3',
		positionRoller: '0x3C672bA969D4eD2f9F3F39eeE4Fdfb40fce1c8f9',
		// positionFactory: "0xB11c4Bdcc8971A2544938f4f85B931e4ADE9d208",
	},
	[bsc.id]: {
		oracleFreeDollar: '0xc97c78dbf7D51d50a8e3a423774ad6F921E9b599',
		bridge: '0x2A864A8aD758deB139750548f252D07e1cA64E9C',
		usdt: '0x55d398326f99059fF775485246999027B3197955',
		equity: '0x49eA9f8A532f62e0972587704F59ee7364173419',
		mintingHub: '0x3578dC0e62612d6c6cafec526ff6517c51128AeD',
		savings: '0x9c8A9A2eB148703aF8e737De8A492b3C3A6540E3',
		positionRoller: '0x3C672bA969D4eD2f9F3F39eeE4Fdfb40fce1c8f9',
		// positionFactory: 0x4096831dC711C1A20aC011FBf0AA90A6c56dcF55
		// wFPS: "null", //need to change the address
	},
}
