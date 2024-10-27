import React, { useCallback } from 'react'
import TokenInput from 'components/Input/TokenInput'
import NormalInput from 'components/Input/NormalInput'
import Link from 'next/link'
import { usePositionCreate } from 'contexts/position'

type Props = {
	userBalanceOFD: bigint
}

const PositionInitialization: React.FC<Props> = (props: Props) => {
	const { userBalanceOFD } = props
	const { form, errors, handleChange } = usePositionCreate()

	const onChangeInitialCollAmount = useCallback(
		(value: string) => {
			const valueBigInt = BigInt(value)
			handleChange('initialCollAmount', valueBigInt)
		},
		[handleChange]
	)

	const onChangeInitPeriod = useCallback(
		(value: string) => {
			const valueBigInt = BigInt(value)
			handleChange('initPeriod', valueBigInt)
		},
		[handleChange]
	)

	return (
		<div className="bg-slate-950 rounded-xl p-4 flex flex-col gap-y-4">
			<div className="text-lg font-bold justify-center mt-3 flex">Initialization</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
				<TokenInput
					digit={18}
					disabled
					error={userBalanceOFD < BigInt(1000 * 1e18) ? 'Not enough OFD' : ''}
					hideMaxLabel
					label="Proposal Fee"
					onChange={onChangeInitialCollAmount}
					symbol="OFD"
					value={BigInt(1000 * 1e18).toString()}
				/>
				<NormalInput
					digit={0}
					error={errors['initPeriod']}
					hideMaxLabel
					label="Initialization Period"
					onChange={onChangeInitPeriod}
					placeholder="Initialization Period"
					symbol="days"
					value={form.initPeriod.toString()}
				/>
			</div>
			<div>
				It is recommended to{' '}
				<Link href="https://github.com/oracleFreeDollar-OFD/oracleFreeDollar/discussions" target="_blank">
					{' '}
					discuss{' '}
				</Link>{' '}
				new positions before initiating them to increase the probability of passing the decentralized governance process.
			</div>
		</div>
	)
}

export default PositionInitialization
