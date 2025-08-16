
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shuffle, Eye, HelpCircle, RotateCcw, Heart } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore, useProfileStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { TarotSceneNew } from '@/components/tarot/TarotSceneNew';
import { CardReveal3DNew } from '@/components/tarot/CardReveal3DNew';
import toast from 'react-hot-toast';
import { FormattedContent } from '@/components/ui/FormattedContent';

const tarotCards = [
  { id: 1, name: 'The Fool', meaning: 'New beginnings, adventure, unlimited potential', description: 'You are stepping into a new journey full of potential' },
  { id: 2, name: 'The Magician', meaning: 'Willpower, creativity, achieving goals', description: 'You have everything you need to succeed' },
  { id: 3, name: 'The High Priestess', meaning: 'Intuition, mystery, subconscious knowledge', description: 'Trust your intuition and inner wisdom' },
  { id: 4, name: 'The Empress', meaning: 'Nurturing, creativity, abundance', description: 'A time of creativity and growth' },
  { id: 5, name: 'The Emperor', meaning: 'Authority, control, structure', description: 'Need discipline and organization in life' },
  { id: 6, name: 'The Hierophant', meaning: 'Tradition, spiritual education, guidance', description: 'Seek guidance from experienced mentors' },
  { id: 7, name: 'The Lovers', meaning: 'Love, choices, harmony', description: 'An important decision about relationships is coming' },
  { id: 8, name: 'The Chariot', meaning: 'Strong will, success, control', description: 'Success achieved through determination and effort' },
  { id: 9, name: 'Strength', meaning: 'Inner strength, courage, patience', description: 'True strength comes from within you' },
  { id: 10, name: 'The Hermit', meaning: 'Soul searching, wisdom, guidance', description: 'Time for reflection and seeking inner truth' },
  { id: 11, name: 'Wheel of Fortune', meaning: 'Luck, change, cycles', description: 'The wheel of destiny is turning, change is coming' },
  { id: 12, name: 'Justice', meaning: 'Fairness, balance, right decisions', description: 'Justice and balance will be restored' },
  { id: 13, name: 'The Hanged Man', meaning: 'Sacrifice, patience, new perspective', description: 'Need to change perspective to find solutions' },
  { id: 14, name: 'Death', meaning: 'Ending, transformation, rebirth', description: 'One phase ends to begin something new' },
  { id: 15, name: 'Temperance', meaning: 'Balance, harmony, patience', description: 'Need patience and balance in everything' },
  { id: 16, name: 'The Devil', meaning: 'Temptation, bondage, liberation', description: 'Recognize what is binding you' },
  { id: 17, name: 'The Tower', meaning: 'Sudden change, enlightenment, breaking down', description: 'Sudden change will bring enlightenment' },
  { id: 18, name: 'The Star', meaning: 'Hope, inspiration, healing', description: 'Hope and inspiration are coming to you' },
  { id: 19, name: 'The Moon', meaning: 'Illusion, intuition, uncertainty', description: 'Trust your intuition in uncertain times' },
  { id: 20, name: 'The Sun', meaning: 'Joy, success, energy', description: 'Success and joy shine brightly ahead' },
  { id: 21, name: 'Judgement', meaning: 'Rebirth, awakening, final decision', description: 'Time to reassess and make important decisions' },
  { id: 22, name: 'The World', meaning: 'Completion, achievement, fulfillment', description: 'You have achieved completion in some area' }
];

type Mode = 'overview' | 'question' | 'love';
type Phase = 'select_mode' | 'spread_cards' | 'pick_cards' | 'reading';

