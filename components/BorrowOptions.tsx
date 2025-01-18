import React from 'react';
import { faPlus, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

const BorrowOptions = () => {
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">How do you plan to Borrow?</h2>
            <div className="grid md:grid-cols-2 gap-6">
                <Link className="w-full text-left bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md rounded-xl p-8 hover:scale-105 transition-all duration-300 flex flex-col border border-purple-500/50 gap-y-4 appearance-none" href={'positions/create'}>
                    <div className="flex justify-center mb-4">
                        <div className="p-3 border rounded-lg">
                            <FontAwesomeIcon className="w-6 h-6" icon={faPlus} />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-center mb-3">
                        Open New Position (Collateral)
                    </h3>
                    <p className="text-gray-200 text-sm">
                        Start fresh with a new borrowing position. This option allows you to set up your collateral and terms from scratch.
                    </p>
                </Link>

                <Link className="w-full text-left bg-gradient-to-br from-purple-900/90 to-slate-900/95 backdrop-blur-md hover:scale-105 transition-all duration-300 rounded-xl p-8 flex flex-col border border-purple-500/50 gap-y-4 appearance-none" href={'#positions-table'}>
                    <div className="flex justify-center mb-4">
                        <div className="p-3 border rounded-lg">
                            <FontAwesomeIcon className="w-6 h-6" icon={faCopy} />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-center mb-3">
                        Clone Existing Position (Collateral)
                    </h3>
                    <p className="text-gray-200 text-sm">
                        Copy the parameters of an existing position to quickly set up a new one with similar terms and conditions.
                    </p>
                </Link>
            </div>

        </div>
    );
};

export default BorrowOptions;