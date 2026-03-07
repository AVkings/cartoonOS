import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useOSStore } from '../../store/useOSStore';
import { useFileStore } from '../../store/useFileStore';
import { WindowManager } from './WindowManager';
import { Taskbar } from './Taskbar';
import { StartMenu } from './StartMenu';
import { DesktopPet } from './DesktopPet';
import { cn } from '../../utils/cn';
import { FileText, Terminal, Settings, Globe, ShoppingBag, Code, type LucideIcon } from 'lucide-react';
import { parseAEX } from '../../utils/aexRuntime';

interface IconDef {
    id: string;
    title: string;
    icon: LucideIcon;
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
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
};

const savePositions = (pos: Record<string, { x: number; y: number }>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
};

const WALLPAPER_FALLBACK = 'bg-[#fdfbf7] bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px]';

export const Desktop: React.FC = () => {
    const { wallpaper, openWindow, pinnedApps } = useOSStore();
    const { files } = useFileStore();
    const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(loadPositions);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({
        x: 0,
        y: 0,
        visible: false,
    });

    const isImageUrl = wallpaper.startsWith('http') || wallpaper.startsWith('data:');

    const getPos = (id: string, idx: number) => positions[id] ?? DEFAULT_POS(idx);

    const handleDragEnd = useCallback((id: string, x: number, y: number) => {
        setPositions(prev => {
            const next = { ...prev, [id]: { x, y } };
            savePositions(next);
            return next;
        });
    }, []);

    const handleDesktopContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            visible: true,
        });
    };

    const closeContextMenu = () => {
        setContextMenu(prev => (prev.visible ? { ...prev, visible: false } : prev));
    };

    return (
        <div
            className={cn(
                'flex flex-col h-screen w-screen overflow-hidden',
                !isImageUrl && (wallpaper || WALLPAPER_FALLBACK)
            )}
            style={isImageUrl ? {
                backgroundImage: `url(${wallpaper})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            } : undefined}
        >
            {/* Desktop surface */}
            <div
                className="flex-1 relative w-full overflow-hidden"
                onContextMenu={handleDesktopContextMenu}
                onClick={closeContextMenu}
            >

                {/* Moveable Desktop Icons: built-in apps */}
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
                                'p-3 border-[3px] border-black shadow-[3px_3px_0_0_#000] rounded-xl w-14 h-14 flex items-center justify-center relative',
                                'group-hover:scale-110 group-active:translate-x-[2px] group-active:translate-y-[2px] group-active:shadow-none transition-all duration-150',
                                app.color
                            )}>
                                <Icon size={28} className="text-black" />
                                <span className="absolute -top-2 -right-2 text-xs">{app.emoji}</span>
                            </div>
                            <span className="font-bold text-black text-[11px] text-center drop-shadow-[1px_1px_0_rgba(255,255,255,0.9)] leading-tight max-w-full px-1">
                                {app.title}
                            </span>
                        </motion.div>
                    );
                })}

                {/* Dynamic icons for pinned AEX apps (e.g. downloaded games) */}
                {pinnedApps.map((appId, idx) => {
                    const file = files[appId];
                    if (!file || file.type !== 'aex') return null;
                    const meta = parseAEX(file.content).meta;
                    const pos = getPos(appId, ICONS.length + idx);
                    const label = `${meta.icon} ${meta.app}`;
                    return (
                        <motion.div
                            key={appId}
                            drag
                            dragMomentum={false}
                            dragElastic={0}
                            initial={false}
                            animate={{ x: pos.x, y: pos.y }}
                            onDragEnd={(_e, info) => {
                                handleDragEnd(appId,
                                    Math.max(0, Math.min(pos.x + info.offset.x, window.innerWidth - 80)),
                                    Math.max(0, Math.min(pos.y + info.offset.y, window.innerHeight - 140))
                                );
                            }}
                            className="absolute flex flex-col items-center gap-1 cursor-pointer w-[92px] group z-10 select-none"
                            style={{ left: 0, top: 0, touchAction: 'none' }}
                            onDoubleClick={() => openWindow(appId, label)}
                        >
                            <div className={cn(
                                'p-3 border-[3px] border-black shadow-[3px_3px_0_0_#000] rounded-xl w-16 h-16 flex items-center justify-center bg-white relative',
                                'group-hover:scale-110 group-active:translate-x-[2px] group-active:translate-y-[2px] group-active:shadow-none transition-all duration-150'
                            )}>
                                <span className="text-2xl">{meta.icon || '📦'}</span>
                            </div>
                            <span className="font-bold text-black text-[11px] text-center drop-shadow-[1px_1px_0_rgba(255,255,255,0.9)] leading-tight max-w-full px-1 line-clamp-2">
                                {meta.app || file.name.replace(/\.aex$/i, '')}
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

                {/* Right-click context menu */}
                {contextMenu.visible && (
                    <div
                        className="absolute z-[9600] bg-white border-[3px] border-black shadow-[4px_4px_0_0_#000] rounded-lg text-xs font-bold overflow-hidden"
                        style={{ left: contextMenu.x, top: contextMenu.y }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => {
                                openWindow('notepad', 'Notepad');
                                closeContextMenu();
                            }}
                            className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                        >
                            📝 New note
                        </button>
                        <button
                            onClick={() => {
                                openWindow('terminal', 'Terminal');
                                closeContextMenu();
                            }}
                            className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                        >
                            💻 Open terminal
                        </button>
                        <button
                            onClick={() => {
                                openWindow('appstore', 'App Store');
                                closeContextMenu();
                            }}
                            className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                        >
                            🛒 Open App Store
                        </button>
                        <button
                            onClick={() => {
                                openWindow('settings', 'Settings');
                                closeContextMenu();
                            }}
                            className="block w-full px-3 py-2 text-left hover:bg-gray-100 border-t border-gray-200"
                        >
                            ⚙️ Settings
                        </button>
                    </div>
                )}
            </div>

            {/* Taskbar */}
            <Taskbar />
        </div>
    );
};