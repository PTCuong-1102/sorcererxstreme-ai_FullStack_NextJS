
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Eye, HelpCircle } from 'lucide-react';

interface RevealedCard3DNewProps {
  card: {
    id: number;
    name: string;
    meaning: string;
    description: string;
  };
  title: string;
  color: string;
  index: number;
}

const RevealedCard3DNew: React.FC<RevealedCard3DNewProps> = ({ card, title, color, index }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 300);
    return () => clearTimeout(timer);
  }, [index]);

  const cardVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.5, 
      rotateY: 180,
      y: 100
    },
    animate: { 
      opacity: 1, 
      scale: 1, 
      rotateY: 0,
      y: 0,
      transition: { 
        duration: 1,
        type: "spring",
        stiffness: 100
      }
    },
    hover: {
      scale: 1.05,
      y: -10,
      rotateY: 5,
      transition: { 
        duration: 0.6,
        type: "spring"
      }
    }
  };

  const iconMap: { [key: string]: any } = {
    'Quá khứ': Eye,
    'Hiện tại': Eye,
    'Tương lai': Eye,
    'Trái tim bạn': Heart,
    'Tình huống hiện tại': Heart,
    'Hướng phát triển': Heart,
    'Câu trả lời': HelpCircle
  };

  const IconComponent = iconMap[title] || Sparkles;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="relative group"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Card Glow */}
          <motion.div
            className="absolute -inset-4 rounded-2xl opacity-50 blur-xl"
            style={{ backgroundColor: color }}
            animate={{
              opacity: 0.6,
              scale: 1.1
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />

          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
                initial={{
                  x: 120,
                  y: 140,
                  scale: 0,
                  opacity: 0
                }}
                animate={{
                  x: 120 + Math.cos((i * Math.PI * 2) / 6) * 60,
                  y: 140 + Math.sin((i * Math.PI * 2) / 6) * 60,
                  scale: 1,
                  opacity: 1
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Main Card */}
          <motion.div
            className="relative w-60 h-80 bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-2xl overflow-hidden"
            style={{
              transformStyle: 'preserve-3d',
              boxShadow: `0 25px 50px -12px ${color}40`
            }}
          >
            {/* Card Header */}
            <div className="absolute top-0 left-0 right-0 p-4 z-10">
              <motion.div
                className="flex items-center justify-center mb-2"
                animate={{
                  scale: 1.1,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                  style={{ backgroundColor: color }}
                >
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-bold" style={{ color }}>
                  {title}
                </h3>
              </motion.div>
              
              <h2 className="text-lg font-bold text-gray-800 text-center">
                {card.name}
              </h2>
            </div>

            {/* Card Center Symbol */}
            <motion.div
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              animate={{
                rotate: 360,
                scale: 1.1
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center relative"
                style={{ 
                  background: `linear-gradient(145deg, ${color}, ${color}dd)`,
                  boxShadow: `0 0 20px ${color}60`
                }}
              >
                <Sparkles className="w-10 h-10 text-white" />
                
                {/* Inner rotating ring */}
                <motion.div
                  className="absolute inset-2 rounded-full border-2 border-white/30"
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>
            </motion.div>

            {/* Card Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white to-transparent">
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                {card.description}
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-4 left-4">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
            </div>
            <div className="absolute top-4 right-4">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
            </div>
            <div className="absolute bottom-4 left-4">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
            </div>
            <div className="absolute bottom-4 right-4">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
            </div>

            {/* Mystical Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, ${color} 2px, transparent 2px), radial-gradient(circle at 75% 75%, ${color} 2px, transparent 2px)`,
                backgroundSize: '30px 30px'
              }} />
            </div>
          </motion.div>

          {/* Magic Trail Effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{ 
                  backgroundColor: color,
                  left: '50%',
                  top: '50%',
                  transformOrigin: '50% 50%'
                }}
                initial={{
                  x: -100 - i * 20,
                  y: -100 - i * 20,
                  scale: 0
                }}
                animate={{
                  scale: 1,
                  opacity: 1
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface CardReveal3DNewProps {
  cards: Array<{
    id: number;
    name: string;
    meaning: string;
    description: string;
  }>;
  mode: 'overview' | 'love' | 'question';
}

export const CardReveal3DNew: React.FC<CardReveal3DNewProps> = ({ cards, mode }) => {
  const getCardData = () => {
    if (mode === 'overview') {
      return [
        { title: 'Quá khứ', color: '#3b82f6' },
        { title: 'Hiện tại', color: '#eab308' },
        { title: 'Tương lai', color: '#10b981' }
      ];
    } else if (mode === 'love') {
      return [
        { title: 'Trái tim bạn', color: '#ef4444' },
        { title: 'Tình huống hiện tại', color: '#ec4899' },
        { title: 'Hướng phát triển', color: '#f97316' }
      ];
    } else {
      return [
        { title: 'Câu trả lời', color: '#8b5cf6' }
      ];
    }
  };

  const cardData = getCardData();
  const isThreeCard = cards.length === 3;

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.3
      }
    }
  };

  return (
    <motion.div
      className="w-full rounded-2xl overflow-hidden p-8"
      style={{
        minHeight: '500px',
        background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 30%, #312e81 70%, #1e1b4b 100%)'
      }}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {/* Background Mystical Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: 'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.2) 0%, transparent 50%)'
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      {/* Cards Layout */}
      <div className={`relative flex ${isThreeCard ? 'justify-center space-x-8' : 'justify-center'} items-center h-full`}>
        {cards.map((card, index) => (
          <RevealedCard3DNew
            key={card.id}
            card={card}
            title={cardData[index]?.title || ''}
            color={cardData[index]?.color || '#8b5cf6'}
            index={index}
          />
        ))}
      </div>

      {/* Bottom Mystical Elements */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 opacity-60">
        {cardData.map((data, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: data.color }}
            animate={{
              scale: 1.5,
              opacity: 1
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
