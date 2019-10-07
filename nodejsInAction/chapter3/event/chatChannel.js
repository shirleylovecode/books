// const net = require('net');
// const EventEmitter = require('events').EventEmitter;

// const channel = new EventEmitter();
// channel.clients = {};
// channel.subscribtions = {};

// channel.on('join', function (id, client) {
//   this.clients[id] = client;
//   this.subscribtions[id] = (sendId, message) => {
//     if(sendId !== id) {
//       console.log(client);
//       client.write(message);
//     }
//   }
//   this.on('broadcasting', this.subscribtions[id]);
// })

// const server = net.createServer((client) => {
//   const id = `${client.remoteAddress}:${client.remotePort}`;
//   channel.emit('join', id, client);
//   client.on('data', (data) => {
//     data = data.toString();
//     channel.emit('broadcasting', id, data);
//   })
// }).listen(3000);

const net = require('net');
const EventEmitter = require('events').EventEmitter;

const channel = new EventEmitter();

channel.clients = {};
channel.subscriptions = {};

channel.on('join', function(client, id) {
  const welcome = `Welcome! There are ${this.listeners('broadcast').length} guests online.`;
  client.write(welcome);
  this.clients[id] = client;
  this.subscriptions[id] = (senderId, message) => {
    if(!senderId || (senderId !== id  && this.clients [senderId])) {
      this.clients[id].write(message);
    }
  }

  

  

  //channel上对于broadcast监听器注册了多个回调函数，如果想要remove的话，一定要正确指定回调函数.
  channel.on('broadcast', this.subscriptions[id]);
});

channel.on('shutdown', function () {
  this.emit('broadcast', '', 'Server is shutting down');

  this.removeAllListeners('broadcast');
  this.clients = {};
  this.subscriptions = {};
})

channel.on('disconnect', function (id) {
  channel.removeListener('broadcast', this.subscriptions[id]);
  delete this.subscriptions[id];
  delete this.clients[id];

  this.emit('broadcast', '', `${id} has left Chat`);
})

const server = net.createServer((client) => {
  const id = `${client.remoteAddress}:${client.remotePort}`;
  channel.emit('join', client, id);

  client.on('data', (data) => {
    if(data.toString() === 'shutdown\r\n') {
      channel.emit('shutdown');
    } else {
      channel.emit('broadcast', id, data.toString());
    }
  });

  client.on('close', function() {
    channel.emit('disconnect', id);
  })

}).listen(3000);