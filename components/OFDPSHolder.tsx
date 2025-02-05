import { Address } from 'viem'
import { formatBigInt } from 'utils/format'
import AddressLabel from './AddressLabel'
import AppBox from './AppBox'
import { CoinTicker } from 'meta/coins'
import { useTranslation } from 'next-i18next'

interface Props {
	holder: Address
	ofdps: bigint
	votingPower: bigint
	totalVotingPower: bigint
}

export default function OFDPSHolder({ holder, ofdps, votingPower, totalVotingPower }: Props) {
	const { t } = useTranslation()
	return (
		<AppBox className="hover:bg-slate-700 duration-300 flex grid grid-cols-1 sm:grid-cols-3">
			<div className="col-span-1">
				<AddressLabel address={holder} showCopy showLink />
			</div>
			<div className="col-span-1 sm:text-center">
				{formatBigInt(ofdps)} {CoinTicker.OFDPS}
			</div>
			<div className="col-span-1 sm:text-right">
				{formatBigInt((votingPower * 10000n) / totalVotingPower, 2)} {t('common:equity:votes')}
			</div>
		</AppBox>
	)
}
