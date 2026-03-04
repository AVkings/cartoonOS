import React from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Maximize2, Square } from 'lucide-react';
import { useOSStore } from '../../store/useOSStore';
import { cn } from '../../utils/cn';

interface WindowProps {
    id: string;
    children: React.ReactNode;
}

// Per-app window dimensions
const APP_SIZES: Record<string, { w: number; h: number }> = {
    browser: { w: 820, h: 560 },
    terminal: { w: 640, h: 380 },
    notepad: { w: 680, h: 460 },
    settings: { w: 560, h: 520 },
    appstore: { w: 820, h: 580 },
    codeeditor: { w: 900, h: 580 },
};

const getSize = (id: string) => {
    if (id.startsWith('aex_')) return { w: 640, h: 480 };
    if (id.startsWith('editor_')) return APP_SIZES.codeeditor;
    return APP_SIZES[id] ?? { w: 640, h: 460 };
};

// Calculate centered + cascaded spawn position
// NOTE: We use a module-level counter that increments per unique window id opened in this session
const seen: Set<string> = new Set();
let spawnCount = 0;

const getSpawnPos = (id: string, w: number, h: number) => {
    if (!seen.has(id)) {
        seen.add(id);
        spawnCount++;
    }
    const idx = [...seen].indexOf(id);
    const cascade = (idx % 8) * 26;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    return {
        x: Math.max(10, Math.floor((vw - w) / 2) + cascade - 4 * 26),
        y: Math.max(10, Math.floor((vh - h - 56) / 2) + cascade - 4 * 26),
    };
};

export const Window: React.FC<WindowProps> = ({ id, children }) => {
    const { windows, focusWindow, closeWindow, minimizeWindow, maximizeWindow, focusedWindowId } = useOSStore();

    const windowData = windows[id];
    if (!windowData || !windowData.isOpen || windowData.isMinimized) return null;

    const isFocused = focusedWindowId === id;
    const { w, h } = getSize(id);
    const spawn = getSpawnPos(id, w, h);

    return (
        <motion.div
            drag={!windowData.isMaximized}
            dragConstraints={{
                left: 0,
                top: 0,
                right: Math.max(0, window.innerWidth - 80),
                bottom: Math.max(0, window.innerHeight - 56 - 40),
            }}
            dragMomentum={false}
            dragElastic={0}
            initial={{ scale: 0.88, opacity: 0, x: spawn.x, y: spawn.y }}
            animate={{
                scale: 1,
                opacity: 1,
                width: windowData.isMaximized ? window.innerWidth : w,
                height: windowData.isMaximized ? window.innerHeight - 56 : h,
                x: windowData.isMaximized ? 0 : undefined,
                y: windowData.isMaximized ? 0 : undefined,
            }}
            transition={{ type: 'spring', bounce: 0.12, duration: 0.3 }}
            onPointerDown={() => focusWindow(id)}
            style={{ zIndex: windowData.zIndex, position: 'absolute' }}
            className={cn(
                'flex flex-col bg-white border-[3px] border-black rounded-xl overflow-hidden',
                isFocused
                    ? 'shadow-[7px_7px_0px_0px_rgba(0,0,0,1)]'
                    : 'shadow-[3px_3px_0px_0px_rgba(0,0,0,0.55)] opacity-95',
                windowData.isMaximized && 'rounded-none border-0 !shadow-none'
            )}
        >
            {/* Title Bar */}
            <div
                className={cn(
                    'flex justify-between items-center px-3 py-2 border-b-[3px] border-black select-none shrink-0 cursor-grab active:cursor-grabbing',
                    isFocused ? 'bg-neo-blue' : 'bg-gray-200'
                )}
            >
                <span className="font-black text-black text-sm truncate max-w-[70%]">{windowData.title}</span>

                {/* Controls */}
                <div className="flex gap-1.5 shrink-0" onPointerDown={(e) => e.stopPropagation()}>
                    <button onClick={() => minimizeWindow(id)} title="Minimize"
                        className="w-5 h-5 flex items-center justify-center bg-neo-yellow border-2 border-black rounded shadow-[1px_1px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all">
                        <Minus size={10} strokeWidth={3} />
                    </button>
                    <button onClick={() => maximizeWindow(id)} title={windowData.isMaximized ? 'Restore' : 'Maximize'}
                        className="w-5 h-5 flex items-center justify-center bg-neo-green border-2 border-black rounded shadow-[1px_1px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all">
                        {windowData.isMaximized ? <Square size={9} strokeWidth={3} /> : <Maximize2 size={9} strokeWidth={3} />}
                    </button>
                    <button onClick={() => closeWindow(id)} title="Close"
                        className="w-5 h-5 flex items-center justify-center bg-neo-red border-2 border-black rounded shadow-[1px_1px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all">
                        <X size={10} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                {children}
            </div>
        </motion.div>
    );
};
