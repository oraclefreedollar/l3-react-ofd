import { ABIS, ADDRESS } from 'contracts'
import { useContractUrl, useWriteContractWithToast } from 'hooks'
import { formatBigInt, formatDate, formatDuration, isDateExpired, shortenAddress } from 'utils'
import Link from 'next/link'
import { Address } from 'viem'
import { useChainId } from 'wagmi'
import AppBox from './AppBox'
import Button from './Button'

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

export default function MinterProposal({ minter, helpers }: Props) {
	const minterUrl = useContractUrl(minter.minter)
	const isVotingFinished = isDateExpired(BigInt(minter.applyDate) + BigInt(minter.applicationPeriod))
	const status = !minter.vetor ? (isVotingFinished ? 'Passed' : 'Active') : 'Vetoed'

	const chainId = useChainId()

	const toastContent = [{ title: 'Reason:', value: 'No' }]

	const { loading: isConfirming, writeFunction: handleVeto } = useWriteContractWithToast({
		contractParams: {
			address: ADDRESS[chainId].oracleFreeDollar,
			abi: ABIS.OracleFreeDollarABI,
			functionName: 'denyMinter',
			args: [minter.minter, helpers, 'No'],
		},
		toastPending: {
			title: 'Vetoing proposal...',
			rows: toastContent,
		},
		toastSuccess: {
			title: 'Successfully vetoed',
			rows: toastContent,
		},
	})

	return (
		<AppBox className="grid grid-cols-6 hover:bg-slate-700 duration-300">
			<div className="col-span-6 sm:col-span-5 pr-4">
				<div className="flex">
					<div>Date:</div>
					<div className="ml-auto">{formatDate(minter.applyDate)}</div>
				</div>
				<div className="flex">
					<div>Minter:</div>
					<Link className="underline ml-auto" href={minterUrl} rel="noreferrer" target="_blank">
						{shortenAddress(minter.minter)}
					</Link>
				</div>
				<div className="flex">
					<div>Comment:</div>
					<div className="ml-auto font-bold">{minter.applyMessage}</div>
				</div>
				<div className="flex">
					<div>Fee:</div>
					<div className="ml-auto">{formatBigInt(minter.applicationFee, 18)} OFD</div>
				</div>
				<div className="flex">
					<div>Voting Period:</div>
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
						Veto
					</Button>
				)}
			</div>
		</AppBox>
	)
}
