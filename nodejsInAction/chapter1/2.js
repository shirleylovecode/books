// const http = require('http');

// http.createServer((req, res) => {
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.end('Hello World! \n');
// }).listen(3000);

// console.log('Server is running on http://localhost:3000');

const http = require('http');

const server = http.createServer();

server.on('request', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World! \n');
});

server.listen(3000);

console.log('Server is running on http://localhost:3000');