export default function TarotPage() {
  const [mode, setMode] = useState<Mode>('overview');
  const [phase, setPhase] = useState<Phase>('select_mode');
  const [question, setQuestion] = useState('');
  const [spreadCards, setSpreadCards] = useState<any[]>([]);
  const [selectedCards, setSelectedCards] = useState<any[]>([]);
  const [pickedPositions, setPickedPositions] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [reading, setReading] = useState('');
  const [showLoveConfirmDialog, setShowLoveConfirmDialog] = useState(false);
  const [proceedWithGeneralLove, setProceedWithGeneralLove] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { partner, breakupData } = useProfileStore();

  const startReading = async () => {
    if (mode === 'love' && !partner && !breakupData?.isActive && !proceedWithGeneralLove) {
      handleLoveAnalysis();
      return;
    }

    if (mode === 'question' && !question.trim()) {
      toast.error('Vui lòng nhập câu hỏi của bạn');
      return;
    }

    setIsAnimating(true);
    setPhase('spread_cards');

    const shuffled = [...tarotCards].sort(() => 0.5 - Math.random());

    await new Promise(resolve => setTimeout(resolve, 1500));

    setSpreadCards(shuffled.slice(0, 6));
    setIsAnimating(false);
    setPhase('pick_cards');
    toast.success('Hãy chọn những lá bài theo trực giác của bạn!');
  };

  const handleLoveAnalysis = () => {
    if (!partner && !breakupData?.isActive && !proceedWithGeneralLove) {
      setShowLoveConfirmDialog(true);
      return;
    }

    startReading();
  };

  const confirmGeneralLoveAnalysis = () => {
    setProceedWithGeneralLove(true);
    setShowLoveConfirmDialog(false);
    startReading();
  };

  const generateGeneralLoveAnalysis = () => {
    if (!partner && !breakupData?.isActive && proceedWithGeneralLove) {
      return `💫 **PHÂN TÍCH TÌNH DUYÊN TỔNG QUAN QUA TAROT**\n\nCác lá bài ${selectedCards.map(c => c.name).join(', ')} đã được chọn không phải ngẫu nhiên. Đây là thông điệp từ vũ trụ về hành trình tình cảm của bạn.\n\n🌹 **Tình trạng tình cảm hiện tại:**\nBạn đang trong giai đoạn chuẩn bị đón nhận tình yêu. Các lá bài cho thấy trái tim bạn đã sẵn sàng mở ra cho những trải nghiệm mới.\n\n🌸 **Diễn biến tình duyên những tháng tới:**\n\n💝 **Tháng ${new Date().getMonth() + 2}:** Có thể có cuộc gặp gỡ đặc biệt. Hãy chú ý đến những dấu hiệu từ vũ trụ.\n\n💕 **Tháng ${new Date().getMonth() + 3}:** Thời kỳ phát triển tình cảm mạnh mẽ. Nếu có ai đó trong lòng, đây là lúc để bày tỏ.\n\n💖 **Tháng ${new Date().getMonth() + 4}:** Cần kiên nhẫn và tin tưởng. Tình yêu đích thực đang trên đường đến.\n\n🎯 **Thông điệp từ các lá bài:**\n${selectedCards.map((card, index) => 
        `• **${card.name}:** ${card.description}`
      ).join('\n')}\n\n💫 **Lời khuyên cho tình yêu:**\n• Hãy tin tưởng vào trực giác khi chọn người yêu\n• Tham gia nhiều hoạt động để mở rộng mối quan hệ\n• Đừng quá khắt khe với tiêu chuẩn, cho tình yêu cơ hội\n• Yêu thương bản thân trước khi yêu người khác\n\n✨ Các lá bài khẳng định rằng tình yêu sẽ đến với bạn đúng thời điểm!`;
    }

    return generateLoveAnalysis();
  };

  const pickCard = async (cardIndex: number, card: any) => {
    if (pickedPositions.includes(cardIndex)) return;

    const newPickedPositions = [...pickedPositions, cardIndex];
    const newSelectedCards = [...selectedCards, card];

    setPickedPositions(newPickedPositions);
    setSelectedCards(newSelectedCards);

    const maxCards = mode === 'overview' ? 3 : mode === 'love' ? 3 : 1;

    if (newSelectedCards.length === maxCards) {
      setIsAnimating(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      generateReading(newSelectedCards);
      setPhase('reading');
      setIsAnimating(false);
    }
  };

  const generateReading = async (cards: any[]) => {
    const { token } = useAuthStore.getState();
    if (!token) {
      toast.error('Vui lòng đăng nhập để xem bài');
      return;
    }

    try {
      const userContext = {
        name: user?.name,
        hasPartner: !!partner,
        isInBreakup: !!breakupData?.isActive,
        partnerName: partner?.name || breakupData?.partnerName,
        partnerData: partner ? {
          name: partner.name,
          birthDate: partner.birthDate,
          birthTime: partner.birthTime,
          birthPlace: partner.birthPlace,
          relationship: partner.relationship,
          startDate: partner.startDate
        } : undefined,
        breakupData: breakupData?.isActive ? {
          partnerName: breakupData.partnerName,
          breakupDate: breakupData.breakupDate,
          autoDeleteDate: breakupData.autoDeleteDate
        } : undefined
      };

      const response = await fetch('/api/tarot/reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question,
          cardsDrawn: cards.map((c) => c.name),
          mode,
          userContext
        }),
      });

      if (response.ok) {
        const { interpretation } = await response.json();
        setReading(interpretation);
      } else {
        toast.error('Không thể lấy được diễn giải từ AI');
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi kết nối với AI');
    }
  };

  const generateLoveAnalysis = () => {
    if (!partner && !breakupData?.isActive) {
      return "Bạn hiện không có người phụ thuộc về mặt tình cảm. Nếu bạn vẫn muốn tiếp tục thì chúng tôi sẽ phân tích chung về mặt tình cảm của bạn một cách tổng quan và diễn biến trong những tháng tới.";
    }

    if (breakupData?.isActive) {
      return `Bạn đang trong giai đoạn hồi phục sau khi chia tay với ${breakupData.partnerName}. Các lá bài cho thấy đây là thời điểm để tự chăm sóc bản thân và lắng nghe những gì trái tim thực sự cần. Hãy kiên nhẫn, thời gian sẽ chữa lành mọi tổn thương.`;
    }

    return `Về mối quan hệ với ${partner?.name}, các lá bài chỉ ra đây là giai đoạn quan trọng trong cuộc sống tình cảm của bạn. Sự hiểu biết và giao tiếp sẽ là chìa khóa để phát triển mối quan hệ bền vững.`;
  };

  const resetReading = () => {
    setPhase('select_mode');
    setSelectedCards([]);
    setSpreadCards([]);
    setPickedPositions([]);
    setReading('');
    setQuestion('');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-950" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Tarot Huyền Bí 3D</h1>
              <p className="text-gray-400">Khám phá tương lai qua những lá bài thiêng liêng</p>
            </motion.div>

            {/* Phase: Select Mode */}
            {phase === 'select_mode' && (
              <>
                {/* Mode Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex justify-center mb-8"
                >
                  <div className="bg-gray-800/60 backdrop-blur-xl rounded-xl p-1 border border-gray-700/30">
                    <button
                      onClick={() => setMode('overview')}
                      className={`px-6 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${mode === 'overview' ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                      <Eye className="w-4 h-4 inline mr-2" />
                      Tổng quan (3 lá)
                    </button>
                    <button
                      onClick={() => setMode('question')}
                      className={`px-6 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${mode === 'question' ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                      <HelpCircle className="w-4 h-4 inline mr-2" />
                      Hỏi đáp (1 lá)
                    </button>
                    <button
                      onClick={() => setMode('love')}
                      className={`px-6 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${mode === 'love' ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                      <Heart className="w-4 h-4 inline mr-2" />
                      Tình duyên (3 lá)
                    </button>
                  </div>
                </motion.div>

                {/* Question Input */}
                <AnimatePresence>
                  {mode === 'question' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-8"
                    >
                      <div className="max-w-2xl mx-auto">
                        <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30">
                          <h3 className="text-lg font-bold text-white mb-4">Câu hỏi của bạn</h3>
                          <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Nhập câu hỏi bạn muốn được giải đáp..."
                            className="w-full h-32 px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none"
                            maxLength={500}
                          />
                          <p className="text-xs text-gray-500 mt-2">{question.length}/500 ký tự</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Start Reading Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-8"
                >
                  <Button
                    onClick={startReading}
                    disabled={isAnimating}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-lg font-medium whitespace-nowrap"
                  >
                    {isAnimating ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Đang trải bài...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Bắt đầu xem bài
                      </>
                    )}
                  </Button>
                </motion.div>
              </>
            )}

            {/* Phase: Cards Spread */}
            {phase === 'spread_cards' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <LoadingSpinner size="lg" text="Đang trải bài lên bàn..." />
              </motion.div>
            )}

            {/* Phase: Pick Cards - 3D Scene */}
            {phase === 'pick_cards' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {mode === 'overview' ? `Chọn 3 lá bài (${selectedCards.length}/3)` : mode === 'love' ? `Chọn 3 lá bài (${selectedCards.length}/3)` : `Chọn 1 lá bài (${selectedCards.length}/1)`}
                  </h3>
                  <p className="text-gray-400">Theo trực giác và chọn những lá bài gọi tên bạn</p>
                </div>

                {/* New 3D Tarot Scene */}
                <TarotSceneNew
                  cards={spreadCards}
                  selectedCards={selectedCards}
                  pickedPositions={pickedPositions}
                  onCardClick={pickCard}
                  isSelectable={true}
                  phase={phase}
                />

                {/* Selected Cards Preview */}
                {selectedCards.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 text-center"
                  >
                    <h4 className="text-lg font-semibold text-white mb-4">Lá bài đã chọn:</h4>
                    <div className="flex flex-wrap justify-center gap-4">
                      {selectedCards.map((card, index) => (
                        <motion.div
                          key={card.id}
                          initial={{ scale: 0, rotateY: 180 }}
                          animate={{ scale: 1, rotateY: 0 }}
                          transition={{ delay: index * 0.2 }}
                          className="bg-gray-800/60 backdrop-blur-xl rounded-xl p-4 border border-gray-700/30 min-w-[140px]"
                        >
                          <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-sm font-medium text-white text-center">{card.name}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Phase: Reading Results with 3D Cards */}
            {phase === 'reading' && reading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
              >
                {/* New 3D Card Reveal */}
                <div className="mb-8">
                  <CardReveal3DNew cards={selectedCards} mode={mode} />
                </div>

                <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/30 shadow-lg">
                  <div className="text-center mb-6">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                    <h3 className="text-2xl font-bold text-white">
                      {mode === 'overview' ? 'Kết Quả Xem Bài Tổng Quan' : mode === 'love' ? 'Kết Quả Xem Bài Tình Duyên' : 'Câu Trả Lời Từ Tarot'}
                    </h3>
                  </div>

                  {mode === 'love' ? (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h4 className="text-xl font-bold text-pink-400 mb-2">Phân tích tình duyên chi tiết</h4>
                        <p className="text-gray-400">Lá bài đã chọn: {selectedCards.map(c => c.name).join(', ')}</p>
                      </div>

                      <div className="bg-gray-900/30 rounded-xl p-6">
                        <h5 className="text-lg font-semibold text-white mb-3 flex items-center">
                          <div className="text-xl mr-2">💕</div>
                          Phân tích tình duyên từ AI
                        </h5>
                        <FormattedContent 
                          content={reading} 
                          className="text-gray-300 leading-relaxed" 
                        />
                      </div>

                      <div className="bg-gradient-to-r from-pink-600/20 to-red-600/20 rounded-xl p-6 border border-pink-500/30">
                        <h5 className="text-lg font-semibold text-pink-300 mb-3 flex items-center">
                          <div className="text-xl mr-2">💖</div>
                          Lời khuyên cho tình yêu
                        </h5>
                        <p className="text-pink-100 leading-relaxed">
                          {breakupData?.isActive
                            ? "Hãy dành thời gian để chữa lành và tìm lại chính mình. Tình yêu đích thực sẽ đến khi bạn sẵn sàng."
                            : partner
                            ? "Hãy trân trọng mối quan hệ hiện tại và không ngừng cố gắng hiểu nhau hơn. Kiên nhẫn và khoan dung là chìa khóa."
                            : "Hãy mở lòng để đón nhận tình yêu. Khi bạn yêu thương bản thân, bạn sẽ thu hút những điều tốt đẹp."}
                        </p>
                      </div>
                    </div>
                  ) : mode === 'overview' ? (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h4 className="text-xl font-bold text-purple-400 mb-2">Kết quả xem bài Tarot tổng quan</h4>
                        <p className="text-gray-400">Lá bài đã chọn: {selectedCards.map(c => c.name).join(', ')}</p>
                      </div>

                      <div className="bg-gray-900/30 rounded-xl p-6">
                        <h5 className="text-lg font-semibold text-white mb-3 flex items-center">
                          <div className="text-xl mr-2">🔮</div>
                          Phân tích từ AI Master Tarot
                        </h5>
                        <FormattedContent 
                          content={reading} 
                          className="text-gray-300 leading-relaxed" 
                        />
                      </div>

                      <div className="bg-pink-600/10 rounded-xl p-6 border border-pink-500/20">
                        <h5 className="text-lg font-semibold text-pink-300 mb-3 flex items-center">
                          <div className="text-xl mr-2">💕</div>
                          Góc nhìn tình duyên
                        </h5>
                        <FormattedContent 
                          content={generateGeneralLoveAnalysis()} 
                          className="text-pink-200 leading-relaxed" 
                        />
                      </div>

                      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30">
                        <h5 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
                          <div className="text-xl mr-2">✨</div>
                          Lời khuyên từ Tarot
                        </h5>
                        <p className="text-purple-100 leading-relaxed">
                          Hãy tin tưởng vào trực giác và đừng sợ đối mặt với những thay đổi cần thiết. Mỗi lá bài bạn chọn đều mang thông điệp riêng, hãy lắng nghe tiếng nói bên trong.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h4 className="text-xl font-bold text-purple-400 mb-2">Kết quả xem bài cho câu hỏi của bạn</h4>
                        <div className="bg-gray-900/50 rounded-xl p-4 mb-4">
                          <p className="text-yellow-300 font-medium">{`"${question}"`}</p>
                        </div>
                        <p className="text-gray-400">Lá bài đã chọn: {selectedCards[0].name}</p>
                      </div>

                      <div className="bg-gray-900/30 rounded-xl p-6">
                        <h5 className="text-lg font-semibold text-white mb-3 flex items-center">
                          <div className="text-xl mr-2">🔮</div>
                          Phân tích từ AI Master Tarot
                        </h5>
                        <FormattedContent 
                          content={reading} 
                          className="text-gray-300 leading-relaxed" 
                        />
                      </div>

                      <div className="bg-gray-900/30 rounded-xl p-6">
                        <h5 className="text-lg font-semibold text-white mb-3 flex items-center">
                          <div className="text-xl mr-2">💡</div>
                          Lời khuyên cụ thể
                        </h5>
                        <p className="text-gray-300 leading-relaxed">
                          {selectedCards[0].meaning}. Hãy tin tưởng vào sự lựa chọn của mình và áp dụng thông điệp này vào tình huống hiện tại.
                        </p>
                      </div>

                      <div className="bg-pink-600/10 rounded-xl p-6 border border-pink-500/20">
                        <h5 className="text-lg font-semibold text-pink-300 mb-3 flex items-center">
                          <div className="text-xl mr-2">💕</div>
                          Liên quan đến tình duyên
                        </h5>
                        <FormattedContent 
                          content={generateGeneralLoveAnalysis()} 
                          className="text-pink-200 leading-relaxed" 
                        />
                      </div>

                      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30">
                        <h5 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
                          <div className="text-xl mr-2">🌟</div>
                          Kết luận
                        </h5>
                        <p className="text-purple-100 leading-relaxed">
                          Lá bài bạn chọn không phải ngẫu nhiên. Hãy tin rằng vũ trụ đã dẫn dắt bạn đến thông điệp này vào đúng thời điểm.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={resetReading}
                      variant="secondary"
                      className="whitespace-nowrap"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Xem bài mới
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Love Confirmation Dialog */}
            <AnimatePresence>
              {showLoveConfirmDialog && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                  onClick={() => setShowLoveConfirmDialog(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-gray-800 rounded-2xl p-8 max-w-md mx-4 border border-gray-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="text-center">
                      <Heart className="w-12 h-12 mx-auto mb-4 text-pink-400" />
                      <h3 className="text-xl font-bold text-white mb-4">Thông báo</h3>
                      <p className="text-gray-300 mb-6 leading-relaxed">
                        Bạn hiện không có người phụ thuộc về mặt tình cảm. Nếu bạn vẫn muốn tiếp tục thì chúng tôi sẽ phân tích chung về mặt tình cảm của bạn một cách tổng quan và diễn biến trong những tháng tới.
                      </p>
                      <div className="flex gap-4">
                        <Button
                          onClick={() => setShowLoveConfirmDialog(false)}
                          variant="secondary"
                          className="flex-1 whitespace-nowrap"
                        >
                          Hủy bỏ
                        </Button>
                        <Button
                          onClick={confirmGeneralLoveAnalysis}
                          className="flex-1 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 whitespace-nowrap"
                        >
                          Tiếp tục
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
