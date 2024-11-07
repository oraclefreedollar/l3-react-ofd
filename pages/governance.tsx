import AppBox from 'components/AppBox'
import AppPageHeader from 'components/AppPageHeader'
import Button from 'components/Button'
import DisplayAmount from 'components/DisplayAmount'
import DisplayLabel from 'components/DisplayLabel'
import GuardToAllowedChainBtn from 'components/Guards/GuardToAllowedChainBtn'
import MinterProposal from 'components/MinterProposal'
import OFDPSHolder from 'components/OFDPSHolder'
import { TxToast, renderErrorToast } from 'components/TxToast'
import { ABIS, ADDRESS } from 'contracts'
import { useContractUrl, useDelegationQuery, useGovStats, useMinterQuery, useOFDPSHolders } from 'hooks'
import { shortenAddress } from 'utils'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { isAddress, zeroAddress } from 'viem'
import { useAccount, useChainId } from 'wagmi'
import { waitForTransactionReceipt, writeContract } from 'wagmi/actions'
import { envConfig } from 'app.env.config'
import { useVotingPowers } from 'hooks/useVotingPowers'
import { WAGMI_CONFIG } from 'app.config'

export default function Governance() {
	const [inputField, setInputField] = useState('')
	const [delegator, setDelegator] = useState(zeroAddress)
	const [error, setError] = useState('')
	const [isConfirming, setIsConfirming] = useState(false)

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

	const onChangeDelegatee = (e: any) => {
		setInputField(e.target.value)

		if (isAddress(e.target.value)) {
			setError('')
			setDelegator(e.target.value)
		} else {
			setError('Please input address in valid EOA address format.')
		}
	}

	const handleDelegate = async () => {
		try {
			setIsConfirming(true)

			const delegateHash = await writeContract(WAGMI_CONFIG, {
				address: ADDRESS[chainId].equity,
				abi: ABIS.EquityABI,
				functionName: 'delegateVoteTo',
				args: [delegator],
			})

			const toastContent = [
				{
					title: 'Delegate To:',
					value: delegator,
				},
				{
					title: 'Transaction:',
					hash: delegateHash,
				},
			]

			await toast.promise(waitForTransactionReceipt(WAGMI_CONFIG, { hash: delegateHash, confirmations: 1 }), {
				pending: {
					render: <TxToast rows={toastContent} title={`Delegating Votes`} />,
				},
				success: {
					render: <TxToast rows={toastContent} title="Successfully Delegated Votes" />,
				},
				error: {
					render(error: any) {
						return renderErrorToast(error)
					},
				},
			})
		} finally {
			delegationStats.refetch()
			setIsConfirming(false)
		}
	}

	return (
		<>
			<Head>
				<title>{envConfig.AppName} - Governance</title>
			</Head>
			<div>
				<AppPageHeader link={equityUrl} title="Governance" />
				<section className="grid grid-cols-1 md:grid-cols-2 gap-4 container mx-auto">
					<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8 border border-purple-500/50 flex flex-col">
						<div className="text-lg font-bold text-center">Delegation</div>
						<div className="mt-5">
							<div className="px-1 flex-1">Delegate votes to</div>
							<div className="flex-1 gap-2 items-center rounded-lg bg-slate-800 p-2">
								<div
									className={`flex-1 gap-1 rounded-lg text-white p-1 bg-slate-600 border-2 ${
										error ? 'border-red-300' : 'border-neutral-100 border-slate-600'
									}`}
								>
									<input
										className="w-full flex-1 rounded-lg bg-transparent px-2 py-1 text-lg"
										onChange={onChangeDelegatee}
										placeholder="Delegatee's Address"
										value={inputField}
									/>
								</div>
								<div className="mx-auto mt-2 max-w-full flex-col">
									<GuardToAllowedChainBtn>
										<Button disabled={delegator == zeroAddress || !!error} isLoading={isConfirming} onClick={() => handleDelegate()}>
											Set
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
								<DisplayLabel label="Your Raw Votes" />
								{(Number(userRawVotesPercent) / 100).toFixed(2)} %
							</AppBox>
							<AppBox>
								<DisplayLabel label="Total Votes" />
								<DisplayAmount amount={delegationStats.totalVotes} digits={24} />
							</AppBox>
							<AppBox>
								<DisplayLabel label="Your Total Votes" />
								{(Number(userTotalVotesPercent) / 100).toFixed(2)} %
							</AppBox>
						</div>
						<div className="mt-4 text-lg font-bold text-center">Delegating to You</div>
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
					</div>
					<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8">
						<div className="mt-4 text-lg font-bold text-center">Proposals</div>
						<div className="bg-slate-900 rounded-xl p-4 flex flex-col gap-2">
							{minters.map((minter: any) => (
								<MinterProposal helpers={delegationStats.delegatedFrom.map((e) => e.owner)} key={minter.id} minter={minter} />
							))}
						</div>
					</div>
				</section>
				<section className="mt-4">
					<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8">
						<div className="mt-4 text-lg font-bold text-center">Top Voters</div>
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
