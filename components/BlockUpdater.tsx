import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAccount, useBlockNumber } from 'wagmi'
import { Address } from 'viem'

import { envConfig } from 'app.env.config'
import { RootState, store } from 'redux/redux.store'
import { fetchAccount, actions as accountActions } from 'redux/slices/account.slice'
import { fetchPositionsList } from 'redux/slices/positions.slice'
import { ERC20Info } from 'redux/slices/positions.types'
import { fetchPricesList } from 'redux/slices/prices.slice'
import { useIsConnectedToCorrectChain } from 'hooks/useWalletConnectStats'
import { WAGMI_CHAIN } from 'app.config'

let initializing: boolean = false
let loading: boolean = false

export default function BockUpdater({ children }: { children?: React.ReactElement | React.ReactElement[] }) {
	const { error, data } = useBlockNumber({ chainId: WAGMI_CHAIN.id, watch: true })
	const { address } = useAccount()
	const isConnectedToCorrectChain = useIsConnectedToCorrectChain()

	// const [initStart, setInitStart] = useState<number>(0)
	const [initialized, setInitialized] = useState<boolean>(false)
	const [latestHeight, setLatestHeight] = useState<number>(0)
	const [latestMintERC20Infos, setLatestMintERC20Infos] = useState<ERC20Info[]>([])
	const [latestCollateralERC20Infos, setLatestCollateralERC20Infos] = useState<ERC20Info[]>([])
	const [latestConnectedToChain, setLatestConnectedToChain] = useState<boolean>(false)
	const [latestAddress, setLatestAddress] = useState<Address | undefined>(undefined)

	const loadedPositions: boolean = useSelector((state: RootState) => state.positions && state.positions.loaded)
	const loadedPrices: boolean = useSelector((state: RootState) => state.prices && state.prices.loaded)
	const { mintERC20Infos, collateralERC20Infos } = useSelector((state: RootState) => state.positions)

	// --------------------------------------------------------------------------------
	// Init
	useEffect(() => {
		if (initialized) return
		if (initializing) return
		initializing = true

		// setInitStart(Date.now())
		// console.log(`Init [BlockUpdater]: Start loading application data... ${initStart}`);
		store.dispatch(fetchPositionsList())
		store.dispatch(fetchPricesList(store.getState()))
	}, [initialized])

	// --------------------------------------------------------------------------------
	// Init done
	useEffect(() => {
		if (initialized) return
		if (loadedPositions && loadedPrices) {
			// console.log(`Init [BlockUpdater]: Done. ${Date.now() - initStart} ms`);
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
		store.dispatch(fetchPositionsList())
		// TODO: check if needed
		if (latestAddress) store.dispatch(fetchAccount())

		// Block update policy: EACH 10 BLOCKS
		if (fetchedLatestHeight % 10 === 0) {
			// console.log(`Policy [BlockUpdater]: EACH 10 BLOCKS ${fetchedLatestHeight}`);
			// store.dispatch(fetchPricesList(store.getState()));
		}

		// Block update policy: EACH 100 BLOCKS
		if (fetchedLatestHeight % 100 === 0) {
			// console.log(`Policy [BlockUpdater]: EACH 100 BLOCKS ${fetchedLatestHeight}`);
			// store.dispatch(fetchPricesList());
		}

		// Unlock block updates
		loading = false
	}, [initialized, error, data, latestHeight, latestAddress])

	// --------------------------------------------------------------------------------
	// ERC20 Info changes
	useEffect(() => {
		if (mintERC20Infos.length == 0 || collateralERC20Infos.length == 0) return

		if (mintERC20Infos.length != latestMintERC20Infos.length) setLatestMintERC20Infos(mintERC20Infos)
		if (collateralERC20Infos.length != latestCollateralERC20Infos.length) setLatestCollateralERC20Infos(collateralERC20Infos)

		// console.log(`Policy [BlockUpdater]: ERC20 Info changed`);
		store.dispatch(fetchPricesList(store.getState()))
	}, [mintERC20Infos, collateralERC20Infos, latestMintERC20Infos, latestCollateralERC20Infos])

	// --------------------------------------------------------------------------------
	// Connected to correct chain changes
	useEffect(() => {
		if (isConnectedToCorrectChain !== latestConnectedToChain) {
			console.log(`Policy [BlockUpdater]: Connected to correct chain changed: ${isConnectedToCorrectChain}`)
			setLatestConnectedToChain(isConnectedToCorrectChain)
		}
	}, [isConnectedToCorrectChain, latestConnectedToChain])

	// Address / User changes
	useEffect(() => {
		if (!address && latestAddress) {
			setLatestAddress(undefined)
			console.log(`Policy [BlockUpdater]: Address reset`)
			store.dispatch(accountActions.resetAccountState())
		} else if (address && !latestAddress) {
			setLatestAddress(address)
			console.log(`Policy [BlockUpdater]: Address changed to: ${address}`)
			// TODO: check if needed
			store.dispatch(fetchAccount())
		}
	}, [address, latestAddress])

	// --------------------------------------------------------------------------------
	// Loading Guard
	if (initialized) {
		return <>{children}</>
	} else {
		return (
			// TODO: remake loading component
			<div className="flex items-center justify-center gap-4 h-screen">
				<picture>
					<img alt="Logo" className="h-10" src="/assets/oracle-free-dollar-logo-square.svg" />
				</picture>
				<h1>{envConfig.AppName} is loading...</h1>
			</div>
		)
	}
}
