
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Info } from 'lucide-react';

interface TuViChartData {
  cungMenh: {
    name: string;
    sao: string[];
    tuoi: string;
    menh: string;
    nghiepLuc: string;
    anCu: string;
  };
  cung12: Array<{
    name: string;
    viTri: number;
    cungChinh: string;
    saoChinhTinh: string[];
    saoSat: string[];
    tuoiHan: string;
    yNghia: string;
    dacDiem: string;
  }>;
  thienCan: string;
  diaChi: string;
  nguyenHanh: string;
  cuc: string;
}

interface NatalChartProps {
  chartData: TuViChartData;
}

// Vị trí 12 cung theo lá số Tử Vi truyền thống (hình vuông)
const cungPositions = [
  { name: 'Tỵ', row: 0, col: 0 }, // Tỵ - góc trên trái
  { name: 'Ngọ', row: 0, col: 1 }, // Ngọ - trên giữa
  { name: 'Mùi', row: 0, col: 2 }, // Mùi - trên phải
  { name: 'Thân', row: 0, col: 3 }, // Thân - góc trên phải
  
  { name: 'Thìn', row: 1, col: 0 }, // Thìn - trái giữa
  { name: 'Dậu', row: 1, col: 3 }, // Dậu - phải giữa
  
  { name: 'Mão', row: 2, col: 0 }, // Mão - trái giữa
  { name: 'Tuất', row: 2, col: 3 }, // Tuất - phải giữa
  
  { name: 'Dần', row: 3, col: 0 }, // Dần - góc dưới trái
  { name: 'Sửu', row: 3, col: 1 }, // Sửu - dưới giữa
  { name: 'Tý', row: 3, col: 2 }, // Tý - dưới phải
  { name: 'Hợi', row: 3, col: 3 }, // Hợi - góc dưới phải
];

const cungMapping = {
  0: 'Tỵ', 1: 'Ngọ', 2: 'Mùi', 3: 'Thân',
  4: 'Thìn', 5: 'Dậu', 6: 'Mão', 7: 'Tuất', 
  8: 'Dần', 9: 'Sửu', 10: 'Tý', 11: 'Hợi'
};

