import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'

interface Props {
	currency: string
	size?: number
	chain?: 'bsc' | 'mainnet' | 'polygon' | 'arbitrum' | 'optimism' | 'bscTestnet'
}

export default function TokenLogo({ currency, size = 8, chain }: Props) {
	// console.log(currency);
	const [imgExist, setImgExist] = useState(true)
	const [src, setSrc] = useState(`/coin/${currency?.toLowerCase()}.svg`)
	const onImageError = (e: any) => {
		const src = e.target.src
		if (src.includes('.svg')) {
			setSrc(src.replace('.svg', '.png'))
		} else if (src.includes('.png')) {
			setSrc(src.replace('.png', '.jpeg'))
		} else {
			setImgExist(false)
		}
	}

	useEffect(() => {
		setSrc(`/coin/${currency?.toLowerCase()}.svg`)
		setImgExist(true)
	}, [currency])

	return imgExist ? (
		<picture className=" relative">
			<img alt="token-logo" className={`w-${size} h-${size} rounded-full`} onError={onImageError} src={src} />
			{chain && (
				<picture className="absolute bottom-0 right-0 p-px rounded-full bg-slate-800">
					<img alt="token-logo" className={`w-3 h-3 rounded-full`} onError={onImageError} src={`/chain/${chain}.svg`} />
				</picture>
			)}
		</picture>
	) : (
		<FontAwesomeIcon className={`w-${size} h-${size} mr-2`} icon={faCircleQuestion} />
	)
}
