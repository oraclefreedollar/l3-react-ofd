import { Address } from 'viem'
import { formatBigInt } from 'utils/format'
import AddressLabel from './AddressLabel'
import AppBox from './AppBox'

interface Props {
	holder: Address
	ofdps: bigint
	votingPower: bigint
	totalVotingPower: bigint
}

export default function OFDPSHolder({ holder, ofdps, votingPower, totalVotingPower }: Props) {
	return (
		<AppBox className="hover:bg-slate-700 duration-300 flex grid grid-cols-1 sm:grid-cols-3">
			<div className="col-span-1">
				<AddressLabel address={holder} showCopy showLink />
			</div>
			<div className="col-span-1 sm:text-center">{formatBigInt(ofdps)} OFDPS</div>
			<div className="col-span-1 sm:text-right">{formatBigInt((votingPower * 10000n) / totalVotingPower, 2)} % Votes</div>
		</AppBox>
	)
}
