import { formatBigInt } from 'utils'
import dynamic from 'next/dynamic'
import { useContractUrl } from 'hooks'
import { zeroAddress } from 'viem'
import { MouseEvent } from 'react'
const TokenLogo = dynamic(() => import('./TokenLogo'), { ssr: false })

interface Props {
	amount: bigint
	bold?: boolean
	big?: boolean
	digits?: number | bigint
	currency?: string
	hideLogo?: boolean
	className?: string
	address?: string
	usdPrice?: number
}

export default function DisplayAmount({ amount, bold = false, big, digits = 18, currency, hideLogo, className, address, usdPrice }: Props) {
	const url = useContractUrl(address || zeroAddress)

	const openExplorer = (e: MouseEvent) => {
		e.preventDefault()
		window.open(url, '_blank')
	}

	return (
		<div className={`flex items-center gap-2 ${className}`}>
			{!hideLogo && currency && <TokenLogo currency={currency} />}
			<div>
				<div>
					<span className={`${bold && 'font-bold'} ${big && 'text-3xl'}`}>{formatBigInt(amount, Number(digits))}</span>
					<span>
						&nbsp;
						{address ? (
							<a href={url} onClick={openExplorer} rel="noreferrer" target="_blank">
								{currency}
							</a>
						) : (
							currency
						)}
					</span>
				</div>
				{usdPrice && usdPrice > 0 && (
					<div>
						<span className="text-sm text-slate-500">{formatBigInt(amount * BigInt(usdPrice * 1e18), Number(digits) + 18)} USD</span>
					</div>
				)}
			</div>
		</div>
	)
}
