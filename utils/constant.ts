import { envConfig } from 'app.env.config'

export const SOCIAL = {
	Github_contract: 'https://github.com/oraclefreedollar/ofd',
	Github_dapp: 'https://github.com/SELISEdigitalplatforms/l3-react-ofd',
	GitLab: '',
	Telegram: 'https://t.me/+Yxg3Q9q4B3g0OWY0',
	Twitter: 'https://x.com/OFD_BNB',
	SubStack: '',
	Forum: '',
	Docs: 'https://oracle-free-dollar.gitbook.io/ofd',
	DefiLlama: 'https://defillama.com/protocol/oraclefreedollar#information',
	Uniswap_Mainnet: '',
	Uniswap_Polygon: '',
	Uniswap_Arbitrum: '',
	Uniswap_Optimism: '',
	Uniswap_WOFDPS_Polygon: '',
	Audit_Blockbite: 'https://github.com/Frankencoin-ZCHF/FrankenCoin/blob/main/audits/blockbite-audit.pdf',
	Audit_Code4rena: 'https://code4rena.com/reports/2023-04-frankencoin',
	Audit_Chainsecurity: 'https://www.chainsecurity.com/security-audit/frankencoin-smart-contracts',
	Partner_Arktionariat: '',
	Partner_DfxSwiss: '',
	Partner_Ammer: '',
	Partner_Zipper: '',
}

export const OPEN_POSITION_FEE: bigint = 3500n * 10n ** 36n

export const ENABLE_EMERGENCY_MODE: boolean = envConfig.EMERGENCY_MODE === 'enabled'
