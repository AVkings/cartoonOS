import React, { useState, useRef, useEffect } from 'react';

export const Terminal: React.FC = () => {
    const [history, setHistory] = useState<{ type: 'input' | 'output', text: string }[]>([
        { type: 'output', text: 'CartoonOS Terminal v1.0.0' },
        { type: 'output', text: 'Type "help" for a list of available commands.' }
    ]);
    const [input, setInput] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = (cmd: string) => {
        const _cmd = cmd.trim();
        if (!_cmd) return;

        const newHistory = [...history, { type: 'input' as const, text: `C:\\> ${_cmd}` }];

        const parts = _cmd.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        switch (command) {
            case 'help':
                newHistory.push({ type: 'output', text: 'Available commands: help, clear, date, echo, whoami' });
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'date':
                newHistory.push({ type: 'output', text: new Date().toString() });
                break;
            case 'echo':
                newHistory.push({ type: 'output', text: args.join(' ') });
                break;
            case 'whoami':
                newHistory.push({ type: 'output', text: 'cartoon_user' });
                break;
            default:
                newHistory.push({ type: 'output', text: `'${command}' is not recognized as an internal or external command.` });
                break;
        }

        setHistory(newHistory);
    };

    return (
        <div className="flex flex-col h-full bg-black text-neo-green font-mono p-4 overflow-y-auto selection:bg-neo-green selection:text-black">
            {history.map((line, i) => (
                <div key={i} className="mb-1">{line.text}</div>
            ))}
            <div className="flex">
                <span className="mr-2">C:\&gt;</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleCommand(input);
                            setInput('');
                        }
                    }}
                    className="flex-1 bg-transparent border-none outline-none text-neo-green font-mono focus:ring-0"
                    autoFocus
                />
            </div>
            <div ref={bottomRef} className="h-4" />
        </div>
    );
};
