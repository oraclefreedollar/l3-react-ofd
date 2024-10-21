import { Address } from 'viem'
import { bsc, bscTestnet } from 'wagmi/chains'

export interface ProtocolAddress {
	oracleFreeDollar: Address
	bridge: Address
	usdt: Address
	equity: Address
	mintingHub: Address
	// wFPS: Address;
	// positionFactory?: Address;
	mockVol?: Address
	mockXofd?: Address
	// mockVids?: Address;
	// mockBoss?: Address;
	// mockRealu?: Address;
	// mockTbos?: Address;
	// mockAxelra?: Address;
	// mockCas?: Address;
	// mockDaks?: Address;
	// mockDqts?: Address;
	// mockAfs?: Address;
	// mockArts?: Address;
	// mockVrgns?: Address;
	// mockEggs?: Address;
	// mockPds?: Address;
	// mockVegs?: Address;
	// mockCfes?: Address;
	// mockGmcs?: Address;
	// mockBees?: Address;
	// mockDgcs?: Address;
	// mockCias?: Address;
	// mockFnls?: Address;
	// mockTvpls?: Address;
	// mockPns?: Address;
	// mockVeda?: Address;
	// mockFsags?: Address;
	// mockSpos?: Address;
	// mockEhck?: Address;
	// mockFdos?: Address;
	// mockDilys?: Address;
	// mockNnmls?: Address;
	// mockTsqp?: Address;
	// mockXxs?: Address;
	// mockFors?: Address;
	// mockShrs?: Address;
	// mockSuns?: Address;
	// mockHps?: Address;
	// mockRxus?: Address;
	// mockWmkt?: Address;
	// mockFes?: Address;
	// mockDdcs?: Address;
	// mockLines?: Address;
	// mockDkkb?: Address;
}

