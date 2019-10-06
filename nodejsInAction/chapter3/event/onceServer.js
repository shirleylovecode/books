const net = require('net');

const server = net.createServer((socket) => {
  socket.once('data', (data) => {
    socket.write(`This is return data: ${data}`);
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});