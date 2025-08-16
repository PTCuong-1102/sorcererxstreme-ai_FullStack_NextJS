
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getAiResponse(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
      systemInstruction: "Bạn là một chuyên gia Tarot hàng đầu với kinh nghiệm 20 năm. Bạn có khả năng đọc và giải thích ý nghĩa sâu sắc của các lá bài Tarot. Hãy luôn đưa ra lời giải chi tiết, tâm linh và đầy cảm hứng."
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('Error getting AI response:', error);
    throw new Error('Failed to get AI response');
  }
}
