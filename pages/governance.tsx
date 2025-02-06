import AppBox from 'components/AppBox'
import AppPageHeader from 'components/AppPageHeader'
import Button from 'components/Button'
import DisplayAmount from 'components/DisplayAmount'
import DisplayLabel from 'components/DisplayLabel'
import GuardToAllowedChainBtn from 'components/Guards/GuardToAllowedChainBtn'
import MinterProposal from 'components/MinterProposal'
import OFDPSHolder from 'components/OFDPSHolder'
import { ABIS, ADDRESS } from 'contracts'
import {
	useContractUrl,
	useDelegationQuery,
	useGovStats,
	useMinterQuery,
	useOFDPSHolders,
	useTokenData,
	useWriteContractWithToast,
} from 'hooks'
import { shortenAddress } from 'utils'
import Head from 'next/head'
import Link from 'next/link'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { isAddress, zeroAddress } from 'viem'
import { useAccount, useChainId } from 'wagmi'
import { envConfig } from 'app.env.config'
import { useVotingPowers } from 'hooks/useVotingPowers'
import GovernanceLeadrateCurrent from 'components/Governance/GovernanceLeadrateCurrent'
import GovernanceLeadrateTable from 'components/Governance/GovernanceLeadrateTable'
import { store } from 'redux/redux.store'
import { fetchSavings } from 'redux/slices/savings.slice'
import AppCard from 'components/AppCard'
import { useTranslation } from 'next-i18next'
import { withServerSideTranslations } from 'utils/withServerSideTranslations'

const namespaces = ['common', 'governance']

