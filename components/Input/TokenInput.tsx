import { useAccount } from 'wagmi'
import DisplayAmount from '../DisplayAmount'
import { formatBigInt } from 'utils'
import { BigNumberInput } from './BigNumberInput'
import dynamic from 'next/dynamic'
import { Tooltip } from 'flowbite-react'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const TokenLogo = dynamic(() => import('../TokenLogo'), { ssr: false })

export interface TokenInputProps {
	balanceLabel?: string
	digit?: bigint | number
	disabled?: boolean
	error?: string
	hideMaxLabel?: boolean
	label?: string
	limit?: bigint
	limitLabel?: string
	max?: bigint
	note?: string
	onChange?: (value: string) => void
	output?: string
	placeholder?: string
	symbol: string
	tooltip?: string
	value?: string
}

export default function TokenInput({
	balanceLabel = 'Balance: ',
	digit = 18n,
	disabled,
	error,
	hideMaxLabel,
	label,
	limit = 0n,
	limitLabel,
	max = 0n,
	note,
	onChange,
	output,
	placeholder = 'Input Amount',
	symbol,
	tooltip,
	value,
}: TokenInputProps) {
	const { isConnected } = useAccount()

	return (
		<div>
			<div className="mb-1 flex gap-2 px-1">
				<div className="flex flex-1 items-center gap-2">
					<span>{label}</span>
					{tooltip && (
						<Tooltip className="max-w-sm" content={tooltip}>
							<FontAwesomeIcon className="h-4 w-4 cursor-help text-gray-400 hover:text-gray-500" icon={faCircleQuestion} />
						</Tooltip>
					)}
				</div>
				{isConnected && symbol && (
					<div className={`flex gap-2 items-center cursor-pointer ${hideMaxLabel && 'hidden'}`} onClick={() => onChange?.(max.toString())}>
						{balanceLabel}
						<span className="font-bold text-link">
							{formatBigInt(max, Number(digit))} {symbol}
						</span>
					</div>
				)}
			</div>

			<div className="flex items-center rounded-lg bg-slate-800 p-2">
				<TokenLogo currency={symbol} size={10} />
				<div className="flex-1">
					{output ? (
						<div className="px-3 py-2 font-bold transition-opacity">{output}</div>
					) : (
						<div
							className={`flex gap-1 rounded-lg text-white p-1 bg-slate-600 border-2 ${
								error ? 'border-red-300' : 'border-neutral-100 border-slate-600'
							}`}
						>
							<BigNumberInput
								autofocus={true}
								className={`w-full flex-1 rounded-lg bg-transparent px-2 py-1 text-lg`}
								decimals={Number(digit)}
								disabled={disabled}
								onChange={(e) => onChange?.(e)}
								placeholder={placeholder}
								value={value || ''}
							/>
						</div>
					)}
				</div>

				<div className="hidden px-3 text-end font-bold sm:block">{symbol}</div>
			</div>
			{error && <div className="mt-2 px-1 text-red-500">{error}</div>}
			<div className="mt-2 px-1 flex items-center">
				{limit >= 0n && limitLabel && (
					<>
						<span>{limitLabel} :&nbsp;</span>
						<DisplayAmount amount={limit} currency={symbol} digits={digit} />
					</>
				)}
				{note && <span>{note}</span>}
			</div>
		</div>
	)
}
