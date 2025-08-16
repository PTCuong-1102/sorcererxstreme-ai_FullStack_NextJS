/**
 * Utility functions for handling breakup context in AI responses
 */

export interface UserBreakupContext {
  isInBreakup: boolean;
  breakupData?: {
    partnerName: string;
    breakupDate: string;
    autoDeleteDate: string;
    weeklyCheckDone: boolean[];
  };
}

/**
 * Get breakup context from localStorage/client-side store
 */
export function getBreakupContext(): UserBreakupContext {
  if (typeof window === 'undefined') {
    return { isInBreakup: false };
  }

  try {
    const profileStorage = localStorage.getItem('profile-storage');
    if (!profileStorage) {
      return { isInBreakup: false };
    }

    const parsed = JSON.parse(profileStorage);
    const breakupData = parsed?.state?.breakupData;

    if (breakupData && breakupData.isActive) {
      return {
        isInBreakup: true,
        breakupData: {
          partnerName: breakupData.partnerName,
          breakupDate: breakupData.breakupDate,
          autoDeleteDate: breakupData.autoDeleteDate,
          weeklyCheckDone: breakupData.weeklyCheckDone || []
        }
      };
    }

    return { isInBreakup: false };
  } catch (error) {
    console.error('Error getting breakup context:', error);
    return { isInBreakup: false };
  }
}

/**
 * Add breakup context to AI prompts for comforting responses
 */
export function addBreakupContextToPrompt(originalPrompt: string, breakupContext: UserBreakupContext): string {
  if (!breakupContext.isInBreakup || !breakupContext.breakupData) {
    return originalPrompt;
  }

  const { partnerName, breakupDate } = breakupContext.breakupData;
  const daysSinceBreakup = Math.floor(
    (new Date().getTime() - new Date(breakupDate).getTime()) / (24 * 60 * 60 * 1000)
  );

  const breakupPromptAddition = `

🌸 **QUAN TRỌNG - NGƯỜI DÙNG ĐANG TRONG GIAI ĐOẠN HỒI PHỤC:**
- Đã chia tay với ${partnerName} được ${daysSinceBreakup} ngày
- Đang trong thời kỳ chữa lành tâm hồn
- CẦN có thông điệp an ủi, động viên và hỗ trợ tinh thần
- LUÔN kết thúc với lời khuyên tích cực và hy vọng
- Tránh đề cập trực tiếp đến việc chia tay trừ khi người dùng hỏi
- Tập trung vào khía cạnh phát triển bản thân và tương lai tươi sáng

**PHONG CÁCH TRẢ LỜI KHI NGƯỜI DÙNG ĐANG HỒI PHỤC:**
- Ấm áp, đồng cảm và khuyến khích
- Nhấn mạnh sức mạnh nội tại và khả năng vượt qua
- Đưa ra lời khuyên thực tế để cải thiện tinh thần
- Kết thúc bằng thông điệp hy vọng và động lực`;

  return originalPrompt + breakupPromptAddition;
}

/**
 * Generate specific comforting messages based on reading type
 */
export function getComfortingMessage(readingType: 'tarot' | 'astrology' | 'numerology' | 'fortune' | 'chat'): string {
  const messages = {
    tarot: "🌟 Các lá bài cho thấy bạn đang trên con đường phục hồi. Hãy tin tưởng vào quá trình này - mọi khó khăn đều sẽ qua đi và bạn sẽ trở nên mạnh mẽ hơn!",
    astrology: "⭐ Các vì sao đang xếp đặt để mang đến cho bạn những cơ hội mới. Giai đoạn này chỉ là tạm thời - vũ trụ đang chuẩn bị những điều tuyệt vời cho bạn!",
    numerology: "🔢 Con số vận mệnh của bạn cho thấy sức mạnh nội tại to lớn. Bạn sinh ra để vượt qua mọi thử thách và tỏa sáng rực rỡ!",
    fortune: "🌈 Tử vi cho thấy đây chỉ là giai đoạn tạm thời trước khi bạn bước vào chu kỳ mới đầy may mắn. Hãy kiên nhẫn và tin tưởng!",
    chat: "💝 Hãy nhớ rằng bạn không đơn độc trong hành trình này. Mỗi ngày trôi qua là một bước tiến gần hơn đến phiên bản tốt nhất của chính mình!"
  };

  return messages[readingType] || messages.chat;
}