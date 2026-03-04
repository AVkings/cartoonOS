import React, { useState, useEffect } from 'react';
import { useFileStore } from '../../../store/useFileStore';

export const Notepad: React.FC = () => {
    const { files, saveFile } = useFileStore();
    const [currentFileId, setCurrentFileId] = useState<string>('welcome');
    const [content, setContent] = useState<string>('');

    useEffect(() => {
        if (files[currentFileId]) {
            setContent(files[currentFileId].content);
        } else {
            setContent('');
        }
    }, [currentFileId, files]);

    const handleSave = () => {
        saveFile(currentFileId, currentFileId + '.txt', content);
    };

    return (
        <div className="flex h-full flex-col font-sans">
            <div className="flex gap-2 p-2 bg-gray-200 border-b-neo border-black">
                <select
                    className="bg-white border-2 border-black rounded px-2 py-1 font-bold shadow-[2px_2px_0_0_#000] focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-all"
                    value={currentFileId}
                    onChange={(e) => setCurrentFileId(e.target.value)}
                >
                    {Object.values(files).map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                    <option value="new_file">-- New File --</option>
                </select>

                {currentFileId === 'new_file' && (
                    <input
                        type="text"
                        placeholder="File name..."
                        className="flex-1 bg-white border-2 border-black rounded px-2 py-1 font-bold shadow-[2px_2px_0_0_#000] focus:outline-none"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const name = e.currentTarget.value;
                                if (!name) return;
                                const id = name.toLowerCase().replace(/\s+/g, '_');
                                saveFile(id, name + '.txt', content);
                                setCurrentFileId(id);
                            }
                        }}
                    />
                )}

                <button
                    onClick={handleSave}
                    className="neo-btn bg-neo-green px-4 py-1 flex items-center h-8"
                >
                    Save
                </button>
            </div>
            <textarea
                className="flex-1 w-full bg-[#ffffe0] p-4 resize-none outline-none font-sans text-lg whitespace-pre-wrap leading-relaxed focus:bg-white transition-colors"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your notes here..."
            />
        </div>
    );
};
