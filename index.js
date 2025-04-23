// const http = require('http');
// const { Worker } = require('worker_threads');
//
// function runWorker() {
//   return new Promise((resolve, reject) => {
//     const worker = new Worker('./worker.js');
//     worker.on('message', resolve);
//     worker.on('error', reject);
//   });
// }
//
// const server = http.createServer(async (req, res) => {
//   if (req.url === '/compute') {
//     try {
//       const result = await runWorker();
//       res.end(`Worker says: ${result}\n`);
//     } catch (err) {
//       res.statusCode = 500;
//       res.end('Error in worker\n');
//     }
//   } else {
//     res.end('Hello from Node.js\n');
//   }
// });
//
// server.listen(3000, () => {
//   console.log('Server running at http://localhost:3000/');
// });
