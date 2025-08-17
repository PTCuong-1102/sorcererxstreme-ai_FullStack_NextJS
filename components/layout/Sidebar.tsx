
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  MessageCircle, 
  Sparkles, 
  Star, 
  Moon, 
  Hash,
  LogOut,
  User,
  Settings
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home
  },
  {
    name: 'AI Chat',
    href: '/chat',
    icon: MessageCircle
  },
  {
    name: 'Tarot',
    href: '/tarot',
    icon: Sparkles
  },
  {
    name: 'Chiêm Tinh',
    href: '/astrology',
    icon: Star
  },
  {
    name: 'Tử Vi',
    href: '/fortune',
    icon: Moon
  },
  {
    name: 'Thần Số Học',
    href: '/numerology',
    icon: Hash
  },
  {
    name: 'Hồ Sơ',
    href: '/profile',
    icon: Settings
  }
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/auth/login';
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-64 h-screen bg-gray-900/80 backdrop-blur-xl border-r border-gray-700/50 flex flex-col shadow-2xl"
      style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 via-red-600 to-orange-500 bg-clip-text text-transparent">
          SorcererXStreme
        </h1>
        <p className="text-sm text-gray-400 mt-1">Huyền thuật AI</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer",
                    isActive 
                      ? "bg-gradient-to-r from-red-600/30 to-red-700/30 text-white border border-red-500/30 shadow-lg shadow-red-500/10" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800/40"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{user?.name || 'Người dùng'}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ x: 4 }}
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-2 text-gray-400 hover:text-red-400 transition-colors w-full cursor-pointer rounded-lg hover:bg-gray-800/30"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Đăng xuất</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
