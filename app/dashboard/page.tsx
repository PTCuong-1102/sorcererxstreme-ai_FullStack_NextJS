
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Star, 
  Moon, 
  Hash, 
  MessageCircle,
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { BreakupStatusBanner } from '@/components/ui/BreakupStatusBanner';
import Link from 'next/link';

const tools = [
  {
    name: 'AI Chat',
    description: 'Trò chuyện với AI huyền thuật',
    icon: MessageCircle,
    href: '/chat',
    color: 'from-blue-600 to-blue-700'
  },
  {
    name: 'Tarot',
    description: 'Xem bài Tarot dự đoán tương lai',
    icon: Sparkles,
    href: '/tarot',
    color: 'from-purple-600 to-purple-700'
  },
  {
    name: 'Chiêm Tinh',
    description: 'Khám phá vận mệnh qua sao',
    icon: Star,
    href: '/astrology',
    color: 'from-yellow-600 to-yellow-700'
  },
  {
    name: 'Tử Vi',
    description: 'Xem tử vi theo ngày sinh',
    icon: Moon,
    href: '/fortune',
    color: 'from-indigo-600 to-indigo-700'
  },
  {
    name: 'Thần Số Học',
    description: 'Khám phá ý nghĩa con số',
    icon: Hash,
    href: '/numerology',
    color: 'from-green-600 to-green-700'
  }
];

const stats = [
  {
    label: 'Lượt sử dụng hôm nay',
    value: '12',
    icon: TrendingUp,
    color: 'text-green-400'
  },
  {
    label: 'Công cụ yêu thích',
    value: 'Tarot',
    icon: Sparkles,
    color: 'text-purple-400'
  },
  {
    label: 'Lần cuối truy cập',
    value: 'Hôm nay',
    icon: Clock,
    color: 'text-blue-400'
  }
];

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user?.isProfileComplete) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user?.isProfileComplete) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-950" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Chào mừng trở lại, {user.name}! 🌟
            </h1>
            <p className="text-gray-400">
              Khám phá thế giới huyền bí với các công cụ AI tiên tiến
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 shadow-lg hover:shadow-red-500/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Tools Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-white mb-6">Công cụ huyền thuật</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <Link key={tool.href} href={tool.href}>
                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 shadow-lg hover:shadow-red-500/20 cursor-pointer group transition-all duration-300"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{tool.name}</h3>
                      <p className="text-gray-400 text-sm">{tool.description}</p>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <h2 className="text-xl font-bold text-white mb-6">Hoạt động gần đây</h2>
            <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 shadow-lg">
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">Chưa có hoạt động nào</p>
                <p className="text-sm text-gray-500">Bắt đầu khám phá các công cụ huyền thuật để xem lịch sử tại đây</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
