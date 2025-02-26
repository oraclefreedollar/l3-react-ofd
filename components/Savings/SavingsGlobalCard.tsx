import AppBox from 'components/AppBox'
import AppCard from 'components/AppCard'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ADDRESS } from 'contracts'
import { useChainId } from 'wagmi'
import { useContractUrl } from 'hooks'
import { shortenAddress } from 'utils'
import Link from 'next/link'
import DisplayLabel from 'components/DisplayLabel'
import DisplayAmount from 'components/DisplayAmount'
import { useSavingsInfo } from 'store/savings'
import React from 'react'
import { useTranslation } from 'next-i18next'
import { CoinTicker } from 'meta/coins'

const namespaces = ['savings']

const SavingsGlobalCard: React.FC = () => {
	const { t } = useTranslation(namespaces)

	const { totalBalance, rate } = useSavingsInfo()

	const moduleAddress = ADDRESS[useChainId()].savings
	const url = useContractUrl(moduleAddress)

	return (
		<AppCard>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
				<AppBox>
					<DisplayLabel label={t('savings:infoCard:currentRate')} />
					<DisplayAmount amount={rate / 10_000} className="mt-1" currency="%" hideLogo />
				</AppBox>
				<AppBox>
					<DisplayLabel label={t('savings:infoCard:totalSavings')} />
					<DisplayAmount amount={totalBalance / 10 ** 18} className="mt-1" currency={CoinTicker.OFD} hideLogo />
				</AppBox>
				<AppBox>
					<DisplayLabel label={t('savings:infoCard:moduleContract')} />
					<Link href={url} target="_blank">
						<div className="mt-1">
							{shortenAddress(moduleAddress)}
							<FontAwesomeIcon className="w-3 ml-2" icon={faArrowUpRightFromSquare} />
						</div>
					</Link>
				</AppBox>
			</div>
		</AppCard>
	)
}

export default SavingsGlobalCard
