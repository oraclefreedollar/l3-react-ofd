import React from 'react'

interface Props {
	children: React.ReactElement | string
}

export default function TableRowEmpty({ children }: Props) {
	return (
		<div className="bg-slate-800 hover:bg-slate-700 px-8 py-8 xl:px-16 first:border-t-0 sm:first:border-t border-t bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md border-purple-500/50 first:rounded-t-lg sm:first:rounded-t-none last:rounded-b-lg duration-300">
			<div className="flex flex-col justify-between gap-y-5 md:flex-row md:space-x-4">{children}</div>
		</div>
	)
}
