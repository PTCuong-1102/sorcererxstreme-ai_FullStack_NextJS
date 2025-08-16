
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAiResponse } from '@/lib/gemini';
import { generateChatPrompt } from '@/lib/ai-prompts';
import { addBreakupContextToPrompt, getComfortingMessage } from '@/lib/breakup-utils';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { message, userContext } = await req.json();

    // Save user message
    await prisma.chatMessage.create({
      data: {
        userId,
        content: message,
        role: 'user',
      },
    });

    // Get recent chat history for context
    const recentMessages = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { role: true, content: true }
    });

    const chatHistory = recentMessages.reverse();
    let prompt = generateChatPrompt(message, userContext || {}, chatHistory);
    
    // Add breakup context if user is in breakup recovery
    if (userContext?.isInBreakup) {
      prompt = addBreakupContextToPrompt(prompt, userContext);
    }
    
    let aiResponse = await getAiResponse(prompt);
    
    // Add comforting message if user is in breakup recovery
    if (userContext?.isInBreakup) {
      const comfortingMsg = getComfortingMessage('chat');
      aiResponse += `\n\n${comfortingMsg}`;
    }

    // Save AI response
    await prisma.chatMessage.create({
      data: {
        userId,
        content: aiResponse,
        role: 'assistant',
      },
    });

    return NextResponse.json({ response: aiResponse }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
