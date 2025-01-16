import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Tooltip } from "flowbite-react"

interface Props {
	label?: string
	placeholder?: string
	value?: string
	onChange?: (value: string) => void
	error?: string
	tooltip?: string
}

export default function AddressInput({ label, placeholder, value, error, onChange, tooltip }: Props) {
	return (
		<div>
			<div className="mb-1 flex gap-2 px-1">
				<span>{label}</span>
				{tooltip && (
					<Tooltip content={tooltip}>
						<FontAwesomeIcon className="h-4 w-4 cursor-help text-gray-400 hover:text-gray-500" icon={faCircleQuestion} />
					</Tooltip>
				)}
			</div>
			<div className="flex gap-2 items-center rounded-lg bg-slate-800 p-2">
				<div
					className={`flex-1 gap-1 rounded-lg text-white p-1 bg-slate-600 border-2 ${
						error ? 'border-red-300' : 'border-neutral-100 border-slate-600'
					}`}
				>
					<input
						className="w-full flex-1 rounded-lg bg-transparent px-2 py-1 text-lg"
						onChange={(e) => onChange?.(e.target.value)}
						placeholder={placeholder}
						value={value}
					/>
				</div>
			</div>
			<div className="mt-2 px-1 text-red-500">{error}</div>
		</div>
	)
}
