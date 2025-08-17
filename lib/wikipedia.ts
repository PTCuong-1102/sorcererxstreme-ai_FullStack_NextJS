/**
 * Wikipedia Service Module
 * Provides functionality to search and retrieve content from Vietnamese Wikipedia
 */

export interface WikipediaSearchResult {
  title: string;
  snippet?: string;
  pageid: number;
}

export interface WikipediaSummary {
  title: string;
  extract: string;
  url: string;
  pageid: number;
}

export interface WikipediaResponse {
  content: WikipediaSummary | null;
  error?: string;
}

/**
 * Search for Wikipedia articles in Vietnamese
 * @param searchTerm - The term to search for
 * @param limit - Maximum number of results to return
 * @returns Promise with search results
 */
export async function searchWikipedia(
  searchTerm: string, 
  limit: number = 1
): Promise<WikipediaSearchResult[]> {
  try {
    const encodedTerm = encodeURIComponent(searchTerm);
    const searchUrl = `https://vi.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodedTerm}&format=json&origin=*&srlimit=${limit}&srprop=snippet`;
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      throw new Error(`Wikipedia search failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.query || !data.query.search) {
      return [];
    }
    
    return data.query.search.map((result: any) => ({
      title: result.title,
      snippet: result.snippet,
      pageid: result.pageid
    }));
    
  } catch (error) {
    console.error('Error searching Wikipedia:', error);
    return [];
  }
}

/**
 * Get Wikipedia page summary/extract
 * @param title - The title of the Wikipedia page
 * @returns Promise with page content or null if not found
 */
export async function getWikipediaSummary(title: string): Promise<WikipediaResponse> {
  try {
    const encodedTitle = encodeURIComponent(title);
    const extractUrl = `https://vi.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&exintro=true&explaintext=true&titles=${encodedTitle}&exsectionformat=plain`;
    
    const response = await fetch(extractUrl);
    
    if (!response.ok) {
      return {
        content: null,
        error: `Failed to fetch Wikipedia page: ${response.status}`
      };
    }
    
    const data = await response.json();
    
    if (!data.query || !data.query.pages) {
      return {
        content: null,
        error: 'Invalid Wikipedia API response'
      };
    }
    
    // Get the first page from the response
    const pages = Object.values(data.query.pages) as any[];
    const page = pages[0];
    
    if (!page || page.missing !== undefined) {
      return {
        content: null,
        error: 'Wikipedia page not found'
      };
    }
    
    const summary: WikipediaSummary = {
      title: page.title,
      extract: page.extract || '',
      url: `https://vi.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
      pageid: page.pageid
    };
    
    return {
      content: summary
    };
    
  } catch (error) {
    console.error('Error getting Wikipedia summary:', error);
    return {
      content: null,
      error: `Error fetching Wikipedia content: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Search and get Wikipedia content in one step
 * @param searchTerm - The term to search for
 * @returns Promise with Wikipedia content or null
 */
export async function searchAndGetWikipediaContent(searchTerm: string): Promise<WikipediaResponse> {
  try {
    // First, search for the term
    const searchResults = await searchWikipedia(searchTerm, 1);
    
    if (searchResults.length === 0) {
      return {
        content: null,
        error: `No Wikipedia articles found for "${searchTerm}"`
      };
    }
    
    // Get the summary of the first result
    const firstResult = searchResults[0];
    return await getWikipediaSummary(firstResult.title);
    
  } catch (error) {
    console.error('Error in searchAndGetWikipediaContent:', error);
    return {
      content: null,
      error: `Error searching Wikipedia: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Get multiple Wikipedia contents for an array of terms
 * @param terms - Array of search terms
 * @returns Promise with array of Wikipedia responses
 */
export async function getMultipleWikipediaContents(terms: string[]): Promise<WikipediaResponse[]> {
  const promises = terms.map(term => searchAndGetWikipediaContent(term));
  return Promise.all(promises);
}

/**
 * Calculate zodiac sign from birth date
 * @param birthDate - Birth date in format YYYY-MM-DD or DD/MM/YYYY
 * @returns Vietnamese zodiac sign name
 */
function getZodiacSign(birthDate: string): string | null {
  try {
    let date: Date;
    
    // Try different date formats
    if (birthDate.includes('/')) {
      const [day, month, year] = birthDate.split('/');
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else if (birthDate.includes('-')) {
      date = new Date(birthDate);
    } else {
      return null;
    }
    
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Zodiac sign calculation
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Bạch Dương';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Kim Ngưu';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Song Tử';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cự Giải';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Sư Tử';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Xử Nữ';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Thiên Bình';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Bọ Cạp';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Nhân Mã';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Ma Kết';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Bảo Bình';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Song Ngư';
    
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Calculate Life Path Number from birth date
 * @param birthDate - Birth date in format YYYY-MM-DD or DD/MM/YYYY
 * @returns Life Path Number (1-9, 11, 22, 33)
 */
function calculateLifePathNumber(birthDate: string): number | null {
  try {
    // Extract numbers from date
    const numbers = birthDate.replace(/[^0-9]/g, '');
    if (numbers.length < 6) return null;
    
    // Add all digits
    let sum = 0;
    for (let digit of numbers) {
      sum += parseInt(digit);
    }
    
    // Reduce to single digit or master number
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      const digits = sum.toString().split('');
      sum = digits.reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    
    return sum;
  } catch (error) {
    return null;
  }
}

/**
 * Calculate Expression Number from name
 * @param name - Full name
 * @returns Expression Number (1-9, 11, 22, 33)
 */
function calculateExpressionNumber(name: string): number | null {
  if (!name) return null;
  
  // Pythagorean numerology values
  const letterValues: { [key: string]: number } = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
    'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
  };
  
  let sum = 0;
  for (let char of name.toUpperCase().replace(/[^A-Z]/g, '')) {
    sum += letterValues[char] || 0;
  }
  
  // Reduce to single digit or master number
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    const digits = sum.toString().split('');
    sum = digits.reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  
  return sum;
}

/**
 * Get Vietnamese zodiac animal from birth year
 * @param birthDate - Birth date
 * @returns Vietnamese zodiac animal
 */
function getChineseZodiac(birthDate: string): string | null {
  try {
    let year: number;
    
    if (birthDate.includes('/')) {
      const parts = birthDate.split('/');
      year = parseInt(parts[2]);
    } else if (birthDate.includes('-')) {
      year = new Date(birthDate).getFullYear();
    } else {
      return null;
    }
    
    const animals = [
      'Tý (Chuột)', 'Sửu (Trâu)', 'Dần (Hổ)', 'Mão (Mèo)', 'Thìn (Rồng)', 'Tỵ (Rắn)',
      'Ngọ (Ngựa)', 'Mùi (Dê)', 'Thân (Khỉ)', 'Dậu (Gà)', 'Tuất (Chó)', 'Hợi (Heo)'
    ];
    
    return animals[(year - 1900) % 12];
  } catch (error) {
    return null;
  }
}

/**
 * Get Can Chi from birth year
 * @param birthDate - Birth date
 * @returns Can Chi information
 */
function getCanChi(birthDate: string): string | null {
  try {
    let year: number;
    
    if (birthDate.includes('/')) {
      const parts = birthDate.split('/');
      year = parseInt(parts[2]);
    } else if (birthDate.includes('-')) {
      year = new Date(birthDate).getFullYear();
    } else {
      return null;
    }
    
    const can = ['Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ'];
    const chi = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi'];
    
    return `${can[year % 10]} ${chi[year % 12]}`;
  } catch (error) {
    return null;
  }
}

/**
 * Enhanced extract search terms with user-specific data
 * @param userContext - User context with personal information
 * @param type - Type of divination
 * @param additionalData - Additional data like cards drawn, etc.
 * @returns Array of specific terms to search for
 */
export function extractSearchTermsAdvanced(
  userContext: any,
  type: 'tarot' | 'astrology' | 'numerology' | 'fortune',
  additionalData?: any
): string[] {
  const terms: string[] = [];
  
  switch (type) {
    case 'tarot':
      // If cards are drawn, search for those specific cards
      if (additionalData?.cardsDrawn && Array.isArray(additionalData.cardsDrawn)) {
        terms.push(...additionalData.cardsDrawn);
      }
      
      // Always include general Tarot for context
      terms.push('Tarot');
      break;
      
    case 'astrology':
      // Get user's zodiac sign from birth date
      if (userContext?.birthDate) {
        const zodiacSign = getZodiacSign(userContext.birthDate);
        if (zodiacSign) {
          terms.push(zodiacSign);
          terms.push(`Cung ${zodiacSign}`);
        }
      }
      
      // Add general astrology terms
      terms.push('Chiêm tinh học');
      terms.push('Cung hoàng đạo');
      
      // If analyzing compatibility, add partner's sign too
      if (userContext?.partnerData?.birthDate) {
        const partnerSign = getZodiacSign(userContext.partnerData.birthDate);
        if (partnerSign) {
          terms.push(partnerSign);
        }
      }
      break;
      
    case 'numerology':
      // Calculate user's Life Path Number
      if (userContext?.birthDate) {
        const lifePathNumber = calculateLifePathNumber(userContext.birthDate);
        if (lifePathNumber) {
          terms.push(`Số ${lifePathNumber} thần số học`);
          terms.push(`Life Path ${lifePathNumber}`);
        }
      }
      
      // Calculate Expression Number from name
      if (userContext?.name) {
        const expressionNumber = calculateExpressionNumber(userContext.name);
        if (expressionNumber) {
          terms.push(`Expression Number ${expressionNumber}`);
        }
      }
      
      // Add general numerology terms
      terms.push('Thần số học');
      terms.push('Numerology');
      break;
      
    case 'fortune':
      // Get Chinese zodiac and Can Chi from birth year
      if (userContext?.birthDate) {
        const chineseZodiac = getChineseZodiac(userContext.birthDate);
        if (chineseZodiac) {
          terms.push(chineseZodiac);
        }
        
        const canChi = getCanChi(userContext.birthDate);
        if (canChi) {
          terms.push(canChi);
        }
      }
      
      // Add general fortune telling terms
      terms.push('Tử vi');
      terms.push('Tử vi Đẩu Số');
      terms.push('Can Chi');
      terms.push('Ngũ hành');
      break;
  }
  
  // Remove duplicates and empty terms
  return [...new Set(terms.filter(term => term && term.length > 0))];
}

/**
 * Backward compatibility - Extract key terms from user input for Wikipedia search
 * @deprecated Use extractSearchTermsAdvanced instead
 */
export function extractSearchTerms(userInput: string, type: 'tarot' | 'astrology' | 'numerology' | 'fortune'): string[] {
  // Legacy implementation for backward compatibility
  return extractSearchTermsAdvanced({ birthDate: null, name: null }, type);
}
