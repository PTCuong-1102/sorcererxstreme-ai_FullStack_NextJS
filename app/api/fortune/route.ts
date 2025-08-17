
import { NextResponse } from 'next/server';
import { getAiResponse } from '@/lib/gemini';
import { generateFortunePrompt } from '@/lib/ai-prompts';
import { addBreakupContextToPrompt, getComfortingMessage } from '@/lib/breakup-utils';
import { extractSearchTermsAdvanced, getMultipleWikipediaContents } from '@/lib/wikipedia';
import { factCheckContent, createSourceReferences } from '@/lib/fact-checker';

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
    
    // Extract Wikipedia search terms using advanced logic for fortune/tử vi
    const searchTerms = extractSearchTermsAdvanced(
      fullUserContext, 
      'fortune',
      { mode, selectedDate }
    );
    
    // Get Wikipedia content for fact-checking
    console.log('Fetching Wikipedia content for fortune:', searchTerms);
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

    let prompt = generateFortunePrompt(mode as 'comprehensive' | 'daily' | 'yearly', fullUserContext, wikipediaContext);
    
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
    
    // Perform fact-checking if Wikipedia context is available
    let factCheckResult: any = null;
    if (validWikipediaContents.length > 0) {
      console.log('Performing fact-check with Wikipedia sources for fortune');
      factCheckResult = factCheckContent(analysis, validWikipediaContents);
      
      // Use the enhanced content with citations and verification
      analysis = factCheckResult.enhancedContent;
      
      // Add source references
      const sourceReferences = createSourceReferences(factCheckResult.citations.sources);
      if (sourceReferences) {
        analysis += `\n\n${sourceReferences}`;
      }
    }

    // Prepare response with enhanced data
    const response: any = { analysis };
    
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
