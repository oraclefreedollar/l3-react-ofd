import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const withServerSideTranslations = (
	namespaces: string[] = ['common'],
	getServerSideProps?: GetServerSideProps
): GetServerSideProps => {
	return async (context) => {
		const { locale } = context

		// If there's an additional getServerSideProps function
		if (getServerSideProps) {
			const props = await getServerSideProps(context)

			// If props.notFound or props.redirect, return as is
			if ('notFound' in props || 'redirect' in props) {
				return props
			}

			return {
				...props,
				props: {
					...props.props,
					...(await serverSideTranslations(locale ?? 'en', namespaces)),
				},
			}
		}

		// Default case with only translations
		return {
			props: {
				...(await serverSideTranslations(locale ?? 'en', namespaces)),
			},
		}
	}
}
