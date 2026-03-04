import React, { useState } from 'react';
import { useFileStore, FileItem } from '../../../store/useFileStore';
import { FilePlus, Trash2, Save, File } from 'lucide-react';
import { cn } from '../../../utils/cn';

const genId = () => `file_${Date.now()}`;

interface EditorAreaProps {
    fileId: string;
    files: Record<string, FileItem>;
    saveFile: (id: string, name: string, content: string) => void;
}

const EditorArea: React.FC<EditorAreaProps> = ({ fileId, files, saveFile }) => {
    const [content, setContent] = useState<string>(files[fileId]?.content ?? '');
    const [fileName, setFileName] = useState<string>(files[fileId]?.name ?? '');
    const [saved, setSaved] = useState(true);

    const handleSave = () => {
        saveFile(fileId, fileName, content);
        setSaved(true);
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border-b-[3px] border-black shrink-0">
                <input
                    type="text"
                    value={fileName}
                    onChange={(e) => { setFileName(e.target.value); setSaved(false); }}
                    className="flex-1 bg-white px-2 py-1 border-2 border-black rounded text-sm font-bold shadow-[1px_1px_0_0_#000] focus:outline-none"
                    placeholder="File name…"
                />
                <button
                    onClick={handleSave}
                    disabled={saved}
                    className={cn(
                        'flex items-center gap-1.5 px-3 py-1 border-[3px] border-black rounded-lg font-black text-sm shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all',
                        saved ? 'bg-gray-300 opacity-60 cursor-not-allowed' : 'bg-neo-green hover:bg-green-400'
                    )}
                >
                    <Save size={14} /> {saved ? 'Saved' : 'Save'}
                </button>
            </div>

            <textarea
                className="flex-1 w-full p-4 resize-none outline-none font-mono text-sm bg-[#fffef0] leading-relaxed"
                value={content}
                onChange={(e) => { setContent(e.target.value); setSaved(false); }}
                placeholder="Start typing your note here…"
            />

            <div className="flex items-center justify-between px-3 py-1 border-t-2 border-black bg-gray-200 text-xs font-semibold shrink-0">
                <span>{content.split('\n').length} lines · {content.length} chars</span>
                <span className={saved ? 'text-green-700' : 'text-orange-600'}>{saved ? '✓ Saved' : '⚠ Unsaved'}</span>
            </div>
        </div>
    );
};

export const Notepad: React.FC = () => {
    const { files, saveFile, deleteFile } = useFileStore();
    const [currentFileId, setCurrentFileId] = useState<string>(Object.keys(files)[0] ?? '');
    const [isRenamingNew, setIsRenamingNew] = useState(false);
    const [newFileName, setNewFileName] = useState('');

    const handleNewFile = () => {
        setIsRenamingNew(true);
        setNewFileName('');
    };

    const handleCreateFile = () => {
        const name = newFileName.trim() || `Note_${Object.keys(files).length + 1}`;
        const id = genId();
        saveFile(id, name.endsWith('.txt') ? name : name + '.txt', '');
        setCurrentFileId(id);
        setIsRenamingNew(false);
    };

    const handleDelete = (id: string) => {
        deleteFile(id);
        const remaining = Object.keys(files).filter(k => k !== id);
        if (remaining.length > 0) {
            setCurrentFileId(remaining[0]);
        } else {
            setCurrentFileId('');
        }
    };

    return (
        <div className="flex h-full font-sans overflow-hidden bg-white">
            <div className="w-44 border-r-[3px] border-black flex flex-col bg-gray-100 shrink-0">
                <div className="flex items-center justify-between px-2 py-2 border-b-[3px] border-black bg-neo-yellow">
                    <span className="font-black text-xs">FILES</span>
                    <button
                        onClick={handleNewFile}
                        title="New File"
                        className="p-1 border-2 border-black rounded shadow-[1px_1px_0_0_#000] bg-white hover:bg-gray-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                    >
                        <FilePlus size={14} />
                    </button>
                </div>

                {isRenamingNew && (
                    <div className="p-2 border-b-2 border-black bg-yellow-50">
                        <input
                            autoFocus
                            type="text"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreateFile();
                                if (e.key === 'Escape') setIsRenamingNew(false);
                            }}
                            className="w-full text-xs border-2 border-black px-2 py-1 rounded focus:outline-none"
                            placeholder="filename.txt"
                        />
                        <div className="flex gap-1 mt-1">
                            <button onClick={handleCreateFile} className="flex-1 text-xs font-bold bg-neo-green border-2 border-black rounded py-0.5">Create</button>
                            <button onClick={() => setIsRenamingNew(false)} className="flex-1 text-xs font-bold bg-neo-red border-2 border-black rounded py-0.5">Cancel</button>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto">
                    {Object.values(files).length === 0 && (
                        <p className="text-xs text-gray-500 p-2 italic">No files. Create one!</p>
                    )}
                    {Object.values(files).map(f => (
                        <div
                            key={f.id}
                            onClick={() => setCurrentFileId(f.id)}
                            className={cn(
                                'flex items-center gap-1.5 px-2 py-2 border-b border-gray-300 cursor-pointer group text-sm',
                                currentFileId === f.id
                                    ? 'bg-neo-blue border-l-4 border-l-black font-bold'
                                    : 'hover:bg-gray-200'
                            )}
                        >
                            <File size={12} className="shrink-0" />
                            <span className="truncate flex-1 text-xs">{f.name}</span>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(f.id); }}
                                className="opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all p-0.5"
                            >
                                <Trash2 size={10} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {currentFileId && files[currentFileId] ? (
                <EditorArea
                    key={currentFileId}
                    fileId={currentFileId}
                    files={files}
                    saveFile={saveFile}
                />
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
                    <File size={48} className="opacity-30" />
                    <p className="font-bold">No file selected.</p>
                    <button onClick={handleNewFile} className="neo-btn bg-neo-yellow px-4 py-2 text-sm">
                        ＋ Create a file
                    </button>
                </div>
            )}
        </div>
    );
};
