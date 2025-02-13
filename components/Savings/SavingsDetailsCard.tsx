import AppCard from 'components/AppCard'
import { formatCurrency } from 'utils/format'
import { formatUnits } from 'viem'
import { CoinTicker } from 'meta/coins'
import { useTranslation } from 'next-i18next'

interface Props {
	balance: bigint
	change: bigint
	direction: boolean
	interest: bigint
	locktime: bigint
}

const namespaces = ['common', 'savings']

export default function SavingsDetailsCard({ balance, change, direction, interest, locktime }: Props) {
	const { t } = useTranslation(namespaces)

	return (
		<AppCard>
			<div className="text-lg font-bold text-center">{t('savings:outcome:title')}</div>
			<div className="p-4 flex flex-col gap-2">
				<div className="flex">
					<div className="flex-1">{t('savings:outcome:balance')}</div>
					<div className="">
						{formatCurrency(formatUnits(balance, 18))} {CoinTicker.OFD}
					</div>
				</div>
				<div className="flex">
					<div className="flex-1">{direction ? t('savings:outcome:addToYourWallet') : t('savings:outcome:withdrawFromWallet')}</div>
					<div className="">
						{formatCurrency(formatUnits(change, 18))} {CoinTicker.OFD}
					</div>
				</div>
				<div className="flex">
					<div className="flex-1">{t('savings:outcome:interest')}</div>
					<div className="">
						{formatCurrency(formatUnits(interest, 18))} {CoinTicker.OFD}
					</div>
				</div>
				<hr className="border-slate-700 border-dashed" />
				<div className="flex font-bold">
					<div className="flex-1">{t('savings:outcome:resultingBalance')}</div>
					<div className="">
						{formatCurrency(formatUnits(balance + change + interest, 18))} {CoinTicker.OFD}
					</div>
				</div>

				<div className="flex mt-8">
					<div className={`flex-1 text-sm`}>
						{t('savings:outcome:locktime')}
						<span className="font-semibold text-text-primary">
							{locktime > 0
								? t('savings:outcome:locktime2', { hours: formatCurrency((parseFloat(locktime.toString()) / 60 / 60).toString()) })
								: ''}
						</span>
					</div>
				</div>
			</div>
		</AppCard>
	)
}
