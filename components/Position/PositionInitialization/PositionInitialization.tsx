import React from 'react'
import TokenInput from 'components/Input/TokenInput'
import NormalInput from 'components/Input/NormalInput'
import Link from 'next/link'

type Props = {
	initError: string
	initPeriod: bigint
	onChangeInitPeriod: (value: string) => void
	onChangeInitialCollAmount: (value: string) => void
	userOFDBalance: bigint
}

const PositionInitialization: React.FC<Props> = (props) => {
	const { initError, initPeriod, onChangeInitPeriod, onChangeInitialCollAmount, userOFDBalance } = props

	return (
		<div className="bg-slate-950 rounded-xl p-4 flex flex-col gap-y-4">
			<div className="text-lg font-bold justify-center mt-3 flex">Initialization</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
				<TokenInput
					digit={18}
					disabled
					error={userOFDBalance < BigInt(1000 * 1e18) ? 'Not enough OFD' : ''}
					hideMaxLabel
					label="Proposal Fee"
					onChange={onChangeInitialCollAmount}
					symbol="OFD"
					value={BigInt(1000 * 1e18).toString()}
				/>
				<NormalInput
					digit={0}
					error={initError}
					hideMaxLabel
					label="Initialization Period"
					onChange={onChangeInitPeriod}
					placeholder="Initialization Period"
					symbol="days"
					value={initPeriod.toString()}
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
