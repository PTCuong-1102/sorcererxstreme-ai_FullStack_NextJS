
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Eye, RefreshCw, ArrowLeft, Sun, Moon, RotateCw, Zap } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore, useProfileStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { FormattedContent } from '@/components/ui/FormattedContent';
import { NatalChart } from '@/components/fortune/NatalChart';
import Link from 'next/link';
import toast from 'react-hot-toast';

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
  analysis: {
    tinhCach: string;
    sucKhoe: string;
    tinhDuyen: string;
    suNghiep: string;
    taiLoc: string;
    duDoan: string[];
    loiKhuyen: string[];
  };
}

const cung12Names = [
  'Mệnh',
  'Phụ Mẫu',
  'Phúc Đức',
  'Điền Trạch',
  'Quan Lộc',
  'Nô Bộc',
  'Thiên Di',
  'Tật Ách',
  'Tài Bạch',
  'Tử Tức',
  'Phu Thê',
  'Huynh Đệ',
];

const saoChinhTinh = [
  '紫微 Tử Vi',
  '天機 Thiên Cơ',
  '太陽 Thái Dương',
  '武曲 Vũ Khúc',
  '天同 Thiên Đồng',
  '廉貞 Liêm Trinh',
  '天府 Thiên Phủ',
  '太陰 Thái Âm',
  '貪狼 Tham Lang',
  '巨門 Cự Môn',
  '天相 Thiên Tướng',
  '天梁 Thiên Lương',
  '七殺 Thất Sát',
  '破軍 Phá Quân',
];

const saoSatTinh = [
  '左輔 Tả Phụ',
  '右弼 Hữu Bật',
  '文昌 Văn Xương',
  '文曲 Văn Khúc',
  '祿存 Lộc Tồn',
  '天馬 Thiên Mã',
  '擎羊 Kình Dương',
  '陀羅 Đà La',
  '火星 Hỏa Tinh',
  '鈴星 Linh Tinh',
  '天空 Thiên Không',
  '地劫 Địa Kiếp',
];

const thienCan = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const diaChi = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const nguyenHanhList = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'];
const cucList = ['Thủy Nhị Cục', 'Mộc Tam Cục', 'Kim Tứ Cục', 'Thổ Ngũ Cục', 'Hỏa Lục Cục'];

