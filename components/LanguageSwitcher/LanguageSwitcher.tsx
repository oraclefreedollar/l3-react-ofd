import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from 'contexts/language'
import { availableLanguages } from 'meta/languages'

// Custom hook for responsive design
export const useMediaQuery = (query: string): boolean => {
	const [matches, setMatches] = useState(false)

	useEffect(() => {
		const media = window.matchMedia(query)
		if (media.matches !== matches) {
			setMatches(media.matches)
		}

		const listener = () => setMatches(media.matches)
		media.addEventListener('change', listener)

		return () => media.removeEventListener('change', listener)
	}, [matches, query])

	return matches
}

const LanguageSwitcher: React.FC = () => {
	const { language, changeLanguage } = useLanguage()
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const isMobile = useMediaQuery('(max-width: 768px)')

	// Find the current language object
	const currentLanguage = useMemo(() => availableLanguages.find((lang) => lang.code === language) || availableLanguages[0], [language])

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<div className="relative" ref={dropdownRef}>
			{/* Language button with current flag */}
			<button
				aria-expanded={isOpen}
				aria-label="Select language"
				className="rounded-full btn btn-nav font-bold"
				onClick={() => setIsOpen(!isOpen)}
			>
				<div className="rounded-full">
					<p>{currentLanguage.code.toUpperCase()}</p>
				</div>
			</button>

			{/* Dropdown menu - positioned differently on mobile */}
			{isOpen && (
				<div
					className={`
            ${isMobile ? 'fixed inset-x-4 bottom-4 top-auto' : 'absolute top-full right-0 mt-1 w-48'} 
            bg-gradient-to-br from-purple-900/90 to-slate-900/95 
            backdrop-blur-md shadow-lg rounded-xl overflow-hidden z-50 
            border border-purple-500/50
          `}
				>
					<div className={`py-1 ${isMobile ? 'grid grid-cols-2 gap-2 p-4' : ''}`}>
						{availableLanguages.map((lang) => (
							<button
								className={`
                  ${isMobile ? 'flex justify-center' : 'w-full text-left'} 
                  btn btn-nav space-x-3 
                  ${language === lang.code ? 'font-bold text-neon-blue' : ''}
                `}
								key={lang.code}
								onClick={() => {
									changeLanguage(lang.code)
									setIsOpen(false)
								}}
							>
								<span>{lang.name}</span>
							</button>
						))}
					</div>

					{/* Close button for mobile */}
					{isMobile && (
						<div className="p-2 border-t border-purple-500/30 flex justify-center">
							<button className="btn btn-nav w-full" onClick={() => setIsOpen(false)}>
								X
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default LanguageSwitcher
