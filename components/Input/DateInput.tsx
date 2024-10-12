import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { formatDate } from 'utils/format'
import { faCalendarDays, faHourglassStart } from '@fortawesome/free-solid-svg-icons'
import ReactDatePicker from 'react-datepicker'

interface Props {
	label: string
	hideMax?: boolean
	max: number | bigint
	value: Date
	error?: string
	onChange?: (date: Date | null) => void
}

export default function DateInput({ label, max, value, error, onChange }: Props) {
	return (
		<div>
			<div className="mb-1 flex gap-2 px-1">
				<div className="flex-1">{label}</div>
				<div>
					Limit:{' '}
					<span className="text-link cursor-pointer" onClick={() => onChange && onChange(new Date(Number(max) * 1000))}>
						{formatDate(max)}
					</span>
				</div>
			</div>
			<div className="flex items-center rounded-lg bg-slate-800 p-2">
				<FontAwesomeIcon className="w-10 h-8 mr-2" icon={faHourglassStart} />
				<div className="flex-1">
					<div
						className={`flex gap-1 rounded-lg text-white p-1 bg-slate-600 border-2 ${
							error ? 'border-red-300' : 'border-neutral-100 border-slate-600'
						}`}
					>
						<ReactDatePicker dateFormat={'yyyy-MM-dd'} id="expiration-datepicker" onChange={(e) => onChange?.(e)} selected={value} />
					</div>
				</div>
				<label className="hidden w-20 px-4 text-end font-bold sm:block cursor-pointer" htmlFor="expiration-datepicker">
					<FontAwesomeIcon className="w-10 h-8 ml-2" icon={faCalendarDays} />
				</label>
			</div>
			{error && <div className="mt-2 px-1 text-red-500">{error}</div>}
		</div>
	)
}
