import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const TOTAL_FRAMES = 80;
const SCROLL_HEIGHT_VH = 400; // Total scroll container height in vh
const EAGER_FRAMES = 12; // Load first N frames eagerly
const BATCH_SIZE = 15; // Load remaining in batches of N

// Pre-generate frame paths
const framePaths = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
    const num = String(i + 1).padStart(3, '0');
    return `/assets/hero-frames/frame-${num}.jpg`;
});

const HeroScroll = () => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const imagesRef = useRef([]);
    const currentFrameRef = useRef(0);
    const rafRef = useRef(null);
    const [loadProgress, setLoadProgress] = useState(0);
    const [isReady, setIsReady] = useState(false);

    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    // Draw a frame onto the canvas with cover-fit scaling
    const drawFrame = useCallback((frameIndex) => {
        const canvas = canvasRef.current;
        const img = imagesRef.current[frameIndex];
        if (!canvas || !img || !img.complete || !img.naturalWidth) return;

        const ctx = canvas.getContext('2d');
        const { width: cw, height: ch } = canvas;
        const { naturalWidth: iw, naturalHeight: ih } = img;

        // Object-fit: cover calculation
        const scale = Math.max(cw / iw, ch / ih);
        const sw = cw / scale;
        const sh = ch / scale;
        const sx = (iw - sw) / 2;
        const sy = (ih - sh) / 2;

        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
    }, []);

    // Resize canvas to fill viewport
    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for perf
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = '100%';
        canvas.style.height = '100vh';
        drawFrame(currentFrameRef.current);
    }, [drawFrame]);

    // Load images progressively
    useEffect(() => {
        const images = new Array(TOTAL_FRAMES);
        let loadedCount = 0;

        const loadImage = (index) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    loadedCount++;
                    setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
                    if (loadedCount === EAGER_FRAMES) setIsReady(true);
                    if (loadedCount === TOTAL_FRAMES) setIsReady(true);
                    resolve(img);
                };
                img.onerror = () => {
                    loadedCount++;
                    resolve(null);
                };
                img.src = framePaths[index];
                images[index] = img;
            });
        };

        const loadAll = async () => {
            // Phase 1: Load eager frames immediately (critical first paint)
            const eagerPromises = [];
            for (let i = 0; i < EAGER_FRAMES; i++) {
                eagerPromises.push(loadImage(i));
            }
            await Promise.all(eagerPromises);

            // Draw first frame as soon as eager batch is loaded
            imagesRef.current = images;
            drawFrame(0);

            // Phase 2: Load remaining frames in background batches
            for (let i = EAGER_FRAMES; i < TOTAL_FRAMES; i += BATCH_SIZE) {
                const batchEnd = Math.min(i + BATCH_SIZE, TOTAL_FRAMES);
                const batchPromises = [];
                for (let j = i; j < batchEnd; j++) {
                    batchPromises.push(loadImage(j));
                }
                await Promise.all(batchPromises);
                imagesRef.current = images;
            }
        };

        loadAll();

        return () => {
            // Cleanup
            images.forEach((img) => {
                if (img) img.src = '';
            });
        };
    }, [drawFrame]);

    // Scroll handler → frame mapping (using rAF)
    useEffect(() => {
        const handleScroll = () => {
            if (rafRef.current) return; // Already scheduled

            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = null;
                const container = containerRef.current;
                if (!container) return;

                const rect = container.getBoundingClientRect();
                const scrollableHeight = container.offsetHeight - window.innerHeight;
                const scrolled = -rect.top;
                const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
                const frameIndex = Math.min(
                    TOTAL_FRAMES - 1,
                    Math.floor(progress * (TOTAL_FRAMES - 1))
                );

                if (frameIndex !== currentFrameRef.current) {
                    currentFrameRef.current = frameIndex;
                    drawFrame(frameIndex);
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [drawFrame]);

    // Handle resize
    useEffect(() => {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, [resizeCanvas]);

    return (
        <div
            ref={containerRef}
            className="relative w-full bg-rr-dark"
            style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
        >
            {/* Sticky viewport container */}
            <div className="sticky top-0 w-full h-screen overflow-hidden">
                {/* Canvas layer */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    style={{ objectFit: 'cover' }}
                />

                {/* Gradient overlays for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-transparent to-transparent z-10" />

                {/* Loading indicator */}
                {!isReady && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-rr-dark">
                        <div className="text-center">
                            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
                                <div
                                    className="h-full bg-gradient-to-r from-rr-blue to-rr-pink rounded-full transition-all duration-300"
                                    style={{ width: `${loadProgress}%` }}
                                />
                            </div>
                            <p className="text-white/40 text-xs tracking-[0.2em] uppercase">Loading Experience</p>
                        </div>
                    </div>
                )}

                {/* Text content overlay */}
                <div className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center text-left pt-16">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: isReady ? 1 : 0, x: isReady ? 0 : -50 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        >
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-6 tracking-tighter leading-none">
                                READY TO OWN
                                <br />
                                THE T20 GAME?
                            </h1>
                            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white/90 mb-4 leading-snug normal-case tracking-normal">
                                Modern cricket demands more than tradition.
                                <br className="hidden md:block" />
                                <span className="text-rr-pink">
                                    We develop explosive skills, sharp thinking and elite habits.
                                </span>
                            </h2>
                            <p className="text-sm md:text-base text-slate-400 font-bold tracking-[0.15em] uppercase mb-8">
                                The future of T20 development starts here.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 30 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                            className="space-y-6 text-lg md:text-xl text-slate-300 leading-relaxed font-light mb-10 max-w-2xl"
                        >
                            <p>
                                Designed and managed by one of the{' '}
                                <strong className="text-white">
                                    biggest cricket brands on the planet
                                </strong>
                                , the Elite program draws on decades of global T20 experience.
                            </p>
                            <p>
                                We provide opportunities previously not available in Australia.
                                The Royals know how to uncover T20 talent like nobody else.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 20 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Button onClick={scrollToForm} variant="gold" className="text-base px-8 py-4 text-lg">
                                APPLY TO SECURE YOUR PLACE
                            </Button>
                            <Button
                                onClick={() =>
                                    document.getElementById('program')?.scrollIntoView({ behavior: 'smooth' })
                                }
                                variant="secondary"
                                className="text-base px-8 py-4 text-lg"
                            >
                                LEARN MORE
                            </Button>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isReady ? 1 : 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
                >
                    <span className="text-white/40 text-xs tracking-[0.2em] uppercase">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                        className="w-5 h-8 border-2 border-white/30 rounded-full flex items-start justify-center pt-1"
                    >
                        <div className="w-1 h-2 bg-white/60 rounded-full" />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default HeroScroll;
