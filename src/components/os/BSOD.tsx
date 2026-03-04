import React from 'react';
import { RefreshCw } from 'lucide-react';

interface Props {
    error?: Error;
}

export const BSOD: React.FC<Props> = ({ error }) => {
    return (
        <div className="fixed inset-0 bg-neo-blue z-[999999] flex flex-col items-center justify-center p-8 text-black selection:bg-black selection:text-white">
            <div className="max-w-3xl flex flex-col gap-8 bg-white border-neo border-black shadow-[16px_16px_0_0_#000] p-12">
                <h1 className="text-6xl font-black bg-neo-red inline-block text-black px-4 py-2 border-neo border-black -rotate-2 w-max">
                    OOPSIE DAISY!
                </h1>
                <div className="text-3xl font-bold">
                    A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36.
                    The current application will be terminated.
                </div>
                <div className="bg-gray-200 border-2 border-black p-4 font-mono font-bold text-red-600">
                    {error?.message || "MANUALLY_TRIGGERED_BSOD"}
                </div>
                <div className="text-xl font-bold italic">
                    * Press the button below to restart your CartoonOS.
                    <br />
                    * You will lose any unsaved information in all applications.
                </div>

                <button
                    onClick={() => window.location.reload()}
                    className="neo-btn bg-neo-yellow px-8 py-4 text-2xl mt-4 w-max flex items-center gap-4 hover:bg-yellow-300"
                >
                    <RefreshCw size={28} />
                    RESTART NOW
                </button>
            </div>
        </div>
    );
};