const Governance: React.FC = () => {
	const { t } = useTranslation(namespaces)

	const [inputField, setInputField] = useState('')
	const [delegator, setDelegator] = useState(zeroAddress)
	const [error, setError] = useState('')

	const { chain } = useAccount()
	const { address } = useAccount()
	const chainId = useChainId()
	const equityUrl = useContractUrl(ADDRESS[chainId].equity)
	const account = address || zeroAddress

	const { minters } = useMinterQuery()
	const delegationData = useDelegationQuery(account)
	const delegationStats = useGovStats(delegationData.pureDelegatedFrom)
	const ofdpsHolders = useOFDPSHolders()
	const votingPowers = useVotingPowers(ofdpsHolders.holders)

	const userRawVotesPercent = delegationStats.totalVotes === 0n ? 0n : (delegationStats.userVotes * 10000n) / delegationStats.totalVotes
	const userTotalVotesPercent =
		delegationStats.totalVotes === 0n ? 0n : (delegationStats.userTotalVotes * 10000n) / delegationStats.totalVotes

	const { totalSupply } = useTokenData(ADDRESS[chainId].oracleFreeDollar)
	useEffect(() => {
		store.dispatch(fetchSavings(address, totalSupply))
	}, [address, totalSupply])

	const onChangeDelegatee = useCallback(
		(e: any) => {
			setInputField(e.target.value)

			if (isAddress(e.target.value)) {
				setError('')
				setDelegator(e.target.value)
			} else {
				setError(t('governance:delegation:form:error'))
			}
		},
		[t]
	)

	const toastContent = useMemo(
		() => [
			{
				title: t('common:toasts:governance:delegateTo'),
				value: delegator,
			},
		],
		[delegator, t]
	)

	const { loading: isConfirming, writeFunction: handleDelegate } = useWriteContractWithToast({
		contractParams: {
			abi: ABIS.EquityABI,
			address: ADDRESS[chainId].equity,
			args: [delegator],
			functionName: 'delegateVoteTo',
		},
		toastSuccess: {
			title: t('common:toasts:governance:success'),
			rows: toastContent,
		},
		toastPending: {
			title: t('common:toasts:governance:pending'),
			rows: toastContent,
		},
		refetchFunctions: [delegationStats.refetch],
	})

	return (
		<>
			<Head>
				<title>
					{envConfig.AppName} - {t('governance:title')}
				</title>
			</Head>
			<div>
				<AppPageHeader link={equityUrl} title="Governance" />
				<section className="grid grid-cols-1 md:grid-cols-2 gap-4 container mx-auto">
					<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8 border border-purple-500/50 flex flex-col">
						<div className="text-lg font-bold text-center">{t('governance:delegation:title')}</div>
						<div className="mt-5">
							<div className="px-1 flex-1">{t('governance:delegation:form:label')}</div>
							<div className="flex-1 gap-2 items-center rounded-lg bg-slate-800 p-2">
								<div
									className={`flex-1 gap-1 rounded-lg text-white p-1 bg-slate-600 border-2 ${
										error ? 'border-red-300' : 'border-neutral-100 border-slate-600'
									}`}
								>
									<input
										className="w-full flex-1 rounded-lg bg-transparent px-2 py-1 text-lg"
										onChange={onChangeDelegatee}
										placeholder={t('governance:delegation:form:placeholder')}
										value={inputField}
									/>
								</div>
								<div className="mx-auto mt-2 max-w-full flex-col">
									<GuardToAllowedChainBtn>
										<Button disabled={delegator == zeroAddress || !!error} isLoading={isConfirming} onClick={() => handleDelegate()}>
											{t('governance:delegation:form:button')}
										</Button>
									</GuardToAllowedChainBtn>
								</div>
							</div>
							<div className="mt-2 px-1 text-red-500">{error}</div>
						</div>
						<div className="bg-slate-900 rounded-xl p-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
							<AppBox>
								<DisplayLabel label="Delegated To" />
								{delegationData.delegatedTo == zeroAddress ? (
									'---'
								) : (
									<Link
										className="underline"
										href={chain?.blockExplorers?.default.url + '/address/' + delegationData.delegatedTo}
										rel="noreferrer"
										target="_blank"
									>
										{shortenAddress(delegationData.delegatedTo)}
									</Link>
								)}
							</AppBox>
							<AppBox>
								<DisplayLabel label={t('governance:delegation:stats:yourRawVotes')} />
								{(Number(userRawVotesPercent) / 100).toFixed(2)} %
							</AppBox>
							<AppBox>
								<DisplayLabel label={t('governance:delegation:stats:totalVotes')} />
								<DisplayAmount amount={delegationStats.totalVotes} digits={24} />
							</AppBox>
							<AppBox>
								<DisplayLabel label={t('governance:delegation:stats:yourTotalVotes')} />
								{(Number(userTotalVotesPercent) / 100).toFixed(2)} %
							</AppBox>
						</div>
						<div className="mt-4 text-lg font-bold text-center">{t('governance:delegatingToYou:title')}</div>
						{delegationStats.delegatedFrom.length > 0 && (
							<div className="bg-slate-900 rounded-xl p-4 grid grid-cols-1 gap-2">
								{delegationStats.delegatedFrom.map((from) => {
									const votePercent = delegationStats.totalVotes === 0n ? 0n : (from.votes * 10000n) / delegationStats.totalVotes
									return (
										<Link
											className="p-4 bg-slate-800 rounded-xl flex hover:bg-slate-700 duration-300"
											href={chain?.blockExplorers?.default.url + '/address/' + from.owner}
											key={from.owner}
											target="_blank"
										>
											<div className="underline">{shortenAddress(from.owner)}</div>
											<span className="ml-auto">{(Number(votePercent) / 100).toFixed(2)} %</span>
										</Link>
									)
								})}
							</div>
						)}
					</div>
					<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8">
						<div className="mt-4 text-lg font-bold text-center">{t('governance:proposals:title')}</div>
						<div className="bg-slate-900 rounded-xl p-4 flex flex-col gap-2">
							{minters.map((minter: any) => (
								<MinterProposal helpers={delegationStats.delegatedFrom.map((e) => e.owner)} key={minter.id} minter={minter} />
							))}
						</div>
					</div>
				</section>

				<section className="flex flex-col gap-3">
					<AppPageHeader link={equityUrl} title={t('governance:baseRate:title')} />
					<AppCard className="p-4 mb-2">
						<div>{t('governance:baseRate:description')}</div>
					</AppCard>

					<GovernanceLeadrateCurrent />

					<GovernanceLeadrateTable />
				</section>
				<section className="mt-4">
					<AppPageHeader link={equityUrl} title={t('governance:topVoters:title')} />
					<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8">
						<div className="bg-slate-900 rounded-xl p-4 flex flex-col gap-2">
							{votingPowers.votesData.map((power) => (
								<OFDPSHolder
									holder={power.holder}
									key={power.holder}
									ofdps={power.ofdps}
									totalVotingPower={votingPowers.totalVotes}
									votingPower={power.votingPower}
								/>
							))}
						</div>
					</div>
				</section>
			</div>
		</>
	)
}

export const getServerSideProps = withServerSideTranslations(namespaces)

export default Governance
