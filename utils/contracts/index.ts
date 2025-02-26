import { swissDLT } from './swissDLT'
import { oprs } from './oprs'
import { Address } from 'viem'
import { dsc } from './dsc'
import { dgc } from './dgc'

const coingeckoPlatforms: Record<Address, string> = {
	'0x90685e300a4c4532efcefe91202dfe1dfd572f47': 'ethereum', // CTA
	'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': 'ethereum', // WETH
}

const toBridgedContract: Record<Address, Address> = {
	'0x2a004afbaed2ffed463b4e149a78becaa441895f': '0x90685e300a4c4532efcefe91202dfe1dfd572f47', // CTA
}

const Constants = {
	coingeckoPlatforms,
	toBridgedContract,
}

const Prices = {
	dsc,
	dgc,
	oprs,
	swissDLT,
}

const Blacklist = ['0xfD5840Cd36d94D7229439859C0112a4185BC0255']

export const Contracts = {
	Blacklist,
	Constants,
	Prices,
}
