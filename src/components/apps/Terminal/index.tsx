import React, { useState, useRef, useEffect } from 'react';
import { useFileStore } from '../../../store/useFileStore';
import { cn } from '../../../utils/cn';

type HistoryLine = { type: 'input' | 'output' | 'error' | 'info'; text: string };

const MOTD = [
    'CartoonOS Terminal v2.0',
    'Type "help" for a list of commands.',
    '─'.repeat(40),
];

export const Terminal: React.FC = () => {
    const { files } = useFileStore();
    const [history, setHistory] = useState<HistoryLine[]>(
        MOTD.map(t => ({ type: 'info', text: t }))
    );
    const [input, setInput] = useState('');
    const [cmdHistory, setCmdHistory] = useState<string[]>([]);
    const [cmdHistoryIndex, setCmdHistoryIndex] = useState(-1);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const push = (lines: HistoryLine[]) => setHistory(prev => [...prev, ...lines]);

    const handleCommand = (raw: string) => {
        const cmd = raw.trim();
        if (!cmd) return;

        // Save to command history
        setCmdHistory(prev => [cmd, ...prev]);
        setCmdHistoryIndex(-1);

        const echo: HistoryLine = { type: 'input', text: `C:\\CartoonOS> ${cmd}` };

        const parts = cmd.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1).join(' ');

        switch (command) {
            case 'help':
                push([echo, {
                    type: 'output', text: [
                        '  help     — Show this help message',
                        '  clear    — Clear the terminal',
                        '  echo     — Print text: echo <text>',
                        '  date     — Show current date/time',
                        '  whoami   — Show current user',
                        '  ls       — List files in virtual FS',
                        '  cat      — Read a file: cat <filename>',
                        '  sysinfo  — Show system information',
                        '  neofetch — Show system info with art',
                        '  color    — Change terminal color: color <green|pink|blue|white>',
                    ].join('\n')
                }]);
                break;

            case 'clear':
                setHistory(MOTD.map(t => ({ type: 'info', text: t })));
                return;

            case 'echo':
                push([echo, { type: 'output', text: args || '' }]);
                break;

            case 'date':
                push([echo, { type: 'output', text: new Date().toString() }]);
                break;

            case 'whoami':
                push([echo, { type: 'output', text: 'cartoon_user @ CartoonOS' }]);
                break;

            case 'ls':
            case 'dir': {
                const fileList = Object.values(files);
                if (fileList.length === 0) {
                    push([echo, { type: 'output', text: 'No files found. Create one in Notepad!' }]);
                } else {
                    push([echo, {
                        type: 'output',
                        text: 'Virtual File System:\n' + fileList.map(f => `  📄 ${f.name}`).join('\n')
                    }]);
                }
                break;
            }

            case 'cat': {
                const target = Object.values(files).find(f => f.name === args || f.id === args);
                if (!target) {
                    push([echo, { type: 'error', text: `cat: ${args}: No such file` }]);
                } else {
                    push([echo, { type: 'output', text: target.content || '(empty file)' }]);
                }
                break;
            }

            case 'sysinfo': {
                const mem = (performance as unknown as { memory?: { jsHeapSizeLimit: number } }).memory;
                push([echo, {
                    type: 'output', text: [
                        'System Information:',
                        `  OS:        CartoonOS v2.0`,
                        `  Browser:   ${navigator.userAgent.split('(')[0].trim()}`,
                        `  Platform:  ${navigator.platform}`,
                        `  RAM:       ${mem?.jsHeapSizeLimit
                            ? Math.round(mem.jsHeapSizeLimit / 1024 / 1024) + ' MB JS Heap'
                            : 'N/A'}`,
                        `  Time:      ${new Date().toLocaleTimeString()}`,
                    ].join('\n')
                }]);
                break;
            }

            case 'neofetch':
                push([echo, {
                    type: 'info', text: [
                        '    ████████     cartoon_user@CartoonOS',
                        '   ██  ██  ██    ───────────────────────',
                        '   ██  ██  ██    OS:     CartoonOS v2.0',
                        '    ████████     Shell:  CartoonBash 2.0',
                        '   ██      ██    DE:     NeoBrutal',
                        '  ████████████   WM:     Framer Motion',
                        '                Theme:  Pastel Brutalism',
                        '                Font:   Nunito',
                    ].join('\n')
                }]);
                break;

            default:
                push([echo, { type: 'error', text: `'${command}' is not recognized. Type "help" for commands.` }]);
                break;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const next = Math.min(cmdHistoryIndex + 1, cmdHistory.length - 1);
            setCmdHistoryIndex(next);
            setInput(cmdHistory[next] ?? '');
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = Math.max(cmdHistoryIndex - 1, -1);
            setCmdHistoryIndex(next);
            setInput(next === -1 ? '' : cmdHistory[next] ?? '');
        } else if (e.key === 'Tab') {
            e.preventDefault();
            // Basic autocomplete
            const match = ['help', 'clear', 'echo', 'date', 'whoami', 'ls', 'cat', 'sysinfo', 'neofetch'].find(c => c.startsWith(input));
            if (match) setInput(match);
        }
    };

    const LINE_COLORS: Record<string, string> = {
        input: 'text-neo-yellow',
        output: 'text-green-300',
        error: 'text-red-400',
        info: 'text-cyan-300',
    };

    return (
        <div
            className="flex flex-col h-full bg-black text-green-300 font-mono text-sm p-3 overflow-y-auto cursor-text"
            onClick={() => inputRef.current?.focus()}
        >
            {history.map((line, i) => (
                <div key={i} className={cn('whitespace-pre-wrap leading-5', LINE_COLORS[line.type])}>
                    {line.text}
                </div>
            ))}
            <div className="flex items-center mt-1">
                <span className="text-neo-yellow mr-2">C:\CartoonOS&gt;</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none outline-none text-green-300 font-mono caret-green-300"
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                />
            </div>
            <div ref={bottomRef} />
        </div>
    );
};

