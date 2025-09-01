const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const pinataClient = axios.create({
    baseURL: 'https://api.pinata.cloud',
    headers: {
        'Authorization': `Bearer ${process.env.PINATA_JWT}`
    }
});

async function testConnection() {
    try {
        const response = await pinataClient.get('/data/testAuthentication');
        console.log('Pinata connection successful:', response.data.message);
        return true;
    } catch (error) {
        console.error('Pinata connection failed:', error.response? error.response.data : error.message);
        return false;
    }
}

testConnection();

// Export the client for use in other modules and the test function
module.exports = { pinataClient, testConnection };