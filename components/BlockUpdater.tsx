import { useEffect, useState } from 'react'
import { useBlockNumber, useChainId } from 'wagmi'

import { envConfig } from 'app.env.config'
import { useIsConnectedToCorrectChain } from 'hooks/useWalletConnectStats'
import { useAppDispatch } from 'store/hooks'
import { PricesActions, useIsPricesLoaded } from 'store/prices'
import { PositionsActions, useCollateralERC20Infos, useIsPositionsLoaded, useMintERC20Infos } from 'store/positions'
import { ERC20Info } from 'meta/positions'
import { useChainSwitchListener } from 'hooks/useChainSwitchListener'

let initializing: boolean = false
let loading: boolean = false

export default function BockUpdater({ children }: { children?: React.ReactElement | React.ReactElement[] }) {
	const dispatch = useAppDispatch()
	const chainId = useChainId()

	useChainSwitchListener()

	const { error, data } = useBlockNumber({ chainId, watch: true })
	const isConnectedToCorrectChain = useIsConnectedToCorrectChain()

	const [initialized, setInitialized] = useState<boolean>(false)
	const [latestHeight, setLatestHeight] = useState<number>(0)
	const [latestMintERC20Infos, setLatestMintERC20Infos] = useState<ERC20Info[]>([])
	const [latestCollateralERC20Infos, setLatestCollateralERC20Infos] = useState<ERC20Info[]>([])
	const [latestConnectedToChain, setLatestConnectedToChain] = useState<boolean>(false)

	const loadedPositions: boolean = useIsPositionsLoaded()
	const loadedPrices: boolean = useIsPricesLoaded()
	const mintERC20Infos = useMintERC20Infos()
	const collateralERC20Infos = useCollateralERC20Infos()

	// --------------------------------------------------------------------------------
	// Init
	useEffect(() => {
		if (initialized) return
		if (initializing) return
		initializing = true

		dispatch(PositionsActions.getAll({ chainId })).unwrap()
		dispatch(PricesActions.update({ chainId }))
	}, [dispatch, chainId, initialized])

	// --------------------------------------------------------------------------------
	// Init done
	useEffect(() => {
		if (initialized) return
		if (loadedPositions && loadedPrices) {
			setInitialized(true)
		}
	}, [initialized, loadedPositions, loadedPrices])

	// --------------------------------------------------------------------------------
	// Bock update policies
	useEffect(() => {
		if (!initialized) return
		if (loading) return

		// verify
		if (!data || error) return
		const fetchedLatestHeight: number = parseInt(data.toString())

		// New block? set new state
		if (fetchedLatestHeight <= latestHeight) return
		loading = true
		setLatestHeight(fetchedLatestHeight)

		// Block update policy: EACH BLOCK
		// console.log(`Policy [BlockUpdater]: EACH BLOCK ${fetchedLatestHeight}`);
		dispatch(PositionsActions.getAll({ chainId })).unwrap()

		// Block update policy: EACH 10 BLOCKS
		if (fetchedLatestHeight % 10 === 0) {
			// console.log(`Policy [BlockUpdater]: EACH 10 BLOCKS ${fetchedLatestHeight}`);
			// dispatch(PricesActions.update());
		}

		// Block update policy: EACH 100 BLOCKS
		if (fetchedLatestHeight % 100 === 0) {
			// console.log(`Policy [BlockUpdater]: EACH 100 BLOCKS ${fetchedLatestHeight}`);
			// dispatch(PricesActions.update());
		}

		// Unlock block updates
		loading = false
	}, [initialized, error, data, latestHeight, dispatch, chainId])

	// --------------------------------------------------------------------------------
	// ERC20 Info changes
	useEffect(() => {
		if (mintERC20Infos.length == 0 || collateralERC20Infos.length == 0) return

		if (mintERC20Infos.length != latestMintERC20Infos.length) setLatestMintERC20Infos(mintERC20Infos)
		if (collateralERC20Infos.length != latestCollateralERC20Infos.length) setLatestCollateralERC20Infos(collateralERC20Infos)

		dispatch(PricesActions.update({ chainId }))
	}, [chainId, mintERC20Infos, collateralERC20Infos, latestMintERC20Infos, latestCollateralERC20Infos, dispatch])

	// --------------------------------------------------------------------------------
	// Connected to correct chain changes
	useEffect(() => {
		if (isConnectedToCorrectChain !== latestConnectedToChain) {
			setLatestConnectedToChain(isConnectedToCorrectChain)
		}
	}, [isConnectedToCorrectChain, latestConnectedToChain])

	if (initialized) {
		return <>{children}</>
	} else {
		return (
			// TODO: remake loading component
			<div className="flex items-center justify-center gap-4 h-screen text-neon-purple">
				<picture>
					<img alt="Logo" className="h-10 rounded-full" src="/assets/ofd-white.png" />
				</picture>
				<h1>{envConfig.AppName} is loading...</h1>
			</div>
		)
	}
}
