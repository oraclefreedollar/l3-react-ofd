import { Tooltip } from 'flowbite-react'
import Link from 'next/link'

interface Props {
	title: string
	className?: string
	link?: string
	backTo?: string
	backText?: string
	tooltip?: string
}

export default function AppPageHeader({ title, className, link, backTo, backText, tooltip }: Props) {
	const content = () => {
		return link ? (
			<Link
				className="text-neon-purple hover:text-neon-pink transition-all duration-300 ease-in-out"
				href={link}
				target="_blank"
			>
				{title}
			</Link>
		) : (
			<span className="text-neon-purple">{title}</span>
		)
	}

	return (
		<section className={`my-5 flex grid-cols-8 flex-col gap-2 py-4 sm:flex-row lg:grid ${className}`}>
			<div>
				{backTo && (
					<Link
						className="text-neon-purple-subtle hover:text-neon-pink-subtle transition-all duration-300 ease-in-out"
						href={backTo}
					>
						{backText}
					</Link>
				)}
			</div>
			<h1 className="font-xl col-span-6 flex-1 text-center mx-auto text-xl font-bold">
				{!tooltip ? (
					content()
				) : (
					<Tooltip arrow content={tooltip} style="light">
						{content()}
					</Tooltip>
				)}
			</h1>
		</section>
	)
}
