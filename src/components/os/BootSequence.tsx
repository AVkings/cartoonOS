import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    onComplete: () => void;
}

const bootMessages = [
    "CARTOON_OS(tm) BIOS v1.02",
    "Copyright (C) 1999-202X, ToonMegatrends, Inc.",
    "",
    "Main Processor : Intel(R) Toon(TM) CPU @ 4.20GHz",
    "Memory Testing : 4194304K OK",
    "",
    "Detecting Primary Master ... TOON_DISK_0",
    "Detecting Primary Slave ... None",
    "",
    "Loading GUI resources...",
    "Applying neobrutalism shaders...",
    "Waking up desktop pet...",
    "",
    "System Ready."
];

export const BootSequence: React.FC<Props> = ({ onComplete }) => {
    const [lines, setLines] = useState<string[]>([]);
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < bootMessages.length) {
                setLines((prev) => [...prev, bootMessages[index]]);
                index++;
            } else {
                clearInterval(interval);
                setIsDone(true);
                setTimeout(() => onComplete(), 1000);
            }
        }, 150);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {!isDone ? (
                <motion.div
                    key="boot"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 bg-black text-neo-green font-mono z-[99999] p-8 text-lg md:text-xl lg:text-2xl"
                >
                    {lines.map((line, i) => (
                        <div key={i}>{line}</div>
                    ))}
                    {!isDone && <span className="animate-pulse">_</span>}
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
};
