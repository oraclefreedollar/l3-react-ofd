import { BigNumberInput } from './BigNumberInput'

interface Props {
	label?: string
	symbol: string
	placeholder?: string
	balanceLabel?: string
	max?: bigint
	digit?: bigint | number
	hideMaxLabel?: boolean
	limit?: bigint
	limitLabel?: string
	output?: string
	note?: string
	value?: string
	onChange?: (value: string) => void
	error?: string
}

export default function NormalInput({
	label = 'Send',
	placeholder = 'Input Amount',
	symbol,
	max = 0n,
	digit = 18n,
	output,
	note,
	value,
	onChange,
	error,
}: Props) {
	return (
		<div>
			<div className="mb-1 flex gap-2 px-1">
				<div className="flex-1">{label}</div>
			</div>

			<div className="flex items-center rounded-lg bg-slate-800 p-2">
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
								onChange={(e) => onChange?.(e)}
								placeholder={placeholder}
								value={value || ''}
							/>
						</div>
					)}
				</div>

				<div className="hidden w-16 text-center font-bold sm:block">{symbol}</div>
			</div>
			{error && <div className="mt-2 px-1 text-red-500">{error}</div>}
		</div>
	)
}
