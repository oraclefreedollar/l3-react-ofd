import { Address } from 'viem'
import { bsc, bscTestnet, mainnet } from 'wagmi/chains'

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
		bridge: '0x2ac1b767378ffdec4a9f71429a6b5aabee559e84',
		equity: '0x49ea9f8a532f62e0972587704f59ee7364173419',
		mintingHub: '0x3578dc0e62612d6c6cafec526ff6517c51128aed',
		oracleFreeDollar: '0xc97c78dbf7d51d50a8e3a423774ad6f921e9b599',
		positionRoller: '0x3c672ba969d4ed2f9f3f39eee4fdfb40fce1c8f9',
		savings: '0x9c8a9a2eb148703af8e737de8a492b3c3a6540e3',
		usdt: '0x0c89580f26951c06e392435364cb5389194b031c',
		// positionFactory: "0xB11c4Bdcc8971A2544938f4f85B931e4ADE9d208",
	},
	[bsc.id]: {
		bridge: '0xaeaf85c740c7a6ee94183e848d0e557cb7fbea47',
		equity: '0xc3f061175adc0992290ec0ff4e28b59b364f3f61',
		mintingHub: '0x70e318f5066597868a9026ecccc0e04d693d0fbd',
		oracleFreeDollar: '0x969d3b762c543909d6addc1b7330bdfdc6cc60e6',
		positionRoller: '0x19cf525f751012da6be6dd2646d376b79dcfeb00',
		savings: '0xa654e6e3cc20b8421814fc7ffc80d8c4d8af120b',
		usdt: '0x55d398326f99059ff775485246999027b3197955',
		// positionFactory: 0x4096831dC711C1A20aC011FBf0AA90A6c56dcF55
		// wFPS: "null", //need to change the address
	},
	[mainnet.id]: {
		bridge: '0x77007bd7fc9311180d7b4c6532e15d0feae5703e',
		equity: '0x0619f152892c9dd014086a02516c2545d6f6f747',
		mintingHub: '0xca8d28d62d863f52795c9fdcae73c6eeb0ff504c',
		oracleFreeDollar: '0x591cf237452497335a9850f49f747d95569eb3b1',
		positionRoller: '0x47db60de931cdc550a04db3f1dec079b9c77fd23',
		savings: '0x07c9ed9a7f18d166e25a47a2ac321ad4db5c6b36',
		usdt: '0xdac17f958d2ee523a2206206994597c13d831ec7',
	},
}
