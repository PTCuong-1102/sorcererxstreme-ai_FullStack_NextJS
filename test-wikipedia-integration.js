/**
 * Enhanced test script để test Wikipedia integration with smart extraction
 * Chạy: node test-wikipedia-integration.js
 */

// Simulate the extractSearchTermsAdvanced function
function getZodiacSign(birthDate) {
  try {
    let date;
    
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

function calculateLifePathNumber(birthDate) {
  try {
    const numbers = birthDate.replace(/[^0-9]/g, '');
    if (numbers.length < 6) return null;
    
    let sum = 0;
    for (let digit of numbers) {
      sum += parseInt(digit);
    }
    
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      const digits = sum.toString().split('');
      sum = digits.reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    
    return sum;
  } catch (error) {
    return null;
  }
}

function extractSearchTermsAdvanced(userContext, type, additionalData) {
  const terms = [];
  
  switch (type) {
    case 'tarot':
      if (additionalData?.cardsDrawn && Array.isArray(additionalData.cardsDrawn)) {
        terms.push(...additionalData.cardsDrawn);
      }
      terms.push('Tarot');
      break;
      
    case 'astrology':
      if (userContext?.birthDate) {
        const zodiacSign = getZodiacSign(userContext.birthDate);
        if (zodiacSign) {
          terms.push(zodiacSign);
          terms.push(`Cung ${zodiacSign}`);
        }
      }
      terms.push('Chiêm tinh học');
      break;
      
    case 'numerology':
      if (userContext?.birthDate) {
        const lifePathNumber = calculateLifePathNumber(userContext.birthDate);
        if (lifePathNumber) {
          terms.push(`Số ${lifePathNumber} thần số học`);
          terms.push(`Life Path ${lifePathNumber}`);
        }
      }
      terms.push('Thần số học');
      break;
      
    case 'fortune':
      terms.push('Tử vi');
      terms.push('Can Chi');
      break;
  }
  
  return [...new Set(terms.filter(term => term && term.length > 0))];
}

// Test the smart extraction logic
async function testSmartExtraction() {
  console.log('🧠 Testing Smart Extraction Logic...\n');
  
  // Test data
  const testUsers = [
    {
      name: 'Nguyễn Văn A',
      birthDate: '25/03/1990',
      type: 'astrology',
      expected: ['Bạch Dương']
    },
    {
      name: 'Trần Thị B', 
      birthDate: '25/12/1985',
      type: 'numerology',
      expected: ['Life Path']
    },
    {
      name: 'Lê Văn C',
      birthDate: '10/07/1995', 
      type: 'fortune',
      expected: ['Tử vi']
    }
  ];
  
  for (let i = 0; i < testUsers.length; i++) {
    const user = testUsers[i];
    console.log(`${i + 1}. Testing ${user.type} extraction for ${user.name}:`);
    
    const terms = extractSearchTermsAdvanced(user, user.type);
    console.log('   Extracted terms:', terms);
    
    const hasExpectedTerm = user.expected.some(expected => 
      terms.some(term => term.includes(expected))
    );
    
    if (hasExpectedTerm) {
      console.log('   ✅ Smart extraction working correctly\n');
    } else {
      console.log('   ❌ Smart extraction failed\n');
    }
  }
  
  // Test Tarot with specific cards
  console.log('4. Testing Tarot extraction with specific cards:');
  const tarotTerms = extractSearchTermsAdvanced(
    { name: 'Test User' }, 
    'tarot', 
    { cardsDrawn: ['The Fool', 'The Magician', 'Death'] }
  );
  console.log('   Extracted terms:', tarotTerms);
  
  if (tarotTerms.includes('The Fool') && tarotTerms.includes('Tarot')) {
    console.log('   ✅ Tarot extraction working correctly\n');
  } else {
    console.log('   ❌ Tarot extraction failed\n');
  }
  
  console.log('🎉 Smart extraction tests completed!');
}

// Test Wikipedia API with smart extracted terms
async function testWikipediaWithSmartTerms() {
  console.log('\n🔍 Testing Wikipedia API with smart extracted terms...\n');
  
  const testUser = {
    name: 'Test User',
    birthDate: '15/03/1990' // Bạch Dương
  };
  
  const terms = extractSearchTermsAdvanced(testUser, 'astrology');
  console.log('Smart extracted terms for astrology:', terms);
  
  if (terms.length === 0) {
    console.log('❌ No terms extracted');
    return;
  }
  
  // Test with the first extracted term
  const testTerm = terms[0];
  console.log(`\nTesting Wikipedia search for: "${testTerm}"`);
  
  try {
    const searchUrl = `https://vi.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(testTerm)}&format=json&origin=*&srlimit=1&srprop=snippet`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (data.query && data.query.search.length > 0) {
      console.log('✅ Wikipedia search successful:', data.query.search[0].title);
      console.log('   Snippet:', data.query.search[0].snippet || 'No snippet');
    } else {
      console.log('❌ No Wikipedia results found');
    }
  } catch (error) {
    console.error('❌ Wikipedia test failed:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  await testSmartExtraction();
  await testWikipediaWithSmartTerms();
}

runAllTests();