export default function ComprehensiveFortunePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chartData, setChartData] = useState<TuViChartData | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [showChart, setShowChart] = useState(false);
  const [selectedCung, setSelectedCung] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuthStore();
  const { partner } = useProfileStore();

  const generateTuViChart = () => {
    if (!user?.birthDate || !user?.birthTime) {
      toast.error('Vui lòng cập nhật đầy đủ ngày và giờ sinh trong hồ sơ cá nhân');
      return;
    }

    setIsAnalyzing(true);
    setShowChart(false);

    setTimeout(() => {
      const mockChartData = generateMockTuViData();
      setChartData(mockChartData);
      setShowChart(true);
      setTimeout(() => {
        generateTuViAnalysis(mockChartData);
        setIsAnalyzing(false);
        toast.success('Đã hoàn tất lập lá số Tử Vi chi tiết!');
      }, 2000);
    }, 3000);
  };

  const generateMockTuViData = (): TuViChartData => {
    const birthYear = new Date(user?.birthDate || '').getFullYear();
    const randomThienCan = thienCan[Math.floor(Math.random() * thienCan.length)];
    const randomDiaChi = diaChi[Math.floor(Math.random() * diaChi.length)];
    const randomNguyenHanh = nguyenHanhList[Math.floor(Math.random() * nguyenHanhList.length)];
    const randomCuc = cucList[Math.floor(Math.random() * cucList.length)];

    const cungMenh = {
      name: 'Cung Mệnh',
      sao: ['紫微 Tử Vi', '天府 Thiên Phủ', '左輔 Tả Phụ'],
      tuoi: getMenhTuoi(birthYear),
      menh: `${randomThienCan} ${randomDiaChi}`,
      nghiepLuc: randomNguyenHanh,
      anCu: randomCuc,
    };

    const cung12: TuViChartData['cung12'] = [];
    for (let i = 0; i < 12; i++) {
      const saoChinhCount = Math.floor(Math.random() * 3) + 1;
      const saoSatCount = Math.floor(Math.random() * 4) + 1;

      const randomSaoChinh: string[] = [];
      for (let j = 0; j < saoChinhCount; j++) {
        const sao = saoChinhTinh[Math.floor(Math.random() * saoChinhTinh.length)];
        if (!randomSaoChinh.includes(sao)) randomSaoChinh.push(sao);
      }

      const randomSaoSat: string[] = [];
      for (let j = 0; j < saoSatCount; j++) {
        const sao = saoSatTinh[Math.floor(Math.random() * saoSatTinh.length)];
        if (!randomSaoSat.includes(sao)) randomSaoSat.push(sao);
      }

      cung12.push({
        name: cung12Names[i],
        viTri: i + 1,
        cungChinh: diaChi[i],
        saoChinhTinh: randomSaoChinh,
        saoSat: randomSaoSat,
        tuoiHan: getTuoiHan(i),
        yNghia: getCungYNghia(cung12Names[i]),
        dacDiem: getCungDacDiem(cung12Names[i], randomSaoChinh),
      });
    }

    return {
      cungMenh,
      cung12,
      thienCan: randomThienCan,
      diaChi: randomDiaChi,
      nguyenHanh: randomNguyenHanh,
      cuc: randomCuc,
      analysis: generateCungAnalysis(),
    };
  };

  const getMenhTuoi = (year: number) => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - year + 1;
    return `${age} tuổi`;
  };

  const getTuoiHan = (index: number) => {
    const baseAge = 4 + index * 10;
    return `${baseAge}-${baseAge + 9} tuổi`;
  };

  const getCungYNghia = (cungName: string) => {
    const yNghiaMap: Record<string, string> = {
      'Mệnh': 'Thể hiện tính cách, vận mệnh, sức khỏe và cuộc đời tổng quát',
      'Phụ Mẫu': 'Quan hệ với cha mẹ, gia đình, nguồn gốc xuất thân',
      'Phúc Đức': 'Tinh thần, tâm linh, phúc báo và hưởng thụ',
      'Điền Trạch': 'Nhà cửa, bất động sản, tổ ấm gia đình',
      'Quan Lộc': 'Sự nghiệp, địa vị xã hội, danh tiếng',
      'Nô Bộc': 'Bạn bè, đồng nghiệp, nhân viên, người giúp việc',
      'Thiên Di': 'Du lịch, di chuyển, thay đổi môi trường sống',
      'Tật Ách': 'Sức khỏe, bệnh tật, tai nạn, khó khăn',
      'Tài Bạch': 'Tài chính, tiền bạc, thu nhập, đầu tư',
      'Tử Tức': 'Con cái, sinh sản, thế hệ sau',
      'Phu Thê': 'Hôn nhân, tình duyên, đối tác đời sống',
      'Huynh Đệ': 'Anh chị em, bạn bè thân thiết, đối tác kinh doanh',
    };
    return yNghiaMap[cungName] || 'Ảnh hưởng đến các khía cạnh khác nhau của cuộc sống';
  };

  const getCungDacDiem = (cungName: string, saoList: string[]) => {
    const mainSao = saoList[0];
    if (mainSao?.includes('紫微')) return 'Quý tộc, lãnh đạo, có uy quyền';
    if (mainSao?.includes('天機')) return 'Thông minh, linh hoạt, hay suy nghĩ';
    if (mainSao?.includes('太陽')) return 'Năng động, nhiệt huyết, có tính lãnh đạo';
    if (mainSao?.includes('武曲')) return 'Cương quyết, có năng lực tài chính';
    if (mainSao?.includes('天同')) return 'Hiền lành, hòa thuận, được lòng người';
    if (mainSao?.includes('廉貞')) return 'Có tài năng, nhưng cần cẩn trọng';
    if (mainSao?.includes('天府')) return 'Ổn định, có phúc khí, được che chở';
    if (mainSao?.includes('太陰')) return 'Dịu dàng, nội tâm, có trực giác tốt';
    if (mainSao?.includes('貪狼')) return 'Ham học hỏi, đa tài, có duyên tình duyên';
    if (mainSao?.includes('巨門')) return 'Có tài hùng biện, nhưng dễ gây tranh cãi';
    if (mainSao?.includes('天相')) return 'Có tài phò tá, giúp đỡ người khác';
    if (mainSao?.includes('天梁')) return 'Có đức độ, được kính trọng, sống lâu';
    if (mainSao?.includes('七殺')) return 'Mạnh mẽ, quyết đoán, có khí phách';
    if (mainSao?.includes('破軍')) return 'Thích đổi mới, phá cách, có sức sáng tạo';
    return 'Có những ảnh hưởng tích cực trong cuộc sống';
  };

  const generateCungAnalysis = () => {
    return {
      tinhCach: 'Bản tính hiền lành, trung thực, có tình thương yêu với mọi người. Thích sự yên tĩnh và hài hòa. Có khả năng lãnh đạo tự nhiên nhưng không thích áp đặt.',
      sucKhoe: 'Sức khỏe tổng quan tốt, cần chú ý hệ tiêu hóa và giấc ngủ. Nên tập thể dục đều đặn và ăn uống điều độ.',
      tinhDuyen: partner ? `Mối quan hệ với ${partner.name} đang phát triển thuận lợi. Đây là thời kỳ tốt để củng cố tình cảm.` : 'Tình duyên sẽ có chuyển biến tích cực. Người phù hợp sẽ xuất hiện khi bạn sẵn sàng.',
      suNghiep: 'Thích hợp với nghề nghiệp liên quan đến giáo dục, tư vấn, y tế hoặc dịch vụ cộng đồng. Có khả năng thành công trong lĩnh vực sáng tạo.',
      taiLoc: 'Tài vận ổn định, không giàu có đột ngột nhưng cũng không thiếu thốn. Nên đầu tư bất động sản và tích lũy từ từ.',
      duDoan: [
        '3-6 tháng tới: Có cơ hội thăng tiến trong công việc',
        '6-12 tháng: Tình duyên có chuyển biến tích cực',
        '1-2 năm: Tài chính cải thiện đáng kể',
        '2-3 năm: Có thể có thay đổi lớn về nơi ở hoặc công việc',
      ],
      loiKhuyen: [
        'Hãy kiên nhẫn và không vội vàng trong mọi quyết định',
        'Tăng cường mối quan hệ với gia đình và bạn bè',
        'Đầu tư vào việc học tập và nâng cao kỹ năng',
        'Chú trọng sức khỏe tinh thần và thể chất',
      ],
    };
  };

  const generateTuViAnalysis = (data: TuViChartData) => {
    const birthPlace = 'Chưa cập nhật';

    const cungAnalysis = data.cung12.map(cung => {
      const saoChinhText = cung.saoChinhTinh.length > 0 ? cung.saoChinhTinh.join(', ') : 'Không có chính tinh';
      const saoSatText = cung.saoSat.length > 0 ? cung.saoSat.join(', ') : 'Không có sát tinh';

      return ` **${cung.name} (${cung.cungChinh}) - Đại hạn ${cung.tuoiHan}**\n${cung.yNghia}\n\n**Chính tinh:** ${saoChinhText}\n**Sát tinh:** ${saoSatText}\n\n**Đặc điểm:** ${cung.dacDiem}\n\n**Phân tích chi tiết:** ${cung.yNghia}\n\n**Lời khuyên:** ${getTuViCungAdvice(cung.name)}`;
    }).join('\n\n');

    const analysisText = ` **LÁ SỐ TỬ VI TOÀN DIỆN - ${user?.name?.toUpperCase()}**\n\n**Thông tin bản mệnh:**\n• Họ tên: ${user?.name}\n• Ngày sinh: ${user?.birthDate} \n• Giờ sinh: ${user?.birthTime}\n• Địa điểm: ${birthPlace}\n\n**Tứ trụ bản mệnh:**\n• Thiên can: ${data.thienCan}\n• Địa chi: ${data.diaChi}  \n• Nguyên hành: ${data.nguyenHanh}\n• Cục: ${data.cuc}\n\n**CUNG MỆNH - TRUNG TÂM LÁ SỐ:**\n\n**Tuổi:** ${data.cungMenh.tuoi}\n**Mệnh:** ${data.cungMenh.menh}\n**Nghiệp lực:** ${data.cungMenh.nghiepLuc}\n**An cục:** ${data.cungMenh.anCu}\n\n**Các sao trong cung Mệnh:** ${data.cungMenh.sao.join(', ')}\n\n**PHÂN TÍCH 12 CUNG CHI TIẾT:**\n\n${cungAnalysis}\n\n**PHÂN TÍCH TỔNG HỢP THEO TỬ VI:**\n\n**Tính cách bản chất:**\n${data.analysis.tinhCach}\n\n**Sức khỏe và thể trạng:**\n${data.analysis.sucKhoe}\n\n**Tình duyên và hôn nhân:**\n${data.analysis.tinhDuyen}\n\n**Sự nghiệp và địa vị:**\n${data.analysis.suNghiep}  \n\n**Tài lộc và phúc đức:**\n${data.analysis.taiLoc}\n\n**DỰ ĐOÁN THEO ĐẠI HẠN:**\n\n${data.analysis.duDoan.map((duDoan, index) => `**${index + 1}.** ${duDoan}`).join('\n')}\n\n**LỜI KHUYÊN TỪ TỬ VI:**\n\n${data.analysis.loiKhuyen.map((loi, index) => `**${index + 1}.** ${loi}`).join('\n')}\n\n**PHƯƠNG HƯỚNG PHÁT TRIỂN:**\n\n**Nghề nghiệp phù hợp:**\n• Giáo dục - giảng dạy, tư vấn học đường\n• Y tế - chăm sóc sức khỏe, điều dưỡng\n• Dịch vụ xã hội - công tác xã hội, tình nguyện\n• Nghệ thuật - âm nhạc, hội họa, văn chương\n• Kinh doanh - buôn bán nhỏ, dịch vụ\n\n**Màu sắc may mắn:** ${getTuViLuckyColor(data.nguyenHanh)}\n**Hướng may mắn:** ${getTuViLuckyDirection(data.diaChi)}\n**Số may mắn:** ${getTuViLuckyNumber(data.cuc)}\n\n**THẦN CHÚ TỬ VI:**\n\n*"Thiện tâm thiện báo, ác tâm ác báo. Tu tâm dưỡng tính, tích đức làm phúc. Thuận theo thiên mệnh, tạo ra vận may."*\n\n**Câu thần chú cá nhân:** *"Tôi sống tốt bằng tấm lòng chân thành, làm việc thiện để tạo phúc đức. Vận mệnh tốt đẹp sẽ đến với tôi."*\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n**Ghi chú quan trọng:** Lá số Tử Vi này được lập theo truyền thống Đông phương, dựa trên hệ thống 12 cung, các sao chính tinh và sát tinh. Kết quả mang tính tham khảo, bạn nên kết hợp với nỗ lực cá nhân để tạo ra cuộc sống tốt đẹp.`;

    setAnalysis(analysisText);
  };

  const getTuViCungAdvice = (cungName: string) => {
    const adviceMap: Record<string, string> = {
      'Mệnh': 'Tự tin thể hiện bản thân và phát huy điểm mạnh',
      'Phụ Mẫu': 'Hiếu thảo với cha mẹ, quan tâm gia đình',
      'Phúc Đức': 'Tu tâm dưỡng tính, làm việc thiện tạo phúc',
      'Điền Trạch': 'Đầu tư bất động sản, xây dựng tổ ấm',
      'Quan Lộc': 'Phát triển sự nghiệp, xây dựng uy tín',
      'Nô Bộc': 'Mở rộng mối quan hệ, đối xử tốt với đồng nghiệp',
      'Thiên Di': 'Chuẩn bị cho những thay đổi tích cực',
      'Tật Ách': 'Chú ý sức khỏe, phòng bệnh hơn chữa bệnh',
      'Tài Bạch': 'Quản lý tài chính khôn ngoan, đầu tư dài hạn',
      'Tử Tức': 'Quan tâm con cái, giáo dục thế hệ sau',
      'Phu Thê': 'Chân thành trong tình cảm, xây dựng hạnh phúc gia đình',
      'Huynh Đệ': 'Giữ gìn tình anh em, hỗ trợ lẫn nhau',
    };
    return adviceMap[cungName] || 'Phát triển tích cực trong lĩnh vực này';
  };

  const getTuViLuckyColor = (nguyenHanh: string) => {
    const colorMap: Record<string, string> = {
      'Kim': 'Trắng, Vàng kim loại',
      'Mộc': 'Xanh lá cây, Xanh lục',
      'Thủy': 'Đen, Xanh nước biển',
      'Hỏa': 'Đỏ, Cam, Hồng',
      'Thổ': 'Vàng, Nâu đất, Be',
    };
    return colorMap[nguyenHanh] || 'Trắng, Xanh';
  };

  const getTuViLuckyDirection = (diaChi: string) => {
    const directionMap: Record<string, string> = {
      'Tý': 'Bắc',
      'Sửu': 'Đông Bắc',
      'Dần': 'Đông Bắc',
      'Mão': 'Đông',
      'Thìn': 'Đông Nam',
      'Tỵ': 'Đông Nam',
      'Ngọ': 'Nam',
      'Mùi': 'Tây Nam',
      'Thân': 'Tây Nam',
      'Dậu': 'Tây',
      'Tuất': 'Tây Bắc',
      'Hợi': 'Tây Bắc',
    };
    return directionMap[diaChi] || 'Đông';
  };

  const getTuViLuckyNumber = (cuc: string) => {
    const numberMap: Record<string, string> = {
      'Thủy Nhị Cục': '1, 2, 6',
      'Mộc Tam Cục': '3, 8, 9',
      'Kim Tứ Cục': '4, 7, 9',
      'Thổ Ngũ Cục': '5, 6, 8',
      'Hỏa Lục Cục': '2, 6, 7',
    };
    return numberMap[cuc] || '6, 8, 9';
  };

  const resetAnalysis = () => {
    setChartData(null);
    setAnalysis('');
    setShowChart(false);
    setSelectedCung(null);
  };

  useEffect(() => {
    // Remove auto rotation effect - keep chart static for better readability
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-950" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center mb-8"
            >
              <Link href="/fortune">
                <Button variant="secondary" className="mr-4 whitespace-nowrap">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>
              </Link>
              <div className="text-center flex-1">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center shadow-lg">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Lá Số Tử Vi Đông Phương</h1>
                <p className="text-gray-400">Phân tích vận mệnh theo 12 cung và hệ thống sao Tử Vi truyền thống</p>
              </div>
            </motion.div>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-8"
            >
              <Button
                onClick={generateTuViChart}
                disabled={isAnalyzing}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-lg font-medium whitespace-nowrap"
              >
                {isAnalyzing ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Đang lập lá số Tử Vi...
                  </>
                ) : (
                  <>
                    <Star className="w-5 h-5 mr-2" />
                    Lập lá số Tử Vi truyền thống
                  </>
                )}
              </Button>
            </motion.div>

            {/* Advanced Loading Animation */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center mb-8"
                >
                  <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/30">
                    <div className="flex flex-col items-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="relative mb-6"
                      >
                        <div className="w-24 h-24 border-4 border-purple-500/30 border-t-purple-500 rounded-full"></div>
                        <div className="absolute top-2 left-2 w-20 h-20 border-4 border-red-500/30 border-r-red-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
                        <Star className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-yellow-400" />
                      </motion.div>

                      <h3 className="text-xl font-bold text-white mb-2">Đang lập lá số Tử Vi truyền thống...</h3>
                      <p className="text-gray-400 text-center mb-6">
                        🔮 Tính toán 12 cung theo hệ thống Đông phương<br />
                        ⭐ Xác định vị trí các sao chính tinh và sát tinh<br />
                        📊 Phân tích đại hạn và tiểu hạn<br />
                        📝 Tạo lời giải đoán chi tiết
                      </p>

                      <div className="w-full max-w-md">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                          <span>Tiến độ</span>
                          <span>85%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 to-red-500"
                            animate={{ width: ["0%", "100%"] }}
                            transition={{ duration: 4, ease: "easeInOut" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tử Vi Chart Display */}
            <AnimatePresence>
              {showChart && chartData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/30 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-white flex items-center">
                        <Star className="w-6 h-6 mr-2 text-purple-400" />
                        Lá Số Tử Vi 12 Cung
                      </h3>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSelectedCung(null)}
                          className="px-3 py-2 bg-gray-800/80 hover:bg-gray-700/80 rounded-lg border border-gray-600/50 text-white text-sm font-medium transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Làm mới
                        </button>
                      </div>
                    </div>

                    {/* Static chart - no rotation */}
                    <div className="mb-6">
                      <NatalChart chartData={chartData} />
                    </div>

                    {/* Cung Selection Panel */}
                    <div className="mt-6">
                      <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                        <Star className="w-5 h-5 mr-2 text-yellow-400" />
                        Chọn Cung Để Phân Tích Chi Tiết
                      </h4>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {chartData.cung12.map((cung, index) => (
                          <motion.button
                            key={index}
                            onClick={() => setSelectedCung(selectedCung === cung.name ? null : cung.name)}
                            className={`bg-gray-800/60 hover:bg-gray-700/60 rounded-lg p-4 border transition-all cursor-pointer ${
                              selectedCung === cung.name
                                ? 'border-yellow-400 shadow-lg ring-2 ring-yellow-400/30'
                                : 'border-gray-600/30 hover:border-gray-500/50'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="flex flex-col items-center">
                              <h5 className="text-white font-bold text-sm mb-2">{cung.name}</h5>
                              <p className="text-xs text-gray-400 mb-2">({cung.cungChinh})</p>
                              <div className="text-xs text-gray-300 text-center">
                                <p className="mb-1">{cung.tuoiHan}</p>
                                <div className="text-xs">
                                  {cung.saoChinhTinh.slice(0, 1).map(sao => (
                                    <p key={sao} className="text-yellow-400">{sao}</p>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>

                      {/* Selected Cung Detail */}
                      <AnimatePresence>
                        {selectedCung && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 bg-gradient-to-r from-purple-600/20 to-red-600/20 rounded-xl p-4 border border-purple-500/30"
                          >
                            {(() => {
                              const cung = chartData.cung12.find(c => c.name === selectedCung);
                              if (!cung) return null;

                              return (
                                <div>
                                  <h5 className="text-lg font-bold text-white mb-3 flex items-center">
                                    <Star className="w-5 h-5 mr-2 text-yellow-400" />
                                    {cung.name} ({cung.cungChinh}) - Chi Tiết
                                  </h5>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="text-purple-300 font-medium mb-1">Đại hạn:</p>
                                      <p className="text-white">{cung.tuoiHan}</p>
                                    </div>
                                    <div>
                                      <p className="text-purple-300 font-medium mb-1">Ý nghĩa:</p>
                                      <p className="text-gray-300">{cung.yNghia}</p>
                                    </div>
                                    <div>
                                      <p className="text-purple-300 font-medium mb-1">Chính tinh:</p>
                                      <p className="text-yellow-300">{cung.saoChinhTinh.join(', ') || 'Không có'}</p>
                                    </div>
                                    <div>
                                      <p className="text-purple-300 font-medium mb-1">Sát tinh:</p>
                                      <p className="text-red-300">{cung.saoSat.join(', ') || 'Không có'}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                      <p className="text-purple-300 font-medium mb-1">Đặc điểm:</p>
                                      <p className="text-gray-300 leading-relaxed">{cung.dacDiem}</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Comprehensive Analysis Results */}
            <AnimatePresence>
              {analysis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/30 shadow-lg">
                    <div className="text-center mb-6">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 360],
                        }}
                        transition={{
                          scale: { duration: 2, repeat: Infinity },
                          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        }}
                      >
                        <Star className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white">Lá Số Tử Vi Truyền Thống</h3>
                      <p className="text-gray-400 mt-2">Phân tích chi tiết theo hệ thống 12 cung Đông phương</p>
                    </div>

                    <div className="prose prose-invert max-w-none">
                      <FormattedContent content={analysis} className="text-gray-300 leading-relaxed" />
                    </div>

                    <div className="flex justify-center gap-4 mt-8">
                      <Button
                        onClick={resetAnalysis}
                        variant="secondary"
                        className="whitespace-nowrap"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Lập lại lá số
                      </Button>

                      <Button
                        onClick={() => window.print()}
                        className="bg-green-600 hover:bg-green-700 whitespace-nowrap"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        In kết quả
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced Instructions */}
            {!analysis && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-purple-600/20 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm"
              >
                <h3 className="text-lg font-bold text-purple-300 mb-3">🔮 Về Lá Số Tử Vi Đông Phương</h3>
                <div className="text-purple-200 space-y-2 text-sm">
                  <p>• <strong>Hệ thống 12 cung truyền thống</strong> - Theo phương pháp Tử Vi cổ truyền Việt Nam</p>
                  <p>• <strong>Chính tinh và Sát tinh</strong> - Phân tích 14 chính tinh và các sát tinh quan trọng</p>
                  <p>• <strong>Đại hạn và Tiểu hạn</strong> - Xem vận mệnh theo từng giai đoạn 10 năm</p>
                  <p>• <strong>Tứ trụ mệnh lý</strong> - Thiên can, Địa chi, Nguyên hành, Cục số</p>
                  <p>• <strong>Lời giải đoán chi tiết</strong> - Tính cách, sự nghiệp, tình duyên, tài lộc</p>
                  <p>• Cần có <strong>giờ sinh chính xác</strong> để lập lá số đúng</p>
                </div>

                <div className="mt-4 pt-4 border-t border-purple-500/20">
                  <p className="text-purple-300 font-medium mb-2">✨ Khác biệt với Chiêm tinh phương Tây:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-purple-200">
                    <p>• Dựa trên âm lịch và địa chi</p>
                    <p>• Hệ thống 12 cung theo truyền thống</p>
                    <p>• Các sao Tử Vi độc đáo</p>
                    <p>• Phương pháp giải đoán Á Đông</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
