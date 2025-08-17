const jwt = require('jsonwebtoken');

// Create a test JWT token
const testUserId = 'test-user-id-123';
const JWT_SECRET = 'your-secret-key-here'; // Replace with your actual JWT secret

const testToken = jwt.sign({ userId: testUserId }, JWT_SECRET, { expiresIn: '7d' });

console.log('Test JWT Token:', testToken);

// Test data
const testPartnerData = {
  name: 'Test Partner',
  birthDate: '1990-01-01',
  birthTime: '12:00',
  birthPlace: 'Ho Chi Minh City, Vietnam',
  relationship: 'dating'
};

// Test function
async function testPartnerAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/partner', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testToken}`,
      },
      body: JSON.stringify(testPartnerData),
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// testPartnerAPI();

console.log('Test data prepared. You can now manually test with the token above.');
