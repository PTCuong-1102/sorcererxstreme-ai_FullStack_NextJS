
'use client';

import React, { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence, Variants } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface TarotCard3DNewProps {
  card: {
    id: number;
    name: string;
    meaning: string;
    description: string;
  };
  position: { x: number; y: number };
  index: number;
  isRevealed: boolean;
  isPicked: boolean;
  isSelectable: boolean;
  onClick?: () => void;
  pickOrder?: number;
}

export const TarotCard3DNew: React.FC<TarotCard3DNewProps> = ({
  card,
  position,
  index,
  isRevealed,
  isPicked,
  isSelectable,
  onClick,
  pickOrder
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (isPicked) {
      controls.start({
        scale: 1.1,
        y: -20,
        rotateY: 360,
        transition: { duration: 1.5, type: "spring" }
      });
    } else if (isHovered && isSelectable) {
      controls.start({
        scale: 1.05,
        y: -10,
        rotateZ: 2,
        transition: { duration: 0.5, repeat: Infinity, repeatType: "reverse" }
      });
    } else {
      controls.start({
        scale: 1,
        y: 0,
        rotateZ: 0,
        rotateY: 0,
        transition: { duration: 0.3 }
      });
    }
  }, [isPicked, isHovered, isSelectable, controls]);

  const cardVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.8, 
      rotateY: 180,
      y: 100
    },
    animate: { 
      opacity: 1, 
      scale: 1, 
      rotateY: 0,
      y: 0,
      transition: { 
        delay: index * 0.1,
        duration: 0.8,
        type: "spring",
        stiffness: 100
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      rotateY: -180,
      transition: { duration: 0.5 }
    }
  };

  const glowVariants: Variants = {
    animate: {
      opacity: 1,
      scale: 1.1,
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse' as const,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: position.x,
        top: position.y,
        transformStyle: 'preserve-3d'
      }}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={isSelectable ? { scale: 1.05 } : {}}
      whileTap={isSelectable ? { scale: 0.95 } : {}}
      onHoverStart={() => isSelectable && setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Magical Particles */}
      <AnimatePresence>
        {isPicked && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-purple-400 rounded-full"
                initial={{
                  x: 60,
                  y: 80,
                  scale: 0
                }}
                animate={{
                  x: 60 + Math.cos((i * Math.PI * 2) / 8) * 40,
                  y: 80 + Math.sin((i * Math.PI * 2) / 8) * 40,
                  scale: 1,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glow Effect */}
      <AnimatePresence>
        {(isHovered || isPicked) && (
          <motion.div
            className="absolute inset-0 -m-4 rounded-xl opacity-50 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${isPicked ? '#8b5cf6' : '#a855f7'} 0%, transparent 70%)`,
              filter: 'blur(10px)',
            }}
            variants={glowVariants}
            initial={{ opacity: 0, scale: 0.8 }}
            animate="animate"
            exit={{ opacity: 0, scale: 0.8 }}
          />
        )}
      </AnimatePresence>

      {/* Main Card */}
      <motion.div
        animate={controls}
        className="relative w-32 h-44 group"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
      >
        {/* Card Shadow */}
        <div 
          className="absolute inset-0 bg-black/20 rounded-xl"
          style={{
            transform: 'translateZ(-2px) translateY(8px)',
            filter: 'blur(8px)'
          }}
        />

        {/* Card Body */}
        <motion.div
          className={`relative w-full h-full rounded-xl border-2 overflow-hidden transition-all duration-300 ${
            isPicked 
              ? 'border-purple-400 shadow-2xl shadow-purple-500/50' 
              : isHovered 
              ? 'border-purple-500 shadow-xl shadow-purple-500/30' 
              : 'border-gray-700 shadow-lg'
          }`}
          style={{
            background: isRevealed 
              ? 'linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)'
              : 'linear-gradient(145deg, #4c1d95 0%, #3730a3 100%)',
            transformStyle: 'preserve-3d'
          }}
        >
          {!isRevealed ? (
            // Card Back Design
            <div className="w-full h-full flex flex-col items-center justify-center p-2 relative overflow-hidden">
              {/* Mystical Pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.3),transparent)]" />
              </div>

              {/* Center Symbol */}
              <motion.div
                className="relative z-10 w-16 h-16 mb-2"
                animate={{
                  rotate: isPicked ? 360 : 0,
                  scale: isPicked ? 1.1 : 1
                }}
                transition={{
                  duration: isPicked ? 3 : 0,
                  repeat: isPicked ? Infinity : 0,
                  ease: "linear"
                }}
              >
                <div className="w-full h-full rounded-full border-2 border-yellow-400 flex items-center justify-center bg-purple-600/20">
                  <div className="w-8 h-8 rounded-full border border-yellow-400 flex items-center justify-center">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  </div>
                </div>
              </motion.div>

              {/* Top and Bottom Symbols */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                <div className="w-6 h-6 border border-yellow-400 rounded transform rotate-45" />
              </div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="w-6 h-6 border border-yellow-400 rounded transform rotate-45" />
              </div>

              {/* Side Symbols */}
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border border-yellow-400 rounded-full" />
              </div>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border border-yellow-400 rounded-full" />
              </div>

              {/* Sparkle Effects */}
              {isPicked && (
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    opacity: 1,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="absolute top-4 right-4 w-4 h-4 text-yellow-400" />
                  <Sparkles className="absolute bottom-4 left-4 w-3 h-3 text-pink-400" />
                  <Sparkles className="absolute top-1/2 left-2 w-2 h-2 text-purple-400" />
                </motion.div>
              )}
            </div>
          ) : (
            // Card Front (Revealed)
            <div className="w-full h-full p-3 flex flex-col">
              {/* Card Name */}
              <div className="text-center mb-2">
                <h4 className="text-xs font-bold text-gray-800 leading-tight">{card.name}</h4>
              </div>

              {/* Card Symbol */}
              <div className="flex-1 flex items-center justify-center mb-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Card Meaning */}
              <div className="text-center">
                <p className="text-xs text-gray-600 leading-tight">{card.meaning}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Pick Order Badge */}
        <AnimatePresence>
          {isPicked && pickOrder && (
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {pickOrder}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
