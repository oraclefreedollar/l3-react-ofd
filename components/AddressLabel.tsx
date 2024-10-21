import { faArrowUpRightFromSquare, faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Address } from 'viem'
import { shortenAddress } from 'utils/format'
import { useContractUrl } from 'hooks/useContractUrl'
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
