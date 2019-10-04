const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const chatServer = require('./lib/socket.io');

const cache = {};

function send404(response) {
    response.writeHead(404, { 'content-type': 'text/plain'});
    response.write('Error 404: resource not found.');
    response.end();
}

function sendFile(response, filePath, fileContent) {
    response.writeHead(200, { 'consent-type': mime.getType(path.basename(filePath))});
    response.end(fileContent);
}

function serverStatic(response, cache, absPath) {
    // 文件存在缓存中
    if(cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, ((exists) => {
            if(exists) {
                fs.readFile(absPath, (error, data) => {
                    if(error) {
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                })
            } else {
                send404(response);
            }
        }))
    }
}

const server = http.createServer((req, res) => {
    const url = req.url;
    let filePath = false;

    if(url == '/') {
        filePath = `./public/index.html`;
    } else {
        filePath = `./public/${url}`;
    }

    serverStatic(res, cache, filePath);
}).listen(3000, () => {
    console.log('Server is running on http://localhost:3000/')
})

chatServer.listen(server);