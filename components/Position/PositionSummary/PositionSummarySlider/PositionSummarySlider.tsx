import React, { useCallback } from 'react'
import ReactSlider from 'react-slider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Tooltip } from 'flowbite-react'
import { PositionCreateFormState } from 'contexts/position/types'
import { usePositionFormContext } from 'contexts/position'

type Props = {
	fieldName: keyof PositionCreateFormState
	label: string
	min?: number
	onChangeValue: (field: keyof PositionCreateFormState, value: number) => void
	percentage: number
	tooltip?: string
}

export const ZoomProps = {
	MAX: 1000000,
	MIN: 10000,
	STEP: 100,
}

const PositionSummarySlider: React.FC<Props> = (props) => {
	const { label, onChangeValue, fieldName, min, tooltip, percentage } = props
	const { errors } = usePositionFormContext()

	const minimum = min ?? ZoomProps.MIN

	const onSliderChange = useCallback(
		(value: number) => {
			onChangeValue(fieldName, Math.trunc(value))
		},
		[fieldName, onChangeValue]
	)

	const onAdd = useCallback(() => {
		const newZoom = Math.min(percentage + ZoomProps.STEP, ZoomProps.MAX)
		onSliderChange(newZoom)
	}, [onSliderChange, percentage])

	const onSubtract = useCallback(() => {
		const newZoom = Math.max(percentage - ZoomProps.STEP, minimum)
		onSliderChange(newZoom)
	}, [minimum, onSliderChange, percentage])

	return (
		<div className="flex justify-between items-center pb-3 pt-4 border-b border-purple-500/20">
			<div className="flex gap-3 items-center">
				<div className="text-gray-300">{label}</div>
				{tooltip && (
					<Tooltip className="max-w-xs" content={tooltip}>
						<FontAwesomeIcon className="h-4 w-4 cursor-help text-gray-400 hover:text-gray-500" icon={faCircleQuestion} />
					</Tooltip>
				)}
			</div>
			<div className="grid grid-rows-1 md:grid-row-2  w-full max-w-lg">
				<div className="text-white font-bold text-center">{percentage / 1e4} %</div>

				<div className="flex items-center justify-between max-w-lg flex-row flex-1 gap-2">
					<FontAwesomeIcon
						className="cursor-pointer bg-purple-600 rounded flex w-5 outline-none h-5 fill-amber-50 p-2"
						icon={faMinus}
						onClick={onSubtract}
					/>
					<ReactSlider
						className="items-center flex h-4 max-w-sm w-full"
						max={ZoomProps.MAX}
						min={minimum}
						onChange={onSliderChange}
						renderTrack={(props, state) => (
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-expect-error
							// eslint-disable-next-line react/prop-types
							<div {...props} className={`${props.className} ${state.index === 0 ? 'bg-purple-500' : 'bg-purple-200'}`} />
						)}
						step={ZoomProps.STEP}
						thumbClassName="bg-purple-600 h-5 w-5 rounded-full cursor-pointer outline-none"
						trackClassName="h-1 items-center rounded-sm cursor-pointer"
						value={percentage}
					/>
					<FontAwesomeIcon
						className="cursor-pointer bg-purple-600 rounded flex w-5 outline-none h-5 fill-amber-50 p-2"
						icon={faPlus}
						onClick={onAdd}
					/>
				</div>
				{errors[fieldName] && <div className="mt-2 px-1 text-red-500 font-medium text-center">{errors[fieldName]}</div>}
			</div>
		</div>
	)
}

export default PositionSummarySlider
