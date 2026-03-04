import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WindowData {
    id: string; // which is also the appId, e.g. 'notepad'
    title: string;
    isOpen: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    zIndex: number;
}

interface OSState {
    windows: Record<string, WindowData>;
    focusedWindowId: string | null;
    highestZIndex: number;
    isStartMenuOpen: boolean;
    wallpaper: string;
    openWindow: (id: string, title?: string) => void;
    closeWindow: (id: string) => void;
    minimizeWindow: (id: string) => void;
    maximizeWindow: (id: string) => void;
    focusWindow: (id: string) => void;
    toggleStartMenu: () => void;
    setWallpaper: (url: string) => void;
}

export const useOSStore = create<OSState>()(
    persist(
        (set, get) => ({
            windows: {},
            focusedWindowId: null,
            highestZIndex: 10, // Start from 10 so OS elements like taskbar can be correctly layered
            isStartMenuOpen: false,
            wallpaper: 'bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px]',

            setWallpaper: (url) => set({ wallpaper: url }),

            toggleStartMenu: () => set((state) => ({ isStartMenuOpen: !state.isStartMenuOpen })),

            openWindow: (id, title = id) => {
                const { highestZIndex } = get();
                const newZIndex = highestZIndex + 1;

                set((state) => ({
                    windows: {
                        ...state.windows,
                        [id]: {
                            id,
                            title: state.windows[id]?.title || title,
                            isOpen: true,
                            isMinimized: false,
                            isMaximized: state.windows[id]?.isMaximized || false,
                            zIndex: newZIndex,
                        },
                    },
                    focusedWindowId: id,
                    highestZIndex: newZIndex,
                }));
            },

            closeWindow: (id) => {
                set((state) => {
                    const newWindows = { ...state.windows };
                    if (newWindows[id]) {
                        newWindows[id].isOpen = false;
                        // Don't fully delete so it remembers its position/maximized state if re-opened?
                        // Or we can delete it. Let's keep it mostly intact but closed.
                    }
                    return {
                        windows: newWindows,
                        focusedWindowId: state.focusedWindowId === id ? null : state.focusedWindowId,
                    };
                });
            },

            minimizeWindow: (id) => {
                set((state) => ({
                    windows: {
                        ...state.windows,
                        [id]: {
                            ...state.windows[id],
                            isMinimized: true,
                        },
                    },
                    focusedWindowId: state.focusedWindowId === id ? null : state.focusedWindowId,
                }));
            },

            maximizeWindow: (id) => {
                set((state) => ({
                    windows: {
                        ...state.windows,
                        [id]: {
                            ...state.windows[id],
                            isMaximized: !state.windows[id].isMaximized, // Toggle
                        },
                    },
                }));
            },

            focusWindow: (id) => {
                const { windows, focusedWindowId, highestZIndex } = get();
                // Only focus if it's not already focused or not the highest
                if (focusedWindowId === id && windows[id]?.zIndex === highestZIndex) return;

                const newZIndex = highestZIndex + 1;

                set((state) => ({
                    windows: {
                        ...state.windows,
                        [id]: {
                            ...state.windows[id],
                            isMinimized: false,
                            zIndex: newZIndex,
                        },
                    },
                    focusedWindowId: id,
                    highestZIndex: newZIndex,
                }));
            },
        }), {
        name: 'cartoonos-storage',
        partialize: (state) => ({ wallpaper: state.wallpaper })
    }));
