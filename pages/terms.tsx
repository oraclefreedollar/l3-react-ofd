import React from 'react'
import { useTermsAndConditions } from 'hooks/termsAndConditions/useTermsAndConditions'

const TermsAndConditions: React.FC = () => {
	const sections = useTermsAndConditions()

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-4 flex flex-col border border-purple-500/50">
				<h1 className="text-3xl font-bold mb-6">Terms and Conditions for Operal DeFi Frontend for the Oracle Free Dollar</h1>
				<p className="text-white">Last Updated:1.11.2024</p>

				<div className="space-y-6">
					{sections.map((section, index) => (
						<section key={index}>
							<h2 className="text-xl font-semibold mb-3">
								{index + 1}. {section.title}
							</h2>
							<p className="text-white">{section.content}</p>
						</section>
					))}
				</div>
			</div>
		</div>
	)
}

export default TermsAndConditions