export const NatalChart = ({ chartData }: NatalChartProps) => {
  const [selectedCung, setSelectedCung] = useState<string | null>(null);
  const [hoveredCung, setHoveredCung] = useState<string | null>(null);

  const getCungByPosition = (row: number, col: number) => {
    const position = cungPositions.find(p => p.row === row && p.col === col);
    if (!position) return null;

    // Tìm cung tương ứng với địa chi
    const cungData = chartData.cung12.find(c => c.cungChinh === position.name);
    return cungData;
  };

  const renderCungCell = (row: number, col: number) => {
    const cung = getCungByPosition(row, col);
    const isCenter = (row === 1 || row === 2) && (col === 1 || col === 2);
    
    if (isCenter) {
      // Khu vực trung tâm hiển thị thông tin tứ trụ
      if (row === 1 && col === 1) {
        return (
          <div className="bg-gradient-to-br from-purple-900/40 to-red-900/40 border-2 border-purple-500/50 rounded-lg p-3 h-full flex flex-col justify-center items-center">
            <h4 className="text-purple-300 font-bold text-sm mb-2">TỨ TRỤ</h4>
            <div className="text-center space-y-1">
              <p className="text-white text-xs">{chartData.thienCan} {chartData.diaChi}</p>
              <p className="text-yellow-300 text-xs">{chartData.nguyenHanh}</p>
              <p className="text-purple-300 text-xs">{chartData.cuc}</p>
            </div>
          </div>
        );
      } else if (row === 1 && col === 2) {
        return (
          <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-2 border-yellow-500/50 rounded-lg p-3 h-full flex flex-col justify-center items-center">
            <h4 className="text-yellow-300 font-bold text-sm mb-2">CUNG MỆNH</h4>
            <div className="text-center space-y-1">
              <p className="text-white text-xs font-semibold">{chartData.cungMenh.tuoi}</p>
              <p className="text-yellow-300 text-xs">{chartData.cungMenh.menh}</p>
              <div className="text-xs">
                {chartData.cungMenh.sao.slice(0, 2).map((sao, i) => (
                  <p key={i} className="text-red-300">{sao}</p>
                ))}
              </div>
            </div>
          </div>
        );
      } else if (row === 2 && col === 1) {
        return (
          <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-2 border-blue-500/50 rounded-lg p-3 h-full flex flex-col justify-center items-center">
            <h4 className="text-blue-300 font-bold text-sm mb-2">NGUYÊN HÀNH</h4>
            <div className="text-center">
              <p className="text-white text-sm font-bold">{chartData.nguyenHanh}</p>
              <p className="text-blue-300 text-xs mt-1">{chartData.cuc}</p>
            </div>
          </div>
        );
      } else if (row === 2 && col === 2) {
        return (
          <div className="bg-gradient-to-br from-green-900/40 to-teal-900/40 border-2 border-green-500/50 rounded-lg p-3 h-full flex flex-col justify-center items-center">
            <h4 className="text-green-300 font-bold text-sm mb-2">NGHIỆP LỰC</h4>
            <div className="text-center">
              <p className="text-white text-sm">{chartData.cungMenh.nghiepLuc}</p>
              <p className="text-green-300 text-xs mt-1">{chartData.cungMenh.anCu}</p>
            </div>
          </div>
        );
      }
      return null;
    }

    if (!cung) return null;

    const isSelected = selectedCung === cung.name;
    const isHovered = hoveredCung === cung.name;

    return (
      <motion.div
        key={`${row}-${col}`}
        className={`relative border-2 rounded-lg p-2 h-full cursor-pointer transition-all ${
          isSelected
            ? 'border-yellow-400 bg-yellow-400/20 shadow-lg'
            : isHovered
            ? 'border-purple-400/80 bg-purple-400/10'
            : 'border-gray-600/50 bg-gray-800/30 hover:border-gray-500/70 hover:bg-gray-800/50'
        }`}
        onClick={() => setSelectedCung(isSelected ? null : cung.name)}
        onMouseEnter={() => setHoveredCung(cung.name)}
        onMouseLeave={() => setHoveredCung(null)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Tên cung và địa chi */}
        <div className="text-center mb-1">
          <h4 className="text-white font-bold text-xs">{cung.name}</h4>
          <p className="text-purple-300 text-xs">({cung.cungChinh})</p>
        </div>

        {/* Đại hạn */}
        <div className="text-center mb-2">
          <p className="text-yellow-300 text-xs font-medium">{cung.tuoiHan}</p>
        </div>

        {/* Chính tinh */}
        <div className="space-y-1 mb-2">
          {cung.saoChinhTinh.slice(0, 2).map((sao, index) => (
            <div key={index} className="flex items-center justify-center">
              <Star className="w-2 h-2 text-red-400 mr-1" />
              <p className="text-red-300 text-xs text-center">{sao}</p>
            </div>
          ))}
          {cung.saoChinhTinh.length > 2 && (
            <p className="text-red-400 text-xs text-center">+{cung.saoChinhTinh.length - 2} sao</p>
          )}
        </div>

        {/* Sát tinh */}
        <div className="space-y-1">
          {cung.saoSat.slice(0, 2).map((sao, index) => (
            <p key={index} className="text-green-300 text-xs text-center">{sao}</p>
          ))}
          {cung.saoSat.length > 2 && (
            <p className="text-green-400 text-xs text-center">+{cung.saoSat.length - 2}</p>
          )}
        </div>

        {/* Indicator for selected */}
        {isSelected && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <Info className="w-2 h-2 text-black" />
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Lá số Tử Vi truyền thống - hình vuông 4x4 */}
      <div className="grid grid-cols-4 gap-2 aspect-square mb-6">
        {[0, 1, 2, 3].map(row => (
          [0, 1, 2, 3].map(col => (
            <div key={`${row}-${col}`} className="aspect-square">
              {renderCungCell(row, col)}
            </div>
          ))
        ))}
      </div>

      {/* Legend và hướng dẫn */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/30">
          <h4 className="text-white font-bold mb-2 flex items-center">
            <Star className="w-4 h-4 text-red-400 mr-2" />
            Chính Tinh
          </h4>
          <p className="text-red-300 text-sm">14 sao chủ đạo theo Tử Vi</p>
        </div>
        
        <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/30">
          <h4 className="text-white font-bold mb-2 flex items-center">
            <Star className="w-4 h-4 text-green-400 mr-2" />
            Sát Tinh
          </h4>
          <p className="text-green-300 text-sm">Các sao hỗ trợ và can thiệp</p>
        </div>

        <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/30">
          <h4 className="text-white font-bold mb-2 flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-2" />
            Đại Hạn
          </h4>
          <p className="text-yellow-300 text-sm">Giai đoạn 10 năm mỗi cung</p>
        </div>
      </div>

      {/* Chi tiết cung được chọn */}
      <AnimatePresence>
        {selectedCung && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-xl p-6 border border-yellow-500/30"
          >
            {(() => {
              const cung = chartData.cung12.find(c => c.name === selectedCung);
              if (!cung) return null;

              return (
                <div>
                  <h5 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-400" />
                    {cung.name} ({cung.cungChinh}) - Chi Tiết
                  </h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h6 className="text-yellow-300 font-medium mb-2">Thông tin cơ bản:</h6>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-300"><span className="text-white font-medium">Đại hạn:</span> {cung.tuoiHan}</p>
                        <p className="text-gray-300"><span className="text-white font-medium">Địa chi:</span> {cung.cungChinh}</p>
                        <p className="text-gray-300"><span className="text-white font-medium">Ý nghĩa:</span> {cung.yNghia}</p>
                      </div>
                    </div>

                    <div>
                      <h6 className="text-yellow-300 font-medium mb-2">Hệ thống sao:</h6>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-red-300 font-medium">Chính tinh:</p>
                          <p className="text-gray-300 ml-2">{cung.saoChinhTinh.join(', ') || 'Không có'}</p>
                        </div>
                        <div>
                          <p className="text-green-300 font-medium">Sát tinh:</p>
                          <p className="text-gray-300 ml-2">{cung.saoSat.join(', ') || 'Không có'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-yellow-500/30">
                    <h6 className="text-yellow-300 font-medium mb-2">Đặc điểm và ảnh hưởng:</h6>
                    <p className="text-gray-300 leading-relaxed">{cung.dacDiem}</p>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mt-6">
        <p className="text-gray-400 text-sm">
          💡 Click vào từng cung để xem phân tích chi tiết theo hệ thống Tử Vi truyền thống
        </p>
      </div>
    </div>
  );
};
