
'use client';

import { VerificationBadge, SourceReferences, VerificationResult } from './VerificationBadge';

interface FormattedContentProps {
  content: string;
  className?: string;
  // Enhanced props for fact-checking
  factCheck?: {
    verification: VerificationResult;
    sources: Array<{
      title: string;
      url: string;
      used: boolean;
    }>;
    citationCount: number;
  };
  showVerification?: boolean;
}

export const FormattedContent = ({ 
  content, 
  className = '', 
  factCheck,
  showVerification = true 
}: FormattedContentProps) => {
  // Parse content để tách các phần khác nhau
  const parseContent = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let listItems: string[] = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Skip empty lines or separator lines
      if (trimmedLine === '' || trimmedLine.match(/^━+$/)) {
        if (elements.length > 0) {
          elements.push(<div key={`space-${index}`} className="h-2" />);
        }
        return;
      }
      
      // Headers với **TEXT** (standalone headers)
      if (trimmedLine.match(/^\*\*([^*]+)\*\*:?\s*$/)) {
        // Flush any pending list items
        if (listItems.length > 0) {
          elements.push(
            <ul key={`list-${index}`} className="list-disc list-inside space-y-1 mb-4 text-gray-300 ml-4">
              {listItems.map((item, i) => (
                <li key={i} className="text-gray-300" dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          );
          listItems = [];
        }
        
        const headerText = trimmedLine.replace(/^\*\*([^*]+)\*\*:?\s*$/, '$1');
        elements.push(
          <h3 key={index} className="text-lg font-bold text-white mb-3 mt-6 first:mt-0">
            {headerText}
          </h3>
        );
        return;
      }
      
      // Subheaders với emoji (bắt đầu bằng emoji hoặc có emoji trong tiêu đề)
      if (trimmedLine.match(/^[🔮💫✨🌟💖💕🎯⚠️📊💡🌈🎨🏆🌸🌹🌺🌻💝🐉💼💰🏥🎭🎪🌙📅🔢💎🍀🌊🔥⭐📍🕐🌍]/)) {
        if (listItems.length > 0) {
          elements.push(
            <ul key={`list-${index}`} className="list-disc list-inside space-y-1 mb-4 text-gray-300 ml-4">
              {listItems.map((item, i) => (
                <li key={i} className="text-gray-300" dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          );
          listItems = [];
        }
        
        // Remove ** from emoji headers
        const cleanedLine = trimmedLine.replace(/\*\*([^*]+)\*\*/g, '$1');
        
        elements.push(
          <h4 key={index} className="text-md font-semibold text-purple-300 mb-2 mt-4">
            {cleanedLine}
          </h4>
        );
        return;
      }
      
      // List items với • hoặc -
      if (trimmedLine.match(/^[•\-]\s/)) {
        const itemText = trimmedLine.replace(/^[•\-]\s/, '');
        // Clean up ** from list items and convert to HTML
        const cleanedItem = itemText.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
        listItems.push(cleanedItem);
        return;
      }
      
      // Regular paragraphs
      if (trimmedLine.length > 0) {
        // Flush any pending list items
        if (listItems.length > 0) {
          elements.push(
            <ul key={`list-${index}`} className="list-disc list-inside space-y-1 mb-4 text-gray-300 ml-4">
              {listItems.map((item, i) => (
                <li key={i} className="text-gray-300" dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          );
          listItems = [];
        }
        
        // Handle bold text within paragraphs - remove ** and apply styling
        let formattedText = trimmedLine.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
        
        // Handle Wikipedia citations: [content](source:URL)
        formattedText = formattedText.replace(
          /\[([^\]]+)\]\(source:([^)]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener noreferrer" class="citation-link text-blue-300 hover:text-blue-200 transition-colors border-b border-blue-300/30 hover:border-blue-200/50">$1</a><sup class="text-blue-400 text-xs ml-0.5 font-mono">[ref]</sup>'
        );
        
        // Handle verification badge HTML from backend
        if (formattedText.includes('verification-badge')) {
          // Skip verification badge HTML as we'll handle it separately
          return;
        }
        
        elements.push(
          <p 
            key={index} 
            className="text-gray-300 mb-3 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
        );
        return;
      }
    });
    
    // Flush any remaining list items
    if (listItems.length > 0) {
      elements.push(
        <ul key="final-list" className="list-disc list-inside space-y-1 mb-4 text-gray-300 ml-4">
          {listItems.map((item, i) => (
            <li key={i} className="text-gray-300" dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      );
    }
    
    return elements;
  };

  return (
    <div className={`formatted-content ${className}`}>
      {/* Verification Badge */}
      {showVerification && factCheck && (
        <VerificationBadge 
          verification={factCheck.verification}
          sources={factCheck.sources}
          citationCount={factCheck.citationCount}
          className="mb-6"
        />
      )}
      
      {/* Main Content */}
      {parseContent(content)}
      
      {/* Source References */}
      {showVerification && factCheck && factCheck.sources.length > 0 && (
        <SourceReferences 
          sources={factCheck.sources}
          className="mt-6"
        />
      )}
    </div>
  );
};
