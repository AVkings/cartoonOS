import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOSStore } from '../../store/useOSStore';
import { WindowManager } from './WindowManager';
import { Taskbar } from './Taskbar';
import { StartMenu } from './StartMenu';
import { DesktopPet } from './DesktopPet';
import { cn } from '../../utils/cn';
import { FileText, Terminal, Settings, Globe, ShoppingBag, Code } from 'lucide-react';

interface IconDef {
    id: string;
    title: string;
    icon: React.FC<{ size?: number }>;
    color: string;
    emoji: string;
}

const ICONS: IconDef[] = [
    { id: 'notepad', title: 'Notepad', icon: FileText, color: 'bg-neo-yellow', emoji: '📝' },
    { id: 'terminal', title: 'Terminal', icon: Terminal, color: 'bg-neo-blue', emoji: '💻' },
    { id: 'browser', title: 'Browser', icon: Globe, color: 'bg-neo-pink', emoji: '🌐' },
    { id: 'settings', title: 'Settings', icon: Settings, color: 'bg-neo-green', emoji: '⚙️' },
    { id: 'appstore', title: 'App Store', icon: ShoppingBag, color: 'bg-purple-300', emoji: '🛒' },
    { id: 'codeeditor', title: 'Code Editor', icon: Code, color: 'bg-orange-300', emoji: '🧑‍💻' },
];

// Default desktop icon grid positions (left column)
const DEFAULT_POS = (idx: number) => ({ x: 12, y: 12 + idx * 88 });

const STORAGE_KEY = 'cartoonos-icon-positions';

const loadPositions = (): Record<string, { x: number; y: number }> => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    } catch { return {}; }
};

const savePositions = (pos: Record<string, { x: number; y: number }>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
};

const WALLPAPER_FALLBACK = 'bg-[#fdfbf7] bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px]';

export const Desktop: React.FC = () => {
    const { wallpaper, openWindow } = useOSStore();
    const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(loadPositions);

    const isImageUrl = wallpaper.startsWith('http') || wallpaper.startsWith('data:');

    const getPos = (id: string, idx: number) => positions[id] ?? DEFAULT_POS(idx);

    const handleDragEnd = useCallback((id: string, x: number, y: number) => {
        const next = { ...positions, [id]: { x, y } };
        setPositions(next);
        savePositions(next);
    }, [positions]);

    return (
        <div
            className={cn(
                'flex flex-col h-screen w-screen overflow-hidden',
                isImageUrl ? '' : (wallpaper || WALLPAPER_FALLBACK)
            )}
            style={isImageUrl ? {
                backgroundImage: `url(${wallpaper})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            } : undefined}
        >
            {/* Desktop surface */}
            <div className="flex-1 relative w-full overflow-hidden">

                {/* Moveable Desktop Icons */}
                {ICONS.map((app, idx) => {
                    const pos = getPos(app.id, idx);
                    const Icon = app.icon;
                    return (
                        <motion.div
                            key={app.id}
                            drag
                            dragMomentum={false}
                            dragElastic={0}
                            initial={false}
                            animate={{ x: pos.x, y: pos.y }}
                            onDragEnd={(_e, info) => {
                                handleDragEnd(app.id,
                                    Math.max(0, Math.min(pos.x + info.offset.x, window.innerWidth - 80)),
                                    Math.max(0, Math.min(pos.y + info.offset.y, window.innerHeight - 140))
                                );
                            }}
                            className="absolute flex flex-col items-center gap-1 cursor-pointer w-[72px] group z-10 select-none"
                            style={{ left: 0, top: 0, touchAction: 'none' }}
                            onDoubleClick={() => openWindow(app.id, app.title)}
                        >
                            <div className={cn(
                                'p-3 border-[3px] border-black shadow-[3px_3px_0_0_#000] rounded-xl w-14 h-14 flex items-center justify-center',
                                'group-hover:scale-110 group-active:translate-x-[2px] group-active:translate-y-[2px] group-active:shadow-none transition-all duration-150',
                                app.color
                            )}>
                                <Icon size={28} className="text-black" />
                            </div>
                            <span className="font-bold text-black text-[11px] text-center drop-shadow-[1px_1px_0_rgba(255,255,255,0.9)] leading-tight max-w-full px-1">
                                {app.title}
                            </span>
                        </motion.div>
                    );
                })}

                {/* Windows */}
                <WindowManager />

                {/* Start Menu overlay */}
                <StartMenu />

                {/* Desktop Pet */}
                <DesktopPet />
            </div>

            {/* Taskbar */}
            <Taskbar />
        </div>
    );
};
