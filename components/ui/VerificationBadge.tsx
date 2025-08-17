'use client';

import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';

export interface VerificationResult {
  score: number | 'Không xác định';
  level: 'Cao' | 'Trung bình' | 'Thấp' | 'Không xác định';
  details?: string;
}

export interface VerificationBadgeProps {
  verification: VerificationResult;
  sources?: Array<{
    title: string;
    url: string;
    used: boolean;
  }>;
  citationCount?: number;
  className?: string;
}

export const VerificationBadge = ({ 
  verification, 
  sources = [], 
  citationCount = 0,
  className = '' 
}: VerificationBadgeProps) => {
  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'Cao':
        return {
          bg: 'bg-green-900/30',
          border: 'border-green-500/50',
          text: 'text-green-300',
          icon: 'text-green-400'
        };
      case 'Trung bình':
        return {
          bg: 'bg-yellow-900/30',
          border: 'border-yellow-500/50',
          text: 'text-yellow-300',
          icon: 'text-yellow-400'
        };
      case 'Thấp':
        return {
          bg: 'bg-orange-900/30',
          border: 'border-orange-500/50',
          text: 'text-orange-300',
          icon: 'text-orange-400'
        };
      default:
        return {
          bg: 'bg-gray-900/30',
          border: 'border-gray-500/50',
          text: 'text-gray-300',
          icon: 'text-gray-400'
        };
    }
  };

  const getIcon = (level: string) => {
    switch (level) {
      case 'Cao':
        return CheckCircle;
      case 'Trung bình':
      case 'Thấp':
        return AlertTriangle;
      default:
        return HelpCircle;
    }
  };

  const colors = getBadgeColor(verification.level);
  const IconComponent = getIcon(verification.level);
  const usedSources = sources.filter(s => s.used);

  return (
    <motion.div 
      className={`verification-badge rounded-lg border backdrop-blur-sm ${colors.bg} ${colors.border} ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <IconComponent className={`w-5 h-5 ${colors.icon}`} />
            <span className="text-sm font-medium text-white">
              Độ xác thực
            </span>
          </div>
          <div className={`text-sm font-bold ${colors.text}`}>
            {typeof verification.score === 'number' 
              ? `${verification.score}%`
              : verification.score}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors.bg} ${colors.text}`}>
              {verification.level}
            </span>
            {citationCount > 0 && (
              <span className="text-xs text-gray-400">
                {citationCount} trích dẫn
              </span>
            )}
          </div>
          
          {verification.details && (
            <p className="text-xs text-gray-400 leading-relaxed">
              {verification.details}
            </p>
          )}
        </div>
        
        {sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>
                Nguồn: {usedSources.length}/{sources.length} Wikipedia
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>Đã xác thực</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export interface SourceReferencesProps {
  sources: Array<{
    title: string;
    url: string;
    used: boolean;
  }>;
  className?: string;
}

export const SourceReferences = ({ sources, className = '' }: SourceReferencesProps) => {
  const usedSources = sources.filter(s => s.used);
  
  if (usedSources.length === 0) {
    return null;
  }
  
  return (
    <motion.div 
      className={`source-references mt-6 p-4 bg-slate-900/30 border border-slate-600/30 rounded-lg backdrop-blur-sm ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
        Nguồn tham khảo
      </h4>
      <ul className="space-y-2">
        {usedSources.map((source, index) => (
          <li key={index} className="flex items-start space-x-2">
            <span className="text-xs text-blue-400 font-mono mt-0.5">
              [{index + 1}]
            </span>
            <a 
              href={source.url}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-gray-300 hover:text-blue-300 transition-colors flex-1 leading-relaxed hover:underline"
            >
              {source.title} - Wikipedia
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};
