
import { NextResponse } from 'next/server';
import { getAiResponse } from '@/lib/gemini';
import { generateFortunePrompt } from '@/lib/ai-prompts';
import { addBreakupContextToPrompt, getComfortingMessage } from '@/lib/breakup-utils';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
// Use Node.js runtime for better compatibility
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { mode, selectedDate, userContext } = await req.json();

    const fullUserContext = {
      ...userContext,
      selectedDate
    };

    let prompt = generateFortunePrompt(mode as 'comprehensive' | 'daily' | 'yearly', fullUserContext);
    
    // Add breakup context if user is in breakup recovery
    if (fullUserContext?.isInBreakup) {
      prompt = addBreakupContextToPrompt(prompt, fullUserContext);
    }
    
    let analysis = await getAiResponse(prompt);
    
    // Add comforting message if user is in breakup recovery
    if (fullUserContext?.isInBreakup) {
      const comfortingMsg = getComfortingMessage('fortune');
      analysis += `\n\n${comfortingMsg}`;
    }

    return NextResponse.json({ analysis }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
