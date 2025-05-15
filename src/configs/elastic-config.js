require('dotenv').config();
const { Client } = require('@elastic/elasticsearch');

const elasticClient = new Client({
    node: process.env.ELASTIC_NODE
});

// Initialize Elasticsearch index for logs
const initializeElastic = async () => {
    try {
        // Check if the index exists
        const indexExists = await elasticClient.indices.exists({
            index: 'api_logs'
        });

        if (!indexExists) {
            // Create the index with mappings
            await elasticClient.indices.create({
                index: 'api_logs',
                body: {
                    mappings: {
                        properties: {
                            timestamp: { type: 'date' },
                            requestId: { type: 'keyword' },
                            method: { type: 'keyword' },
                            url: { type: 'text' },
                            status: { type: 'integer' },
                            responseTime: { type: 'float' },
                            userId: { type: 'keyword' },
                            userAgent: { type: 'text' },
                            ip: { type: 'ip' },
                            message: { type: 'text' },
                            level: { type: 'keyword' },
                            context: { type: 'object', enabled: true },
                            error: { type: 'text' },
                            stack: { type: 'text' }
                        }
                    }
                }
            });
            console.log('Elasticsearch index created successfully');
        } else {
            console.log('Elasticsearch index already exists');
        }
    } catch (error) {
        console.error('Elasticsearch initialization error:', error);
    }
};

module.exports = { elasticClient, initializeElastic };