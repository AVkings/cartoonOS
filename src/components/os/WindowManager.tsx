import React from 'react';
import { useOSStore } from '../../store/useOSStore';
import { Window } from '../ui/Window';

import { Notepad } from '../apps/Notepad';
import { Terminal } from '../apps/Terminal';
import { Browser } from '../apps/Browser';
import { Settings } from '../apps/Settings';

const AppRegistry: Record<string, React.FC> = {
    notepad: Notepad,
    terminal: Terminal,
    settings: Settings,
    browser: Browser,
};

export const WindowManager: React.FC = () => {
    const { windows } = useOSStore();

    return (
        <>
            {Object.values(windows).map((win) => {
                if (!win.isOpen) return null;
                const AppComponent = AppRegistry[win.id];

                return (
                    <Window key={win.id} id={win.id}>
                        {AppComponent ? <AppComponent /> : <div className="p-4 text-red-500 font-bold">App not found: {win.id}</div>}
                    </Window>
                );
            })}
        </>
    );
};
