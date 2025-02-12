import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useBlockNumber } from 'wagmi'

import { envConfig } from 'app.env.config'
import { fetchPositionsList } from 'store/slices/positions.slice'
import { ERC20Info } from 'store/slices/positions.types'
import { useIsConnectedToCorrectChain } from 'hooks/useWalletConnectStats'
import { WAGMI_CHAIN } from 'app.config'
import { RootState } from 'store/types'
import { useAppDispatch } from 'store/hooks'
import { PricesActions, useIsPricesLoaded } from 'store/prices'

let initializing: boolean = false
let loading: boolean = false

export default function BockUpdater({ children }: { children?: React.ReactElement | React.ReactElement[] }) {
	const dispatch = useAppDispatch()

	const { error, data } = useBlockNumber({ chainId: WAGMI_CHAIN.id, watch: true })
	const isConnectedToCorrectChain = useIsConnectedToCorrectChain()

	const [initialized, setInitialized] = useState<boolean>(false)
	const [latestHeight, setLatestHeight] = useState<number>(0)
	const [latestMintERC20Infos, setLatestMintERC20Infos] = useState<ERC20Info[]>([])
	const [latestCollateralERC20Infos, setLatestCollateralERC20Infos] = useState<ERC20Info[]>([])
	const [latestConnectedToChain, setLatestConnectedToChain] = useState<boolean>(false)

	const loadedPositions: boolean = useSelector((state: RootState) => state.positions && state.positions.loaded)
	const loadedPrices: boolean = useIsPricesLoaded()
	const { mintERC20Infos, collateralERC20Infos } = useSelector((state: RootState) => state.positions)

	// --------------------------------------------------------------------------------
	// Init
	useEffect(() => {
		if (initialized) return
		if (initializing) return
		initializing = true

		dispatch(fetchPositionsList())
		dispatch(PricesActions.update())
	}, [dispatch, initialized])

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
		dispatch(fetchPositionsList())

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
	}, [initialized, error, data, latestHeight, dispatch])

	// --------------------------------------------------------------------------------
	// ERC20 Info changes
	useEffect(() => {
		if (mintERC20Infos.length == 0 || collateralERC20Infos.length == 0) return

		if (mintERC20Infos.length != latestMintERC20Infos.length) setLatestMintERC20Infos(mintERC20Infos)
		if (collateralERC20Infos.length != latestCollateralERC20Infos.length) setLatestCollateralERC20Infos(collateralERC20Infos)

		dispatch(PricesActions.update())
	}, [mintERC20Infos, collateralERC20Infos, latestMintERC20Infos, latestCollateralERC20Infos, dispatch])

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
