
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Calendar, Eye, RefreshCw, Heart, Star } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore, useProfileStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { FormattedContent } from '@/components/ui/FormattedContent';
import Link from 'next/link';
import { NatalChart } from '@/components/fortune/NatalChart';

const lunarCalendar = [
  { name: 'Tý', years: [1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020], animal: 'Chuột', element: 'Thủy', traits: 'Thông minh, linh hoạt, cần mẫn' },
  { name: 'Sửu', years: [1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021], animal: 'Trâu', element: 'Thổ', traits: 'Chăm chỉ, kiên nhẫn, trung thành' },
  { name: 'Dần', years: [1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022], animal: 'Hổ', element: 'Mộc', traits: 'Dũng cảm, mạnh mẽ, độc lập' },
  { name: 'Mão', years: [1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023], animal: 'Mèo', element: 'Mộc', traits: 'Nhẹ nhàng, tinh tế, thận trọng' },
  { name: 'Thìn', years: [1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024], animal: 'Rồng', element: 'Thổ', traits: 'Quyền uy, tự tin, sáng tạo' },
  { name: 'Tỵ', years: [1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025], animal: 'Rắn', element: 'Hỏa', traits: 'Khôn ngoan, bí ẩn, trực giác' },
  { name: 'Ngọ', years: [1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026], animal: 'Ngựa', element: 'Hỏa', traits: 'Năng động, tự do, nhiệt huyết' },
  { name: 'Mùi', years: [1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027], animal: 'Dê', element: 'Thổ', traits: 'Hiền lành, nghệ thuật, nhạy cảm' },
  { name: 'Thân', years: [1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028], animal: 'Khỉ', element: 'Kim', traits: 'Thông minh, linh hoạt, hài hước' },
  { name: 'Dậu', years: [1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029], animal: 'Gà', element: 'Kim', traits: 'Cần mẫn, trung thực, tỉ mỉ' },
  { name: 'Tuất', years: [1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030], animal: 'Chó', element: 'Thổ', traits: 'Trung thành, tin cậy, bảo vệ' },
  { name: 'Hợi', years: [1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031], animal: 'Heo', element: 'Thủy', traits: 'Hào phóng, chân thành, may mắn' }
];

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
  'Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc',
  'Thiên Di', 'Tật Ách', 'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ',
];

const saoChinhTinh = [
  '紫微 Tử Vi', '天機 Thiên Cơ', '太陽 Thái Dương', '武曲 Vũ Khúc',
  '天同 Thiên Đồng', '廉貞 Liêm Trinh', '天府 Thiên Phủ', '太陰 Thái Âm',
  '貪狼 Tham Lang', '巨門 Cự Môn', '天相 Thiên Tướng', '天梁 Thiên Lương',
  '七殺 Thất Sát', '破軍 Phá Quân',
];

const saoSatTinh = [
  '左輔 Tả Phụ', '右弼 Hữu Bật', '文昌 Văn Xương', '文曲 Văn Khúc',
  '祿存 Lộc Tồn', '天馬 Thiên Mã', '擎羊 Kình Dương', '陀羅 Đà La',
  '火星 Hỏa Tinh', '鈴星 Linh Tinh', '天空 Thiên Không', '地劫 Địa Kiếp',
];

const thienCan = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const diaChi = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const nguyenHanhList = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'];
const cucList = ['Thủy Nhị Cục', 'Mộc Tam Cục', 'Kim Tứ Cục', 'Thổ Ngũ Cục', 'Hỏa Lục Cục'];

