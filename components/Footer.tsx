import Link from 'next/link'
import { SOCIAL } from 'utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faBook, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faTelegram, faXTwitter } from '@fortawesome/free-brands-svg-icons'

interface ButtonProps {
	link: string
	text: string
	icon: IconProp
}

const FooterButton = ({ link, text, icon }: ButtonProps) => {
	return (
		<Link className="flex gap-1 hover:opacity-70" href={link} rel="noreferrer" target="_blank">
			<FontAwesomeIcon className="w-5 h-5" icon={icon} />
			<div className="hidden sm:block">{text}</div>
		</Link>
	)
}

export default function Footer() {
	return (
		<footer className="container mx-auto px-4 py-6 relative min-h-[100px]">
			<div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
				{/* Left side - Social links */}
				<div className="flex items-center gap-6">
					<FooterButton icon={faGithub} link={SOCIAL.Github_contract} text="Github" />
					<FooterButton icon={faBook} link={SOCIAL.Docs} text="Doc" />
					<FooterButton icon={faXTwitter} link={SOCIAL.Twitter} text="Twitter" />
					<FooterButton icon={faTelegram} link={SOCIAL.Telegram} text="Telegram" />
				</div>

				{/* Divider for larger screens */}
				<div className="hidden sm:block text-slate-100">|</div>

				{/* Right side - Frankencoin reference */}
				<div className="flex items-center gap-2 text-sm">
					<span className="text-slate-100">Fork of</span>
					<a
						className="text-slate-100 hover:text-purple-300 transition-colors"
						href="https://www.frankencoin.com"
						rel="noreferrer"
						target="_blank"
					>
						Frankencoin
					</a>
					<div className="relative group">
						<FontAwesomeIcon
							className="w-4 h-4 text-slate-100 hover:text-purple-400 cursor-help"
							icon={faCircleInfo}
						/>
						<div className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
							<div className="fixed left-4 right-4 bottom-[100px] sm:absolute sm:bottom-full sm:left-1/2 sm:right-auto sm:w-64 sm:-translate-x-1/2 sm:mb-2 p-2 bg-slate-800 rounded-lg text-sm text-slate-300">
								<div className="relative">
									Like Frankencoin, OFD uses an auction-based liquidation mechanism that operates without external price feeds,
									but tracks the US Dollar instead of the Swiss Franc.
									<div className="hidden sm:block absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}
