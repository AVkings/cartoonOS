import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const DesktopPet: React.FC = () => {
    const [position, setPosition] = useState({ x: window.innerWidth - 120, y: window.innerHeight - 150 });
    const [message, setMessage] = useState<string | null>(null);

    const handleDragEnd = (_event: any, info: any) => {
        setPosition({
            x: position.x + info.offset.x,
            y: position.y + info.offset.y
        });
    };

    const handleClick = () => {
        const messages = [
            "Hi there!",
            "Need help?",
            "Click apps to open!",
            "Ouch!",
            "*yawn*",
            "CartoonOS rulez!"
        ];
        setMessage(messages[Math.floor(Math.random() * messages.length)]);
    };

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    // Simple idle animation effect
    const [idleOffset, setIdleOffset] = useState(0);
    useEffect(() => {
        const idler = setInterval(() => {
            setIdleOffset(prev => prev === 0 ? -4 : 0);
        }, 1000);
        return () => clearInterval(idler);
    }, []);

    return (
        <motion.div
            drag
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            onClick={handleClick}
            className="absolute z-[9990] cursor-grab active:cursor-grabbing flex flex-col items-center select-none"
            initial={{ ...position }}
            animate={{
                x: position.x,
                y: position.y + idleOffset
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className="bg-white border-neo border-black shadow-[2px_2px_0_0_#000] rounded-xl p-2 mb-2 font-bold text-sm text-center min-w-[100px] whitespace-nowrap"
                    >
                        {message}
                        {/* Speech bubble tail */}
                        <div className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-black border-r-[8px] border-r-transparent"></div>
                        <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-t-[5px] border-t-white border-r-[5px] border-r-transparent"></div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Simple pixel-art style SVG pet */}
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[4px_4px_0_rgba(0,0,0,1)] hover:scale-110 active:scale-90 transition-transform">
                {/* Body */}
                <rect x="16" y="24" width="32" height="32" rx="8" fill="#FF90E8" stroke="black" strokeWidth="4" />
                {/* Ears */}
                <path d="M 16 24 Q 10 10 24 16 L 32 24" fill="#FF90E8" stroke="black" strokeWidth="4" />
                <path d="M 48 24 Q 54 10 40 16 L 32 24" fill="#FF90E8" stroke="black" strokeWidth="4" />
                {/* Eyes */}
                <circle cx="26" cy="36" r="4" fill="black" />
                <circle cx="38" cy="36" r="4" fill="black" />
                {/* Mouth */}
                <path d="M 28 44 Q 32 48 36 44" stroke="black" strokeWidth="4" strokeLinecap="round" />
            </svg>
        </motion.div>
    );
};
