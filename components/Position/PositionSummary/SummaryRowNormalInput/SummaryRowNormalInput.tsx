import React from 'react'
import { PositionCreateFormState } from 'contexts/position/types'
import { usePositionFormContext } from 'contexts/position'
import { Tooltip } from 'flowbite-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import NormalInput, { NormalInputProps } from 'components/Input/NormalInput'

type Props = Omit<NormalInputProps, 'onChange' | 'value' | 'tooltip'> & {
	fieldName: keyof PositionCreateFormState
	label: string
	onChangeValue: (field: keyof PositionCreateFormState, value: string) => void
	tooltip?: string
	value: bigint
}

const SummaryRowNormalInput: React.FC<Props> = (props) => {
	const { onChangeValue, fieldName, label, value, tooltip, ...otherProps } = props
	const { errors } = usePositionFormContext()

	return (
		<div className="flex justify-between items-center py-3 border-b border-purple-500/20">
			<div className="flex gap-3">
				<div className="text-gray-300">{label}</div>
				{tooltip && (
					<Tooltip className="max-w-xs" content={tooltip}>
						<FontAwesomeIcon className="h-4 w-4 cursor-help text-gray-400 hover:text-gray-500" icon={faCircleQuestion} />
					</Tooltip>
				)}
			</div>
			<div className="flex-1 max-w-lg">
				<NormalInput
					{...otherProps}
					error={errors[fieldName]}
					onChange={(value) => onChangeValue(fieldName, value)}
					value={value.toString()}
				/>
			</div>
		</div>
	)
}

export default SummaryRowNormalInput
