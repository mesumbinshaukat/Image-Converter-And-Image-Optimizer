import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

const API_URL = 'http://localhost:8000/api';
const TEST_IMAGE_PATH = path.join(process.cwd(), 'public', 'Imgify Icon.png');

async function testImageProcessing() {
    console.log('Starting Image Processing Tests...');
    console.log(`Using test image: ${TEST_IMAGE_PATH}`);

    if (!fs.existsSync(TEST_IMAGE_PATH)) {
        console.error('Test image not found!');
        return;
    }

    // 1. Test Optimization
    console.log('\n--- Testing Optimization ---');
    try {
        const form = new FormData();
        form.append('images[]', fs.createReadStream(TEST_IMAGE_PATH));
        form.append('quality', '80');

        const response = await axios.post(`${API_URL}/optimize`, form, {
            headers: {
                ...form.getHeaders(),
            },
        });

        if (response.data.success) {
            console.log('✅ Optimization Successful!');
            console.log('Results:', response.data.results);
        } else {
            console.error('❌ Optimization Failed:', response.data);
        }
    } catch (error) {
        console.error('❌ Optimization Error:', error.response?.data || error.message);
    }

    // 2. Test Conversion
    console.log('\n--- Testing Conversion (to WebP) ---');
    try {
        const form = new FormData();
        form.append('images[]', fs.createReadStream(TEST_IMAGE_PATH));
        form.append('format', 'webp');
        form.append('quality', '80');

        const response = await axios.post(`${API_URL}/convert`, form, {
            headers: {
                ...form.getHeaders(),
            },
        });

        if (response.data.success) {
            console.log('✅ Conversion Successful!');
            console.log('Results:', response.data.results);
        } else {
            console.error('❌ Conversion Failed:', response.data);
        }
    } catch (error) {
        console.error('❌ Conversion Error:', error.response?.data || error.message);
    }
}

testImageProcessing();
