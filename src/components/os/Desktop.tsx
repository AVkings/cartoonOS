import React from 'react';
import { WindowManager } from './WindowManager';
import { Taskbar } from './Taskbar';
import { StartMenu } from './StartMenu';
import { DesktopPet } from './DesktopPet';
import { useOSStore } from '../../store/useOSStore';
import { FileText, Terminal, Settings, Globe } from 'lucide-react';
import { cn } from '../../utils/cn';

const APPS = [
    { id: 'notepad', title: 'Notepad', icon: FileText, color: 'bg-neo-yellow' },
    { id: 'terminal', title: 'Terminal', icon: Terminal, color: 'bg-neo-blue' },
    { id: 'browser', title: 'Browser', icon: Globe, color: 'bg-neo-pink' },
    { id: 'settings', title: 'Settings', icon: Settings, color: 'bg-neo-green' },
];

// Precompute background for wallpapers that can't be Tailwind classes (e.g. gradient)
const WALLPAPER_FALLBACK = 'bg-[#fdfbf7] bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px]';

export const Desktop: React.FC = () => {
    const { wallpaper, openWindow } = useOSStore();

    const isImageUrl = wallpaper.startsWith('http') || wallpaper.startsWith('data:');

    return (
        <div
            className={cn(
                'flex flex-col h-screen w-screen overflow-hidden',
                isImageUrl ? '' : (wallpaper || WALLPAPER_FALLBACK)
            )}
            style={
                isImageUrl
                    ? { backgroundImage: `url(${wallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : undefined
            }
        >
            {/* Desktop Surface */}
            <div className="flex-1 relative w-full overflow-hidden">
                {/* Desktop Icon Grid — left column */}
                <div className="absolute top-4 left-4 flex flex-col gap-3 z-10">
                    {APPS.map((app) => {
                        const Icon = app.icon;
                        return (
                            <div
                                key={app.id}
                                className="flex flex-col items-center gap-1 cursor-pointer w-[68px] group select-none"
                                onDoubleClick={() => openWindow(app.id, app.title)}
                            >
                                <div className={cn(
                                    'p-3 border-[3px] border-black shadow-[3px_3px_0_0_#000] rounded-xl',
                                    'group-hover:scale-110 group-active:translate-x-[2px] group-active:translate-y-[2px] group-active:shadow-none transition-all duration-150',
                                    app.color
                                )}>
                                    <Icon size={28} className="text-black" />
                                </div>
                                <span className="font-bold text-black text-xs text-center drop-shadow-[1px_1px_0_rgba(255,255,255,0.9)] leading-tight">
                                    {app.title}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Windows are rendered here */}
                <WindowManager />

                {/* Start Menu pops up from the desktop */}
                <StartMenu />

                {/* Desktop Pet */}
                <DesktopPet />
            </div>

            {/* Taskbar */}
            <Taskbar />
        </div>
    );
};
