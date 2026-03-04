import React, { useState } from 'react';
import { X, Plus, Globe, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface Tab {
    id: number;
    url: string;
    inputValue: string;
    title: string;
}

let nextTabId = 1;

const makeTab = (url = 'https://en.wikipedia.org/wiki/Special:Random'): Tab => ({
    id: nextTabId++,
    url,
    inputValue: url,
    title: 'New Tab',
});

export const Browser: React.FC = () => {
    const [tabs, setTabs] = useState<Tab[]>([makeTab()]);
    const [activeTabId, setActiveTabId] = useState<number>(tabs[0].id);
    const [iframeKey, setIframeKey] = useState(0); // force-reload key

    const activeTab = tabs.find(t => t.id === activeTabId) ?? tabs[0];

    const updateTab = (id: number, patch: Partial<Tab>) => {
        setTabs(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
    };

    const addTab = () => {
        const tab = makeTab('https://en.wikipedia.org/wiki/Special:Random');
        setTabs(prev => [...prev, tab]);
        setActiveTabId(tab.id);
    };

    const closeTab = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setTabs(prev => {
            const remaining = prev.filter(t => t.id !== id);
            if (remaining.length === 0) {
                const fresh = makeTab();
                setActiveTabId(fresh.id);
                return [fresh];
            }
            if (activeTabId === id) {
                setActiveTabId(remaining[remaining.length - 1].id);
            }
            return remaining;
        });
    };

    const handleNavigate = (e: React.FormEvent) => {
        e.preventDefault();
        let target = activeTab.inputValue;
        if (!target.startsWith('http://') && !target.startsWith('https://')) {
            // Treat as a search if no domain pattern
            if (!target.includes('.')) {
                target = `https://www.google.com/search?q=${encodeURIComponent(target)}`;
            } else {
                target = 'https://' + target;
            }
        }
        updateTab(activeTab.id, { url: target, inputValue: target });
        setIframeKey(k => k + 1);
    };

    const reload = () => setIframeKey(k => k + 1);

    return (
        <div className="flex flex-col h-full bg-white font-sans text-black">
            {/* Tab Bar */}
            <div className="flex items-end gap-1 px-2 pt-2 bg-gray-300 border-b-neo border-black overflow-x-auto min-h-[42px]">
                {tabs.map(tab => (
                    <div
                        key={tab.id}
                        onClick={() => setActiveTabId(tab.id)}
                        className={cn(
                            'flex items-center gap-2 px-3 py-1 rounded-t-lg border-t-2 border-l-2 border-r-2 border-black cursor-pointer min-w-[100px] max-w-[180px] shrink-0 group transition-all',
                            tab.id === activeTabId
                                ? 'bg-white -mb-[2px] font-black z-10'
                                : 'bg-gray-200 font-semibold hover:bg-gray-100'
                        )}
                    >
                        <Globe size={12} className="shrink-0 text-gray-600" />
                        <span className="truncate text-sm flex-1">{tab.title}</span>
                        <button
                            onClick={(e) => closeTab(tab.id, e)}
                            className="opacity-0 group-hover:opacity-100 hover:bg-red-200 rounded p-0.5 transition-all"
                        >
                            <X size={10} />
                        </button>
                    </div>
                ))}
                <button
                    onClick={addTab}
                    className="mb-1 p-1 rounded-full border-2 border-black bg-neo-yellow shadow-[2px_2px_0_0_#000] hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all shrink-0"
                >
                    <Plus size={14} />
                </button>
            </div>

            {/* Address / Nav Bar */}
            <form onSubmit={handleNavigate} className="flex items-center gap-2 p-2 bg-gray-100 border-b-2 border-black">
                <button type="button" onClick={reload} className="p-1.5 border-2 border-black rounded shadow-[2px_2px_0_0_#000] hover:bg-gray-200 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all">
                    <RotateCcw size={14} />
                </button>
                <input
                    type="text"
                    value={activeTab.inputValue}
                    onChange={(e) => updateTab(activeTab.id, { inputValue: e.target.value })}
                    className="flex-1 px-3 py-1.5 border-2 border-black rounded font-semibold shadow-[2px_2px_0_0_#000] focus:outline-none focus:shadow-[3px_3px_0_0_#1d4ed8] text-sm"
                    placeholder="Search or enter URL…"
                />
                <button
                    type="submit"
                    className="px-4 py-1.5 font-black border-neo border-black bg-neo-blue shadow-[2px_2px_0_0_#000] rounded-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                >
                    GO
                </button>
            </form>

            {/* Warning */}
            <div className="bg-yellow-100 border-b-2 border-black px-4 py-1 text-xs font-bold text-center text-yellow-800">
                ⚠️ Many sites block iframes (X-Frame-Options). If blank, the site doesn't allow embedding.
            </div>

            {/* IFrame */}
            <div className="flex-1 bg-white relative overflow-hidden">
                <iframe
                    key={iframeKey}
                    src={activeTab.url}
                    className="w-full h-full border-none"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                    title="Cartoon Browser"
                    onLoad={(e) => {
                        try {
                            const title = (e.target as HTMLIFrameElement).contentDocument?.title;
                            if (title) updateTab(activeTab.id, { title });
                        } catch { /* cross-origin blocks title access */ }
                    }}
                />
            </div>
        </div>
    );
};
