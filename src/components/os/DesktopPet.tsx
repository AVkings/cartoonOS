import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES_IDLE = ['*yawn* 😴', 'Hi there! 👋', 'Bored...', 'Feed me clicks!', 'I like it here 🏠', 'CartoonOS rulez! ⚡'];
const MESSAGES_CLICK = ['Ouch! 😣', 'Hey, stop! 😤', 'Hehe 😄', 'Again! Again! 🎉', 'You clicked me! 👆', 'Wheee! 🌀'];
const EXPRESSIONS = ['😊', '😴', '😤', '🤩', '😂', '🥺', '😎', '😛'];

export const DesktopPet: React.FC = () => {
    const [pos, setPos] = useState({ x: window.innerWidth - 120, y: window.innerHeight - 180 });
    const [message, setMessage] = useState<string | null>(null);
    const [expression, setExpression] = useState('😊');
    const [isJumping, setIsJumping] = useState(false);
    const [isScared, setIsScared] = useState(false);
    const [bobOffset, setBobOffset] = useState(0);
    const messageTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showMessage = (msg: string) => {
        setMessage(msg);
        if (messageTimeout.current) clearTimeout(messageTimeout.current);
        messageTimeout.current = setTimeout(() => setMessage(null), 3500);
    };

    // Idle bobbing
    useEffect(() => {
        const timer = setInterval(() => {
            setBobOffset(prev => prev === 0 ? -5 : 0);
        }, 900);
        return () => clearInterval(timer);
    }, []);

    // Random idle messages
    useEffect(() => {
        const timer = setInterval(() => {
            const now = Math.random();
            if (now < 0.3) {
                showMessage(MESSAGES_IDLE[Math.floor(Math.random() * MESSAGES_IDLE.length)]);
                setExpression(EXPRESSIONS[Math.floor(Math.random() * EXPRESSIONS.length)]);
            }
        }, 8000);
        return () => clearInterval(timer);
    }, []);


    const handleClick = () => {
        const msg = MESSAGES_CLICK[Math.floor(Math.random() * MESSAGES_CLICK.length)];
        showMessage(msg);
        setIsJumping(true);
        setExpression(EXPRESSIONS[Math.floor(Math.random() * EXPRESSIONS.length)]);
        setTimeout(() => setIsJumping(false), 600);
    };

    return (
        <motion.div
            drag
            dragMomentum={false}
            dragElastic={0.1}
            onDragStart={() => setIsScared(true)}
            onDragEnd={(_e, info) => {
                setPos(prev => ({
                    x: Math.max(0, Math.min(prev.x + info.offset.x, window.innerWidth - 80)),
                    y: Math.max(0, Math.min(prev.y + info.offset.y, window.innerHeight - 140)),
                }));
                setIsScared(false);
            }}
            onClick={handleClick}
            className="absolute z-[9550] cursor-grab active:cursor-grabbing flex flex-col items-center select-none"
            initial={{ x: pos.x, y: pos.y }}
            animate={{ x: pos.x, y: pos.y + bobOffset }}
            transition={{ type: 'spring', stiffness: 280, damping: 18 }}
            style={{ left: 0, top: 0 }}
        >
            {/* Speech Bubble */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.7, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.7, y: 10 }}
                        transition={{ type: 'spring', bounce: 0.4, duration: 0.3 }}
                        className="bg-white border-[3px] border-black shadow-[3px_3px_0_0_#000] rounded-xl px-3 py-2 mb-2 font-bold text-sm text-center relative max-w-[150px] whitespace-normal"
                    >
                        {message}
                        {/* Tail */}
                        <div className="absolute -bottom-[11px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-t-[11px] border-t-black border-r-[8px] border-r-transparent" />
                        <div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-t-[7px] border-t-white border-r-[6px] border-r-transparent" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pet SVG */}
            <motion.div
                animate={{
                    scale: isJumping ? [1, 1.3, 0.9, 1.05, 1] : isScared ? [1, 0.9, 1] : 1,
                    rotate: isScared ? [-5, 5, -5, 0] : 0,
                }}
                transition={{ duration: 0.5 }}
                className="filter hover:brightness-110 active:brightness-125 transition-all"
            >
                <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg"
                    style={{ filter: 'drop-shadow(4px 4px 0px rgba(0,0,0,1))' }}>
                    {/* Shadow */}
                    <ellipse cx="35" cy="67" rx="22" ry="4" fill="rgba(0,0,0,0.15)" />
                    {/* Ears */}
                    <ellipse cx="18" cy="20" rx="9" ry="12" fill="#FF90E8" stroke="black" strokeWidth="3" />
                    <ellipse cx="18" cy="20" rx="5" ry="8" fill="#ffb3e6" />
                    <ellipse cx="52" cy="20" rx="9" ry="12" fill="#FF90E8" stroke="black" strokeWidth="3" />
                    <ellipse cx="52" cy="20" rx="5" ry="8" fill="#ffb3e6" />
                    {/* Body */}
                    <ellipse cx="35" cy="44" rx="22" ry="20" fill="#FF90E8" stroke="black" strokeWidth="3" />
                    {/* Head */}
                    <circle cx="35" cy="30" r="18" fill="#FF90E8" stroke="black" strokeWidth="3" />
                    {/* Belly spot */}
                    <ellipse cx="35" cy="47" rx="13" ry="10" fill="#ffb3e6" />
                    {/* Eyes */}
                    {isScared ? (
                        <>
                            <text x="26" y="32" fontSize="10" textAnchor="middle">👁</text>
                            <text x="44" y="32" fontSize="10" textAnchor="middle">👁</text>
                        </>
                    ) : (
                        <>
                            <circle cx="28" cy="28" r="4.5" fill="white" stroke="black" strokeWidth="2" />
                            <circle cx="42" cy="28" r="4.5" fill="white" stroke="black" strokeWidth="2" />
                            <circle cx="29.5" cy="27" r="2.5" fill="black" />
                            <circle cx="43.5" cy="27" r="2.5" fill="black" />
                            <circle cx="30.5" cy="26" r="1" fill="white" />
                            <circle cx="44.5" cy="26" r="1" fill="white" />
                        </>
                    )}
                    {/* Nose */}
                    <ellipse cx="35" cy="33" rx="2.5" ry="1.5" fill="#ff6eb4" />
                    {/* Mouth */}
                    {isJumping ? (
                        <ellipse cx="35" cy="37" rx="5" ry="4" fill="#ff6eb4" stroke="black" strokeWidth="1.5" />
                    ) : (
                        <path d="M 29 36 Q 35 40 41 36" stroke="black" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    )}
                    {/* Cheek blush */}
                    <ellipse cx="21" cy="35" rx="5" ry="3" fill="#ff80ce" opacity="0.5" />
                    <ellipse cx="49" cy="35" rx="5" ry="3" fill="#ff80ce" opacity="0.5" />
                    {/* Arms */}
                    <ellipse cx="13" cy="46" rx="7" ry="5" fill="#FF90E8" stroke="black" strokeWidth="2.5" transform="rotate(-30 13 46)" />
                    <ellipse cx="57" cy="46" rx="7" ry="5" fill="#FF90E8" stroke="black" strokeWidth="2.5" transform="rotate(30 57 46)" />
                    {/* Expression emoji overlay */}
                    <text x="35" y="16" fontSize="12" textAnchor="middle" style={{ userSelect: 'none' }}>{expression}</text>
                </svg>
            </motion.div>
        </motion.div>
    );
};
