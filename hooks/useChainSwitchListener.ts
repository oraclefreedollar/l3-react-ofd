import { useChainId } from 'wagmi'
import { useAppDispatch } from 'store'
import { PricesActions } from 'store/prices'
import { ChallengesActions } from 'store/challenges'
import { PositionsActions } from 'store/positions'
import { useEffect } from 'react'
import { Chain } from 'utils/chain'

export const useChainSwitchListener = () => {
	const dispatch = useAppDispatch()
	const chainId = useChainId()
	const currentId = Chain.getId()

	useEffect(() => {
		if (currentId !== chainId) {
			Chain.setId(chainId)
			dispatch(PositionsActions.getAll({ chainId }))
			dispatch(PricesActions.update({ chainId }))
			dispatch(ChallengesActions.getAll())
		}
	}, [chainId, currentId, dispatch])
}
