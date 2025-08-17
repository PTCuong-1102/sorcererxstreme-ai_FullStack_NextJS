'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Calendar, MapPin, Eye, Heart, Network, Home } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore, useProfileStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { FormattedContent } from '@/components/ui/FormattedContent';
import AstrologyScene3D from '@/components/astrology/AstrologyScene3D';
import HouseChart3D from '@/components/astrology/HouseChart3D';
import StarMap3D from '@/components/astrology/StarMap3D';
import toast from 'react-hot-toast';

const zodiacSigns = [
  { name: 'Bạch Dương', date: '21/3 - 19/4', element: 'Hỏa', traits: 'Năng động, dũng cảm, lãnh đạo' },
  { name: 'Kim Ngưu', date: '20/4 - 20/5', element: 'Thổ', traits: 'Bền bỉ, thực tế, đáng tin cậy' },
  { name: 'Song Tử', date: '21/5 - 20/6', element: 'Khí', traits: 'Thông minh, linh hoạt, giao tiếp' },
  { name: 'Cự Giải', date: '21/6 - 22/7', element: 'Thủy', traits: 'Nhạy cảm, chu đáo, bảo vệ' },
  { name: 'Sư Tử', date: '23/7 - 22/8', element: 'Hỏa', traits: 'Tự tin, hào phóng, sáng tạo' },
  { name: 'Xử Nữ', date: '23/8 - 22/9', element: 'Thổ', traits: 'Hoàn hảo, phân tích, tỉ mỉ' },
  { name: 'Thiên Bình', date: '23/9 - 22/10', element: 'Khí', traits: 'Cân bằng, hòa hợp, thẩm mỹ' },
  { name: 'Hổ Cáp', date: '23/10 - 21/11', element: 'Thủy', traits: 'Mạnh mẽ, bí ẩn, đam mê' },
  { name: 'Nhân Mã', date: '22/11 - 21/12', element: 'Hỏa', traits: 'Tự do, phiêu lưu, triết học' },
  { name: 'Ma Kết', date: '22/12 - 19/1', element: 'Thổ', traits: 'Kỷ luật, tham vọng, truyền thống' },
  { name: 'Bảo Bình', date: '20/1 - 18/2', element: 'Khí', traits: 'Độc lập, sáng tạo, nhân đạo' },
  { name: 'Song Ngư', date: '19/2 - 20/3', element: 'Thủy', traits: 'Trực giác, nghệ thuật, đồng cảm' }
];

const getZodiacSign = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return zodiacSigns[0];
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return zodiacSigns[1];
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return zodiacSigns[2];
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return zodiacSigns[3];
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacSigns[4];
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacSigns[5];
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return zodiacSigns[6];
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return zodiacSigns[7];
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return zodiacSigns[8];
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return zodiacSigns[9];
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return zodiacSigns[10];
  return zodiacSigns[11];
};

