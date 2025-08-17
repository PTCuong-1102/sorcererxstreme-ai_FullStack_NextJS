'use client';

import { motion } from 'framer-motion';
import { Heart, Calendar, TrendingUp } from 'lucide-react';
import { useProfileStore } from '@/lib/store';

export function BreakupStatusBanner() {
  const { breakupData } = useProfileStore();

  if (!breakupData?.isActive) {
    return null;
  }

  const daysSinceBreakup = Math.floor(
    (new Date().getTime() - new Date(breakupData.breakupDate).getTime()) / (24 * 60 * 60 * 1000)
  );

  const daysUntilAutoDelete = Math.max(0, Math.floor(
    (new Date(breakupData.autoDeleteDate).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)
  ));

  const progressPercentage = Math.min(100, (daysSinceBreakup / 30) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-orange-600/20 to-pink-600/20 border border-orange-500/30 rounded-2xl p-6 backdrop-blur-sm mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Heart className="w-6 h-6 text-orange-400 mr-3" />
          <div>
            <h3 className="text-lg font-bold text-orange-300">Giai đoạn hồi phục</h3>
            <p className="text-sm text-orange-200">
              Đã {daysSinceBreakup} ngày kể từ khi chia tay với {breakupData.partnerName}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-orange-300">Còn {daysUntilAutoDelete} ngày</p>
          <p className="text-xs text-orange-400">để tự động xóa</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-orange-300 mb-2">
          <span>Tiến trình hồi phục</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full"
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900/50 rounded-xl p-3 text-center">
          <Calendar className="w-5 h-5 text-orange-400 mx-auto mb-1" />
          <p className="text-sm text-orange-300">Số lần check</p>
          <p className="text-lg font-bold text-white">
            {breakupData.weeklyCheckDone?.filter(Boolean).length || 0}
          </p>
        </div>
        <div className="bg-gray-900/50 rounded-xl p-3 text-center">
          <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
          <p className="text-sm text-green-300">Tình trạng</p>
          <p className="text-sm font-bold text-white">
            {progressPercentage > 80 ? 'Gần hoàn thành' : 
             progressPercentage > 50 ? 'Đang tiến bộ' : 'Bắt đầu'}
          </p>
        </div>
        <div className="bg-gray-900/50 rounded-xl p-3 text-center">
          <Heart className="w-5 h-5 text-pink-400 mx-auto mb-1" />
          <p className="text-sm text-pink-300">Hỗ trợ AI</p>
          <p className="text-sm font-bold text-white">Đang hoạt động</p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-500/30">
        <p className="text-sm text-blue-200 text-center">
          💝 Mọi lời giải từ AI sẽ bao gồm thông điệp an ủi và động viên để hỗ trợ bạn vượt qua giai đoạn này
        </p>
      </div>
    </motion.div>
  );
}