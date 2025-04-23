// // worker.js
// const { parentPort } = require('worker_threads');
//
// // simulate heavy CPU task
// const end = Date.now() + 5000;
// while (Date.now() < end);
//
// parentPort.postMessage('Heavy work complete');

const http = require('http');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'my_note';

async function main() {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection('users');

    const server = http.createServer(async (req, res) => {
        console.log(`Worker ${process.pid} process`);

        const end = Date.now() + 200;
        while (Date.now() < end);

        if (req.url === '/users' && req.method === 'GET') {
            const allUsers = await users.find().toArray();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(allUsers));
        }

        else if (req.url === '/users' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
                const user = JSON.parse(body);
                await users.insertOne(user);
                res.writeHead(201);
                res.end('User created');
            });
        }

        else {
            res.writeHead(404);
            res.end('Not Found');
        }
    });

    const PORT = 3000;
    server.listen(PORT, () => {
        console.log(`Worker ${process.pid} running at http://localhost:${PORT}`);
    });
}

main().catch(console.error);
