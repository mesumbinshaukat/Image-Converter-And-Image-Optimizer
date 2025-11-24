import axios from 'axios';

const API_URL = 'https://imgify.worldoftech.company/api/register';

async function testRegistration() {
    console.log(`Testing Registration API: ${API_URL}`);

    // Generate random user data
    const randomId = Math.floor(Math.random() * 10000);
    const userData = {
        name: `TestUser${randomId}`,
        email: `testuser${randomId}@example.com`,
        password: 'password123',
        password_confirmation: 'password123'
    };

    console.log('Payload:', userData);

    try {
        const response = await axios.post(API_URL, userData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log('\n✅ Registration Successful!');
        console.log('Status:', response.status);
        console.log('Data:', response.data);
    } catch (error) {
        console.error('\n❌ Registration Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testRegistration();
