import React, { useState } from 'react';
import { buildAEXDocument, parseAEX } from '../../../utils/aexRuntime';
import { useFileStore } from '../../../store/useFileStore';
import { Shield, Play, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    fileId: string;
}

export const AEXRunner: React.FC<Props> = ({ fileId }) => {
    const { files } = useFileStore();
    const [phase, setPhase] = useState<'prompt' | 'running' | 'denied'>('prompt');
    const [iframeKey] = useState(() => Math.random());

    const file = files[fileId];
    if (!file) return <div className="p-8 font-bold text-red-600">App file not found: {fileId}</div>;

    const meta = parseAEX(file.content);
    const doc = buildAEXDocument(file.content);

    return (
        <div className="flex flex-col h-full">
            <AnimatePresence mode="wait">
                {phase === 'prompt' && (
                    <motion.div
                        key="prompt"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex-1 flex flex-col items-center justify-center p-8 bg-neo-bg gap-6"
                    >
                        {/* App Info */}
                        <div className="text-7xl">{meta.meta.icon}</div>
                        <div className="text-center">
                            <h2 className="text-3xl font-black">{meta.meta.app}</h2>
                            <p className="text-sm font-semibold text-gray-600 mt-1">v{meta.meta.version} · by {meta.meta.author}</p>
                        </div>

                        {/* Permission Card */}
                        <div className="bg-white border-[3px] border-black shadow-[4px_4px_0_0_#000] rounded-xl p-5 max-w-sm w-full">
                            <div className="flex items-center gap-2 mb-3">
                                <Shield size={20} className="text-neo-blue" />
                                <span className="font-black text-base">AEX App Permissions</span>
                            </div>
                            <div className="flex flex-col gap-2 mb-4">
                                {[
                                    { icon: '🖥️', text: 'Access screen and render UI' },
                                    { icon: '🏃', text: 'Run AEX scripts in sandbox' },
                                    { icon: '🔒', text: 'No access to your files or network' },
                                ].map((p, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm font-semibold">
                                        <span>{p.icon}</span><span>{p.text}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3 flex gap-2 items-start text-xs font-semibold text-yellow-800">
                                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                <span>AEX apps run in an isolated sandbox. CartoonOS is not responsible for third-party content.</span>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => setPhase('denied')}
                                className="flex items-center gap-2 px-6 py-3 border-[3px] border-black bg-white shadow-[3px_3px_0_0_#000] rounded-xl font-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                            >
                                <X size={18} /> Deny
                            </button>
                            <button
                                onClick={() => setPhase('running')}
                                className="flex items-center gap-2 px-8 py-3 border-[3px] border-black bg-neo-green shadow-[3px_3px_0_0_#000] rounded-xl font-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                            >
                                <Play size={18} /> Allow & Run
                            </button>
                        </div>
                    </motion.div>
                )}

                {phase === 'running' && (
                    <motion.div
                        key="running"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex flex-col overflow-hidden"
                    >
                        {/* App topbar */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 border-b-2 border-black shrink-0 text-xs font-bold">
                            <span>{meta.meta.icon}</span>
                            <span>{meta.meta.app} · AEX Sandbox</span>
                            <span className="ml-auto text-green-600">● Running</span>
                        </div>
                        <iframe
                            key={iframeKey}
                            srcDoc={doc}
                            className="flex-1 border-none w-full"
                            sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
                            title={meta.meta.app}
                        />
                    </motion.div>
                )}

                {phase === 'denied' && (
                    <motion.div
                        key="denied"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex flex-col items-center justify-center gap-4 p-8 bg-neo-bg text-center"
                    >
                        <span className="text-6xl">🚫</span>
                        <h2 className="text-2xl font-black">App Blocked</h2>
                        <p className="font-semibold text-gray-600">You denied permission to run <strong>{meta.meta.app}</strong>.</p>
                        <button
                            onClick={() => setPhase('prompt')}
                            className="neo-btn bg-neo-yellow px-6 py-2 font-black"
                        >
                            Try Again
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
