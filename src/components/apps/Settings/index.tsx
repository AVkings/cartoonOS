import React from 'react';
import { Palette, HelpCircle, Image as ImageIcon } from 'lucide-react';
import { useOSStore } from '../../../store/useOSStore';

export const Settings: React.FC = () => {
    const { wallpaper, setWallpaper } = useOSStore();
    const handleReboot = () => {
        // Just reload for now
        window.location.reload();
    };

    const triggerBsod = () => {
        // We'll throw an error to trigger React's ErrorBoundary which we'll build later
        throw new Error("MANUALLY_TRIGGERED_BSOD");
    };

    return (
        <div className="p-6 h-full flex flex-col gap-6 font-sans overflow-auto bg-neo-bg">
            <h1 className="text-3xl font-black drop-shadow-[2px_2px_0_rgba(255,144,232,1)] border-b-neo border-black pb-2">
                System Settings
            </h1>

            <section className="bg-white p-4 border-neo border-black shadow-neo rounded-xl flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <Palette size={24} />
                    <h2 className="text-xl font-bold">Themes</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <button className="neo-btn bg-white py-4 font-black text-lg">
                        Light Mode
                    </button>
                    <button className="neo-btn bg-black text-white py-4 font-black text-lg">
                        Dark Mode
                    </button>
                    <button className="neo-btn bg-[#9bac0b] text-[#0f380f] py-4 font-black text-lg border-[#0f380f] shadow-[4px_4px_0_0_#0f380f]">
                        Gameboy
                    </button>
                    <button className="neo-btn bg-neo-pink py-4 font-black text-lg">
                        Cartoon
                    </button>
                </div>
            </section>

            <section className="bg-white p-4 border-neo border-black shadow-neo rounded-xl flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <ImageIcon size={24} />
                    <h2 className="text-xl font-bold">Wallpaper</h2>
                </div>
                <div className="flex flex-col gap-4">
                    <p className="font-semibold text-sm">Enter a valid image URL or a valid CSS background class (e.g., `bg-neo-yellow`)</p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="flex-1 px-3 border-2 border-black rounded font-bold shadow-[2px_2px_0_0_#000] focus:outline-none"
                            placeholder="bg-neo-blue or https://..."
                            onChange={(e) => setWallpaper(e.target.value)}
                            value={wallpaper.startsWith('http') || wallpaper.startsWith('bg-') ? wallpaper : ''}
                        />
                    </div>
                </div>
            </section>

            <section className="bg-white p-4 border-neo border-black shadow-neo rounded-xl flex flex-col gap-4">
                <div className="flex items-center gap-2 text-red-600">
                    <HelpCircle size={24} />
                    <h2 className="text-xl font-bold">Troubleshooting</h2>
                </div>
                <div className="flex flex-col gap-2">
                    <button onClick={handleReboot} className="neo-btn bg-neo-blue py-2 w-full text-left px-4">
                        Reboot System
                    </button>
                    <button onClick={triggerBsod} className="neo-btn bg-neo-red py-2 w-full text-left px-4">
                        Trigger Cartoon BSOD Test
                    </button>
                </div>
            </section>
        </div>
    );
};
