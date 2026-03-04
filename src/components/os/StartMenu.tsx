import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '../../store/useOSStore';
import { Power, FileText, Terminal, Settings, Globe, ShoppingBag, Code, RotateCcw } from 'lucide-react';
import { cn } from '../../utils/cn';

const APPS = [
    { id: 'notepad', title: 'Notepad', icon: FileText, color: 'bg-neo-yellow' },
    { id: 'terminal', title: 'Terminal', icon: Terminal, color: 'bg-neo-blue' },
    { id: 'browser', title: 'Browser', icon: Globe, color: 'bg-neo-pink' },
    { id: 'settings', title: 'Settings', icon: Settings, color: 'bg-neo-green' },
    { id: 'appstore', title: 'App Store', icon: ShoppingBag, color: 'bg-purple-300' },
    { id: 'codeeditor', title: 'Code Editor', icon: Code, color: 'bg-orange-300' },
];

export const StartMenu: React.FC = () => {
    const { isStartMenuOpen, toggleStartMenu, openWindow } = useOSStore();

    return (
        <AnimatePresence>
            {isStartMenuOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[9990]"
                        onClick={toggleStartMenu}
                    />
                    {/* Menu */}
                    <motion.div
                        initial={{ y: 30, opacity: 0, scale: 0.97 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 30, opacity: 0, scale: 0.97 }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.28 }}
                        className="absolute bottom-16 left-3 w-68 bg-white border-[3px] border-black shadow-[6px_6px_0_0_#000] rounded-xl overflow-hidden z-[9991]"
                        style={{ width: 256 }}
                    >
                        {/* Header */}
                        <div className="bg-neo-pink px-4 py-3 border-b-[3px] border-black">
                            <h2 className="text-2xl font-black">⚡ CartoonOS</h2>
                            <p className="text-xs font-semibold opacity-70">All Applications</p>
                        </div>

                        {/* App list */}
                        <div className="flex flex-col p-2 gap-1">
                            {APPS.map((app) => {
                                const Icon = app.icon;
                                return (
                                    <button
                                        key={app.id}
                                        onClick={() => {
                                            openWindow(app.id, app.title);
                                            toggleStartMenu();
                                        }}
                                        className="flex items-center gap-3 w-full px-2 py-2 text-left rounded-lg hover:bg-gray-100 transition-colors active:bg-gray-200 group"
                                    >
                                        <div className={cn('p-2 border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all', app.color)}>
                                            <Icon size={18} className="text-black" />
                                        </div>
                                        <span className="font-bold text-base">{app.title}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="p-2 pt-0 border-t-[3px] border-black bg-gray-50 mt-1">
                            <button
                                onClick={() => window.location.reload()}
                                className="flex items-center gap-3 w-full px-2 py-2 text-left rounded-lg hover:bg-red-50 transition-colors text-red-600"
                            >
                                <RotateCcw size={16} />
                                <span className="font-bold text-sm">Restart CartoonOS</span>
                            </button>
                            <button
                                onClick={toggleStartMenu}
                                className="flex items-center gap-3 w-full px-2 py-2 text-left rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                            >
                                <Power size={16} />
                                <span className="font-bold text-sm">Close Menu</span>
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
