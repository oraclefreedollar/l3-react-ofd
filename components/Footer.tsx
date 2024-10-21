import Link from 'next/link'
import { SOCIAL } from 'utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faBook } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faTelegram, faXTwitter } from '@fortawesome/free-brands-svg-icons'

interface ButtonProps {
	link: string
	text: string
	icon: IconProp
}

const FooterButton = ({ link, text, icon }: ButtonProps) => {
	return (
		<Link className="flex gap-1 hover:opacity-70" href={link} rel="noreferrer" target="_blank">
			<FontAwesomeIcon className="w-6 h-6" icon={icon} />
			<div className="hidden sm:block">{text}</div>
		</Link>
	)
}

export default function Footer() {
	return (
		<ul className="mt-12 mb-4 flex items-center justify-center gap-8">
			<li>
				<FooterButton icon={faGithub} link={SOCIAL.Github_contract} text="Github" />
			</li>
			<li>
				<FooterButton icon={faBook} link={SOCIAL.Docs} text="Doc" />
			</li>
			{/*<li>*/}
			{/*  <FooterButton link={SOCIAL.SubStack} text="Blog" icon={faBookmark} />*/}
			{/*</li>*/}
			{/*<li>*/}
			{/*  <FooterButton link={SOCIAL.Forum} text="Forum" icon={faComments} />*/}
			{/*</li>*/}
			<li>
				<FooterButton icon={faXTwitter} link={SOCIAL.Twitter} text="Twitter" />
			</li>
			<li>
				<FooterButton icon={faTelegram} link={SOCIAL.Telegram} text="Telegram" />
			</li>
		</ul>
	)
}
