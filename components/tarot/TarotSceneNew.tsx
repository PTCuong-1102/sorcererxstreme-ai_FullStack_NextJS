
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TarotCard3DNew } from './TarotCard3DNew';

interface TarotSceneNewProps {
  cards: Array<{
    id: number;
    name: string;
    meaning: string;
    description: string;
  }>;
  selectedCards: any[];
  pickedPositions: number[];
  onCardClick: (index: number, card: any) => void;
  isSelectable: boolean;
  phase: string;
}

export const TarotSceneNew: React.FC<TarotSceneNewProps> = ({
  cards,
  selectedCards,
  pickedPositions,
  onCardClick,
  isSelectable,
  phase
}) => {
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateSize = () => {
      const width = Math.min(window.innerWidth - 64, 1000);
      const height = Math.min(window.innerHeight * 0.6, 600);
      setContainerSize({ width, height });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const getCardPosition = (index: number) => {
    const cols = 3;
    const rows = 2;
    const cardWidth = 140;
    const cardHeight = 180;
    
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    const totalWidth = cols * cardWidth + (cols - 1) * 20;
    const totalHeight = rows * cardHeight + (rows - 1) * 30;
    
    const startX = (containerSize.width - totalWidth) / 2;
    const startY = (containerSize.height - totalHeight) / 2;
    
    return {
      x: startX + col * (cardWidth + 20),
      y: startY + row * (cardHeight + 30)
    };
  };

  if (!mounted) {
    return (
      <div 
        className="w-full rounded-2xl bg-gray-900 flex items-center justify-center"
        style={{ height: 600 }}
      >
        <div className="text-white">Đang tải...</div>
      </div>
    );
  }

  const backgroundVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 1 }
    }
  };

  const tableVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 1, delay: 0.2 }
    }
  };

  return (
    <motion.div 
      className="relative w-full rounded-2xl overflow-hidden"
      style={{ 
        height: containerSize.height,
        background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)'
      }}
      variants={backgroundVariants}
      initial="initial"
      animate="animate"
    >
      {/* Enhanced Mystical Background Elements */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 30% 30%, rgba(124,58,237,0.4) 0%, transparent 50%)',
            'radial-gradient(circle at 70% 70%, rgba(59,130,246,0.4) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, rgba(147,51,234,0.4) 0%, transparent 50%)'
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "loop"
        }}
      />

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              backgroundColor: ['#8b5cf6', '#3b82f6', '#ec4899', '#f59e0b'][Math.floor(Math.random() * 4)],
              boxShadow: `0 0 ${Math.random() * 10 + 5}px currentColor`
            }}
            initial={{
              x: Math.random() * containerSize.width,
              y: containerSize.height + 20,
              opacity: 0
            }}
            animate={{
              x: Math.random() * containerSize.width,
              y: -20,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 8 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Enhanced Mystical Table/Circle */}
      <motion.div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        variants={tableVariants}
      >
        <div 
          className="rounded-full border-4 border-purple-400/40 bg-purple-900/20 shadow-2xl"
          style={{
            width: Math.min(containerSize.width * 0.85, 650),
            height: Math.min(containerSize.height * 0.85, 450),
            boxShadow: '0 0 50px rgba(124, 58, 237, 0.3), inset 0 0 50px rgba(124, 58, 237, 0.1)'
          }}
        >
          {/* Enhanced inner mystical circles */}
          <div className="absolute inset-6 rounded-full border-2 border-purple-300/30 bg-purple-800/10">
            <div className="absolute inset-6 rounded-full border-2 border-yellow-400/40 bg-yellow-900/10">
              {/* Enhanced mystical symbols around circle */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute border-2 border-yellow-400/60 rounded transform rotate-45"
                  style={{
                    width: 8,
                    height: 8,
                    left: '50%',
                    top: '50%',
                    transformOrigin: '50% 50%',
                    transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-100px) rotate(45deg)`
                  }}
                  animate={{
                    opacity: [0.4, 1, 0.4],
                    scale: [1, 1.3, 1],
                    rotate: [45, 90, 45]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                />
              ))}

              {/* Central mystical symbol */}
              <motion.div
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <div className="w-6 h-6 border-2 border-yellow-400/70 rounded-full bg-yellow-400/20">
                  <div className="absolute inset-1 border border-white/50 rounded-full bg-white/10"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cards Container */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          {cards.map((card, index) => (
            <TarotCard3DNew
              key={`${card.id}-${index}`}
              card={card}
              position={getCardPosition(index)}
              index={index}
              isRevealed={false}
              isPicked={pickedPositions.includes(index)}
              isSelectable={isSelectable && phase === 'pick_cards'}
              onClick={() => onCardClick(index, card)}
              pickOrder={pickedPositions.indexOf(index) + 1 || undefined}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Enhanced Mystical Overlay Effects */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'conic-gradient(from 0deg at 50% 50%, rgba(139,92,246,0.1) 0deg, rgba(59,130,246,0.1) 120deg, rgba(236,72,153,0.1) 240deg, rgba(139,92,246,0.1) 360deg)'
        }}
      />

      {/* Pulsing Border Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: [
            '0 0 0 0 rgba(139, 92, 246, 0)',
            '0 0 0 4px rgba(139, 92, 246, 0.3)',
            '0 0 0 0 rgba(139, 92, 246, 0)'
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Shooting Stars Effect */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full pointer-events-none"
          style={{
            boxShadow: '0 0 8px #ffffff, 0 0 16px #ffffff'
          }}
          initial={{ 
            x: -20, 
            y: Math.random() * containerSize.height,
            opacity: 0 
          }}
          animate={{ 
            x: containerSize.width + 20,
            y: Math.random() * containerSize.height,
            opacity: [0, 1, 0] 
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: Math.random() * 8 + 5,
            delay: Math.random() * 3,
            ease: "linear"
          }}
        />
      ))}
    </motion.div>
  );
};