export default function FortunePage() {
  const [mode, setMode] = useState<'daily' | 'tuvi' | 'love'>('daily');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fortune, setFortune] = useState('');
  const [userZodiac, setUserZodiac] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [chartData, setChartData] = useState<TuViChartData | null>(null);
  const [showChart, setShowChart] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { partner, breakupData } = useProfileStore();
  const [showLoveConfirmDialog, setShowLoveConfirmDialog] = useState(false);
  const [proceedWithGeneralLove, setProceedWithGeneralLove] = useState(false);

  const getVietnameseZodiac = (birthYear: number) => {
    return lunarCalendar.find(zodiac => zodiac.years.includes(birthYear));
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

    const cung12 = [];
    for (let i = 0; i < 12; i++) {
      const saoChinhCount = Math.floor(Math.random() * 3) + 1;
      const saoSatCount = Math.floor(Math.random() * 4) + 1;

      const randomSaoChinh = [];
      for (let j = 0; j < saoChinhCount; j++) {
        const sao = saoChinhTinh[Math.floor(Math.random() * saoChinhTinh.length)];
        if (!randomSaoChinh.includes(sao)) randomSaoChinh.push(sao);
      }

      const randomSaoSat = [];
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
    const yNghiaMap = {
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
    if (mainSao?.includes('太陽')) return 'Năng động, nhiệt tình, chiếu sáng cho người khác';
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
    const birthPlace = 'Việt Nam'; // Default birth place since it's not in user model

    const cungAnalysis = data.cung12.map(cung => {
      const saoChinhText = cung.saoChinhTinh.length > 0 ? cung.saoChinhTinh.join(', ') : 'Không có chính tinh';
      const saoSatText = cung.saoSat.length > 0 ? cung.saoSat.join(', ') : 'Không có sát tinh';

      return `**${cung.name} (${cung.cungChinh}) - Đại hạn ${cung.tuoiHan}**\n${cung.yNghia}\n\n**Chính tinh:** ${saoChinhText}\n**Sát tinh:** ${saoSatText}\n\n**Đặc điểm:** ${cung.dacDiem}\n\n**Phân tích chi tiết:** ${cung.yNghia}\n\n**Lời khuyên:** ${getTuViCungAdvice(cung.name)}`;
    }).join('\n\n');

    const analysisText = `🌟 **LÁ SỐ TỬ VI TỔNG QUAN - ${user?.name?.toUpperCase()}**\n\n📅 **Thông tin bản mệnh:**\n• Ngày sinh: ${user?.birthDate}\n• Giờ sinh: ${user?.birthTime}\n• Địa điểm: ${birthPlace}\n\n**Tứ trụ bản mệnh:**\n• Thiên can: ${data.thienCan}\n• Địa chi: ${data.diaChi}\n• Nguyên hành: ${data.nguyenHanh}\n• Cục: ${data.cuc}\n\n🏛️ **HỆ THỐNG 12 CUNG TỬ VI:**\n\n${cungAnalysis}\n\n🌟 **CÁC SAO CHÍNH TINH QUAN TRỌNG:**\n\n**紫微 Tử Vi** - Đế tinh, sao hoàng đế\nCó khí chất lãnh đạo, được mọi người kính trọng\n\n**天機 Thiên Cơ** - Sao trí tuệ\nThông minh, linh hoạt, có khả năng phân tích\n\n**太陽 Thái Dương** - Sao ánh sáng\nNăng động, nhiệt tình, chiếu sáng cho người khác\n\n💫 **PHÂN TÍCH VẬN MỆNH THEO TỬ VI:**\n\n🎭 **Tính cách theo Tử Vi:**\n${data.analysis.tinhCach}\n\n💼 **Sự nghiệp và tài lộc:**\n${data.analysis.suNghiep}\n\n💕 **Tình duyên và hôn nhân:**\n${data.analysis.tinhDuyen}\n\n🏥 **Sức khỏe:**\n${data.analysis.sucKhoe}\n\n🔮 **DỰ ĐOÁN THEO ĐẠI HẠN TỬ VI:**\n\n${data.analysis.duDoan.map((duDoan, index) => `**${index + 1}.** ${duDoan}`).join('\n')}\n\n🎯 **LỜI KHUYÊN TỪ TỬ VI:**\n\n${data.analysis.loiKhuyen.map((loi, index) => `**${index + 1}.** ${loi}`).join('\n')}\n\n🌸 **THÔNG TIN MAY MẮN:**\n• Màu sắc: ${getTuViLuckyColor(data.nguyenHanh)}\n• Số may mắn: ${getTuViLuckyNumber(data.cuc)}\n• Hướng tốt: ${getTuViLuckyDirection(data.diaChi)}\n\n✨ **THẦN CHÚ TỬ VI:**\n*"Tử Vi chiếu mệnh, vạn sự như ý. Thiện tâm thiện báo, phúc đức vô biên."*\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n**Ghi chú:** Đây là lá số Tử Vi tổng quan theo truyền thống Đông phương, dựa trên hệ thống 12 cung và các sao chính tinh.`;

    setFortune(analysisText);
  };

  const getTuViCungAdvice = (cungName: string) => {
    const adviceMap = {
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
    const colorMap = {
      'Kim': 'Trắng, Vàng kim loại',
      'Mộc': 'Xanh lá cây, Xanh lục',
      'Thủy': 'Đen, Xanh nước biển',
      'Hỏa': 'Đỏ, Cam, Hồng',
      'Thổ': 'Vàng, Nâu đất, Be',
    };
    return colorMap[nguyenHanh] || 'Trắng, Xanh';
  };

  const getTuViLuckyDirection = (diaChi: string) => {
    const directionMap = {
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
    const numberMap = {
      'Thủy Nhị Cục': '1, 2, 6',
      'Mộc Tam Cục': '3, 8, 9',
      'Kim Tứ Cục': '4, 7, 9',
      'Thổ Ngũ Cục': '5, 6, 8',
      'Hỏa Lục Cục': '2, 6, 7',
    };
    return numberMap[cuc] || '6, 8, 9';
  };

  const generateTuViFortune = async () => {
    if (!user?.birthDate || !user?.birthTime) {
      toast.error('Vui lòng cập nhật đầy đủ ngày và giờ sinh trong hồ sơ cá nhân');
      return;
    }

    setIsAnalyzing(true);
    setShowChart(false);

    const birthYear = new Date(user?.birthDate || '').getFullYear();
    const zodiac = getVietnameseZodiac(birthYear);
    setUserZodiac(zodiac);

    // Tạo lá số Tử Vi 3D
    setTimeout(() => {
      const mockChartData = generateMockTuViData();
      setChartData(mockChartData);
      setShowChart(true);

      setTimeout(() => {
        generateTuViAnalysis(mockChartData);
        setIsAnalyzing(false);
        toast.success('Đã hoàn tất tạo lá số Tử Vi chi tiết!');
      }, 2000);
    }, 3000);
  };

  const generateFortune = async () => {
    const { token } = useAuthStore.getState();
    if (!token) {
      toast.error('Vui lòng đăng nhập để xem tử vi');
      return;
    }

    if (mode === 'love' && !partner && !breakupData?.isActive && !proceedWithGeneralLove) {
      setShowLoveConfirmDialog(true);
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/fortune', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mode,
          selectedDate,
          userContext: {
            name: user?.name,
            birthDate: user?.birthDate,
            birthTime: user?.birthTime,
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
        setFortune(analysis);
        if (mode === 'tuvi') {
          setShowChart(true);
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

  const generateLoveFortuneText = (zodiac: any, today: Date, weekDays: string[], dayOfWeek: number) => {
    const loveAnalysis = partner && !breakupData?.isActive ?
      `💕 **Tình hình hiện tại với ${partner.name}:**\n\nMối quan hệ đang trong giai đoạn ${getRelationshipPhase()}. Con giáp ${zodiac?.animal} báo hiệu ${getLoveAdvice()}.` :
      breakupData?.isActive ?
        `💔 **Thời kỳ hồi phục:**\n\nBạn đang vượt qua giai đoạn khó khăn sau khi chia tay. Con giáp ${zodiac?.animal} cho thấy ${getHealingAdvice()}.` :
        `💝 **Tình duyên tổng quan:**\n\nBạn hiện đang độc thân. Con giáp ${zodiac?.animal} dự báo ${getSingleAdvice()}.`;

    return `💖 **TỬ VI TÌNH DUYÊN CHI TIẾT**\n\n🐉 **Thông tin cơ bản:**\n• Con giáp: ${zodiac?.animal} (${zodiac?.name})\n• Ngũ hành tình cảm: ${zodiac?.element}\n• Ngày xem: ${weekDays[dayOfWeek]}, ${today.toLocaleDateString('vi-VN')}\n\n${loveAnalysis}\n\n🌸 **Lời khuyên từ tử vi:**\n\n${getDetailedLoveAdvice()}\n\n✨ *"Tình yêu đến với những ai biết yêu thương chính mình trước."*`;
  };

  const generateDailyFortuneText = (zodiac: any, today: Date, weekDays: string[], dayOfWeek: number) => {
    const fortunes = [
      { overall: 'Rất tốt', description: 'Hôm nay là ngày tuyệt vời để bạn thực hiện những kế hoạch quan trọng. Vận may đang mỉm cười với bạn.', score: 9 },
      { overall: 'Tốt', description: 'Một ngày khá thuận lợi với những cơ hội tốt. Hãy tận dụng thời gian này để tiến bộ.', score: 7 },
      { overall: 'Bình thường', description: 'Ngày bình thường với những thử thách nhỏ. Hãy giữ tâm thế tích cực và kiên nhẫn.', score: 5 }
    ];

    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];

    return `🌙 **TỬ VI HÀNG NGÀY CHI TIẾT**\n\n📅 **${weekDays[dayOfWeek]}, ${today.toLocaleDateString('vi-VN')}**\n\n🐉 **Thông tin bản mệnh:**\n• Con giáp: ${zodiac?.animal} (${zodiac?.name})\n• Ngũ hành: ${zodiac?.element}\n• Đặc điểm: ${zodiac?.traits}\n\n🔮 **Vận may tổng quát: ${randomFortune.overall} (${randomFortune.score}/10)**\n${randomFortune.description}\n\n💼 **Công việc - Sự nghiệp:**\n${getCareerAdvice(zodiac)}\n\n💰 **Tài chính:**\n${getFinanceAdvice(zodiac)}\n\n🏥 **Sức khỏe:**\n${getHealthAdvice(zodiac)}\n\n💕 **Tình cảm:**\n${getLoveStatusDaily()}\n\n🎯 **Thông tin may mắn:**\n• Con số: ${Math.floor(Math.random() * 100)}\n• Màu sắc: ${getLuckyColor(zodiac)}\n• Hướng: ${['Đông', 'Tây', 'Nam', 'Bắc'][Math.floor(Math.random() * 4)]}\n\n💫 **Lời khuyên:** ${getDailyAdvice()}`;
  };

  const getRelationshipPhase = () => {
    const phases = ['phát triển tích cực', 'ổn định', 'cần quan tâm thêm'];
    return phases[Math.floor(Math.random() * phases.length)];
  };

  const getLoveAdvice = () => {
    return 'đây là thời điểm tốt để thể hiện tình cảm và chia sẻ nhiều hơn';
  };

  const getHealingAdvice = () => {
    return 'bạn cần thời gian để lành lại và sẵn sàng cho tình yêu mới';
  };

  const getSingleAdvice = () => {
    return 'tình duyên sẽ có chuyển biến tích cực trong thời gian tới';
  };

  const getDetailedLoveAdvice = () => {
    return `• Hãy lắng nghe trái tim và tin tưởng vào trực giác\n• Tạo ra những kỷ niệm đẹp và ý nghĩa\n• Kiên nhẫn và chân thành trong mọi tình huống\n• Đừng quá khắt khe với bản thân và người khác`;
  };

  const getCareerAdvice = (zodiac: any) => {
    const advices = {
      'Thìn': 'Hôm nay là ngày tuyệt vời để bạn thể hiện khả năng lãnh đạo của bạn. Các dự án quan trọng sẽ có tiến triển tích cực.',
      'Tý': 'Trí thông minh của bạn sẽ được đánh giá cao. Đây là thời điểm tốt để đưa ra những ý tưởng sáng tạo.',
    };
    return advices[zodiac?.name] || 'Sự chăm chỉ và kiên nhẫn của bạn sẽ được đền đáp xứng đáng. Hãy tiếp tục nỗ lực theo hướng tích cực.';
  };

  const getFinanceAdvice = (zodiac: any) => {
    const financeMap = {
      'Kim': 'Vận tài lộc khá thuận lợi. Có thể có những cơ hội đầu tư hoặc thu nhập bất ngờ.',
      'Thủy': 'Tài chính ổn định nhưng nên tiết kiệm và đầu tư thông minh.',
    };
    return financeMap[zodiac?.element] || 'Cần thận trọng trong việc chi tiêu. Ưu tiên những khoản đầu tư dài hạn.';
  };

  const getHealthAdvice = (zodiac: any) => {
    const healthMap = {
      'Mộc': 'Sức khỏe tốt, năng lượng dồi dào. Thích hợp cho các hoạt động thể thao và giải trí.',
      'Hỏa': 'Cần chú ý đến việc nghỉ ngơi và giảm stress. Tránh làm việc quá sức.',
    };
    return healthMap[zodiac?.element] || 'Sức khỏe ổn định. Nên duy trì chế độ ăn uống lành mạnh và tập thể dục đều đặn.';
  };

  const getLoveStatusDaily = () => {
    if (partner && !breakupData?.isActive) {
      return `Mối quan hệ với ${partner.name} đang phát triển tốt. Hôm nay là ngày tốt để thể hiện tình cảm.`;
    }
    if (breakupData?.isActive) {
      return 'Đang trong giai đoạn hồi phục. Hãy kiên nhẫn và chăm sóc bản thân.';
    }
    return 'Tình duyên có dấu hiệu tích cực. Có thể có cuộc gặp gỡ thú vị.';
  };

  const getLuckyColor = (zodiac: any) => {
    const colorMap = {
      'Kim': 'Trắng, Vàng',
      'Mộc': 'Xanh lá',
      'Thủy': 'Đen, Xanh dương',
      'Hỏa': 'Đỏ, Cam',
      'Thổ': 'Vàng, Nâu',
    };
    return colorMap[zodiac?.element] || 'Trắng, Xanh';
  };

  const getDailyAdvice = () => {
    const advices = [
      'Hãy tin tưởng vào khả năng của bản thân và luôn giữ tâm thế lạc quan.',
      'Đừng ngại thể hiện sự quan tâm đến những người xung quanh.',
      'Kiên nhẫn và chăm chỉ sẽ đưa bạn đến thành công.',
    ];
    return advices[Math.floor(Math.random() * advices.length)];
  };

  const resetFortune = () => {
    setFortune('');
    setUserZodiac(null);
    setChartData(null);
    setShowChart(false);
    setProceedWithGeneralLove(false);
  };

  const confirmGeneralLoveAnalysis = () => {
    setProceedWithGeneralLove(true);
    setShowLoveConfirmDialog(false);
    generateFortune();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-950" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg">
                <Moon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Tử Vi Huyền Thuật</h1>
              <p className="text-gray-400">Khám phá vận mệnh theo truyền thống Á Đông</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="flex justify-center mb-8"
            >
              <div className="bg-gray-800/60 backdrop-blur-xl rounded-xl p-1 border border-gray-700/30">
                <button
                  onClick={() => setMode('daily')}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${mode === 'daily' ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Tử vi ngày
                </button>
                <button
                  onClick={() => setMode('tuvi')}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${mode === 'tuvi' ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <Star className="w-4 h-4 inline mr-2" />
                  Lá số tử vi
                </button>
                <button
                  onClick={() => setMode('love')}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${mode === 'love' ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <Heart className="w-4 h-4 inline mr-2" />
                  Tình duyên
                </button>
              </div>
            </motion.div>

            {mode === 'daily' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-md mx-auto mb-8"
              >
                <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Chọn ngày xem tử vi
                  </h3>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <Button
                onClick={generateFortune}
                disabled={isAnalyzing}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-lg font-medium whitespace-nowrap"
              >
                {isAnalyzing ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    {mode === 'tuvi' ? 'Đang tạo lá số tử vi...' : 'Đang phân tích...'}
                  </>
                ) : (
                  <>
                    {mode === 'daily' && <Calendar className="w-5 h-5 mr-2" />}
                    {mode === 'tuvi' && <Star className="w-5 h-5 mr-2" />}
                    {mode === 'love' && <Heart className="w-5 h-5 mr-2" />}
                    {mode === 'daily' ? 'Xem tử vi ngày' : mode === 'tuvi' ? 'Xem lá số tử vi' : 'Xem tử vi tình duyên'}
                  </>
                )}
              </Button>
            </motion.div>

            <AnimatePresence>
              {showChart && chartData && mode === 'tuvi' && (
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
                    </div>

                    <div className="mb-6">
                      <NatalChart chartData={chartData} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {fortune && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/30 shadow-lg">
                    <div className="text-center mb-6">
                      {mode === 'love' ? (
                        <Heart className="w-12 h-12 mx-auto mb-4 text-pink-400" />
                      ) : mode === 'tuvi' ? (
                        <Star className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                      ) : (
                        <Moon className="w-12 h-12 mx-auto mb-4 text-indigo-400" />
                      )}
                      <h3 className="text-2xl font-bold text-white">
                        {mode === 'love' ? 'Tử Vi Tình Duyên' : mode === 'tuvi' ? 'Lá Số Tử Vi Chi Tiết' : 'Tử Vi Hàng Ngày'}
                      </h3>
                    </div>

                    <div className="prose prose-invert max-w-none">
                      <FormattedContent content={fortune} className="text-gray-300 leading-relaxed" />
                    </div>

                    <div className="flex justify-center gap-4 mt-8">
                      <Button
                        onClick={resetFortune}
                        variant="secondary"
                        className="whitespace-nowrap"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Xem lại
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {mode === 'tuvi' && !fortune && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-purple-600/20 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm mt-8"
              >
                <h3 className="text-lg font-bold text-purple-300 mb-3">🔮 Về Lá Số Tử Vi Chi Tiết</h3>
                <div className="text-purple-200 space-y-2 text-sm">
                  <p>• <strong>Hệ thống 12 cung truyền thống</strong> - Theo phương pháp Tử Vi cổ truyền Việt Nam</p>
                  <p>• <strong>Chính tinh và Sát tinh</strong> - Phân tích 14 chính tinh và các sát tinh quan trọng</p>
                  <p>• <strong>Đại hạn và Tiểu hạn</strong> - Xem vận mệnh theo từng giai đoạn 10 năm</p>
                  <p>• <strong>Tứ trụ mệnh lý</strong> - Thiên can, Địa chi, Nguyên hành, Cục số</p>
                  <p>• <strong>Lời giải đoán chi tiết</strong> - Tính cách, sự nghiệp, tình duyên, tài lộc</p>
                  <p>• <strong>Mô hình 3D tương tác</strong> - Click vào từng cung để xem chi tiết</p>
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

                <div className="mt-6 text-center">
                  <Button
                    onClick={generateTuViFortune}
                    disabled={!user?.birthDate || !user?.birthTime}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-lg font-medium whitespace-nowrap"
                  >
                    <Star className="w-5 h-5 mr-2" />
                    Tạo lá số Tử Vi
                  </Button>
                  {(!user?.birthDate || !user?.birthTime) && (
                    <p className="text-purple-300 text-sm mt-2">
                      Cần có đầy đủ ngày và giờ sinh để tạo lá số chính xác
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {mode === 'love' && !fortune && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-indigo-600/20 border border-indigo-500/30 rounded-xl p-6 backdrop-blur-sm mt-8"
              >
                <h3 className="text-lg font-bold text-indigo-300 mb-3">💕 Về Tử Vi Tình Duyên</h3>
                <div className="text-indigo-200 space-y-2 text-sm">
                  <p>• <strong>Phân tích cung Phu Thê</strong> - Xem tình duyên và hôn nhân</p>
                  <p>• <strong>Sao chiếu mệnh tình duyên</strong> - Các sao ảnh hưởng đến tình cảm</p>
                  <p>• <strong>Đại hạn tình duyên</strong> - Thời điểm thuận lợi cho tình yêu</p>
                  <p>• <strong>Tương thích cung mệnh</strong> - Hợp tuổi và tương khắc</p>
                  <p>• <strong>Lời khuyên tình duyên</strong> - Cách cải thiện và phát triển tình cảm</p>
                  <p>• <strong>Dự đoán tình duyên</strong> - Diễn biến tình cảm trong năm</p>
                </div>

                <div className="mt-4 pt-4 border-t border-indigo-500/20">
                  <p className="text-indigo-300 font-medium mb-2">💝 Nội dung phân tích:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-indigo-200">
                    <p>• Tính cách trong tình yêu</p>
                    <p>• Đặc điểm người yêu tương lai</p>
                    <p>• Thời điểm gặp gỡ định mệnh</p>
                    <p>• Cách giữ gìn hạnh phúc</p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Button
                    onClick={() => {
                      if (mode === 'love' && !partner && !breakupData?.isActive && !proceedWithGeneralLove) {
                        setShowLoveConfirmDialog(true);
                      } else {
                        generateFortune();
                      }
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-lg font-medium whitespace-nowrap"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Xem tử vi tình duyên
                  </Button>
                </div>
              </motion.div>
            )}
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
}
