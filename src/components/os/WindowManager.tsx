import React from 'react';
import { useOSStore } from '../../store/useOSStore';
import { Window } from '../ui/Window';
import { Notepad } from '../apps/Notepad';
import { Terminal } from '../apps/Terminal';
import { Browser } from '../apps/Browser';
import { Settings } from '../apps/Settings';
import { AppStore } from '../apps/AppStore';
import { CodeEditor } from '../apps/CodeEditor';
import { AEXRunner } from '../apps/AEXRunner';
import { useFileStore } from '../../store/useFileStore';

// Static app registry for built-in apps
const BUILT_INS: Record<string, React.FC> = {
    notepad: Notepad,
    terminal: Terminal,
    browser: Browser,
    settings: Settings,
    appstore: AppStore,
    codeeditor: CodeEditor,
};

export const WindowManager: React.FC = () => {
    const { windows } = useOSStore();
    const { files } = useFileStore();

    return (
        <>
            {Object.values(windows).map((win) => {
                if (!win.isOpen) return null;

                let content: React.ReactNode;

                if (BUILT_INS[win.id]) {
                    // Built-in app
                    const App = BUILT_INS[win.id];
                    content = <App />;
                } else if (win.id.startsWith('editor_')) {
                    // Code editor opened for a specific file
                    const fileId = win.id.replace('editor_', '');
                    content = <CodeEditor fileId={fileId} />;
                } else if (win.id.startsWith('aex_')) {
                    // AEX app runner
                    content = <AEXRunner fileId={win.id} />;
                } else {
                    content = (
                        <div className="p-6 text-red-500 font-bold">
                            App not found: <code>{win.id}</code>
                        </div>
                    );
                }

                return (
                    <Window key={win.id} id={win.id}>
                        {content}
                    </Window>
                );
            })}
        </>
    );
};
