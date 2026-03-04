import React, { useState } from 'react';

export const Browser: React.FC = () => {
    const [url, setUrl] = useState('https://en.wikipedia.org/wiki/Special:Random');
    const [input, setInput] = useState(url);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let target = input;
        if (!target.startsWith('http://') && !target.startsWith('https://')) {
            target = 'https://' + target;
        }
        setUrl(target);
    };

    return (
        <div className="flex flex-col h-full bg-white font-sans text-black">
            {/* Address Bar */}
            <form onSubmit={handleSubmit} className="flex gap-2 p-2 bg-gray-200 border-b-neo border-black">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 px-3 border-2 border-black rounded font-bold shadow-[2px_2px_0_0_#000] focus:outline-none focus:shadow-[4px_4px_0_0_#1d4ed8]"
                    placeholder="Enter URL..."
                />
                <button
                    type="submit"
                    className="neo-btn bg-neo-blue px-4 py-1 flex items-center h-10 font-black text-lg"
                >
                    GO
                </button>
            </form>
            {/* Warning Message */}
            <div className="bg-yellow-100 border-b-2 border-black p-2 text-sm font-bold flex justify-center text-center px-4">
                Note: Many websites block iframes via X-Frame-Options. Some pages may fail to load.
            </div>
            {/* IFrame View */}
            <div className="flex-1 bg-white relative">
                <iframe
                    src={url}
                    className="w-full h-full border-none"
                    sandbox="allow-same-origin allow-scripts"
                    title="Cartoon Browser"
                />
            </div>
        </div>
    );
};
