import { swissDLT } from './swissDLT'
import { oprs } from './oprs'
import { Address } from 'viem'

const coingeckoPlatforms: Record<Address, string> = {
	'0x90685e300a4c4532efcefe91202dfe1dfd572f47': 'ethereum', // CTA
}

const toBridgedContract: Record<Address, Address> = {
	'0x2a004afbaed2ffed463b4e149a78becaa441895f': '0x90685e300a4c4532efcefe91202dfe1dfd572f47', // CTA
}

const Constants = {
	coingeckoPlatforms,
	toBridgedContract,
}

const Prices = {
	oprs,
	swissDLT,
}

export const Contracts = {
	Constants,
	Prices,
}
