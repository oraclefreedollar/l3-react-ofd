import { useAccount } from 'wagmi'
import { useWeb3ModalState } from '@web3modal/wagmi/react'

export const useIsConnectedToCorrectChain = () => {
	const { address, chain, isConnected } = useAccount()
	const { selectedNetworkId } = useWeb3ModalState()

	if (!isConnected || !chain || !address) return false
	return selectedNetworkId ? parseInt(selectedNetworkId) === chain.id : false
}
