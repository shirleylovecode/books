const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'image/jpg'});
    fs.createReadStream('./image.jpg').pipe(res);
}).listen(3000);

console.log('Server is running at http://localhost:3000')