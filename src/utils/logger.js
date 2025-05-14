const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');
const { Client } = require('@elastic/elasticsearch');

// Create Elasticsearch client
const esClient = new Client({
    node: process.env.ELASTICSEARCH_HOST || 'http://localhost:9200',
    auth: {
        username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
        password: process.env.ELASTICSEARCH_PASSWORD || 'changeme'
    },
    ssl: {
        rejectUnauthorized: false // Note: Only use in development
    }
});

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
);

// Create Elasticsearch transport
const esTransport = new ElasticsearchTransport({
    client: esClient,
    level: 'info',
    indexPrefix: process.env.ELASTICSEARCH_INDEX || 'api-logs',
    indexSuffixPattern: 'YYYY.MM.DD',
    messageType: 'log'
});

// Create logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'api-service' },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        esTransport
    ]
});

// Handle errors with the Elasticsearch transport
esTransport.on('error', (error) => {
    console.error('Error in Elasticsearch transport', error);
});

module.exports = logger;// Directory Structure