const axios = require('axios');

class ExternalApiService {
    async fetchGreeting() {
        try {
            const response = await axios.get('http://localhost:9010/greeting');
            return response.data;
        } catch (error) {
            return 'Has some error when call API';
        }
    }
}

module.exports = new ExternalApiService();