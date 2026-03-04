import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { useOSStore } from '../../store/useOSStore';
import { cn } from '../../utils/cn';

interface WindowProps {
    id: string;
    children: React.ReactNode;
}

// Stagger spawn positions so windows don't all appear at the same spot
const SPAWN_OFFSETS: Record<string, { x: number; y: number }> = {};
const getSpawnOffset = (id: string) => {
    if (!SPAWN_OFFSETS[id]) {
        const count = Object.keys(SPAWN_OFFSETS).length;
        SPAWN_OFFSETS[id] = {
            x: 60 + (count % 5) * 30,
            y: 40 + (count % 4) * 30,
        };
    }
    return SPAWN_OFFSETS[id];
};

export const Window: React.FC<WindowProps> = ({ id, children }) => {
    const { windows, focusWindow, closeWindow, minimizeWindow, maximizeWindow, focusedWindowId } = useOSStore();
    const constraintRef = useRef(null);

    const windowData = windows[id];
    if (!windowData || !windowData.isOpen || windowData.isMinimized) return null;

    const isFocused = focusedWindowId === id;
    const spawn = getSpawnOffset(id);

    return (
        <motion.div
            drag={!windowData.isMaximized}
            dragConstraints={{ left: 0, top: 0, right: window.innerWidth - 120, bottom: window.innerHeight - 80 }}
            dragMomentum={false}
            dragElastic={0}
            initial={{ scale: 0.85, opacity: 0, x: spawn.x, y: spawn.y }}
            animate={{
                scale: 1,
                opacity: 1,
                width: windowData.isMaximized ? '100vw' : id === 'browser' ? 760 : 600,
                height: windowData.isMaximized ? 'calc(100vh - 56px)' : id === 'terminal' ? 360 : id === 'browser' ? 500 : 420,
                x: windowData.isMaximized ? 0 : undefined,
                y: windowData.isMaximized ? 0 : undefined,
            }}
            transition={{ type: 'spring', bounce: 0.1, duration: 0.35 }}
            onPointerDown={() => focusWindow(id)}
            style={{ zIndex: windowData.zIndex, position: 'absolute' }}
            className={cn(
                "flex flex-col bg-white border-[3px] border-black rounded-xl overflow-hidden",
                isFocused
                    ? "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                    : "shadow-[3px_3px_0px_0px_rgba(0,0,0,0.6)] opacity-95",
                windowData.isMaximized && "rounded-none border-0 shadow-none"
            )}
        >
            {/* Title Bar */}
            <div
                className={cn(
                    "flex justify-between items-center px-3 py-2 border-b-[3px] border-black select-none shrink-0 cursor-grab active:cursor-grabbing",
                    isFocused ? "bg-neo-blue" : "bg-gray-200"
                )}
            >
                <div className="flex items-center gap-2">
                    <span className="font-black text-black text-sm">{windowData.title}</span>
                </div>

                {/* Window control buttons */}
                <div className="flex gap-1.5" onPointerDown={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => minimizeWindow(id)}
                        title="Minimize"
                        className="w-5 h-5 flex items-center justify-center bg-neo-yellow border-2 border-black rounded shadow-[1px_1px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all hover:brightness-90"
                    >
                        <Minus size={10} strokeWidth={3} />
                    </button>
                    <button
                        onClick={() => maximizeWindow(id)}
                        title={windowData.isMaximized ? 'Restore' : 'Maximize'}
                        className="w-5 h-5 flex items-center justify-center bg-neo-green border-2 border-black rounded shadow-[1px_1px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all hover:brightness-90"
                    >
                        {windowData.isMaximized ? <Square size={10} strokeWidth={3} /> : <Maximize2 size={10} strokeWidth={3} />}
                    </button>
                    <button
                        onClick={() => closeWindow(id)}
                        title="Close"
                        className="w-5 h-5 flex items-center justify-center bg-neo-red border-2 border-black rounded shadow-[1px_1px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all hover:brightness-90"
                    >
                        <X size={10} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden" ref={constraintRef}>
                {children}
            </div>
        </motion.div>
    );
};
