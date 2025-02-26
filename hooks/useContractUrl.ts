import { Hash } from 'viem'
import { bsc, mainnet } from 'viem/chains'
import { useChainId } from 'wagmi'

const chainToLinkMapper: { [key: number]: string } = {
	[bsc.id]: 'https://bscscan.com',
	[mainnet.id]: 'https://etherscan.io',
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
