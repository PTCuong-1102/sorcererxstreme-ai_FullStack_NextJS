
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAiResponse } from '@/lib/gemini';
import { generateTarotPrompt } from '@/lib/tarot-prompts';
import { addBreakupContextToPrompt, getComfortingMessage } from '@/lib/breakup-utils';

const prisma = new PrismaClient();

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { question, cardsDrawn, mode = 'question', userContext } = await req.json();

    let prompt = generateTarotPrompt(mode, question || '', cardsDrawn, userContext);
    
    // Add breakup context if user is in breakup recovery
    if (userContext?.isInBreakup) {
      prompt = addBreakupContextToPrompt(prompt, userContext);
    }

    let interpretation = await getAiResponse(prompt);
    
    // Add comforting message if user is in breakup recovery
    if (userContext?.isInBreakup) {
      const comfortingMsg = getComfortingMessage('tarot');
      interpretation += `\n\n${comfortingMsg}`;
    }

    const reading = await prisma.tarotReading.create({
      data: {
        userId,
        question,
        cardsDrawn,
        interpretation,
      },
    });

    return NextResponse.json({ interpretation }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
