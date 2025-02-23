import { useTranslation } from 'next-i18next'

interface Props {
	headers: string[]
	actionCol?: boolean
	colSpan?: number
}

export default function TableHeader({ headers, actionCol, colSpan }: Props) {
	const { t } = useTranslation('common')

	return (
		<div className="hidden items-center justify-between rounded-t-lg bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md border-purple-500/50 py-5 px-8 md:flex xl:px-16">
			<div className={`hidden flex-grow grid-cols-2 items-center text-gray-300 md:grid md:grid-cols-${colSpan || headers.length}`}>
				{headers.map((header, i) => (
					<span className="leading-tight" key={`table-header-${i}`}>
						{header}
					</span>
				))}
			</div>
			{actionCol && <div className="w-40 flex-shrink-0">{t('common:table:action')}</div>}
		</div>
	)
}
