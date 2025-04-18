'use client'
import '../styles/globals.css'
import '../styles/datepicker.css'
import 'react-toastify/dist/ReactToastify.css'
import type { AppProps } from 'next/app'

import Layout from 'components/Layout'
import NextSeoProvider from 'components/NextSeoProvider'
import { ApolloProvider } from '@apollo/client'
import { Provider as ReduxProvider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import Web3ModalProvider from 'components/Web3Modal'
import { store } from 'store'
import { clientPonder } from 'app.config'
import BlockUpdater from 'components/BlockUpdater'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { appWithTranslation } from 'next-i18next'
import nextI18nextConfig from '../next-i18next.config'

import { LanguageProvider } from 'contexts/language'

function App({ Component, pageProps }: AppProps) {
	return (
		<ReduxProvider store={store}>
			<Web3ModalProvider>
				<LanguageProvider>
					<ApolloProvider client={clientPonder}>
						<BlockUpdater>
							<NextSeoProvider />
							<ToastContainer hideProgressBar={false} position="bottom-right" rtl={false} theme="dark" />

							<Layout>
								<Component {...pageProps} />
								<Analytics />
								<SpeedInsights />
							</Layout>
						</BlockUpdater>
					</ApolloProvider>
				</LanguageProvider>
			</Web3ModalProvider>
		</ReduxProvider>
	)
}

export default appWithTranslation(App, nextI18nextConfig)
