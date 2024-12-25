import AppBox from 'components/AppBox'
import AppCard from 'components/AppCard'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/redux.store'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ADDRESS } from 'contracts'
import { useChainId } from 'wagmi'
import { useContractUrl } from 'hooks'
import { shortenAddress } from 'utils'
import Link from 'next/link'
import DisplayLabel from 'components/DisplayLabel'
import DisplayAmount from 'components/DisplayAmount'

export default function SavingsGlobalCard() {
	const { totalBalance, rate } = useSelector((state: RootState) => state.savings.savingsInfo)

	const moduleAddress = ADDRESS[useChainId()].savings
	const url = useContractUrl(moduleAddress)

	return (
		<AppCard>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
				<AppBox>
					<DisplayLabel label="Current Interest Rate" />
					<DisplayAmount amount={rate / 10_000} className="mt-1" currency="%" hideLogo />
				</AppBox>
				<AppBox>
					<DisplayLabel label="Total Savings" />
					<DisplayAmount amount={totalBalance / 10 ** 18} className="mt-1" currency="OFD" hideLogo />
				</AppBox>
				<AppBox>
					<DisplayLabel label="Module Contract" />
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
