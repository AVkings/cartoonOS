import React, { useState, useEffect } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { cn } from '../../utils/cn';

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
            openWindow(id); // Re-focuses if already open
        }
    };

    return (
        <div className="h-14 w-full border-t-neo border-black bg-white shadow-[0_-4px_0_0_rgba(0,0,0,1)] z-[9999] flex items-center px-4 justify-between select-none">
            <div className="flex gap-2 h-full items-center">
                <button
                    onClick={toggleStartMenu}
                    className="neo-btn bg-neo-yellow px-6 py-1 h-10 flex items-center justify-center text-xl tracking-wider mr-4">
                    START
                </button>

                {openApps.map(app => (
                    <button
                        key={app.id}
                        onClick={() => toggleWindow(app.id, app.isMinimized)}
                        className={cn(
                            "neo-btn px-4 py-1 h-10 flex items-center justify-center transition-all",
                            focusedWindowId === app.id && !app.isMinimized
                                ? "bg-gray-200 translate-y-1 translate-x-1 shadow-none"
                                : "bg-white"
                        )}
                    >
                        <span className="font-bold">{app.title}</span>
                    </button>
                ))}
            </div>

            <div className="flex items-center justify-center h-10 px-4 border-neo border-black shadow-neo rounded-lg bg-neo-pink font-bold text-lg select-none">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
        </div>
    );
};
