import { Address } from 'viem'
import { bsc, bscTestnet, mainnet } from 'wagmi/chains'
import { base, polygon } from 'viem/chains'

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
	[base.id]: {
		bridge: '0x62e9e41925e9e1973f219ae6784e7fdc6e54fe37',
		equity: '0xd97cf080d7f78c3b5e1a0bd74f9d685cf2071a2c',
		mintingHub: '0xbab0c2a7b11357245b03a4e81e04435d3893c97e',
		oracleFreeDollar: '0x7479791022eb1030bbc3b09f6575c5db4ddc0b90',
		positionRoller: '0xacef382a305b850c1b2fa35521ddd57e5425045c',
		savings: '0x1ccadd1577cdbb95f3c404fd22ccc82f3ef1531c',
		usdt: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
	},
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
		usdt: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // Ethereum uses USDC. Consider handle it in a proper way
	},
	[polygon.id]: {
		bridge: '0xca8d28d62d863f52795c9fdcae73c6eeb0ff504c',
		equity: '0x35868f0c44f43d2f0b0ca1adc52b38937d0b1df9',
		mintingHub: '0x178C2Eb681943Ee06D1735ee1f4898aE42E8A03c',
		oracleFreeDollar: '0x9cfb3b1b217b41c4e748774368099dd8dd7e89a1',
		positionRoller: '0x0465d5d4abe0383322a33147317a2c0ed2fce8d8',
		savings: '0x204843b865d87ef85f72801784bed3efc15e7c1d',
		usdt: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
	},
}
