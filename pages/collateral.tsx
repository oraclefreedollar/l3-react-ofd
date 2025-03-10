import Head from 'next/head'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
import { useTranslation } from 'next-i18next'
import { withServerSideTranslations } from 'utils/withServerSideTranslations'
import { InferGetServerSidePropsType } from 'next'
import { useOpenPositionsByCollateral } from 'store/positions'
import { PositionQuery } from 'meta/positions'
import { SavingsActions } from 'store/savings'

const namespaces = ['collateral']

const Overview: React.FC = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { t } = useTranslation(namespaces)

	const dispatch = useAppDispatch()

	const openPositionsByCollateral = useOpenPositionsByCollateral()
	const [list, setList] = useState<PositionQuery[]>([])
	const { address } = useAccount()
	const chainId = useChainId()
	const { totalSupply } = useTokenData(ADDRESS[chainId].oracleFreeDollar)

	useEffect(() => {
		dispatch(SavingsActions.getAll({ account: address, totalOFDSupply: totalSupply }))
	}, [address, chainId, dispatch, totalSupply])

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
			} else return BigInt(position.isOriginal ? position.availableForClones : position.availableForMinting) !== 0n
		})

		return makeUnique(filteredPositions)
	}, [openPositions, makeUnique])

	useEffect(() => {
		setList(matchingPositions)
	}, [matchingPositions])

	const headers: string[] = useMemo(
		() => [
			t('collateral:table:collateral'),
			t('collateral:table:loanToValue'),
			t('collateral:table:effectiveInterest'),
			t('collateral:table:liquidationPrice'),
			t('collateral:table:maturity'),
		],
		[t]
	)

	return (
		<div>
			<Head>
				<title>
					{envConfig.AppName} - {t('collateral:title')}
				</title>
			</Head>

			<AppPageHeader title={t('collateral:headerTitle')} />
			<Table>
				<TableHeader actionCol headers={headers} />
				<TableBody>
					{list.length === 0 ? (
						<TableRowEmpty>{t('collateral:noSavings')}</TableRowEmpty>
					) : (
						list.map((r) => <BorrowPositionRow item={r} key={r.position} />)
					)}
				</TableBody>
			</Table>
		</div>
	)
}

export const getServerSideProps = withServerSideTranslations(namespaces)

export default Overview
