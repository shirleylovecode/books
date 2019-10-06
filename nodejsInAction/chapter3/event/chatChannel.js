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
  console.log(this);
  this.clients[id] = client;
  this.subscriptions[id] = (senderId, message) => {
    console.log(this);
    if(senderId !== id) {
      this.clients[id].write(message);
    }
  }

  channel.on('broadcast', function(senderId, message){
    this.subscriptions[id](senderId, message)
  })
});

const server = net.createServer((client) => {
  const id = `${client.remoteAddress}:${client.remotePort}`;
  channel.emit('join', client, id);

  client.on('data', (data) => {
    channel.emit('broadcast', id, data.toString());
  })
}).listen(3000);