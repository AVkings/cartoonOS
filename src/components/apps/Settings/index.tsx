import React, { useState } from 'react';
import { Palette, HelpCircle, Image as ImageIcon, Monitor } from 'lucide-react';
import { useOSStore } from '../../../store/useOSStore';
import { cn } from '../../../utils/cn';

const WALLPAPERS = [
    { label: '🎨 Dot Grid (Default)', value: 'bg-neo-bg bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px]' },
    { label: '🌸 Pastel Pink', value: 'bg-neo-pink' },
    { label: '💙 Electric Blue', value: 'bg-neo-blue' },
    { label: '🌱 Lime Green', value: 'bg-neo-green' },
    { label: '☀️ Sunny Yellow', value: 'bg-neo-yellow' },
    { label: '🌑 Dark Night', value: 'bg-gray-900' },
    { label: '🌊 Ocean', value: 'bg-gradient-to-br from-blue-400 to-cyan-600' },
    { label: '🌅 Sunset', value: 'bg-gradient-to-br from-orange-400 to-pink-600' },
    { label: '🟢 Gameboy', value: 'bg-[#9bac0b]' },
    { label: '🎲 Checkers', value: 'bg-[length:40px_40px] bg-[linear-gradient(45deg,#000_25%,transparent_25%),linear-gradient(-45deg,#000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#000_75%),linear-gradient(-45deg,transparent_75%,#000_75%)] bg-white' },
];

export const Settings: React.FC = () => {
    const { wallpaper, setWallpaper } = useOSStore();
    const [customUrl, setCustomUrl] = useState('');

    const handleReboot = () => window.location.reload();

    const triggerBsod = () => {
        throw new Error("MANUALLY_TRIGGERED_BSOD");
    };

    return (
        <div className="p-6 h-full flex flex-col gap-6 font-sans overflow-auto bg-neo-bg">
            <h1 className="text-3xl font-black drop-shadow-[2px_2px_0_rgba(255,144,232,1)] border-b-neo border-black pb-2 flex items-center gap-3">
                <Monitor size={28} /> System Settings
            </h1>

            {/* Wallpaper Section */}
            <section className="bg-white p-4 border-neo border-black shadow-neo rounded-xl flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <ImageIcon size={22} />
                    <h2 className="text-xl font-bold">Wallpaper</h2>
                </div>

                {/* Preset Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {WALLPAPERS.map(wp => (
                        <button
                            key={wp.value}
                            onClick={() => setWallpaper(wp.value)}
                            className={cn(
                                'neo-btn py-3 px-3 text-sm font-bold text-left flex items-center gap-2 transition-all',
                                wallpaper === wp.value
                                    ? 'bg-neo-yellow ring-4 ring-black'
                                    : 'bg-white hover:bg-gray-100'
                            )}
                        >
                            {wallpaper === wp.value && <span className="font-black">✓</span>}
                            {wp.label}
                        </button>
                    ))}
                </div>

                {/* Custom image URL */}
                <div className="flex flex-col gap-2 border-t-2 border-black pt-4">
                    <p className="font-bold text-sm">Or paste a custom image URL:</p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="flex-1 px-3 py-2 border-2 border-black rounded font-semibold shadow-[2px_2px_0_0_#000] focus:outline-none text-sm"
                            placeholder="https://example.com/wallpaper.jpg"
                            value={customUrl}
                            onChange={(e) => setCustomUrl(e.target.value)}
                        />
                        <button
                            onClick={() => customUrl && setWallpaper(customUrl)}
                            className="neo-btn bg-neo-blue px-4 py-2 font-black"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </section>

            {/* Themes Section */}
            <section className="bg-white p-4 border-neo border-black shadow-neo rounded-xl flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <Palette size={22} />
                    <h2 className="text-xl font-bold">Quick Themes</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setWallpaper('bg-neo-bg bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px]')} className="neo-btn bg-white py-3 font-bold">🌞 Cartoon Day</button>
                    <button onClick={() => setWallpaper('bg-gray-900')} className="neo-btn bg-gray-900 text-white py-3 font-bold">🌙 Night Mode</button>
                    <button onClick={() => setWallpaper('bg-[#9bac0b]')} className="neo-btn bg-[#9bac0b] text-[#0f380f] py-3 font-bold border-[#0f380f] shadow-[4px_4px_0_0_#0f380f]">🎮 Gameboy</button>
                    <button onClick={() => setWallpaper('bg-gradient-to-br from-orange-400 to-pink-600')} className="neo-btn bg-gradient-to-br from-orange-400 to-pink-600 py-3 font-bold">🌅 Sunset</button>
                </div>
            </section>

            {/* Troubleshooting */}
            <section className="bg-white p-4 border-neo border-black shadow-neo rounded-xl flex flex-col gap-4">
                <div className="flex items-center gap-2 text-red-600">
                    <HelpCircle size={22} />
                    <h2 className="text-xl font-bold">Troubleshooting</h2>
                </div>
                <div className="flex flex-col gap-2">
                    <button onClick={handleReboot} className="neo-btn bg-neo-blue py-2 w-full text-left px-4 font-bold">
                        🔄 Reboot System
                    </button>
                    <button onClick={triggerBsod} className="neo-btn bg-neo-red py-2 w-full text-left px-4 font-bold">
                        💥 Trigger Cartoon BSOD
                    </button>
                </div>
            </section>
        </div>
    );
};
