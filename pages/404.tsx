import Head from 'next/head'
import Link from 'next/link'
import { SOCIAL } from 'utils'
import { envConfig } from 'app.env.config'

export default function Custom404() {
	return (
		<main className="container-xl mx-auto">
			<Head>
				<title>{envConfig.AppName} - 404</title>
			</Head>

			{/* To load dynamic classes */}
			<div className="hidden w-8 h-8 w-10 h-10" />
			<div className="flex flex-col items-center justify-center w-full text-center" style={{ height: '60vh' }}>
				<h1 className="text-right text-4xl font-bold">
					<picture>
						<img alt="logo" className="h-20" src="/assets/oracle-free-dollar-logo.svg" />
					</picture>
				</h1>
				<h1 className="text-4xl font-bold mt-10">You seem to be in the wrong place</h1>
				<p className="text-2xl font-bold mt-4">
					<Link className="mr-4 hover:underline md:mr-6 text-purple-900" href={SOCIAL.Telegram} rel="noopener noreferrer" target="_blank">
						Ping us on Telegram if you think this is a bug
					</Link>
				</p>
			</div>
		</main>
	)
}
