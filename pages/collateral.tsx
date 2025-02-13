import Head from 'next/head'
import { useCallback, useEffect, useMemo, useState } from 'react'
import AppPageHeader from 'components/AppPageHeader'
import { envConfig } from 'app.env.config'
import Table from 'components/Table'
import TableBody from 'components/Table/TableBody'
import TableHeader from 'components/Table/TableHead'
import TableRowEmpty from 'components/Table/TableRowEmpty'
import BorrowPositionRow from 'components/Borrow/BorrowPositionRow'
import { useAppDispatch } from 'store'
import { ADDRESS } from 'contracts'
import { useTokenData } from 'hooks'
import { useAccount, useChainId } from 'wagmi'
import { useOpenPositionsByCollateral } from 'store/positions'
import { PositionQuery } from 'meta/positions'
import { SavingsActions } from 'store/savings'

export default function Overview() {
	const dispatch = useAppDispatch()

	const openPositionsByCollateral = useOpenPositionsByCollateral()
	const [list, setList] = useState<PositionQuery[]>([])
	const { address } = useAccount()
	const chainId = useChainId()
	const { totalSupply } = useTokenData(ADDRESS[chainId].oracleFreeDollar)

	useEffect(() => {
		dispatch(SavingsActions.getAll({ account: address, totalOFDSupply: totalSupply }))
	}, [address, dispatch, totalSupply])

	const openPositions = useMemo(() => openPositionsByCollateral.flat(1), [openPositionsByCollateral])

	const makeUnique = useCallback((positions: PositionQuery[]) => {
		const highestMaturityMap = new Map()
		positions.forEach((pos) => {
			const key = pos.original + '-' + pos.price
			if (!highestMaturityMap.has(key)) {
				highestMaturityMap.set(key, pos)
			} else {
				const highest = highestMaturityMap.get(key)
				if (pos.expiration > highest.expiration) {
					highestMaturityMap.set(key, pos)
				}
			}
		})
		return Array.from(highestMaturityMap.values())
	}, [])

	const matchingPositions = useMemo(() => {
		const filteredPositions = openPositions.filter((position) => {
			if (position.closed || position.denied) {
				return false
			} else if (position.cooldown * 1000 > Date.now()) {
				return false // under cooldown
			} else if (BigInt(position.isOriginal ? position.availableForClones : position.availableForMinting) === 0n) {
				return false
			} else {
				return true
			}
		})

		return makeUnique(filteredPositions)
	}, [openPositions, makeUnique])

	useEffect(() => {
		setList(matchingPositions)
	}, [matchingPositions])

	const headers: string[] = ['Collateral', 'Loan-to-Value', 'Effective Interest', 'Liquidation Price', 'Maturity', 'Action']

	return (
		<div>
			<Head>
				<title>{envConfig.AppName} - Collateral</title>
			</Head>

			<AppPageHeader title="Mint fresh OFD" />
			<Table>
				<TableHeader headers={headers} />
				<TableBody>
					{list.length === 0 ? (
						<TableRowEmpty>{'There are no savings yet.'}</TableRowEmpty>
					) : (
						list.map((r) => <BorrowPositionRow item={r} key={r.position} />)
					)}
				</TableBody>
			</Table>
		</div>
	)
}
