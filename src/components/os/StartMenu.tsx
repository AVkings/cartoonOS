import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '../../store/useOSStore';
import { Power, FileText, Terminal, Settings, Globe } from 'lucide-react';
import { cn } from '../../utils/cn';

const APPS = [
    { id: 'notepad', title: 'Notepad', icon: FileText, color: 'bg-neo-yellow' },
    { id: 'terminal', title: 'Terminal', icon: Terminal, color: 'bg-neo-blue' },
    { id: 'browser', title: 'Browser', icon: Globe, color: 'bg-neo-pink' },
    { id: 'settings', title: 'Settings', icon: Settings, color: 'bg-neo-green' },
];

export const StartMenu: React.FC = () => {
    const { isStartMenuOpen, toggleStartMenu, openWindow } = useOSStore();

    return (
        <AnimatePresence>
            {isStartMenuOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[9990]"
                        onClick={toggleStartMenu}
                    />
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                        className="absolute bottom-16 left-4 w-64 bg-white border-neo border-black shadow-neo rounded-xl overflow-hidden z-[9991]"
                    >
                        <div className="bg-neo-pink p-4 border-b-neo border-black">
                            <h2 className="text-2xl font-black drop-shadow-[2px_2px_0_rgba(255,255,255,0.8)]">
                                CartoonOS
                            </h2>
                        </div>
                        <div className="flex flex-col p-2 gap-2">
                            {APPS.map((app) => {
                                const Icon = app.icon;
                                return (
                                    <button
                                        key={app.id}
                                        onClick={() => {
                                            openWindow(app.id, app.title);
                                            toggleStartMenu();
                                        }}
                                        className="flex items-center gap-3 w-full p-2 text-left rounded hover:bg-gray-100 transition-colors active:bg-gray-200"
                                    >
                                        <div className={cn("p-2 border-2 border-black rounded shadow-[2px_2px_0_0_#000]", app.color)}>
                                            <Icon size={20} className="text-black" />
                                        </div>
                                        <span className="font-bold text-lg">{app.title}</span>
                                    </button>
                                )
                            })}
                        </div>
                        <div className="p-2 border-t-neo border-black bg-gray-100">
                            <button
                                onClick={() => window.location.reload()}
                                className="flex items-center gap-3 w-full p-2 text-left rounded hover:bg-red-100 transition-colors active:bg-red-200 text-red-600"
                            >
                                <Power size={20} />
                                <span className="font-bold">Restart / BSOD test</span>
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
