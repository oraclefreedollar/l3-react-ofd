import Link from 'next/link'
import { useChainId } from 'wagmi'
import NavButton from './NavButton'
import WalletConnect from './WalletConnect'
import { ENABLE_EMERGENCY_MODE } from 'utils'
import { useTranslation } from 'next-i18next'
import React from 'react'

const Navbar: React.FC = () => {
	const { t } = useTranslation(['common'])
	const chainId = useChainId()

	return (
		<div className="fixed top-0 left-0 right-0 z-10 backdrop-blur border-b border-gray-400">
			<header className="flex items-center justify-between p-2 sm:gap-x-4 md:p-4 relative w-full">
				<div className="justify-left flex items-center">
					<Link className="" href="/">
						<picture>
							<img alt="Logo" className="h-9 transition" src="/assets/ofd-white.png" />
						</picture>
					</Link>

					<ul className="justify-left hidden flex-1 gap-2 md:flex lg:gap-3 xl:w-1/2">
						{!ENABLE_EMERGENCY_MODE && (
							<li>
								<NavButton name="Swap" to="/swap" />
							</li>
						)}
						<li>

							<NavButton name={t('common:navigation:swap')} to="/swap" />
						</li>
					)}
					<li>
						<NavButton name={t('common:navigation:borrow')} to="/collateral" />
					</li>
					<li>
						<NavButton name={t('common:navigation:myPositions')} to="/positions" />
					</li>
					<li>
						<NavButton name={t('common:navigation:auctions')} to="/auctions" />
					</li>
					<li>
						<NavButton name={t('common:navigation:equity')} to="/pool" />
					</li>
					<li>
						<NavButton name={t('common:navigation:savings')} to="/savings" />
					</li>
					<li>
						<NavButton name={t('common:navigation:governance')} to="/governance" />
					</li>
					<li>
						<NavButton name={t('common:navigation:monitoring')} to="/monitoring" />
					</li>
					{chainId == 97 && (
						<li>
							<NavButton name={t('common:navigation:faucet')} to="/faucet" />
						</li>
						)}
					</ul>
				</div>
				<div className="flex flex-1 justify-end items-center">
					<WalletConnect />
				</div>

				<aside className="flex w-10 h-10 sm:hidden">
					<div className="flex items-center">
						<label className="absolute z-20 cursor-pointer px-3 py-6" htmlFor="ss-mobile-menu">
							<input className="peer hidden" id="ss-mobile-menu" type="checkbox" />
							<div className="before:bg-white after:bg-white block h-[1px] content-[''] relative w-7 bg-transparent peer-checked:bg-transparent z-30 before:peer-checked:transform before:peer-checked:rotate-45 before:peer-checked:top-0 before:peer-checked:w-full after:peer-checked:transform after:peer-checked:-rotate-45 after:peer-checked:bottom-0 after:peer-checked:w-full before:block before:h-full before:w-full before:absolute before:content-[''] before:transition-all before:ease-out before:duration-200 before:top-[-0.35rem] before:z-30 after:block after:h-full after:w-full after:right-0 after:absolute after:content-[''] after:transition-all after:ease-out after:duration-200 after:bottom-[-0.35rem]" />
							<div className="fixed inset-0 hidden h-screen w-full bg-gray-800/50 backdrop-blur-sm peer-checked:block"></div>
							<div className="fixed top-0 right-0 h-screen translate-x-full overflow-y-auto overscroll-y-none transition duration-500 peer-checked:translate-x-0 peer-checked:shadow-heading">
								<div className="float-right min-h-full w-full bg-slate-800 opacity-90 backdrop-blur px-6 pt-12 shadow-2xl">
									<menu className="mt-8 mb-8 flex flex-col text-heading">
										{!ENABLE_EMERGENCY_MODE && (
											<li>
												<NavButton name={t('common:navigation:swap')} to="/swap" />
											</li>
										)}
										<li>
											<NavButton name={t('common:navigation:borrow')} to="/collateral" />
										</li>
										<li>
											<NavButton name={t('common:navigation:myPositions')} to="/positions" />
										</li>
										<li>
											<NavButton name={t('common:navigation:auctions')} to="/auctions" />
										</li>
										<li>
											<NavButton name={t('common:navigation:equity')} to="/pool" />
										</li>
										<li>
											<NavButton name={t('common:navigation:savings')} to="/savings" />
										</li>
										<li>
											<NavButton name={t('common:navigation:governance')} to="/governance" />
										</li>
										<li>
											<NavButton name="Monitoring" to="/monitoring" />
										</li>
									</menu>
								</div>
							</div>
						</label>
					</div>
				</aside>
			</header>
			{ENABLE_EMERGENCY_MODE && (
				<>
					<div className="relative w-full bg-red-100 text-red-800 border border-red-300 py-2">
						<div className="hidden md:block text-center px-4">
							Notice: On 26.10.2024, a{' '}
							<a
								className="text-purple-900 underline hover:no-underline"
								href="https://github.com/oraclefreedollar/ofd/blob/main/ir.txt"
								rel="noreferrer"
								target="_blank"
							>
								contract vulnerability was exploited
							</a>
							. We’ve frozen frontend features and{' '}
							<a
								className="text-purple-900 underline hover:no-underline"
								href="https://github.com/oraclefreedollar/ofd/blob/main/ir-update.txt"
								rel="noreferrer"
								target="_blank"
							>
								all funds are safe
							</a>{' '}
							. A new version is coming soon.
						</div>
						<div className="block md:hidden overflow-hidden whitespace-nowrap">
							<div className="inline-block animate-scroll px-10">
								Notice: On 26.10.2024, a{' '}
								<a className="text-purple-900 underline hover:no-underline" href="https://github.com/oraclefreedollar/ofd/blob/main/ir.txt">
									contract vulnerability was exploited
								</a>
								. We’ve frozen frontend features and{' '}
								<a
									className="text-purple-900 underline hover:no-underline"
									href="https://github.com/oraclefreedollar/ofd/blob/main/ir-update.txt"
								>
									all funds are safe
								</a>{' '}
								. A new version is coming soon.
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	)
}

export default Navbar
