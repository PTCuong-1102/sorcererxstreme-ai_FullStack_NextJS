
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAiResponse } from '@/lib/gemini';
import { generateTarotPrompt } from '@/lib/tarot-prompts';
import { addBreakupContextToPrompt, getComfortingMessage } from '@/lib/breakup-utils';
import { extractSearchTermsAdvanced, getMultipleWikipediaContents } from '@/lib/wikipedia';
import { factCheckContent, createSourceReferences } from '@/lib/fact-checker';

const prisma = new PrismaClient();

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
// Use Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { question, cardsDrawn, mode = 'question', userContext } = await req.json();

    // Extract Wikipedia search terms using advanced logic with cards drawn
    const searchTerms = extractSearchTermsAdvanced(
      userContext, 
      'tarot', 
      { cardsDrawn }
    );
    
    // Get Wikipedia content for fact-checking
    console.log('Fetching Wikipedia content for Tarot:', searchTerms);
    const wikipediaResponses = await getMultipleWikipediaContents(searchTerms);
    const validWikipediaContents = wikipediaResponses
      .filter(response => response.content !== null)
      .map(response => response.content!);
    
    // Create Wikipedia context for AI prompt
    let wikipediaContext: any = undefined;
    if (validWikipediaContents.length > 0) {
      wikipediaContext = {
        content: validWikipediaContents.map(content => 
          `**${content.title}:**\n${content.extract}\nNguồn: ${content.url}`
        ).join('\n\n'),
        sources: validWikipediaContents.map(content => ({
          title: content.title,
          url: content.url
        }))
      };
    }

    let prompt = generateTarotPrompt(mode, question || '', cardsDrawn, userContext, wikipediaContext);
    
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
    
    // Perform fact-checking if Wikipedia context is available
    let factCheckResult: any = null;
    if (validWikipediaContents.length > 0) {
      console.log('Performing fact-check with Wikipedia sources');
      factCheckResult = factCheckContent(interpretation, validWikipediaContents);
      
      // Use the enhanced content with citations and verification
      interpretation = factCheckResult.enhancedContent;
      
      // Add source references
      const sourceReferences = createSourceReferences(factCheckResult.citations.sources);
      if (sourceReferences) {
        interpretation += `\n\n${sourceReferences}`;
      }
    }

    const reading = await prisma.tarotReading.create({
      data: {
        userId,
        question,
        cardsDrawn,
        interpretation,
      },
    });

    // Prepare response with enhanced data
    const response: any = {
      interpretation,
      readingId: reading.id
    };
    
    // Add fact-check data if available
    if (factCheckResult) {
      response.factCheck = {
        verification: factCheckResult.verification,
        sources: factCheckResult.citations.sources,
        citationCount: factCheckResult.citations.citationCount
      };
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
