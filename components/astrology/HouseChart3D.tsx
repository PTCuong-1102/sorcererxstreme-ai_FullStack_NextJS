
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Network, Star, Circle, Heart, Zap, Shield, Users, Target } from 'lucide-react';

interface HouseChart3DProps {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  userZodiac: any;
}

interface ZodiacRelation {
  sign: string;
  symbol: string;
  element: string;
  compatibility: 'excellent' | 'good' | 'neutral' | 'challenging';
  relationship: string;
  influence: string;
  color: string;
  angle: number;
  distance: number;
}

export default function HouseChart3D({ birthDate, birthTime, birthPlace, userZodiac }: HouseChart3DProps) {
  const [relations, setRelations] = useState<ZodiacRelation[]>([]);
  const [selectedRelation, setSelectedRelation] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [pulseIndex, setPulseIndex] = useState(0);

  const allZodiacs = [
    { name: 'Bạch Dương', symbol: '♈', element: 'Hỏa', color: '#ef4444' },
    { name: 'Kim Ngưu', symbol: '♉', element: 'Thổ', color: '#10b981' },
    { name: 'Song Tử', symbol: '♊', element: 'Khí', color: '#3b82f6' },
    { name: 'Cự Giải', symbol: '♋', element: 'Thủy', color: '#8b5cf6' },
    { name: 'Sư Tử', symbol: '♌', element: 'Hỏa', color: '#f59e0b' },
    { name: 'Xử Nữ', symbol: '♍', element: 'Thổ', color: '#06b6d4' },
    { name: 'Thiên Bình', symbol: '♎', element: 'Khí', color: '#ec4899' },
    { name: 'Hổ Cáp', symbol: '♏', element: 'Thủy', color: '#dc2626' },
    { name: 'Nhân Mã', symbol: '♐', element: 'Hỏa', color: '#7c3aed' },
    { name: 'Ma Kết', symbol: '♑', element: 'Thổ', color: '#059669' },
    { name: 'Bảo Bình', symbol: '♒', element: 'Khí', color: '#0ea5e9' },
    { name: 'Song Ngư', symbol: '♓', element: 'Thủy', color: '#6366f1' }
  ];

  const getCompatibility = (
    userElement: string,
    otherElement: string,
    userSign: string,
    otherSign: string
  ): 'excellent' | 'good' | 'neutral' | 'challenging' => {
    if (userElement === otherElement) return 'excellent';

    if ((userElement === 'Hỏa' && otherElement === 'Khí') ||
        (userElement === 'Khí' && otherElement === 'Hỏa') ||
        (userElement === 'Thổ' && otherElement === 'Thủy') ||
        (userElement === 'Thủy' && otherElement === 'Thổ')) {
      return 'good';
    }

    if ((userElement === 'Hỏa' && otherElement === 'Thủy') ||
        (userElement === 'Thủy' && otherElement === 'Hỏa') ||
        (userElement === 'Khí' && otherElement === 'Thổ') ||
        (userElement === 'Thổ' && otherElement === 'Khí')) {
      return 'challenging';
    }

    return 'neutral';
  };

  const getRelationshipType = (
    compatibility: 'excellent' | 'good' | 'neutral' | 'challenging',
    userSign: string,
    otherSign: string
  ) => {
    const relationships: Record<'excellent' | 'good' | 'neutral' | 'challenging', string[]> = {
      'excellent': ['Đồng minh tự nhiên', 'Tri kỷ tâm linh', 'Người bạn đồng hành', 'Đối tác hoàn hảo'],
      'good': ['Bạn tốt', 'Đối tác kinh doanh', 'Người cố vấn', 'Nguồn cảm hứng'],
      'neutral': ['Mối quan hệ cân bằng', 'Học hỏi lẫn nhau', 'Tương tác bình thường', 'Khám phá tiềm năng'],
      'challenging': ['Thử thách lớn', 'Bài học quan trọng', 'Cần sự kiên nhẫn', 'Cơ hội phát triển']
    };

    return relationships[compatibility][Math.floor(Math.random() * relationships[compatibility].length)];
  };

  const getInfluence = (
    compatibility: 'excellent' | 'good' | 'neutral' | 'challenging',
    otherElement: string
  ) => {
    const influences: Record<'excellent' | 'good' | 'neutral' | 'challenging', Record<string, string>> = {
      'excellent': {
        'Hỏa': 'Tăng cường năng lượng và sự nhiệt huyết',
        'Thổ': 'Mang lại sự ổn định và thực tế',
        'Khí': 'Kích thích trí tuệ và giao tiếp',
        'Thủy': 'Nuôi dưỡng cảm xúc và trực giác'
      },
      'good': {
        'Hỏa': 'Thúc đẩy hành động và quyết đoán',
        'Thổ': 'Hỗ trợ xây dựng nền tảng vững chắc',
        'Khí': 'Mở rộng tầm nhìn và hiểu biết',
        'Thủy': 'Phát triển khả năng cảm thụ'
      },
      'neutral': {
        'Hỏa': 'Học cách cân bằng năng lượng',
        'Thổ': 'Khám phá tính kiên nhẫn',
        'Khí': 'Rèn luyện khả năng thích ứng',
        'Thủy': 'Phát triển sự nhạy bén'
      },
      'challenging': {
        'Hỏa': 'Thử thách về việc kiểm soát cảm xúc',
        'Thổ': 'Bài học về sự linh hoạt',
        'Khí': 'Học cách tập trung và kiên trì',
        'Thủy': 'Rèn luyện sự quyết đoán'
      }
    };

    return influences[compatibility][otherElement] || 'Ảnh hưởng đặc biệt';
  };

  useEffect(() => {
    if (!userZodiac) return;

    const otherZodiacs = allZodiacs.filter(z => z.name !== userZodiac.name);

    const calculatedRelations = otherZodiacs.map((zodiac, index) => {
      const compatibility = getCompatibility(userZodiac.element, zodiac.element, userZodiac.name, zodiac.name);
      const angle = (index * (360 / 11)) * (Math.PI / 180);
      const distance = compatibility === 'excellent' ? 35 :
                       compatibility === 'good' ? 40 :
                       compatibility === 'neutral' ? 45 : 50;

      return {
        sign: zodiac.name,
        symbol: zodiac.symbol,
        element: zodiac.element,
        compatibility,
        relationship: getRelationshipType(compatibility, userZodiac.name, zodiac.name),
        influence: getInfluence(compatibility, zodiac.element),
        color: zodiac.color,
        angle: index * (360 / 11),
        distance
      };
    });

    setRelations(calculatedRelations);
  }, [userZodiac]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 0.3);
      setPulseIndex(prev => (prev + 1) % relations.length);
    }, 100);

    return () => clearInterval(interval);
  }, [relations.length]);

  if (!userZodiac || relations.length === 0) {
    return (
      <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-xl">
        <div className="text-center text-gray-400">
          <Circle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Đang tải sơ đồ quan hệ cung...</p>
        </div>
      </div>
    );
  }

  const userSymbol = allZodiacs.find(z => z.name === userZodiac.name)?.symbol || '⭐';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-xl"
    >
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <Network className="w-6 h-6 mr-2 text-indigo-400" />
        Sơ Đồ Quan Hệ Cung - {userSymbol} {userZodiac.name} và 11 Cung Còn Lại
      </h3>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 3D Relationship Chart */}
        <div className="flex-1">
          <div className="relative w-full aspect-square max-w-lg mx-auto">
            <motion.div
              className="relative w-full h-full"
              animate={{ rotate: rotation }}
              transition={{ type: "spring", stiffness: 30, damping: 30 }}
            >
              {/* Connection Lines */}
              {relations.map((relation, index) => {
                const angle = (relation.angle * Math.PI) / 180;
                const x = 50 + relation.distance * Math.cos(angle);
                const y = 50 + relation.distance * Math.sin(angle);

                return (
                  <motion.div
                    key={`line-${relation.sign}`}
                    className="absolute"
                    style={{
                      left: '50%',
                      top: '50%',
                      width: `${relation.distance}%`,
                      height: '2px',
                      transformOrigin: '0 50%',
                      transform: `rotate(${relation.angle}deg)`,
                      opacity: selectedRelation === relation.sign ? 0.8 : 0.3
                    }}
                  >
                    <div
                      className="w-full h-full"
                      style={{
                        background: `linear-gradient(to right, ${userZodiac.color || '#fbbf24'}, ${relation.color})`,
                        filter: relation.compatibility === 'excellent' ? 'drop-shadow(0 0 8px currentColor)' : 'none'
                      }}
                    />
                  </motion.div>
                );
              })}

              {/* User's Zodiac - Center */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                animate={{
                  scale: [1, 1.1, 1],
                  rotateZ: -rotation
                }}
                transition={{
                  scale: { duration: 2, repeat: Infinity },
                  rotateZ: { duration: 0.1 }
                }}
              >
                <div
                  className="w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-white shadow-2xl relative"
                  style={{
                    backgroundColor: userZodiac.color + '60',
                    borderColor: userZodiac.color,
                    boxShadow: `0 0 30px ${userZodiac.color}80`
                  }}
                >
                  <span className="text-2xl">{userSymbol}</span>

                  {/* Pulsing ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: userZodiac.color + '40' }}
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [1, 0, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity
                    }}
                  />
                </div>
              </motion.div>

              {/* Other Zodiacs */}
              {relations.map((relation, index) => {
                const angle = (relation.angle * Math.PI) / 180;
                const x = 50 + relation.distance * Math.cos(angle);
                const y = 50 + relation.distance * Math.sin(angle);

                const CompatibilityIcon = relation.compatibility === 'excellent' ? Heart :
                                        relation.compatibility === 'good' ? Star :
                                        relation.compatibility === 'neutral' ? Shield :
                                        Zap;

                return (
                  <motion.div
                    key={relation.sign}
                    className="absolute cursor-pointer z-10"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    whileHover={{
                      scale: 1.4,
                      z: 30
                    }}
                    whileTap={{
                      scale: 0.95
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedRelation(relation.sign);
                    }}
                    animate={{
                      rotateZ: -rotation,
                      scale: selectedRelation === relation.sign ? 1.3 :
                             pulseIndex === index ? 1.15 : 1,
                      y: pulseIndex === index ? -8 : 0
                    }}
                    transition={{
                      duration: 0.3,
                      y: { duration: 0.6 },
                      scale: { type: "spring", stiffness: 400, damping: 17 }
                    }}
                  >
                    {/* Larger clickable area */}
                    <div
                      className="absolute inset-0 -m-4 rounded-full"
                      style={{ minWidth: '60px', minHeight: '60px' }}
                    />

                    <div
                      className="relative w-14 h-14 rounded-full border-3 flex items-center justify-center font-bold text-white shadow-2xl group transition-all duration-300"
                      style={{
                        backgroundColor: relation.color + (selectedRelation === relation.sign ? '80' : '40'),
                        borderColor: relation.color,
                        borderWidth: selectedRelation === relation.sign ? '3px' : '2px',
                        boxShadow: `0 0 ${selectedRelation === relation.sign ? '30' : '20'}px ${relation.color}${selectedRelation === relation.sign ? '80' : '40'}`
                      }}
                    >
                      <span className="text-xl font-black drop-shadow-lg">{relation.symbol}</span>

                      {/* Compatibility indicator - larger and more visible */}
                      <div
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center border-2 border-gray-900"
                        style={{
                          backgroundColor: relation.compatibility === 'excellent' ? '#22c55e' :
                                          relation.compatibility === 'good' ? '#3b82f6' :
                                          relation.compatibility === 'neutral' ? '#f59e0b' : '#ef4444'
                        }}
                      >
                        <CompatibilityIcon className="w-3 h-3 text-white drop-shadow" />

                      </div>

                      {/* Hover effect ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 opacity-0 group-hover:opacity-100"
                        style={{ 
                          borderColor: relation.color,
                          scale: 1.2
                        }}
                        animate={{
                          rotate: [0, 360],
                          opacity: selectedRelation === relation.sign ? [0.3, 0.7, 0.3] : 0
                        }}
                        transition={{
                          rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                          opacity: { duration: 2, repeat: Infinity }
                        }}
                      />

                      {/* Floating particles around excellent compatibility */}
                      {relation.compatibility === 'excellent' && (
                        <>
                          {[...Array(4)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: relation.color }}
                              animate={{
                                x: [0, Math.cos(i * 90) * 25, 0],
                                y: [0, Math.sin(i * 90) * 25, 0],
                                opacity: [1, 0.2, 1],
                                scale: [0.5, 1, 0.5]
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 0.3
                              }}
                            />
                          ))}
                        </>
                      )}
                    </div>

                    {/* Tooltip on hover */}
                    <motion.div
                      className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50"
                      style={{
                        backgroundColor: relation.color + 'dd'
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                    >
                      {relation.symbol} {relation.sign}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-current" 
                           style={{ borderTopColor: relation.color + 'dd' }} />
                    </motion.div>
                  </motion.div>
                );
              })}

              {/* Orbiting rings */}
              <div className="absolute inset-0 rounded-full border border-purple-500/10" />
              <div className="absolute inset-4 rounded-full border border-blue-500/10" />
              <div className="absolute inset-8 rounded-full border border-indigo-500/10" />
            </motion.div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">Nhấp vào từng cung để xem mối quan hệ chi tiết</p>
            <div className="flex justify-center gap-4 mt-2 text-xs">
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-green-400" />
                <span className="text-gray-500">Tuyệt vời</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-blue-400" />
                <span className="text-gray-500">Tốt</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-yellow-400" />
                <span className="text-gray-500">Trung tính</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-red-400" />
                <span className="text-gray-500">Thách thức</span>
              </div>
            </div>
          </div>
        </div>

        {/* Relation Information Panel */}
        <div className="flex-1 max-w-md">
          <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-600/30 min-h-96">
            {selectedRelation ? (
              <motion.div
                key={selectedRelation}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {(() => {
                  const relation = relations.find(r => r.sign === selectedRelation);
                  if (!relation) return null;

                  const CompatibilityIcon = relation.compatibility === 'excellent' ? Heart :
                                          relation.compatibility === 'good' ? Star :
                                          relation.compatibility === 'neutral' ? Shield :
                                          Zap;

                  return (
                    <div>
                      <div className="flex items-center mb-4">
                        <div
                          className="w-10 h-10 rounded-full mr-3 border-2 flex items-center justify-center text-lg"
                          style={{
                            backgroundColor: relation.color + '40',
                            borderColor: relation.color
                          }}
                        >
                          <span className="text-white font-bold">{relation.symbol}</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white flex items-center gap-2">
                            {userSymbol} {userZodiac.name} ↔ {relation.symbol} {relation.sign}
                          </h4>
                          <p className="text-xs text-gray-400">
                            {userZodiac.element} × {relation.element}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Mức độ tương hợp</p>
                          <div className="flex items-center gap-2">
                            <div
                              className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                              style={{
                                backgroundColor: relation.compatibility === 'excellent' ? '#22c55e40' :
                                                relation.compatibility === 'good' ? '#3b82f640' :
                                                relation.compatibility === 'neutral' ? '#f59e0b40' : '#ef444440',
                                color: relation.compatibility === 'excellent' ? '#22c55e' :
                                       relation.compatibility === 'good' ? '#3b82f6' :
                                       relation.compatibility === 'neutral' ? '#f59e0b' : '#ef4444'
                              }}
                            >
                              <CompatibilityIcon className="w-3 h-3" />
                              {relation.compatibility === 'excellent' ? 'Tuyệt vời' :
                               relation.compatibility === 'good' ? 'Tốt' :
                               relation.compatibility === 'neutral' ? 'Trung tính' : 'Thách thức'}
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-400 mb-1">Loại quan hệ</p>
                          <p className="text-white font-medium">
                            {relation.relationship}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-400 mb-1">Ảnh hưởng lên bạn</p>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {relation.influence}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-gray-600/30">
                          <p className="text-sm text-gray-400 mb-2">Lời khuyên tương tác</p>
                          <div className="bg-gray-900/50 rounded-lg p-3">
                            <p className="text-xs text-gray-300">
                              {relation.compatibility === 'excellent' ?
                                `Đây là mối quan hệ tự nhiên và hài hòa. Hãy tận dụng sự đồng điệu này để cùng nhau phát triển và học hỏi.` :
                               relation.compatibility === 'good' ?
                                `Mối quan hệ bổ sung tốt. Bạn có thể học được nhiều điều từ ${relation.symbol} ${relation.sign} và ngược lại.` :
                               relation.compatibility === 'neutral' ?
                                `Cần thời gian để hiểu nhau. Hãy kiên nhẫn và cởi mở trong giao tiếp với ${relation.symbol} ${relation.sign}.` :
                                `Mối quan hệ thách thức nhưng có thể mang lại sự phát triển lớn. Cần sự kiên nhẫn và thấu hiểu.`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            ) : (
              <div className="text-center text-gray-400 mt-20">
                <Network className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nhấp vào một cung trong sơ đồ</p>
                <p className="text-sm">để xem mối quan hệ chi tiết</p>
                <div className="mt-6 text-left">
                  <h5 className="text-sm font-semibold text-white mb-2">Cung chủ đạo của bạn:</h5>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
                      style={{
                        backgroundColor: userZodiac.color + '40',
                        borderColor: userZodiac.color
                      }}
                    >
                      <span className="text-lg text-white font-bold">
                        {userSymbol}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium flex items-center gap-2">
                        {userSymbol} {userZodiac.name}
                      </p>
                      <p className="text-xs text-gray-400">Nguyên tố: {userZodiac.element}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm mb-2">💡 Mẹo: Nhấn và giữ để chọn cung dễ dàng hơn</p>
        <div className="flex flex-wrap justify-center gap-3 mt-3 text-xs">
          <div className="flex items-center gap-1 bg-gray-800/40 px-2 py-1 rounded-full">
            <Heart className="w-3 h-3 text-green-400" />
            <span className="text-gray-300">Tuyệt vời</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-800/40 px-2 py-1 rounded-full">
            <Star className="w-3 h-3 text-blue-400" />
            <span className="text-gray-300">Tốt</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-800/40 px-2 py-1 rounded-full">
            <Shield className="w-3 h-3 text-yellow-400" />
            <span className="text-gray-300">Trung tính</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-800/40 px-2 py-1 rounded-full">
            <Zap className="w-3 h-3 text-red-400" />
            <span className="text-gray-300">Thách thức</span>
          </div>
        </div>

        {/* Quick select buttons */}
        <div className="mt-4">
          <p className="text-gray-500 text-xs mb-2">Chọn nhanh:</p>
          <div className="flex flex-wrap justify-center gap-1">
            {relations.map((relation) => (
              <button
                key={relation.sign}
                onClick={() => setSelectedRelation(relation.sign)}
                className={`px-2 py-1 text-xs rounded-full border transition-all cursor-pointer ${
                  selectedRelation === relation.sign
                    ? 'text-white shadow-lg'
                    : 'text-gray-400 border-gray-600 hover:text-gray-300 hover:border-gray-500'
                }`}
                style={{
                  backgroundColor: selectedRelation === relation.sign ? relation.color + '40' : 'transparent',
                  borderColor: selectedRelation === relation.sign ? relation.color : undefined
                }}
              >
                {relation.symbol}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