export const ADDRESS: Record<number, ProtocolAddress> = {
	// [hardhat.id]: {
	// 	oracleFreeDollar: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
	// 	bridge: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
	// 	xchf: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
	// 	equity: "0xCafac3dD18aC6c6e92c921884f9E4176737C052c",
	// 	mintingHub: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
	// 	mockVol: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
	// 	wFPS: zeroAddress,
	// },
	// [sepolia.id]: {
	// 	oracleFreeDollar: "0x28c4efd564103730160ad1E6A241b30808445363",
	// 	bridge: "0x1Fc726149c6d6CC16C5f23cD9ec004a501D06012",
	// 	xchf: "0xe94c49Dcf0c7D761c173E9C131B132A1Cfb81A80",
	// 	equity: "0x22f3b4CEED90207620C5631b748f65f805bc774f",
	// 	mintingHub: "0x6f43400A93c222666351c05A4e36Ec6A51a5b49B",
	// 	positionFactory: "0x6ad579D11349d70704df66bc78f84Ae5BBce8D4A",
	// 	wFPS: zeroAddress,
	// 	mockVids: "0xbe374758Eca03653ACdB43D91461e3c35669acB4",
	// 	mockBoss: "0x08c03ec7cE1747f01A54f9e79DDdc928b1932f61",
	// 	mockRealu: "0x0F89a805dFcdE077C400f320a74E61bFC2D2e98E",
	// 	mockTbos: "0x7F77405c0B288f9B84C8fDbAff42D5b5c917d3D7",
	// 	mockAxelra: "0x59dAcD3b9f5a4808F5057041f7eDC97a793152f4",
	// 	mockCas: "0x611F02D44ECBe9F552D4b654D222A9AaEc17Dcb6",
	// 	mockDaks: "0xd07834f7A348bC78D66994a64ECDD67030b65BA8",
	// 	mockDqts: "0xD058cBC8d552ED3d66EF7CD602371f348af2E0c7",
	// 	mockAfs: "0xA2fc0b6893553bfEc4a2bf016593FF62f2d2Be7C",
	// 	mockArts: "0xD739cf0619196c456Fa7329140700DC1A737ef02",
	// 	mockVrgns: "0x4572Fdde0e84c5DF4F2C4F2e6a3eA67C816C6A04",
	// 	mockEggs: "0x61f50615064cCA97fFbA4436449987C20b848275",
	// 	mockPds: "0xB40b7095b499f3789a6aa25320e14227D4D959F2",
	// 	mockVegs: "0xBf1eD3b00C3B33a58CA245563EC9139A34a8F446",
	// 	mockCfes: "0x9e601D329d1AfB4D325A1Ac09Fe26C76b4d6b5A1",
	// 	mockGmcs: "0x1Be64F88b4Ed8828e19368F3544e53D944834EEB",
	// 	mockBees: "0x5AadE3c5570E7C3169b991174130589a761BCc47",
	// 	mockDgcs: "0xea89Ab2F84Acc7Cd6a82772cD61995A24314FbB6",
	// 	mockCias: "0x3616bbA2BCE749Ba1f30e492042E4Bd6584c3c1d",
	// 	mockFnls: "0xe1D9f96620B2f91d3360D02b9d5a271181DeB1B7",
	// 	mockTvpls: "0x8b2A6ca85d4a58497D6D2Cc24Aea64a88FdACD85",
	// 	mockPns: "0xA6F0130d359928AE8A9e0F3C919046a309F4e1a8",
	// 	mockVeda: "0x0f0c2337A02AeBe1caE2AC34FDaDF067ef5C1277",
	// 	mockFsags: "0xbB70FC012D6a060Bb66cab828132754ec7915274",
	// 	mockSpos: "0xC2448aC7A2eb098B241E394B89ECf634aA7EA845",
	// 	mockEhck: "0x28a881B08c11a5856C971dbE52f03f1848A13016",
	// 	mockFdos: "0x9020a8f194E413900A304631c71BA1f335322A82",
	// 	mockDilys: "0x9e575060f9E78C2Dd6aEE5d6E3449E06C300e4f6",
	// 	mockNnmls: "0x36b18FCA7C19D1A8a523Db31f15c5482E3697537",
	// 	mockTsqp: "0x2C368ec51691a54c964201b0325ff6AC37EF5403",
	// 	mockXxs: "0xe8992E66451A60d0A524226514E7B43A2E920701",
	// 	mockFors: "0x1878743c481b2e4bfe9A423dc8F983C7ed364bF2",
	// 	mockShrs: "0xFEb3c07C4Ef56D938A0eae401FA37C0618e91b32",
	// 	mockSuns: "0xd2B5d3E0fF43b42e2b53C94995a9471d72a83D8d",
	// 	mockHps: "0x7319A8c28905530DFEF2354b5293Baae209D31d4",
	// 	mockRxus: "0xCF3249d9FD12D566eB1B59C173A1346DC66712E7",
	// 	mockWmkt: "0xEF16CD43Bd53E74547743d2b2279B73564fAaa30",
	// 	mockFes: "0xec4aEea6C825F044CFfB077F9E56a75441c92EC4",
	// 	mockDdcs: "0x96a7D58eCaE2462eAbB5f1bAE31Eb6BE4beaddf1",
	// 	mockLines: "0x0d9a2e156E45628C16F8f94e1E488B62F611A94b",
	// 	mockDkkb: "0xAA115D40D67883a58A1e05d8FB1153473b9b087d",
	// },
	[bscTestnet.id]: {
		oracleFreeDollar: '0x9c06B95640455ae3DEc830A0a05370d4Cd6fFef8',
		bridge: '0xa1Dde8965Ac0A59949ADEfc702A8C22d0fAdb69f',
		usdt: '0x887C14bc51705Eb11E238631a24B4d6305a7B6BD', //BSC-USD/Collateral/XOFD same
		equity: '0x47DeAd2B6150eCEbFD0D5fd2F884a02Ee3966886',
		mintingHub: '0xF92B19b4D4dF3C25F5a238034eF4A0B3c05556a6',
		// positionFactory: "0xB11c4Bdcc8971A2544938f4f85B931e4ADE9d208",
	},
	[bsc.id]: {
		oracleFreeDollar: '0x55899A4Cd6D255DCcAA84d67E3A08043F2123d7E',
		bridge: '0x5330B9275C9094555286998D20c96bc63a9A575f',
		usdt: '0x55d398326f99059fF775485246999027B3197955',
		equity: '0xeA38b0cD48fA781181FDAa37291e8d6668462261',
		mintingHub: '0xFe00054AF44E24f0B4bd49b1A2d2984C4264aabE',
		// positionFactory: 0x4096831dC711C1A20aC011FBf0AA90A6c56dcF55
		// wFPS: "null", //need to change the address
	},
	// [polygon.id]: {
	// 	oracleFreeDollar: "0x02567e4b14b25549331fCEe2B56c647A8bAB16FD",
	// 	bridge: zeroAddress,
	// 	usdt: zeroAddress,
	// 	equity: zeroAddress,
	// 	mintingHub: zeroAddress,
	// 	// wFPS: "0x54Cc50D5CC4914F0c5DA8b0581938dC590d29b3D",
	// },
	// [arbitrum.id]: {
	// 	oracleFreeDollar: "0xB33c4255938de7A6ec1200d397B2b2F329397F9B",
	// 	bridge: zeroAddress,
	// 	usdt: zeroAddress,
	// 	equity: zeroAddress,
	// 	mintingHub: zeroAddress,
	// 	// wFPS: zeroAddress,
	// },
	// [optimism.id]: {
	// 	oracleFreeDollar: "0x4F8a84C442F9675610c680990EdDb2CCDDB8aB6f",
	// 	bridge: zeroAddress,
	// 	usdt: zeroAddress,
	// 	equity: zeroAddress,
	// 	mintingHub: zeroAddress,
	// 	// wFPS: zeroAddress,
	// },
}

export const TokenAddresses = {
	OFD: '0x55899A4Cd6D255DCcAA84d67E3A08043F2123d7E',
	USDT: '0x55d398326f99059fF775485246999027B3197955',
}
