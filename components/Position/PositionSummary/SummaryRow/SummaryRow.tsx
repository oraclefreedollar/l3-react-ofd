import React from 'react'
import { Tooltip } from 'flowbite-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'

type SummaryRowProps = {
	label: string
	value: string
	tooltip?: string
}
export const SummaryRow: React.FC<SummaryRowProps> = ({ label, tooltip, value }) => (
	<div className="flex justify-between items-center py-3 border-b border-purple-500/20">
		<div className="flex gap-3">
			<div className="text-gray-300">{label}</div>
			{tooltip && (
				<Tooltip className="max-w-xs" content={tooltip}>
					<FontAwesomeIcon className="h-4 w-4 cursor-help text-gray-400 hover:text-gray-500" icon={faCircleQuestion} />
				</Tooltip>
			)}
		</div>
		<div className="text-white font-medium text-right">{value}</div>
	</div>
)
