import AppBox from 'components/AppBox'
import TableRow from 'components/Table/TableRow'
import { formatCurrency } from 'utils/format'
import { Address } from 'viem'
import DisplayCollateralBorrowTable from './DisplayCollateralBorrowTable'
import Link from 'next/link'
import { useCoingeckoPrices } from 'store/prices'
import { PositionQuery } from 'meta/positions'
import { useSavingsInfo } from 'store/savings'
import { useTranslation } from 'next-i18next'
import { CoinTicker } from 'meta/coins'

interface Props {
	item: PositionQuery
}

export default function BorrowPositionRow({ item }: Props) {
	const { t } = useTranslation('collateral')

	const coingecko = useCoingeckoPrices()
	const { rate } = useSavingsInfo()
	const collTokenPrice = coingecko[item.collateral.toLowerCase() as Address]?.price?.usd
	const ofdPrice = coingecko[item.ofd.toLowerCase() as Address]?.price?.usd
	if (!collTokenPrice || !ofdPrice) return null
	const interest: number = item.riskPremiumPPM / 10 ** 4
	const reserve: number = item.reserveContribution / 10 ** 4

	const price: number = parseInt(item.price) / 10 ** (36 - item.collateralDecimals)

	const expirationStr = new Date(item.expiration * 1000).toDateString().split(' ')
	const expirationString: string = `${expirationStr[2]} ${expirationStr[1]} ${expirationStr[3]}`

	const effectiveLTV: number = ((price * (1 - reserve / 100)) / collTokenPrice) * ofdPrice * 100
	const effectiveInterest: number = interest / (1 - reserve / 100) + rate / 10 ** 4

	return (
		<>
			<TableRow
				actionCol={
					<Link className="btn btn-primary w-full" href={`/position/${item.position}/borrow`}>
						{t('collateral:table:clone')}
					</Link>
				}
			>
				<div className="flex flex-col max-md:mb-5">
					<AppBox className="md:hidden">
						<DisplayCollateralBorrowTable address={item.collateral} name={item.collateralName} symbol={item.collateralSymbol} />
					</AppBox>
					<div className="max-md:hidden">
						<DisplayCollateralBorrowTable address={item.collateral} name={item.collateralName} symbol={item.collateralSymbol} />
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<div className="col-span-2 text-md">{formatCurrency(effectiveLTV, 2, 2)}%</div>
				</div>

				<div className="flex flex-col gap-2">
					<div className="col-span-2 text-md">{formatCurrency(effectiveInterest, 2, 2)}%</div>
				</div>

				<div className="flex flex-col gap-2">
					<div className="col-span-2 text-md">
						{formatCurrency(price, 2, 2)} {CoinTicker.OFD}
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<div className="col-span-2 text-md">{expirationString}</div>
				</div>
			</TableRow>
		</>
	)
}
