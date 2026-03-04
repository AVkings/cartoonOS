import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FileItem {
    id: string;
    name: string;
    content: string;
    type: 'txt' | 'aex'; // file type
}

interface FileState {
    files: Record<string, FileItem>;
    saveFile: (id: string, name: string, content: string, type?: 'txt' | 'aex') => void;
    deleteFile: (id: string) => void;
}

export const useFileStore = create<FileState>()(
    persist(
        (set) => ({
            files: {
                'welcome': {
                    id: 'welcome',
                    name: 'Welcome.txt',
                    content: 'Welcome to CartoonOS!\n\nDouble-click desktop icons to open apps.\nUse the START menu to access all apps.\nOpen the App Store to install AEX apps!\nTry the Code Editor to build your own AEX apps.\n\n— The CartoonOS Team',
                    type: 'txt'
                }
            },
            saveFile: (id, name, content, type = 'txt') => set((state) => ({
                files: {
                    ...state.files,
                    [id]: { id, name, content, type }
                }
            })),
            deleteFile: (id) => set((state) => {
                const newFiles = { ...state.files };
                delete newFiles[id];
                return { files: newFiles };
            })
        }),
        { name: 'cartoonos-fs-storage' }
    )
);
