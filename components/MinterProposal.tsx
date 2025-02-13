import { ABIS, ADDRESS } from 'contracts'
import { useContractUrl, useWriteContractWithToast } from 'hooks'
import { formatBigInt, formatDate, formatDuration, isDateExpired, shortenAddress } from 'utils'
import Link from 'next/link'
import { Address } from 'viem'
import { useChainId } from 'wagmi'
import AppBox from './AppBox'
import Button from './Button'
import { useTranslation } from 'next-i18next'
import React, { useMemo } from 'react'
import { CoinTicker } from 'meta/coins'

type Props = {
	minter: Minter
	helpers: Address[]
}

type Minter = {
	applicationFee: bigint
	applicationPeriod: bigint
	applyDate: bigint
	applyMessage: string
	denyDate: string
	denyMessage: string
	id: string
	minter: Address
	suggestor: string
	vetor: string
}

const namespaces = ['common', 'governance']

const MinterProposal: React.FC<Props> = ({ minter, helpers }: Props) => {
	const { t } = useTranslation(namespaces)
	const chainId = useChainId()

	const minterUrl = useContractUrl(minter.minter)
	const isVotingFinished = isDateExpired(BigInt(minter.applyDate) + BigInt(minter.applicationPeriod))
	const status = useMemo(
		() =>
			!minter.vetor
				? isVotingFinished
					? t('governance:minterProposal:status:passed')
					: t('governance:minterProposal:status:active')
				: t('governance:minterProposal:status:vetoed'),
		[isVotingFinished, minter.vetor, t]
	)

	const toastContent = useMemo(
		() => [{ title: t('common:toasts:governance:minterProposal:title'), value: t('common:toasts:governance:minterProposal:description') }],
		[t]
	)

	const { loading: isConfirming, writeFunction: handleVeto } = useWriteContractWithToast({
		contractParams: {
			address: ADDRESS[chainId].oracleFreeDollar,
			abi: ABIS.OracleFreeDollarABI,
			functionName: 'denyMinter',
			args: [minter.minter, helpers, 'No'],
		},
		toastPending: {
			title: t('common:toasts:governance:minterProposal:pending'),
			rows: toastContent,
		},
		toastSuccess: {
			title: t('common:toasts:governance:minterProposal:success'),
			rows: toastContent,
		},
	})

	return (
		<AppBox className="grid grid-cols-6 hover:bg-slate-700 duration-300">
			<div className="col-span-6 sm:col-span-5 pr-4">
				<div className="flex">
					<div>{t('governance:minterProposal:date')}</div>
					<div className="ml-auto">{formatDate(minter.applyDate)}</div>
				</div>
				<div className="flex">
					<div>{t('governance:minterProposal:minter')}</div>
					<Link className="underline ml-auto" href={minterUrl} rel="noreferrer" target="_blank">
						{shortenAddress(minter.minter)}
					</Link>
				</div>
				<div className="flex">
					<div>{t('governance:minterProposal:comment')}</div>
					<div className="ml-auto font-bold">{minter.applyMessage}</div>
				</div>
				<div className="flex">
					<div>{t('governance:minterProposal:fee')}</div>
					<div className="ml-auto">
						{formatBigInt(minter.applicationFee, 18)} {CoinTicker.OFD}
					</div>
				</div>
				<div className="flex">
					<div>{t('governance:minterProposal:votingPeriod')}</div>
					<div className="ml-auto">{formatDuration(minter.applicationPeriod)}</div>
				</div>
			</div>
			<div className="col-span-6 sm:col-span-1 border-t sm:border-t-0 sm:border-l border-dashed pt-4 sm:pl-4 mt-4 sm:mt-0 flex flex-col">
				<div
					className={`rounded-xl text-white text-center ${
						status == 'Passed' ? 'bg-green-800' : status == 'Active' ? 'bg-green-600' : 'bg-gray-700'
					}`}
				>
					{status}
				</div>
				{status == 'Active' && (
					<Button className="mt-auto" isLoading={isConfirming} onClick={() => handleVeto()}>
						{t('governance:minterProposal:button')}
					</Button>
				)}
			</div>
		</AppBox>
	)
}

export default MinterProposal
