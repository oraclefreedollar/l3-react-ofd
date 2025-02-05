import { faPlus, faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import React from 'react'

const BorrowOptions: React.FC = () => {
	const { t } = useTranslation('positionBorrow')

	return (
		<div className="mb-8">
			<h2 className="text-2xl font-bold mb-6">{t('positionBorrow:options:title')}</h2>
			<div className="grid md:grid-cols-2 gap-6">
				<Link
					className="w-full text-left bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8 hover:scale-105 transition-all duration-300 flex flex-col border border-purple-500/50 gap-y-4 appearance-none"
					href={'positions/create'}
				>
					<div className="flex justify-center mb-4">
						<div className="p-3 border rounded-lg">
							<FontAwesomeIcon className="w-6 h-6" icon={faPlus} />
						</div>
					</div>
					<h3 className="text-lg font-semibold text-center mb-3">{t('positionBorrow:options:openNewPosition:title')}</h3>
					<p className="text-gray-200 text-sm">{t('positionBorrow:options:openNewPosition:description')}</p>
				</Link>

				<Link
					className="w-full text-left bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md hover:scale-105 transition-all duration-300 rounded-xl p-8 flex flex-col border border-purple-500/50 gap-y-4 appearance-none"
					href={'#positions-table'}
				>
					<div className="flex justify-center mb-4">
						<div className="p-3 border rounded-lg">
							<FontAwesomeIcon className="w-6 h-6" icon={faCopy} />
						</div>
					</div>
					<h3 className="text-lg font-semibold text-center mb-3">{t('positionBorrow:options:cloneExistingPosition:title')}</h3>
					<p className="text-gray-200 text-sm">{t('positionBorrow:options:cloneExistingPosition:description')}</p>
				</Link>
			</div>
		</div>
	)
}

export default BorrowOptions
