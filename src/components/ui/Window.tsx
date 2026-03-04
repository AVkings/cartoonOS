import React from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Square } from 'lucide-react';
import { useOSStore } from '../../store/useOSStore';
import { cn } from '../../utils/cn';

interface WindowProps {
    id: string;
    children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ id, children }) => {
    const { windows, focusWindow, closeWindow, minimizeWindow, maximizeWindow, focusedWindowId } = useOSStore();

    const windowData = windows[id];
    if (!windowData || !windowData.isOpen || windowData.isMinimized) return null;

    const isFocused = focusedWindowId === id;

    const handlePointerDown = () => {
        focusWindow(id);
    };

    return (
        <motion.div
            drag={!windowData.isMaximized}
            dragConstraints={{ left: 0, top: 0, right: window.innerWidth - 100, bottom: window.innerHeight - 100 }}
            dragMomentum={false}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
                scale: 1,
                opacity: 1,
                width: windowData.isMaximized ? '100vw' : 600,
                height: windowData.isMaximized ? 'calc(100vh - 4rem)' : 400, // Leave space for taskbar
                top: windowData.isMaximized ? 0 : undefined,
                left: windowData.isMaximized ? 0 : undefined,
            }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            onPointerDown={handlePointerDown}
            style={{ zIndex: windowData.zIndex }}
            className={cn(
                "absolute flex flex-col bg-white border-neo border-black shadow-neo rounded-xl overflow-hidden",
                isFocused ? "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] opacity-90",
                windowData.isMaximized && "rounded-none border-b-0 border-x-0 shadow-none border-t-0"
            )}
        >
            {/* Title Bar */}
            <div
                className={cn(
                    "flex justify-between items-center px-4 py-2 border-b-neo border-black select-none",
                    isFocused ? "bg-neo-blue" : "bg-gray-200"
                )}
            >
                <span className="font-bold text-black drop-shadow-[1px_1px_0_rgba(255,255,255,0.5)]">
                    {windowData.title}
                </span>
                <div className="flex gap-2">
                    <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => minimizeWindow(id)}
                        className="w-6 h-6 flex items-center justify-center bg-neo-yellow border-2 border-black rounded shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                    >
                        <Minus size={14} strokeWidth={3} className="text-black" />
                    </button>
                    <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => maximizeWindow(id)}
                        className="w-6 h-6 flex items-center justify-center bg-neo-green border-2 border-black rounded shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                    >
                        <Square size={12} strokeWidth={3} className="text-black" />
                    </button>
                    <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => closeWindow(id)}
                        className="w-6 h-6 flex items-center justify-center bg-neo-red border-2 border-black rounded shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                    >
                        <X size={14} strokeWidth={3} className="text-black" />
                    </button>
                </div>
            </div>

            {/* Window Content */}
            <div className="flex-1 overflow-auto bg-neo-bg">
                {children}
            </div>
        </motion.div>
    );
};
