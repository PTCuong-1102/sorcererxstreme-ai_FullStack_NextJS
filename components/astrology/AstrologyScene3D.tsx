
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Sparkles, Stars, Moon, Sun } from 'lucide-react';

interface AstrologyScene3DProps {
  isActive: boolean;
  mode: 'general' | 'love';
}

export default function AstrologyScene3D({ isActive, mode }: AstrologyScene3DProps) {
  const [floatingElements, setFloatingElements] = useState<Array<{
    id: number;
    x: number;
    y: number;
    delay: number;
    size: number;
    type: 'star' | 'sparkle' | 'moon' | 'sun';
  }>>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const elements = [];
    for (let i = 0; i < 20; i++) {
      elements.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        size: 0.5 + Math.random() * 1.5,
        type: ['star', 'sparkle', 'moon', 'sun'][Math.floor(Math.random() * 4)] as any
      });
    }
    setFloatingElements(elements);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Mystical Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 30% 40%, rgba(147, 51, 234, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
        }}
      />
      
      {/* Animated Constellation */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          background: mode === 'love' 
            ? 'radial-gradient(circle at 50% 50%, rgba(219, 39, 119, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 70%)'
        }}
        transition={{ duration: 2 }}
      />

      {/* Floating Elements */}
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            transform: `scale(${element.size})`
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut"
          }}
        >
          {element.type === 'star' && (
            <Stars className="w-4 h-4 text-yellow-400/60" />
          )}
          {element.type === 'sparkle' && (
            <Sparkles className="w-3 h-3 text-blue-400/60" />
          )}
          {element.type === 'moon' && (
            <Moon className="w-5 h-5 text-gray-300/50" />
          )}
          {element.type === 'sun' && (
            <Sun className="w-4 h-4 text-yellow-500/60" />
          )}
        </motion.div>
      ))}

      {/* Mystical Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full opacity-20"
        initial={{ scale: 0, rotate: 0 }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          background: mode === 'love' 
            ? 'conic-gradient(from 0deg, #ec4899, #8b5cf6, #06b6d4, #ec4899)'
            : 'conic-gradient(from 0deg, #8b5cf6, #3b82f6, #06b6d4, #8b5cf6)'
        }}
      />

      <motion.div
        className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full opacity-15"
        initial={{ scale: 0, rotate: 360 }}
        animate={{
          scale: [1, 0.8, 1],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          background: mode === 'love' 
            ? 'radial-gradient(circle, #f43f5e, #8b5cf6)'
            : 'radial-gradient(circle, #3b82f6, #8b5cf6)'
        }}
      />

      {/* Shooting Stars */}
      {isActive && mounted && (
        <>
          <motion.div
            className="absolute w-2 h-2 bg-white rounded-full"
            initial={{ x: -100, y: 100, opacity: 0 }}
            animate={{ 
              x: typeof window !== 'undefined' ? window.innerWidth + 100 : 1200, 
              y: -100, 
              opacity: [0, 1, 0] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 5,
              delay: 1 
            }}
            style={{
              boxShadow: '0 0 15px #ffffff, 0 0 30px #ffffff, 0 0 45px #ffffff'
            }}
          />
          
          <motion.div
            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
            initial={{ x: typeof window !== 'undefined' ? window.innerWidth + 100 : 1200, y: 200, opacity: 0 }}
            animate={{ 
              x: -100, 
              y: -50, 
              opacity: [0, 1, 0] 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              repeatDelay: 7,
              delay: 3 
            }}
            style={{
              boxShadow: '0 0 12px #fbbf24, 0 0 24px #fbbf24'
            }}
          />
        </>
      )}

      {/* Zodiac Wheel */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full border border-purple-500/20"
        style={{ transform: 'translate(-50%, -50%)' }}
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-purple-400/40 rounded-full shadow-lg"
            style={{
              left: '50%',
              top: '10px',
              transform: `rotate(${i * 30}deg) translateX(-50%)`,
              transformOrigin: '50% 182px'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>

      {/* Energy Waves */}
      {isActive && (
        <>
          <motion.div
            className="absolute inset-0 border-4 border-purple-500/20 rounded-full"
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ transformOrigin: '50% 50%' }}
          />
          
          <motion.div
            className="absolute inset-0 border-4 border-blue-500/20 rounded-full"
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            style={{ transformOrigin: '50% 50%' }}
          />

          <motion.div
            className="absolute inset-0 border-4 border-yellow-500/20 rounded-full"
            initial={{ scale: 0, opacity: 0.4 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            style={{ transformOrigin: '50% 50%' }}
          />
        </>
      )}

      {/* Pulsing background effect */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 25% 25%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 25% 75%, rgba(219, 39, 119, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 75% 25%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)'
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}
