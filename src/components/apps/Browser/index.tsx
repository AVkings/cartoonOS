import React, { useState, useRef } from 'react';
import { X, Plus, RotateCcw, Globe, ExternalLink } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface Tab {
    id: number;
    url: string;
    inputValue: string;
    title: string;
    loading: boolean;
    error: boolean;
}

const EMBEDDABLE_SITES = [
    { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Special:Random' },
    { label: 'OpenStreetMap', url: 'https://www.openstreetmap.org' },
    { label: 'Weather', url: 'https://wttr.in?format=html' },
    { label: 'MDN Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
    { label: 'Archive.org', url: 'https://archive.org' },
    { label: 'HackerNews', url: 'https://news.ycombinator.com' },
];

let _id = 1;
const makeTab = (url = 'https://en.wikipedia.org/wiki/Special:Random'): Tab => ({
    id: _id++, url, inputValue: url, title: 'Loading…', loading: true, error: false,
});

export const Browser: React.FC = () => {
    const [tabs, setTabs] = useState<Tab[]>([makeTab()]);
    const [activeId, setActiveId] = useState<number>(tabs[0].id);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const active = tabs.find(t => t.id === activeId) ?? tabs[0];

    const update = (id: number, patch: Partial<Tab>) => {
        setTabs(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
    };

    const addTab = (url?: string) => {
        const tab = makeTab(url);
        setTabs(prev => [...prev, tab]);
        setActiveId(tab.id);
    };

    const closeTab = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setTabs(prev => {
            const rest = prev.filter(t => t.id !== id);
            if (rest.length === 0) {
                const fresh = makeTab();
                setActiveId(fresh.id);
                return [fresh];
            }
            if (activeId === id) setActiveId(rest[rest.length - 1].id);
            return rest;
        });
    };

    const navigate = (e: React.FormEvent) => {
        e.preventDefault();
        let target = active.inputValue.trim();
        if (!target) return;
        if (!target.includes('.') && !target.startsWith('http')) {
            target = `https://www.google.com/search?q=${encodeURIComponent(target)}`;
        } else if (!target.startsWith('http')) {
            target = 'https://' + target;
        }
        update(active.id, { url: target, inputValue: target, loading: true, error: false, title: 'Loading…' });
    };

    const reload = () => {
        update(active.id, { loading: true, error: false });
        if (iframeRef.current) {
            try { iframeRef.current.src = active.url; } catch { /* ignore */ }
        }
    };

    const onLoad = () => {
        try {
            const title = iframeRef.current?.contentDocument?.title || active.url;
            update(active.id, { loading: false, error: false, title: title.slice(0, 30) || active.url });
        } catch {
            // Cross-origin — still counts as "loaded" (X-Frame-Options handled gracefully)
            update(active.id, { loading: false, title: active.url.replace(/https?:\/\//, '').slice(0, 30) });
        }
    };

    const onError = () => {
        update(active.id, { loading: false, error: true, title: 'Error' });
    };

    return (
        <div className="flex flex-col h-full font-sans text-black bg-white">
            {/* Tab Bar */}
            <div className="flex items-end gap-1 px-2 pt-1 bg-gray-300 border-b-[3px] border-black overflow-x-auto shrink-0 min-h-[40px]">
                {tabs.map(tab => (
                    <div
                        key={tab.id}
                        onClick={() => setActiveId(tab.id)}
                        className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg border-t-2 border-x-2 border-black cursor-pointer min-w-[100px] max-w-[160px] shrink-0 group transition-all select-none',
                            tab.id === activeId ? 'bg-white font-black z-10' : 'bg-gray-200 font-semibold hover:bg-gray-100 opacity-80'
                        )}
                    >
                        {tab.loading ? (
                            <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin shrink-0" />
                        ) : (
                            <Globe size={11} className="shrink-0 text-gray-500" />
                        )}
                        <span className="truncate text-xs flex-1">{tab.title}</span>
                        <button
                            onClick={(e) => closeTab(tab.id, e)}
                            className="opacity-0 group-hover:opacity-100 hover:bg-red-200 rounded p-0.5 transition-all"
                        >
                            <X size={10} />
                        </button>
                    </div>
                ))}
                <button
                    onClick={() => addTab()}
                    className="mb-1 p-1 rounded-full border-2 border-black bg-neo-yellow shadow-[1px_1px_0_0_#000] hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all shrink-0"
                >
                    <Plus size={12} />
                </button>
            </div>

            {/* Address Bar */}
            <form onSubmit={navigate} className="flex items-center gap-2 px-2 py-1.5 bg-gray-100 border-b-2 border-black shrink-0">
                <button type="button" onClick={reload}
                    className="p-1.5 border-2 border-black rounded-lg shadow-[1px_1px_0_0_#000] hover:bg-gray-200 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all shrink-0">
                    <RotateCcw size={13} />
                </button>
                <input
                    type="text"
                    value={active.inputValue}
                    onChange={(e) => update(active.id, { inputValue: e.target.value })}
                    className="flex-1 px-3 py-1 border-2 border-black rounded-lg font-semibold shadow-[1px_1px_0_0_#000] focus:outline-none focus:shadow-[2px_2px_0_0_#1d4ed8] text-sm"
                    placeholder="Search or enter URL… (e.g. wikipedia.org)"
                />
                <button type="submit"
                    className="px-4 py-1 font-black border-[3px] border-black bg-neo-blue shadow-[2px_2px_0_0_#000] rounded-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-sm">
                    GO
                </button>
                <a href={active.url} target="_blank" rel="noreferrer" title="Open in new tab"
                    className="p-1.5 border-2 border-black rounded-lg shadow-[1px_1px_0_0_#000] hover:bg-gray-200 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all shrink-0">
                    <ExternalLink size={13} />
                </a>
            </form>

            {/* Notice bar */}
            <div className="bg-yellow-50 border-b-2 border-yellow-300 px-3 py-1 text-xs font-semibold text-yellow-800 shrink-0 flex items-center gap-2">
                ⚠️ Some sites block embedding. Use <ExternalLink size={10} className="inline" /> to open blocked sites in a real tab.
            </div>

            {/* Main view */}
            <div className="flex-1 flex overflow-hidden">
                {/* Quick links sidebar */}
                <div className="w-32 border-r-2 border-black bg-gray-50 flex flex-col p-2 gap-1 shrink-0 overflow-y-auto">
                    <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Quick Links</p>
                    {EMBEDDABLE_SITES.map(s => (
                        <button
                            key={s.url}
                            onClick={() => addTab(s.url)}
                            className="text-left text-xs font-bold px-2 py-1.5 rounded-lg border-2 border-black bg-white shadow-[1px_1px_0_0_#000] hover:bg-neo-blue hover:text-white active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all truncate"
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                {/* Iframe */}
                <div className="flex-1 relative bg-white">
                    {active.error ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-neo-bg p-8 text-center">
                            <span className="text-5xl">🚫</span>
                            <h2 className="text-xl font-black">Can't Load Page</h2>
                            <p className="text-sm font-semibold text-gray-600 max-w-xs">
                                This site may have blocked embedding or the URL is invalid.
                            </p>
                            <a href={active.url} target="_blank" rel="noreferrer"
                                className="flex items-center gap-2 neo-btn bg-neo-blue px-4 py-2 font-bold">
                                <ExternalLink size={16} /> Open in Real Browser
                            </a>
                        </div>
                    ) : (
                        <iframe
                            ref={iframeRef}
                            src={active.url}
                            className="w-full h-full border-none"
                            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-pointer-lock"
                            title="CartoonBrowser"
                            onLoad={onLoad}
                            onError={onError}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
