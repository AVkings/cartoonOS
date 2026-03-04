import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FileItem {
    id: string;
    name: string;
    content: string;
}

interface FileState {
    files: Record<string, FileItem>;
    saveFile: (id: string, name: string, content: string) => void;
    deleteFile: (id: string) => void;
}

export const useFileStore = create<FileState>()(
    persist(
        (set) => ({
            files: {
                'welcome': { id: 'welcome', name: 'Welcome.txt', content: 'Welcome to CartoonOS! Try editing this file or creating new ones.' }
            },
            saveFile: (id, name, content) => set((state) => ({
                files: {
                    ...state.files,
                    [id]: { id, name, content }
                }
            })),
            deleteFile: (id) => set((state) => {
                const newFiles = { ...state.files };
                delete newFiles[id];
                return { files: newFiles };
            })
        }),
        {
            name: 'cartoonos-fs-storage'
        }
    )
);
