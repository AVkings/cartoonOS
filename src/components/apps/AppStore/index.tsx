import React, { useState } from 'react';
import { buildAEXDocument, parseAEX, STORE_APPS } from '../../../utils/aexRuntime';
import { useFileStore } from '../../../store/useFileStore';
import { useOSStore } from '../../../store/useOSStore';
import { ShoppingBag, Play, Download, CheckCircle, Code } from 'lucide-react';

export const AppStore: React.FC = () => {
    const { files, saveFile } = useFileStore();
    const { openWindow } = useOSStore();
    const [preview, setPreview] = useState<string | null>(null);
    const [previewSrc, setPreviewSrc] = useState('');

    const isInstalled = (id: string) => !!files[`aex_${id}`];

    const install = (id: string, source: string) => {
        const meta = parseAEX(source);
        saveFile(`aex_${id}`, `${meta.meta.app}.aex`, source, 'aex');
    };

    const run = (source: string) => {
        setPreviewSrc(buildAEXDocument(source));
        setPreview('preview');
    };

    const openInWindow = (id: string, source: string) => {
        const key = `aex_${id}`;
        if (!isInstalled(id)) install(id, source);
        const meta = parseAEX(source);
        openWindow(key, `${meta.meta.icon} ${meta.meta.app}`);
    };

    return (
        <div className="flex flex-col h-full font-sans overflow-hidden">
            {/* Header */}
            <div className="bg-neo-pink border-b-[3px] border-black px-4 py-3 shrink-0">
                <h1 className="text-2xl font-black flex items-center gap-2">
                    <ShoppingBag size={24} /> CartoonOS App Store
                </h1>
                <p className="text-sm font-semibold opacity-75">Install & run AEX apps. Build your own in Code Editor!</p>
            </div>

            {/* Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* App Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 gap-4">
                        {STORE_APPS.map(({ id, source }) => {
                            const meta = parseAEX(source);
                            const installed = isInstalled(id);
                            return (
                                <div key={id} className="bg-white border-[3px] border-black shadow-[3px_3px_0_0_#000] rounded-xl overflow-hidden flex flex-col">
                                    {/* App header */}
                                    <div className="bg-neo-yellow px-4 py-3 border-b-[3px] border-black flex items-center gap-3">
                                        <span className="text-3xl">{meta.meta.icon}</span>
                                        <div className="min-w-0">
                                            <h3 className="font-black text-base leading-tight truncate">{meta.meta.app}</h3>
                                            <p className="text-xs font-semibold opacity-70">by {meta.meta.author} · v{meta.meta.version}</p>
                                        </div>
                                        {installed && (
                                            <CheckCircle size={18} className="text-green-600 shrink-0 ml-auto" />
                                        )}
                                    </div>
                                    {/* Description */}
                                    <p className="px-4 py-3 text-sm font-semibold text-gray-700 flex-1">{meta.meta.description}</p>
                                    {/* Actions */}
                                    <div className="flex gap-2 px-3 pb-3">
                                        <button
                                            onClick={() => run(source)}
                                            className="flex items-center gap-1 px-3 py-1.5 border-2 border-black rounded-lg bg-neo-blue font-bold text-xs shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                                        >
                                            <Play size={12} /> Preview
                                        </button>
                                        {installed ? (
                                            <button
                                                onClick={() => openInWindow(id, source)}
                                                className="flex items-center gap-1 px-3 py-1.5 border-2 border-black rounded-lg bg-neo-green font-bold text-xs shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex-1 justify-center"
                                            >
                                                <Play size={12} /> Open
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => { install(id, source); openInWindow(id, source); }}
                                                className="flex items-center gap-1 px-3 py-1.5 border-2 border-black rounded-lg bg-neo-pink font-bold text-xs shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex-1 justify-center"
                                            >
                                                <Download size={12} /> Install & Run
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {/* Your AEX files */}
                        {Object.values(files).filter(f => f.type === 'aex' && !STORE_APPS.find(a => `aex_${a.id}` === f.id)).map(f => {
                            const meta = parseAEX(f.content);
                            return (
                                <div key={f.id} className="bg-white border-[3px] border-black shadow-[3px_3px_0_0_#000] rounded-xl overflow-hidden flex flex-col">
                                    <div className="bg-neo-green px-4 py-3 border-b-[3px] border-black flex items-center gap-3">
                                        <span className="text-3xl">{meta.meta.icon}</span>
                                        <div>
                                            <h3 className="font-black text-base">{meta.meta.app}</h3>
                                            <p className="text-xs font-semibold opacity-70">Local · by {meta.meta.author}</p>
                                        </div>
                                    </div>
                                    <p className="px-4 py-3 text-sm font-semibold text-gray-700 flex-1">{meta.meta.description || 'No description'}</p>
                                    <div className="flex gap-2 px-3 pb-3">
                                        <button
                                            onClick={() => run(f.content)}
                                            className="flex items-center gap-1 px-3 py-1.5 border-2 border-black rounded-lg bg-neo-blue font-bold text-xs shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                                        >
                                            <Play size={12} /> Run
                                        </button>
                                        <button
                                            onClick={() => openWindow(`editor_${f.id}`, `✏️ ${f.name}`)}
                                            className="flex items-center gap-1 px-3 py-1.5 border-2 border-black rounded-lg bg-neo-yellow font-bold text-xs shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                                        >
                                            <Code size={12} /> Edit
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Preview Panel */}
                {preview && (
                    <div className="w-[380px] border-l-[3px] border-black flex flex-col shrink-0">
                        <div className="flex justify-between items-center px-3 py-2 bg-neo-blue border-b-[3px] border-black shrink-0">
                            <span className="font-black text-sm">Live Preview</span>
                            <button onClick={() => setPreview(null)} className="font-black text-lg">✕</button>
                        </div>
                        <iframe srcDoc={previewSrc} className="flex-1 border-none w-full" sandbox="allow-scripts allow-same-origin allow-forms" title="App Preview" />
                    </div>
                )}
            </div>
        </div>
    );
};
