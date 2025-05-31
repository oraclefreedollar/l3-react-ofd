import { Hash } from 'viem'
import { base, bsc, mainnet, polygon } from 'viem/chains'
import { useChainId } from 'wagmi'
import { bscTestnet } from 'wagmi/chains'

const chainToLinkMapper: { [key: number]: string } = {
	[base.id]: 'https://basescan.org',
	[bsc.id]: 'https://bscscan.com',
	[bscTestnet.id]: 'https://testnet.bscscan.com',
	[mainnet.id]: 'https://etherscan.io',
	[polygon.id]: 'https://polygonscan.com',
}

export const useContractUrl = (address: string) => {
	const chainId = useChainId()
	const explorerLink = chainToLinkMapper[chainId]
	return explorerLink + '/address/' + address
}

export const useTxUrl = (hash: Hash) => {
	const chainId = useChainId()
	const explorerLink = chainToLinkMapper[chainId]
	return explorerLink + '/tx/' + hash
}
