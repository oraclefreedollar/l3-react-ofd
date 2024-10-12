import Link from 'next/link'
import { useAccount } from 'wagmi'
import { shortenHash, transactionLink } from 'utils'
import { Hash } from 'viem'

export const renderErrorToast = (error: any) => {
	const errorLines: string[] = error.message.split('\n')
	return (
		<TxToast
			rows={errorLines.slice(0, errorLines.length - 3).map((line) => {
				return {
					title: '',
					value: line,
				}
			})}
			title="Transaction Failed!"
		/>
	)
}

export const TxToast = (props: { title: string; rows: { title: string; value?: string | JSX.Element; hash?: Hash }[] }) => {
	const { title, rows } = props
	const { chain } = useAccount()
	let reasonLine: number

	return (
		<div className="flex flex-col">
			<div className="font-bold mb-2">{title}</div>
			{rows.map((row, i) => {
				if (row.value?.toString().includes('with the following reason')) reasonLine = i + 1
				return (
					<div className="flex items-center gap-1 justify-between text-sm" key={row.title} style={{ minHeight: 8 }}>
						{row.title && <div>{row.title}</div>}
						{row.hash ? (
							<Link className="text-link" href={transactionLink(chain?.blockExplorers?.default.url, row.hash)} target="_blank">
								{shortenHash(row.hash)}
							</Link>
						) : (
							<div className={i == reasonLine ? 'font-bold uppercase' : ''}>{row.value}</div>
						)}
					</div>
				)
			})}
		</div>
	)
}
