import { faArrowUpRightFromSquare, faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Address, Hash, zeroAddress } from 'viem'
import { shortenAddress } from 'utils/format'
import { useContractUrl, useTxUrl } from 'hooks/useContractUrl'
import Link from 'next/link'

interface Props {
	address: Address
	showCopy?: boolean
	showLink?: boolean
}

export default function AddressLabel({ address, showCopy, showLink }: Props) {
	const link = useContractUrl(address)

	const content = () => {
		return (
			<>
				{shortenAddress(address)}
				{showCopy && <FontAwesomeIcon className="w-3 ml-2 cursor-pointer" icon={faCopy} onClick={handleCopy} />}
				{showLink && <FontAwesomeIcon className="w-3 ml-2 cursor-pointer" icon={faArrowUpRightFromSquare} />}
			</>
		)
	}

	const handleCopy = (e: any) => {
		e.preventDefault()
		navigator.clipboard.writeText(address)
	}

	return (
		<>
			{showLink ? (
				<Link className="flex items-center" href={link} target="_blank">
					{content()}
				</Link>
			) : (
				<div className="flex items-center">{content()}</div>
			)}
		</>
	)
}

export function AddressLabelSimple({ address, showLink }: Props) {
	const link = useContractUrl(address || zeroAddress)

	const openExplorer = (e: any) => {
		e.preventDefault()
		window.open(link, '_blank')
	}

	return (
		<div>
			<span className={showLink ? 'cursor-pointer' : ''} onClick={(e) => (showLink ? openExplorer(e) : undefined)}>
				{shortenAddress(address)}
			</span>
			{showLink && (
				<span>
					<FontAwesomeIcon className="w-3 ml-2 my-auto cursor-pointer" icon={faArrowUpRightFromSquare} onClick={openExplorer} />
				</span>
			)}
		</div>
	)
}

type TxLabelSimpleProps = {
	label: string
	tx: Hash
	showLink?: boolean
	className?: string
}

export function TxLabelSimple({ label, tx, showLink, className }: TxLabelSimpleProps) {
	const link = useTxUrl(tx)

	const openExplorer = (e: any) => {
		e.preventDefault()
		window.open(link, '_blank')
	}

	return (
		<div className={className}>
			<span className={showLink ? 'cursor-pointer' : ''} onClick={(e) => (showLink ? openExplorer(e) : undefined)}>
				{label}
			</span>
			{showLink && (
				<span>
					<FontAwesomeIcon className="w-3 ml-2 my-auto cursor-pointer" icon={faArrowUpRightFromSquare} onClick={openExplorer} />
				</span>
			)}
		</div>
	)
}