const AstrologyPage = () => {
  const [mode, setMode] = useState<'general' | 'love' | 'staranalysis' | 'relations'>('general');
  const [birthPlace, setBirthPlace] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [userZodiac, setUserZodiac] = useState<any>(null);
  const [showRelationChart, setShowRelationChart] = useState(false);
  const [showStarMap, setShowStarMap] = useState(false);
  const [starMapGenerated, setStarMapGenerated] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { partner, breakupData } = useProfileStore();
  const [showLoveConfirmDialog, setShowLoveConfirmDialog] = useState(false);
  const [proceedWithGeneralLove, setProceedWithGeneralLove] = useState(false);

  const analyzeChart = async () => {
    const { token } = useAuthStore.getState();
    if (!token) {
      toast.error('Vui lòng đăng nhập để xem chiêm tinh');
      return;
    }

    if (mode === 'love' && !partner && !breakupData?.isActive && !proceedWithGeneralLove) {
      handleLoveAnalysis();
      return;
    }

    if (!birthPlace.trim()) {
      toast.error('Vui lòng nhập nơi sinh của bạn');
      return;
    }

    setIsAnalyzing(true);
    setStarMapGenerated(false);
    setAnalysis('');

    const zodiac = getZodiacSign(user?.birthDate || '');
    setUserZodiac(zodiac);

    try {
      const response = await fetch('/api/astrology', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mode,
          birthDate: user?.birthDate,
          birthTime: user?.birthTime,
          birthPlace,
          userContext: {
            name: user?.name,
            birthDate: user?.birthDate,
            birthTime: user?.birthTime,
            birthPlace,
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
          }
        }),
      });

      if (response.ok) {
        const { analysis } = await response.json();
        setAnalysis(analysis);
        if (mode === 'staranalysis') {
          setShowStarMap(true);
        } else if (mode === 'relations') {
          setShowRelationChart(true);
        }
      } else {
        toast.error('Không thể lấy được phân tích từ AI');
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi kết nối với AI');
    }

    setIsAnalyzing(false);
  };

  const handleLoveAnalysis = () => {
    if (!partner && !breakupData?.isActive && !proceedWithGeneralLove) {
      setShowLoveConfirmDialog(true);
      return;
    }

    analyzeChart();
  };

  const confirmGeneralLoveAnalysis = () => {
    setProceedWithGeneralLove(true);
    setShowLoveConfirmDialog(false);
    analyzeChart();
  };

  const resetAnalysis = () => {
    setAnalysis('');
    setUserZodiac(null);
    setBirthPlace('');
    setMode('general');
    setShowRelationChart(false);
    setShowStarMap(false);
    setStarMapGenerated(false);
  };

  const handleStarMapGenerated = () => {
    console.log('Star map generated callback triggered');
    setStarMapGenerated(true);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-950 relative" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
      <AstrologyScene3D isActive={isAnalyzing || showRelationChart || showStarMap} mode={mode === 'love' ? 'love' : 'general'} />

      <Sidebar />

      <main className="flex-1 overflow-auto relative z-10">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-full flex items-center justify-center shadow-lg">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Chiêm Tinh Học 3D</h1>
              <p className="text-gray-400">Khám phá vận mệnh qua vị trí các vì sao với công nghệ 3D</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="flex justify-center mb-8"
            >
              <div className="bg-gray-800/60 backdrop-blur-xl rounded-xl p-1 border border-gray-700/30">
                <button
                  onClick={() => setMode('general')}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${mode === 'general' ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <Eye className="w-4 h-4 inline mr-2" />
                  Tổng quan
                </button>
                <button
                  onClick={() => setMode('love')}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${mode === 'love' ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <Heart className="w-4 h-4 inline mr-2" />
                  Tình duyên
                </button>
                <button
                  onClick={() => setMode('staranalysis')}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${mode === 'staranalysis' ? 'bg-gradient-to-r from-purple-600 to-blue-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <Star className="w-4 h-4 inline mr-2" />
                  Phân tích sao
                </button>
                <button
                  onClick={() => setMode('relations')}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${mode === 'relations' ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <Network className="w-4 h-4 inline mr-2" />
                  Quan hệ cung
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Thông tin sinh của bạn
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-600/20">
                    <p className="text-sm text-gray-400 mb-1">Ngày sinh</p>
                    <p className="text-white font-medium">{user?.birthDate || 'Chưa có thông tin'}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-600/20">
                    <p className="text-sm text-gray-400 mb-1">Giờ sinh</p>
                    <p className="text-white font-medium">{user?.birthTime || 'Chưa có thông tin'}</p>
                  </div>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Nơi sinh của bạn (Thành phố, Quốc gia)"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <Button
                onClick={analyzeChart}
                disabled={isAnalyzing}
                className={`${mode === 'staranalysis' ? 'bg-gradient-to-r from-purple-600 to-blue-700 hover:from-purple-700 hover:to-blue-800' : mode === 'relations' ? 'bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800' : 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800'}`}
              >
                {isAnalyzing ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    {mode === 'staranalysis' ? 'Đang tạo bản đồ sao...' : mode === 'relations' ? 'Đang tính toán quan hệ cung...' : 'Đang phân tích biểu đồ...'}
                  </>
                ) : (
                  <>
                    {mode === 'love' ? <Heart className="w-5 h-5 mr-2" /> : mode === 'staranalysis' ? <Star className="w-5 h-5 mr-2" /> : mode === 'relations' ? <Network className="w-5 h-5 mr-2" /> : <Eye className="w-5 h-5 mr-2" />}
                    {mode === 'love' ? 'Phân tích tình duyên' : mode === 'staranalysis' ? 'Phân tích bản đồ sao' : mode === 'relations' ? 'Xem sơ đồ quan hệ cung' : 'Xem biểu đồ chiêm tinh'}
                  </>
                )}
              </Button>
            </motion.div>

            <AnimatePresence>
              {showStarMap && user?.birthDate && user?.birthTime && birthPlace && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <StarMap3D
                    birthDate={user.birthDate}
                    birthTime={user.birthTime}
                    birthPlace={birthPlace}
                    userZodiac={userZodiac}
                    onMapGenerated={handleStarMapGenerated}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showRelationChart && user?.birthDate && user?.birthTime && birthPlace && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <HouseChart3D
                    birthDate={user.birthDate}
                    birthTime={user.birthTime}
                    birthPlace={birthPlace}
                    userZodiac={userZodiac}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {analysis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/30 shadow-lg">
                    <div className="text-center mb-6">
                      {mode === 'love' ? <Heart className="w-12 h-12 mx-auto mb-4 text-pink-400" /> : mode === 'staranalysis' ? <Star className="w-12 h-12 mx-auto mb-4 text-purple-400" /> : <Star className="w-12 h-12 mx-auto mb-4 text-yellow-400" />}
                      <h3 className="text-2xl font-bold text-white">
                        {mode === 'love' ? 'Phân Tích Tình Duyên' : mode === 'staranalysis' ? 'Phân Tích Bản Đồ Sao' : 'Biểu Đồ Chiêm Tinh'}
                      </h3>
                    </div>

                    <div className="prose prose-invert max-w-none">
                      <FormattedContent content={analysis} className="text-gray-300 leading-relaxed" />
                    </div>

                    <div className="flex justify-center mt-8">
                      <Button
                        onClick={resetAnalysis}
                        variant="secondary"
                        className="whitespace-nowrap"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Xem lại
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {(showRelationChart || showStarMap) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-8"
              >
                <Button
                  onClick={resetAnalysis}
                  variant="secondary"
                  className="whitespace-nowrap"
                >
                  <Star className="w-4 h-4 mr-2" />
                 Khám phá thêm
                </Button>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-bold text-white text-center mb-8">12 Cung Hoàng Đạo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {zodiacSigns.map((sign, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:bg-gray-800/60 transition-all"
                  >
                    <h3 className="text-lg font-bold text-white mb-1">{sign.name}</h3>
                    <p className="text-sm text-gray-400 mb-2">{sign.date}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-yellow-600/20 text-yellow-300 px-2 py-1 rounded-full">
                        {sign.element}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

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
  );
};

export default AstrologyPage;