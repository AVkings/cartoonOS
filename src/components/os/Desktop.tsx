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

export const Desktop: React.FC = () => {
    const { wallpaper, openWindow } = useOSStore();

    const isUrl = wallpaper.startsWith('http') || wallpaper.startsWith('data:');

    return (
        <div
            className={cn(
                "flex flex-col h-screen w-screen overflow-hidden",
                !isUrl && wallpaper
            )}
            style={{
                backgroundImage: isUrl ? `url(${wallpaper})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Desktop Area */}
            <div className="flex-1 relative w-full h-full overflow-hidden p-6 flex flex-col gap-6 items-start">
                {/* Desktop Icons */}
                {APPS.map((app) => {
                    const Icon = app.icon;
                    return (
                        <div
                            key={app.id}
                            className="flex flex-col items-center gap-1 cursor-pointer w-20 group"
                            onDoubleClick={() => openWindow(app.id, app.title)}
                        >
                            <div className={cn("p-3 border-neo border-black shadow-[2px_2px_0_0_#000] rounded-xl group-active:translate-x-[2px] group-active:translate-y-[2px] group-active:shadow-none transition-all", app.color)}>
                                <Icon size={32} className="text-black" />
                            </div>
                            <span className="font-bold text-black drop-shadow-[1px_1px_0_rgba(255,255,255,1)] text-center text-sm">
                                {app.title}
                            </span>
                        </div>
                    );
                })}

                {/* Window Manager */}
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
