const net = require('net');

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    socket.write(`This is echo data: ${data}`);
  })
})

server.listen(3000, () => {
  console.log('Server is running in 3000');
})