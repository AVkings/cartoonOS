import React, { useState, useEffect } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { cn } from '../../utils/cn';
import { FileText, Terminal, Settings, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const APP_ICONS: Record<string, React.FC<{ size?: number }>> = {
    notepad: ({ size = 16 }) => <FileText size={size} />,
    terminal: ({ size = 16 }) => <Terminal size={size} />,
    browser: ({ size = 16 }) => <Globe size={size} />,
    settings: ({ size = 16 }) => <Settings size={size} />,
};

const APP_COLORS: Record<string, string> = {
    notepad: 'bg-neo-yellow',
    terminal: 'bg-neo-blue',
    browser: 'bg-neo-pink',
    settings: 'bg-neo-green',
};

export const Taskbar: React.FC = () => {
    const { windows, openWindow, minimizeWindow, focusedWindowId, toggleStartMenu } = useOSStore();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const openApps = Object.values(windows).filter(w => w.isOpen);

    const toggleWindow = (id: string, isMinimized: boolean) => {
        if (focusedWindowId === id && !isMinimized) {
            minimizeWindow(id);
        } else {
            openWindow(id);
        }
    };

    return (
        <div className="h-14 w-full border-t-[3px] border-black bg-white shadow-[0_-4px_0_0_rgba(0,0,0,1)] z-[9999] flex items-center px-3 justify-between select-none shrink-0">
            {/* Left: Start + App buttons */}
            <div className="flex gap-2 h-full items-center">
                {/* START Button */}
                <button
                    onClick={toggleStartMenu}
                    className="neo-btn bg-neo-yellow px-5 h-10 flex items-center justify-center text-lg font-black tracking-widest mr-2 hover:bg-yellow-300"
                >
                    ⚡ START
                </button>

                {/* Open app buttons */}
                <AnimatePresence>
                    {openApps.map(app => {
                        const Icon = APP_ICONS[app.id];
                        const isFocused = focusedWindowId === app.id && !app.isMinimized;
                        return (
                            <motion.button
                                key={app.id}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ type: 'spring', bounce: 0.3, duration: 0.3 }}
                                onClick={() => toggleWindow(app.id, app.isMinimized)}
                                className={cn(
                                    'flex items-center gap-2 px-3 h-10 border-[3px] border-black rounded-lg font-bold text-sm transition-all',
                                    isFocused
                                        ? 'translate-x-[2px] translate-y-[2px] shadow-none bg-gray-200'
                                        : 'shadow-[2px_2px_0_0_#000] bg-white hover:bg-gray-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
                                    app.isMinimized && 'opacity-60'
                                )}
                            >
                                {Icon && (
                                    <div className={cn('p-1 rounded border border-black', APP_COLORS[app.id] || 'bg-gray-200')}>
                                        <Icon size={12} />
                                    </div>
                                )}
                                <span className="max-w-[100px] truncate">{app.title}</span>
                            </motion.button>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Right: Clock */}
            <div className="flex items-center gap-3 shrink-0">
                <div className="flex flex-col items-center justify-center h-10 px-4 border-[3px] border-black shadow-[2px_2px_0_0_#000] rounded-lg bg-neo-pink font-black select-none">
                    <span className="text-base leading-none">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-[10px] leading-none">{time.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                </div>
            </div>
        </div>
    );
};
