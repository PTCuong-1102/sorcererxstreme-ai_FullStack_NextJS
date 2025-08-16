
'use client';

interface FormattedContentProps {
  content: string;
  className?: string;
}

export const FormattedContent = ({ content, className = '' }: FormattedContentProps) => {
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
        const formattedText = trimmedLine.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
        
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
      {parseContent(content)}
    </div>
  );
};
